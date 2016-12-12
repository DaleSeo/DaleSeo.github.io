---
title: "[번역] 자바8 람다 - 1부"
modified: 2016-11-13T11:45:04-04:00
source: http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html
categories: 
  - Java
tags:
  - Java8
  - Lambda
  - FP
  - 번역
---

## 자바8의 람다 표현식 알아보기

자신이 선택한 프로그래밍 언어나 플랫폼의 새로운 출시 소식보다 소프트웨어 개발자를 흥분시키는 일이 있을까?
자바 개발자들도 예외는 아니다. 사실, 오히려 자바 개발지들 더욱 새로운 출시에 대해 간절했을지도 모릅니다.
왜냐하면 자바를 만들었던 Sun이 그랬던 것 처럼 자바도 쇠퇴의 길을 걷지 않을까 생각했던 게 그리 오래 전 일이 아니기 때문이죠.

죽을 고비를 겪고 나면 다시 주어진 삶을 더욱 소중히 생각하게 됩니다.
그러나 이 번에는 우리의 열정을 통해 자바8이 마침내 이전 출시와 달리 우리 대부분의 자바 개발자들이 수십 년은 아니더라도 꽤 여러 해동안 요청해왔던 새로운 최신 언어 기능을 갖도록 만들어냈습니다.

물론, 자바8에 대한 열광은 주로 일명 클로저라고 불리기도 하는 람다에 대한 것이며 그 것이 앞으로 총 2부에 걸쳐 다루게 될 주제입니다.
그러나 어느 정도의 서포트가 뒷받침 되지 않는다면 어떤 언어의 기능 자체는 유용하고 흥미로운 점으로 다가오지 못할 것입니다.
자바7의 일부 기능들이 여기에 해당되는데요. 예를 들어 향상된 숫자 리터럴은 대부분의 개발자들의 시선을 별로 끌지 못하였습니다.

하지만 이 번에는 자바8의 함수 리터럴들은 언어의 핵심을 바꿀뿐만 아니라, 그 것들은 더 쉽게 사용되도록 설계된 부가적인 기능들도 추가되었습니다. 또한 이러한 기능들을 직접 사용되도록 일부 라이브러리들이 개조되었습니다. 이런 점들은 자바 개발자로서의 삶을 편안하게 해줄 것입니다.

자바 메거진은 이전에도 람다에 대한 기사를 연재했었습니다. 그러나 그 때 이후로 일부 문법이 변경되었는지도 모르고 모든 독자들이 그 지난간 기사들을 읽을 시간이나 의향이 있지는 않을 것입니다. 그래서 저는 독자들이 전에 이와 관련된 어떤 문법도 본적이 없다고 가정할 것입니다.

참고: 이 문서는 Java 8 SE 시험판 버전을 기준으로 작성되어 있으므로 최종 버전이 출시될 시점에는 완벽하게 정확하지 않을 수도 있습니다. 최종 출시까지 문법은 항상 변경될 가능성이 있습니다.

이 주제에 대해서 더 깊고 공식적인 설명을 원하시는 분들은 Brian Goetz의 논문(“State of the Lambda: Libraries Edition”)이나 프로젝트 람다 홈페이지에 공개되어 있는 문헌들이 귀중한 참고자료가 되실 겁니다.


## 배경지식 - 함수형 객체

우리가 자바 커뮤니티에서 함수형 객체의 유용함과 필요성을 과소 평가되도록 격렬하게 노력해왔음도 불구하고, 이에 대한 요구는 항상 있어왔습니다.

자바의 초창기 시절, GUI를 개발할 때, 우리는 창 열기나 닫기, 버튼 클릭, 스크롤바 이동과 같은 사용자 이벤트에 응답하기 위한 코드 블록들이 필요했습니다.

In Java 1.0, Abstract Window Toolkit (AWT) applications were expected, like their C++ predecessors, to extend window classes and override the event method of choice; this was deemed unwieldy and unworkable. So in Java 1.1, Sun gave us a set of “listener” interfaces, each with one or more methods corresponding to an event within the GUI.

