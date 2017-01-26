---
title: "자바 쓰레드 Sleep & Intterupt & Join"
modified: 2016-09-25T15:05:05+09:00
categories:
  - Java
tags:
  - Concurrency
  - Process
  - Thread
published: true
---

> 본 포스트는 오라클 자바 튜토리얼의 [Pausing Execution with Sleep](https://docs.oracle.com/javase/tutorial/essential/concurrency/sleep.html)와 [Interrupts](https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html),  [Joins](https://docs.oracle.com/javase/tutorial/essential/concurrency/join.html), [The SimpleThreads Example](https://docs.oracle.com/javase/tutorial/essential/concurrency/simple.html)를 번역하였습니다.


## `Sleep`으로 실행 중지하기

`Thread.sleep()` 메소드는 현재 쓰레드가 일정 기간동안 실행을 중지시킵니다.
이 것은 해당 어플리케이션 또는 시스템 상에서 돌고 있는 다른 어플리케이션 내의 다른 쓰레드들에게 프로세서를 이용 가능하도록 만들기 위한 효율적인 방법입니다.
`sleep()` 메소드는 다음 예제와 같이 속도 조절을 위해서도 사용될 수 있습니다.
또한 다음 섹션의 `SimpleThreads` 예제와 같이 대기 요건이 용납되는 임무를 가진 또 다른 쓰레드를 기다리기 위해서도 사용될 수 있습니다.

`sleep` 메소드는 오버로드된 두가지 버전이 제공되는데 하나는 밀리 초단위로 정지 시간을 지정할 수 있고 다른 하나는 나노 초단위로 정지 사간을 지정할 수 있습니다.
하지만 이 정지 시간은 기저 운영체제의 제한을 받기 때문에 정확하게 보장되지 않습니다.
또한 정지 시간은 다음 섹션에서 보시겠지만 인터럽트에 의해서 종료될 수 있습니다.
어떤 방식으로든지 `sleep` 메소드를 호출하는 것이 정확하게 지정한 기간 만큼 쓰레드를 중지시킬 것이라고 가정할 수는 없습니다.

다음 `SleepMessages` 예제는 4초 간격으로 메세지를 출력하기 위해서 `sleep()` 메소드를 사용하고 있습니다.

```java
public class SleepMessages {
  public static void main(String args[]) throws InterruptedException {
    String importantInfo[] = {
      "Mares eat oats",
      "Does eat oats",
      "Little lambs eat ivy",
      "A kid will eat ivy too"
    };

    for (int i = 0; i < importantInfo.length; i++) {
      // 4초 간 중지한다
      Thread.sleep(4000);
      // 메세지를 출력한다
      System.out.println(importantInfo[i]);
    }
  }
}
```

`main` 메소드가 `InterruptedException`을 던지도록 정의되어 있다라는 점을 점을 주목하세요.
이 것은 `sleep` 메소드가 실행 중에 다른 쓰레드가 현재 쓰레드를 인터럽트하면 `sleep` 메소드가 던지는 예외입니다.
본 어플리케이션에서는 인터럽트를 유발하는 다른 쓰레드를 정의하지 않았기 때문에, 굳이 `InterruptedException` 예외를 잡으실 필요는 없습니다.


## 인터럽트 (Interrupts)

인터럽트는 쓰레드에게 하던 것을 멈추고 다른 것을 하라는 지시입니다.
정확히 해당 쓰레드가 어떻게 인터럽트에 반응할지를 결정하는 것은 전적으로 프로그래머의 몫이지만 쓰레드를 종료시키는 것이 가장 일반적입니다.
이 것이 이번 수업에서 초점을 맞출 용법입니다.

쓰레드는 인터럽트 대상의 다른 쓰레드 객체 상대로 `interrupt()` 메소드를 호출함으로써 인터럽트를 보냅니다.
인터럽트 메커니즘이 정확하기 동작하기 위해서는 인터럽트 대상 쓰레드가 스스로 인터럽트를 지원해줘야 합니다.


### 인터럽트 지원하기 (Supporting Interruption)

어떻게 쓰레드가 스스로 인터럽션을 지원해야 할까요?
이는 그 쓰레드가 현재 무엇을 하고 있느냐에 달려있습니다.
만약 해당 쓰레드가 `InterruptedException` 예외를 던지는 메소드를 빈번하게 호출하고 있다면, 단순하게 `run()` 메소드에서 해당 예외를 잡은 후에 반환해버립니다.
예를 들어, `SleepMessages` 예제의 중앙에 있는 메세지 루프가 `Runnable` 객체의 `run()` 메소드 안에 있었다고 가정해봅시다.
그러면 해당 코드는 인터럽트를 지원하기 위해서 다음과 같이 수정될 것입니다.

```java
for (int i = 0; i < importantInfo.length; i++) {
  // 4초 간 중지한다
  try {
    Thread.sleep(4000);
  } catch (InterruptedException e) {
    // 인터럽트 당했다 (메세지 출력 중단하고 바로 반환)
    return;
  }
  // 메세지를 출력한다
  System.out.println(importantInfo[i]);
}
```

`sleep()`처럼 `InterruptedException` 예외를 던지는 많은 메소드들이 인터럽트를 받았을 때 현재 작업을 취소하고 즉시 반환하도록 설계되어 있습니다.

만약 `InterruptedException` 예외를 던지는 메소드를 호출하지 않는 쓰레드가 오래동안 수행되면 어찌할까요?
그러면 인터럽트를 받았을 때 true를 반환하는 `Thread.interrupted()` 메소드를 주기적으로 호출해줘야만 합니다.

```java
for (int i = 0; i < inputs.length; i++) {
  heavyCrunch(inputs[i]);
  if (Thread.interrupted()) {
    // 인터럽트 당했다 (오래걸리는 작업 중단)
    return;
  }
}
```

이 단순한 예제에서, 코드는 단지 인터럽트 여부를 테스트해보고 인터럽트를 받았다면 쓰레드를 나갑니다.
더 복잡한 어플리케이션에서는 `InterruptedException` 예외를 던지는 편이 더 나을지도 모르겠습니다.

```java
if (Thread.interrupted()) {
    throw new InterruptedException();
}
```

이렇게 하면 catch 절에서 인터럽트를 모아서 처리할 수 있습니다.


### 인터럽트 상태 플래그 (The Interrupt Status Flag)

인터럽트 매커니즘은 인터럽트 상태라고 알려진 내부 플래그에 의해서 구현됩니다.
`Thread.interrupt()` 메소드를 호출해서 이 플래그를 true로 설정합니다.
쓰레드가 정적 메소드인 `Thread.interrupted()`를 호출해서 인터럽트 여부를 체크할 때, 인터럽트 상태는 false로 초기화됩니다.
정적 메소드가 아닌 `isInterrupted()`는 한 쓰레드가 다른 쓰레드의 인터럽트 생태를 조회하기 위해서 사용되며 인터럽트 상태를 변경하지 않습니다.

관습적으로 어떤 메소드든지 `InterruptedException` 예외를 던져서 빠져나갈 때 인터럽트 상태를 false 초기화해버립니다.
하지만 인터럽트 상태는 `interrupt` 메소드를 호출하는 또 다른 쓰레드에 의해서 즉시 재 변경될 가능성이 항상 있습니다.


## 조인 (Joins)

`join` 메소드는 한 쓰레드가 다른 쓰레드의 완료를 기다리게 합니다.
만약 `t`가 현재 동작 중인 스레드 객체라고 한다면,

```java
t.join();
```

위 코드는 현재 쓰레드가 `t` 쓰레드가 종료될 때 까지 실행을 중단합니다.
프로그래머는 오버로드된 `join` 메소드르르 통해 대기 기간을 명시해줄 수 있습니다.
하지만 `sleep`처럼, `join` 메소드의 타이밍도 운영 체제에 달려있으므로 정확하게 명시된 시간만큼 대기한다고 가정하시면 안 됩니다.

`sleep`처럼, `join`도 인터럽트에 대해서 `InterruptedException` 예외를 발생시켜 대응합니다.


## SimpleThreads 예제 (The SimpleThreads Example)

다음 예제에 본 섹션의 여러가지 컨셉들을 반영해보았습니다.
`SimpleThreads`는 두 개의 쓰레드로 구서오딥니다.
첫번째는 모든 자바 어플리케이션이 가지게 되는 메인 쓰레드입니다.
메인 쓰레드는 `MessageLoop`라는 `Runnalbe` 객체를 통해서 새로운 쓰레드를 생성하고 그 쓰레드가 종료되기를 기다립니다.
만약 `MessageLoop` 쓰레드가 종료되기까지 너무 오래 걸린다면, 메인 쓰레드는 인터럽트를 겁니다.

`MessageLoop` 쓰레드가 일련의 메세지들을 출력합니다.
만약 모든 메세지를 출력하기 전에 인터럽트를 당한다면, `MessageLoop` 쓰레드는 메세지를 출력하고 빠져나갑니다.

```java
public class SimpleThreads {

  // 현재 쓰레드 이름과 함께 메세지를 출력한다.
  static void threadMessage(String message) {
    String threadName = Thread.currentThread().getName();
    System.out.format("%s: %s%n", threadName, message);
  }

  private static class MessageLoop implements Runnable {
    public void run() {
      String importantInfo[] = {
        "Mares eat oats",
        "Does eat oats",
        "Little lambs eat ivy",
        "A kid will eat ivy too"
      };
      try {
        for (int i = 0; i < importantInfo.length; i++) {
            // 4초 간 중지한다
            Thread.sleep(4000);
            // 메세지를 출력한다
            threadMessage(importantInfo[i]);
        }
      } catch (InterruptedException e) {
        threadMessage("I wasn't done!");
      }
    }
  }

  public static void main(String args[]) throws InterruptedException {

    // MessageLoop 쓰레드를 인터럽트 하기 전에 밀리 초 단위로 대기한다. (기본값 : 1시간)
    long patience = 1000 * 60 * 60;

    // 커맨드 라인 인자가 존재하면, patience 변수를 초 단위로 설정한다.
    if (args.length > 0) {
      try {
        patience = Long.parseLong(args[0]) * 1000;
      } catch (NumberFormatException e) {
        System.err.println("Argument must be an integer.");
        System.exit(1);
      }
    }

    threadMessage("Starting MessageLoop thread");
    long startTime = System.currentTimeMillis();
    Thread t = new Thread(new MessageLoop());
    t.start();

    threadMessage("Waiting for MessageLoop thread to finish");
    // MessageLoop가 종료될 때까지 루프를 돈다.
    while (t.isAlive()) {
      threadMessage("Still waiting...");
      // MessageLoop 쓰레드가 종료될 때 까지 최대 1초를 기다린다.
      t.join(1000);
      if (((System.currentTimeMillis() - startTime) > patience) && t.isAlive()) {
        threadMessage("Tired of waiting!");
        t.interrupt();
        // 더 오래 기다릴 수 없다
        t.join();
      }
    }
    threadMessage("Finally!");
  }
}
```
