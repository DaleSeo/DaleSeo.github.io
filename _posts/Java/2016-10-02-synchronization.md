---
title: "동기화 (Synchronization)"
modified: 2016-10-02T16:53:56+09:00
categories:
  - Java
tags:
  - Concurrency
  - Synchronization
  - Thread Interference
  - Memory Consistency Errors
published: false
---

> 본 포스트는 오라클 자바 튜토리얼의 [Synchronization](http://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)와 [Thread Interference](http://docs.oracle.com/javase/tutorial/essential/concurrency/interfere.html), [Memory Consistency Errors](http://docs.oracle.com/javase/tutorial/essential/concurrency/memconsist.html)를 번역하였습니다.


## 동기화 (Synchronization)

쓰레드들은 필드들에 대한 접근과 그 필드들이 가리키고 있는 객체 참조를 공유함으로써 주로 통신합니다.
이 통신 형태는 굉장히 효율적이지만, 쓰레드 간섭(thread interference)과 메모리 일관성 오류(memory consistency errors)라는 두 가지 오류가 발생할 여지가 줍니다.
이 오류들을 예방하기 위해서 필요한 도구가 바로 동기화(synchronization)입니다.

하지만, 동기화는 경쟁(thread contention)을 일으킬 수 있는데, 이는 두 개 이상의 쓰레드가 동일 자원을 동시에 접근할 때 발생하며 자바 런타임이 하나 이상의 쓰레드를 더 느리게 실행되도록 만들거나 심지어 실행을 중단시킬 수 있습니다.
기아상태(Starvation)와 라이브락(livelock)이 쓰레드 경쟁의 발생 모습입니다.
더 자세한 설명은 라이브락 섹션을 참고바랍니다.

### 이 번 섹션에서 다루게 될 내용은 다음과 같습니다.

- 쓰레드 간섭(thread interference) 편에서는 여러 개의 쓰레드가 공유 데이터에 접근할 때 어떻게 오류가 발생하는지 기술합니다.
- 메모리 일관성 에러(Memory Consistency Errors) 편에서는 공유 메모리의 일관적이 않은 모습 때문에 발생하는 오류에 대해서 기술합니다.
- 동기화된 메소드(Synchronized Methods) 편에서는 효과적으로 쓰레드 간섭과 메모리 일관성 에러를 효과적으로 예방하는 간단한 구문에 대해서 기술합니다.
- Intrinsic Locks and Synchronization 편에서는 더 일반적인 동기화 구문과 어떻게 동기화가 implicit locks에 기반으로 작동하는지에 대해서 기술합니다.
- 원자적 접근(Atomic Access) 편에서는 다른 쓰레들에 의해서 간섭당할 수 없는 실행에 관련된 좀 더 전반적인 개념에 대해서 알아보겠습니다.


## 쓰레드 간섭 (Thread Interference)

`Counter`라는 클래스를 생각해봅시다.

```java
class Counter {
    private int c = 0;

    public void increment() {
        c++;
    }

    public void decrement() {
        c--;
    }

    public int value() {
        return c;
    }

}
```

`Counter` 클래스는 `increment` 메서드가 호출될 때 변수 `c`가 1이 증가되도록 설계되었습니다.
하지만, 만약에 `Counter` 객체가 여러 개의 쓰레드에 의해서 참조되면, 쓰레드 간의 간섭에 의해서 예상했던 것처럼 동작하지 않을 수도 있습니다.

간섭은 다른 쓰레드에서 실행되고 있는 2개의 연산이 같은 데이터 상에서 수행될 때 일어납니다.
이 것은 두 개의 연산이 여러 개의 단계로 이뤄져 있으며 그 단계들이 서로 겹칠 수 있음을 의미합니다.

`Counter`의 인스턴스 상의 메소드들이 모두 단일 연산이기 때문에 이에 해당하지 않는 것처럼 보일 수도 있습니다.
하지만, 이렇게 간단한 표현도 가상 머신의 의해서 여러 단계로 해석될 수 있습니다.
가상 머신이 거치는 구체적인 단계에 대해서는 설명하지는 않겠습니다.
여기서는 `c++`와 같이 간단한 표현이 3단계로 분해될 수 있다는 것만 알아도 충분합니다.

1. 변수 `c`의 현재 값을 조회한다.
2. 조회된 값에서 1을 증가시킨다.
3. 변수 `c`에 증가된 값을 저장한다.

`c--`라는 표현도 2번째 단계가 증가에서 감소로 바뀌는 것만 제외하면 같은 방식으로 분해될 수 있습니다.

쓰레드 A가 쓰레드 `increment` 메소드를 호출함과 거의 동시에 쓰레드 B가 `decrement` 메소드를 호출한다고 가정해보시죠.
만약에 `c` 변수의 초기값이 0이라고 한다면, 이 둘의 간에 간섭은 다음처럼 나타날 수 있습니다.

1. 쓰레드 A: `c`를 조회한다.
2. 쓰레드 B: `c`를 조회한다.
3. 쓰레드 A: 조회된 값에서 1을 증가시킨다. (결과: 1)
4. 쓰레드 B: 조회된 값에서 1을 증가시킨다. (결과: -1)
5. 쓰레드 A: `c`에 결과를 저장한다. 이제 `c` 값은 1이다.
6. 쓰레드 B: `c`에 결과를 저장한다. 이제 `c` 값은 -1이다.

쓰레드 A의 결과는 사라지고 쓰레드 B에 의해 덮어쓰여집니다.
이 특후나 간섭은 단지 한 가지 가능성에 불과합니다.
다른 상황에서는 쓰레드 B의 결과가 사라지거나 전혀 문제가 없을 수도 있습니다.
이렇게 결과를 예상할 수 없기 때문에 쓰레드 간섭 버그는 발견해서 고치기가 어렵습니다.


## 메모리 일관성 오류 (Memory Consistency Errors)

메모리 일관성 오류는 다른 쓰레드가 동일한 데이터에 대해서 일관적이지 않은 상태를 바라볼 때 발생합니다.
메모리 일관성 오류의 원인은 복잡하고 이 튜토리얼의 범위에서 벗어납니다.
프로그래머들은 이러한 원인들에 대해서 자세히 알고 있을 필요는 없어서 다행입니다.
우리는 단지 이 오류를 피하기 위한 전략이 필요할 뿐입니다.

메모리 일관성 오류를 피하기 위한 핵심은 먼저 실행(happens-before) 관계를 이해하는 것입니다.
이 관계는 간단하게 말하면, 하나의 표현식에 의한 메모리 쓰기를 다른 연산이 감지할 수 있게 보장하기 위함입니다.
이 것을 보기위해서, 다음 예제를 생각해봅시다.
단순한 `int` 형 필드가 선언되어 초기화되어 있다고 가정해보시죠.

```
int counter = 0;
```

이 `coutner` 필드는 두 개의 쓰레드 A와 B 간에 공유되어 집니다.
쓰레드 A가 `counter`를 증가시킨다고 가정해보시죠.

```
counter++;
```

그리고 나서 바로 쓰레드가 B가 `coutner`를 출력합니다.

```
System.out.println(counter);
```

만약에 두 개의 표현식이 동일 쓰레드 내에서 실행된다면, "1"이 출력될 것으로 추정해도 무방할 것입니다.
그러나 만약에 두 표현식이 다른 쓰레드에서 실행됬더라면, 쓰레드 A에서 일어나는 `counter`의 변경을 쓰레드 B에서 감지할 수 있을 것이라는 보장이 없기 때문에 출력되는 값은 아마 "0"이 될지도 모르겠습니다.
이는 프로그래머가 이 두 개의 표현식 간에 먼저 실행 관계를 맺어준 적이 없었기 때문이기도 합니다.

먼저 실행 관계를 형성하기 위한 몇 가지 방법들이 있습니다.
그 중에 하나가 다음 섹션에서 살펴볼 게 될 동기화(synchronization)입니다.

우리는 이미 먼저 실행 관계를 형성하는 두 가지 방법을 보았습니다.

표현식이 `Thread.start` 메소드를 호출하였을 때, 해당 표현식과 먼저 실행 관계를 가진 모든 표현식은 새로운 쓰레드에 의해서 수행되는 모든 표현식과도 먼저 실행 관계를 갖습니다.
어떤 쓰레드가 종료되어 `Thread.join` 메서드가 다른 쓰레드에서 리턴하도록 만든다면, 종료된 쓰레드에 의해서 수행된 모든 표현식은 성공적인 `join` 메소드를 뒤 따르는 모든 표현식과 먼저 실행 관계를 가집니다.
쓰레드 내에서 코드의 효과는 `join` 메서드를 수행한 쓰레드에서 이제 인지할 수 있게 됩니다.
이전에 일어나기 관계를 형상하는 방법 목록은 [java.util.concurrent 패키지의 요약 페이지](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html#MemoryVisibility)를 참고바랍니다.