자바 1.0에서는 C++처럼 AWT 응용 프로그램은 윈도우 클래스를 확장하고 선택한 이벤트 메서드를 오버라이드했어야 했는데, 이 것은 번거롭고 실용성이 떨어졌었습니다. 그래서 자바 1.1에서 Sun사는 우리에게 일련의 리스너 인터페이스를 제공하였고, 각 인터페이스는 GUI 내부의 이벤트에 하나 이상에 대응하였습니다.

But in order to make it easier to write the classes that must implement these interfaces and their corresponding methods, Sun gave us inner classes, including the ability to write such a class within the body of an existing class without having to specify a name—the ubiquitous anonymous inner class. (By the way, the listeners were hardly the only example of these that appeared during Java’s history. As we’ll see later, other, more “core” interfaces just like them appeared, for example, Runnable and Comparator.)

또한 이 인터페이스와 부합하는 메서드들을 구현하는 클래스들을 쉽게 작성하게 하기 위해서 Sun사는 우리에게 이름을 지정하지 않고도 기존 클래스 바디 내부에 클래스를 구현할 수 있게 해주는 익명 내부 클래스를 제공하였습니다. (덧붙여, 이 리스너들만이 자바 역사에서 등장하는 유일한 예제가 아닙니다. 나중에 보시겠지만, Runnable이나 Comparator처럼 더욱 핵심 인터페이스들도 등장합니다.)

Inner classes had some strangeness to them, both in terms of syntax and semantics. For example, an inner class was either a static inner class or an instance inner class, depending not on any particular keyword (though static inner classes could be explicitly stated as such using the static keyword) but on the lexical context in which the instance was created. What that meant, in practical terms, is that Java developers often got questions such as those in Listing 1 wrong on programming interviews.

내부 클래스들은 구문과 의미론의 모든 측면에서 다소 이상한 점이 있었습니다. 예를 들어, 내부 클래스가 내부 클래스이거나 인스턴스 내부 클래스인지가 어떤 특별한 키워드에 의존하지 않고 인스턴스가 생성되고 있는 어희적인 문맥 상으로 결정되었습니다. (그러나 정적 내부 클래스는 명시적으로 static 키워드를 사용하여 표시가 될 수 있었습니다.)
이 것은 현실적인 측면에서 자바 개발자들은 프로그래밍 면접에서 자주 일람 1과 같은 질문을 받게 되고 틀렸다라는 것을 의미했습니다.

### 일람 1
```java
class InstanceOuter {
  public InstanceOuter(int xx) { x = xx; }

  private int x;

  class InstanceInner {
    public void printSomething() {
      System.out.println("The value of x in my outer is " + x);
    }
  }
}

class StaticOuter {
  private static int x = 24;

  static class StaticInner {
    public void printSomething() {
      System.out.println("The value of x in my outer is " + x);
    }
  }
}

public class InnerClassExamples {
  public static void main(String... args) {
    InstanceOuter io = new InstanceOuter(12);

    // Is this a compile error?
    InstanceOuter.InstanceInner ii = io.new InstanceInner();

    // What does this print?
    ii.printSomething(); // prints 12

    // What about this?
    StaticOuter.StaticInner si = new StaticOuter.StaticInner();
    si.printSomething(); // prints 24
  }
} 
```

내부 클래스와 같은 기능들은 프로그래밍 면접에 어울릴만한 특수 케이스로 취급될 정도로 일반적인 상황에서는 사용하는 않는 기능이라고 생각하도록 자바 개발자들을 확신시켰습니다. 심저어 그 후에는 대부분 내부 클래스 기능은 순전히 이벤트 처리 목적으로만 사용되어 졌습니다.


## 위와 너머 (Above and Beyond)

