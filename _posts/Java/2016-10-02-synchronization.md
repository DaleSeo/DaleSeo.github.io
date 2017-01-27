---
title: "동기화 (Synchronization)"
modified: 2016-10-02T16:53:56+09:00
categories:
  - Java
tags:
  - Concurrency
  - Synchronization
published: true
---

> 본 포스트는 오라클 자바 튜토리얼의 [Pausing Execution with Sleep](https://docs.oracle.com/javase/tutorial/essential/concurrency/sleep.html)와 [Interrupts](https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html),  [Joins](https://docs.oracle.com/javase/tutorial/essential/concurrency/join.html), [The SimpleThreads Example](https://docs.oracle.com/javase/tutorial/essential/concurrency/simple.html)를 번역하였습니다.


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
