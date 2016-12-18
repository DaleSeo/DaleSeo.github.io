---
title: "자바: Thread 클래스와 Runnable 인터페이스"
modified: 2016-09-04T11:13:17+09:00
categories: 
  - Java
tags:
  - Multithreading
  - 멀티쓰레드
  - Thread
  - 쓰레드
---

자바에서 쓰레드를 작성하는 2가지 방법에 대해서 알아보겠습니다.

## `Thread` 클래스 확장하기

첫번째 방법으로 `java.lang.Thread` 클래스를 확장할 수 있습니다.
`Thread` 클래스에는 상당히 많은 메소드가 있는데요.
그 중에서 `run()` 이라는 메소드만 오버라이드해주면 됩니다.

```java
import java.util.Random;

public class MyThread extends Thread {

  private static final Random random = new Random();

  @Override
  public void run() {
    String threadName = Thread.currentThread().getName();
    System.out.println("- " + threadName + " has been started");
    int delay = 1000 + random.nextInt(4000);
    try {
      Thread.sleep(delay);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println("- " + threadName + " has been ended (" + delay + "ms)");
  }

}
```

쓰레드마다 수행 시간을 다르게 하여 현실과 비슷한 상황을 연출하고 싶었습니다.
그래서 `Thread.sleep()` 메서드를 이용해여 1초 이상 6초 미만의 랜덤 딜레이를 주었습니다.
그리고 각 쓰레드의 시작과 종료 시점에 `Thread.currentThread().getName()` 메소드를 통해 쓰레드 이름이 출력되도록 하였습니다.
이 쓰레드 이름은 스트링을 인자로 받는 생성자를 통해 객체 생성 시점에 세팅될 것입니다.

## `Runnable` 인터페이스 구현하기

Thread 확장 예제와 동일한 기능을 Runnable 인터페이스를 구현하여 작성해보았습니다.
클래스 이름 뒷 부분이 `extends Thread`에서 `implements Runnable`로 바뀐 것 빼고는 동일한 코드입니다.
`Runnable` 인터페이스는 구현할 메소드가 `run()` 하나 뿐인 함수형 인터페이스입니다.
따라서 Java8에서 도입된 람다를 이용해서 좀 더 깔끔하게 구현할 수도 있습니다. (뒤에서 잠깐 다루겠습니다.)

```java
import java.util.Random;

public class MyRunnable implements Runnable {

  private static final Random random = new Random();

  @Override
  public void run() {
    String threadName = Thread.currentThread().getName();
    System.out.println("- " + threadName + " has been started");
    int delay = 1000 + random.nextInt(4000);
    try {
      Thread.sleep(delay);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println("- " + threadName + " has been ended (" + delay + "ms)");
  }

}
```

## 실행해보기

2가지 방법으로 작성한 클래스의 쓰레드 실행 방법이 약간 다릅니다.
두 가지 클래스 모두 `Thread` 클래스의 `start()` 메소드를 통해서 실행시킬 수 있는데요.
`Thread`를 확장한 `MyThread` 클래스의 경우, 해당 객체에 `start()` 메소드를 직접 호출할 수 있습니다.
반면에 `Runnable`을 구현한 `MyRunnable` 클래스의 경우에는, `Runnable` 형 인자를 받는 생성자를 통해 별도의 Thread 객체를 생성 후 `start()` 메소드를 호출해야 합니다.

```java
public class ThreadRunner {

  public static void main(String[] args) {
    // create thread objects
    Thread thread1 = new MyThread();
    thread1.setName("Thread #1");
    Thread thread2 = new MyThread();
    thread2.setName("Thread #2");

    // create runnable objects
    Runnable runnable1 = new MyRunnable();
    Runnable runnable2 = new MyRunnable();

    Thread thread3 = new Thread(runnable1);
    thread3.setName("Thread #3");
    Thread thread4 = new Thread(runnable2);
    thread4.setName("Thread #4");

    // start all threads
    thread1.start();
    thread2.start();
    thread3.start();
    thread4.start();
  }

}
```

아래 실행 결과를 보시면 4개의 쓰레드가 순차적으로 실행되지 않고, 랜덤 딜레이 때문에 끝나는 시간도 재각기인 것을 알 수 있습니다.
그리고 매번 실행할 때마다 딜레이가 달라지기 때문에, 실행 결과가 항상 동일하지 않을 것입니다.

```bash
- Thread #2 has been started
- Thread #4 has been started
- Thread #3 has been started
- Thread #1 has been started
- Thread #2 has been ended (2630ms)
- Thread #1 has been ended (3655ms)
- Thread #4 has been ended (4126ms)
- Thread #3 has been ended (4942ms)
```

## `Thread` vs. `Runnable`

위의 예제 코드를 보시면 `Thread` 클래스를 확장하는 것이 실행 방법이 간단하다는 것을 볼 수 있습니다.
하지만 자바에서는 다중 상속을 하용하지 않기 때문에, `Tread` 클래스를 확장하는 클래스는 다른 클래스를 상속받을 수 없습니다.
반면에 `Runnable` 인터페이스를 구현했을 경우에는 다른 인터페이스를 구현할 수 있을 뿐만 아니라, 다른 클래스도 상속받을 수 있습니다.
따라서 해당 클래스의 확장성이 중요한 상황이라면 `Runnalbe` 인터페이스를 구현하는 것이 더 바람직할 것입니다.

## 부록, 람다를 이용하여 Tread 실행

Runnable 인터페이스를 구현해서 해당 클래스의 객체 생성하는 방법보다 좀 더 간단하게 Runnalbe 인터페이스를 사용할 수 있습니다.
바로 Java8의 람다 구문을 이용하는 것인데요.
다음과 같이 Thread의 생성자의 인자로 람다를 넘기면 됩니다.

```java
public class RunnableLambdaTest {

  public static void main(String[] args) {
    Thread thread = new Thread(() -> {
      String threadName = Thread.currentThread().getName();
      System.out.println(threadName);
    });
    thread.setName("Thread #1");
    thread.start();
  }

}
```