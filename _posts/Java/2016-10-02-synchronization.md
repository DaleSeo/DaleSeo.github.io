---
title: "동기화 (Synchronization)"
modified: 2016-10-02T16:53:56+09:00
categories:
  - Java
tags:
  - Concurrency
  - Synchronization
published: false
---

> 본 포스트는 오라클 자바 튜토리얼의 [Synchronization](http://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)와 [Interrupts](https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html),  [Joins](https://docs.oracle.com/javase/tutorial/essential/concurrency/join.html), [The SimpleThreads Example](https://docs.oracle.com/javase/tutorial/essential/concurrency/simple.html)를 번역하였습니다.


## 동기화 (Synchronization)

쓰레드들은 필드들에 대한 접근과 그 필드들이 가리키고 있는 객체 참조를 공유함으로써 주로 통신합니다.
이 통신 형태는 굉장히 효율적이지만, 쓰레드 간섭(thread interference)과 메모리 일관성 에러(memory consistency errors)라는 두 가지 오류가 발생할 여지가 줍니다.
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

쓰레드 A가 쓰레드 `increment` 메소드를 호출함과 거의 동시에 쓰레드 B가 `decrement` 메소드를 호출한다고 가정해보자.
만약에 `c` 변수의 초기값이 0이라고 한다면, 이 둘의 간에 간섭은 다음처럼 나타날 수 있습니다.

1. 쓰레드 A: `c`를 조회한다.
2. 쓰레드 B: `c`를 조회한다.
3. 쓰레드 A: 조회된 값에서 1을 증가시킨다. (결과: 1)
4. 쓰레드 B: 조회된 값에서 1을 증가시킨다. (결과: -1)
5. 쓰레드 A: `c`에 결과를 저장한다. 이제 `c` 값은 1이다.
6. 쓰레드 B: `c`에 결과를 저장한다. 이제 `c` 값은 -1이다.

쓰레드 A의 결과는 사라지고 쓰레드 B에 의해 덮어쓰여진다.
이 특후나 간섭은 단지 한 가지 가능성에 불과하다.
다른 상황에서는 쓰레드 B의 결과가 사라지거나 전혀 문제가 없을 수도 있다.
이렇게 결과를 예상할 수 없기 때문에 쓰레드 간섭 버그는 발견해서 고치기가 어렵다.