구문과 의미론이 투박했음에도 불구하고 그 시스템은 작동했습니다.
자바가 성장하고 성숙해짐에 따라, 우리는 코드 블록을 객체(실제로 데이터)로 취급하는 것이 유용할 뿐만 아니라 필요하는 더 많은 지점들을 발견하였습니다.
Java SE 1.2에서 개편된 보안 시스템은 다른 보안 문맥 하에서 코드 블록을 전달하는 것이 유용하다는 걸 알아내었습니다.
같은 릴리즈에서 함께 개편된 컬렉션 클래스는 정렬된 컬렉션에 어떤 정렬 순서를 적용할지 알기위해서 코드 블록을 전달하는 것이 유용하다고 판단하였습니다.
스윙은 파일 열기나 저장 대화 사장에서 사용자에게 어떤 파일을 표시할지 결정하기 위해서 코드 블록을 전달하는 것달하는 것이 유용한다고 판단하였습니다.
그리고 오직 작성자 본인 밖에 좋아하지 않을 만한 구문을 통해서 그 것은 해결되었습니다.

하지만 함수형 프로그래밍의 개념이 주류가 되기 시작했을 때, 대부분의 자바 개발자들은 이미 포기하였습니다.
심지어 가능할지라도 ((여기에 완벽한 사례가 있습니다.)[http://www.functionaljava.org/]) 어찌됐든 자바에서 함수형 프로그래밍은 서투르고 어색하였습니다.
자바는 진화하여 나중에 실행할 수 있도록 코드 블록을 정의하고 전달하고 저장하기 위한 first-class 언어 지원을 제공하는 주류 프로그래밍 언어에 참여할 필요가 있었습니다. 


## 자바8: 람다식, 타입 추론, 어휘 범위

자바8은 그런한 코드 블록을 쉽게 작성하게 하기위해 설계된 몇몇 새로운 언어 기능들을 도입합니다. 
그 중에서 가장 중요한 기능은 구어체로 클로저또는 익명 함수라고 일켣는 람다식입니다.
(클로저라고 불리는 이유는 잠시 후 논의할 것입니다.)
이 것들에 하나 씩 다뤄봅시다.

### 람다식

람다식은 기본적으로 나중에 실행하는 메서드의 구현을 간결하게 기술하는 방법에 불과합니다.
예를 들어 그러므로 일람 2와 같이 Runnable을 정의하기 위해 익명 내부 함수 문법을 사용하고 간단한 개념 표현을 위해서 너무 많은 코드 줄을 소비하는 문제가 명확하게 나타났던 반면에, 자바8 람다 문법을 이용하면 동일한 내용의 코드를 알람 3과 같이 작성할 수 있습니다.

#### 일람 2 
```java
public class Lambdas {
  public static void main(String... args) {
    Runnable r = new Runnable() {
      public void run() {
        System.out.println("Howdy, world!");
      }
    };
    r.run();
  }
} 
```

#### 일람 3 
```java
public static void main(String... args) {
  Runnable r2 = () -> System.out.println("Howdy, world!");
  r2.run();
}
```

두 가지 접근법 콘솔에 무언가를 출력하기 위해서 run() 메서드가 호출되고 있는 Runnable을 구현하는 객체라는 점에서 동일한 효과를 냅니다. 
그러나 내부적으로 자바8 버전은 단지 Runnable 인터페이스를 구현하는 익명 클래스를 생성하는 것 외에도 약간 처리가 추가됩니다.
그 중 일부는 자바7에서 도입되었던 동적 바이트코드 호출과 관계를 있습니다.
본 기사에서는 더 깊이 들어가지는 않겠지만, 이 것이 단지 익명 클래스 이상이라는 것만 알아두시기 바랍니다.

### 함수형 인터페이스

자바 내부에서 이미 정의해놓은 Runnable이나 Callable<T>, Comprator<T> 그리고 수 많은 다른 인터페이스들은 java8에서는 함수형 인터페이스라고 부릅니다.
이 인터페이스들은 함수현 인터페이스의 요구사항을 만족하기 위해서 구현되어야 할 메소드를 정확히 하나만 가져야합니다.
람다가 해당 인터페이스의 어떤 메서드를 정의하고 있는지에 대한 모호함이 없기 때문에 문법이 간결해질 수 있는 이유가 됩니다.

자바8의 설계자들은 **@FunctionalInterface**라는 어노테이션을 제공하기로 하였습니다.
문서화 시 어떤 인터페이스가 람다와 함께 사용되어지도록 설계되었다라는 것에 알려주는 힌트 용도인데, 
컴파일러는 이 어노테이션이 아니라 인터페이스의 구조로 함수형 인터페이스 여부르르 판단하기 때문이 이 어노테이션이 필요 하지 않습니다.

Throughout the rest of this article, we’ll continue to use the Runnable and Comparator<T> interfaces as working examples, but there is nothing particularly special about them, except that they adhere to this functional interface single-method restriction. Any developer can, at any time, define a new functional interface—such as the following one—that will be the interface target type for a lambda.

이 기사의 남은 부분 동안,  Runnable과 Comparator<T> 인터페이스를 실전 예제로 사용할 것입니다.
그러나 이 인터페이스들이 함수현 인터페이스의 유일 메서드 제약을 따르는 점 외에는 특별한 점은 없습니다.
어떤 개발자든지 언제든지 다음과 같이 람다의 인터페이스 타켓 타입이 될 새로운 함수형 인터페이스를 정의할 수 있습니다.

```java
interface Something {
  public String doit(Integer i);
}
```

The Something interface is every bit as legal and legitimate a functional interface as Runnable or Comparator<T>; we’ll look at it again after getting some lambda syntax under our belt.

위의 Something 인터페이스는 Runnable과 Comparator<T>처럼 유효하고 적절한 함수형 인터페이스입니다.
이 인터페이스는 몇 가지 람다 문법을 습득 한 후 다시 다루겠습니다.

### 람다 문법

자바에서 람다는 괄호 안의 매개 변수 집합, 화살표 그리고 하나의 표현식이거나 코드 블록이 될 수 있는 바디 이렇게 핵심적인 3개의 부분으로 이루어집니다.
일람 2와 같은 예제에서 run 메서드가 파라미터를 받지 않았고 void 반환했기 때문에 파라미터와 반환 타입이 없었습니다.
그러나 일람 4와 같이 Comparator<T>에 대한 예제는 이 문법을 좀 더 명확하게 보여줍니다.
Comparator는 2개의 문자열을 인수로 받고 정수를 반환하는데 첫 번째 스트링이 더 작을 경우에는 음수, 더 클 경우에는 양수, 같을 경우에는 0을 반환합니다.

#### 일람 4
```java
public static void main(String... args) {
  Comparator<String> c = (String lhs, String rhs) -> lhs.compareTo(rhs);
  int result = c.compare("Hello", "World");
}
```

If the body of the lambda requires more than one expression, the value returned from the expression can be handed back via the return keyword, just as with any block of Java code (see Listing 5).

일람 5처럼 만약에 람다의 바디가 하나보다 많은 표현식을 필요로 한다면, 일반적인 자바 코드와 마찬가지로 반환 값은 return 키워를 통해서 반환되어질 수 있습니다.

#### 일람 5
```java
public static void main(String... args) {
  Comparator<String> c = (String lhs, String rhs) -> {
    System.out.println("I am comparing" + lhs + " to " + rhs);
    return lhs.compareTo(rhs);
  };
  int result = c.compare("Hello", "World");
} 
```

(코드의 어디에 중괄호를 위치시킬지에 대한 논의는 앞으로 수년동안 자바 게시판과 블로그를 수놓을 것 같습니다.)
람다의 바디에서 실행될 수 있는 것들에 대해서는 약간의 제한이 있는데요.
대부분은 break나 continue 키워드로 람다 바디 밖으로 탈출할 수 없다거나 람다가 값을 반환한다면 모든 코드 경로에서 값을 반환하거나 예외를 던저야 한다는 등의 직관적인 것들입니다.
이 것들은 표준 자바 메서드에 대한 규칙과 동일한 부분이 많으며 그래서 그리 놀랄만한 일도 아닙니다.

### 타입 추론

자바 외의 다른 언어에서 내세워온 특징 중 하나는 타입 추론입니다.
즉, 개발자가 매개 변수의 타입을 매번 명시하도록 강제하기 보다는 컴파일러가 스스로 타입 매개 변수가 무엇인지 알아낼 정도로 똑똑해야 한다는 건데요.

예를 들어 일람 5의 Comparator를 생각해보겠습니다.
만약 타겟 타입이 Comparator<String>이라면, 람다에 넘어오는 객체들은 문자열 또는 그 하위 타입이여야 합니다.
그렇지 않으면, 코드는 애초에 컴파일 되지 않을 것입니다.
(그런데 이 것은 새로운 내용은 아니군요. 상속의 기초 개념입니다.)

이 경우에, 자바8의 향상된 타입 추론 기능 덕분에 **lhs**와 **rhs** 앞에 **Stirng** 선언은 완전히 중복되며, 완전히 선택사항입니다. (일람 6)

#### 일람 6 
```java
public static void main(String... args) {
  Comparator<String> c = (lhs, rhs) -> {
    System.out.println("I am comparing" + lhs + " to " + rhs);
    return lhs.compareTo(rhs);
  };
  int result = c.compare("Hello", "World");
}
``` 

언어 규격은 언제 명시적인 형식적인 타입 선언이 필요한지에 대해서 정확한 규칙을 가질 것입니다.
그러나 대부분 경우에 대해 람다 표현식에 대해 매개 변수 타입 명시는 완전히 생략하는 것이 예외적인 것이 아니라 표준적이 되어가고 있습니다.

자바 람다 문법의 한가지 재미잇는 부작용은 약간의 조치없이는 Object 참조에 할당할 수 없는 사례가 자바 역사상 처음으로 등장했다는 것입니다. (일람 7)

#### 일람 7
```java
public static void main4(String... args) {
  Object o = () -> System.out.println("Howdy, world!");
  // 컴파일 에러!
}
```

The compiler will complain that Object is not a functional interface, though the real problem is that the compiler can’t quite figure out which functional interface this lambda should implement: Runnable or something else? We can help the compiler with, as always, a cast, as shown in Listing 8.

컴파일러는 Object가 함수형 인터페이스가 아니라고 불평할 것입니다.
그러나 실제 문제는 컴파일라는 이 람다가 어떤 함수형 인터페이스를 구현하고 있는지 알아낼 길이 없다는 것입니다.
Runnalbe일까요? 아니면 다른 걸까요? 일람 8처럼 늘 그래왔던 것 처럼 형변환을 통해 컴파일러를 도와줄 수 있습니다.

#### 일람 8 
```java
public static void main4(String... args) {
  Object o = (Runnable) () -> System.out.println("Howdy, world!");
}
``` 

Recall from earlier that lambda syntax works with any interface, so a lambda that is inferred to a custom interface will also be inferred just as easily, as shown in Listing 9. Primitive types are equally as viable as their wrapper types in a lambda type signature, by the way.

앞서 언급했듯이 람다 문법은 어떤 인터페이스와도 작동하므로 사용자 인터페이스로 추론되는 람다는 일람 9처럼 마찬가지로 쉽게 유추될 것입니다.
그런데 원시형 타입들은 각각 대응하는 래퍼 타입들과 동이랗게 작동합니다.

#### 일람 9
```java
Something s = (Integer i) -> { return i.toString(); };
System.out.println(s.doit(4)); 
```

다시 말씀드리지만, 진짜 아무 것도 진짜 새로운 것은 없습니다. 
자바8은 자바의 오래된 원칙, 패턴과 새로운 기능에 대한 문법들을 적용하는 것 뿐입니다.
만약 아직 완전히 이해하지 못하셨다면, 코드를 통해 타입 추론을 이해하기 위해서 몇 분을 사용시면 크게 도움이 됩니다.



