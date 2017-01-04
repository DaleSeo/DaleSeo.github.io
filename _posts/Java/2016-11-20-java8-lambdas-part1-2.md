---
title: "자바8: 람다 1부 - 람다식, 타입 추론, 어휘 범위"
modified: 2016-11-20T21:40:04+09:00
source: http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html
categories: 
  - Java
tags:
  - Java8
  - Lambda
  - FP
  - 번역
---

> 본 포스트는 [오라클 웹사이트](http://www.oracle.com)에 Ted Neward가 기고한 [Java 8: Lambdas, Part 1](http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html)를 번역하였습니다.

자바8은 그런한 코드 블록을 쉽게 작성하게 하기위해 설계된 몇몇 새로운 언어 기능들을 도입합니다. 
그 중에서 가장 중요한 기능은 구어체로 클로저또는 익명 함수라고 일켣는 람다식입니다.
(클로저라고 불리는 이유는 잠시 후 논의할 것입니다.)
이 것들에 하나 씩 다뤄봅시다.

## 람다식

람다식은 기본적으로 나중에 실행하는 메서드의 구현을 간결하게 기술하는 방법에 불과합니다.
예를 들어 그러므로 일람 2와 같이 Runnable을 정의하기 위해 익명 내부 함수 문법을 사용하고 간단한 개념 표현을 위해서 너무 많은 코드 줄을 소비하는 문제가 명확하게 나타났던 반면에, 자바8 람다 문법을 이용하면 동일한 내용의 코드를 알람 3과 같이 작성할 수 있습니다.

### 일람 2 
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

### 일람 3 
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

## 함수형 인터페이스

자바 내부에서 이미 정의해놓은 Runnable이나 Callable<T>, Comprator<T> 그리고 수 많은 다른 인터페이스들은 java8에서는 함수형 인터페이스라고 부릅니다.
이 인터페이스들은 함수현 인터페이스의 요구사항을 만족하기 위해서 구현되어야 할 메소드를 정확히 하나만 가져야합니다.
람다가 해당 인터페이스의 어떤 메서드를 정의하고 있는지에 대한 모호함이 없기 때문에 문법이 간결해질 수 있는 이유가 됩니다.

자바8의 설계자들은 **@FunctionalInterface**라는 어노테이션을 제공하기로 하였습니다.
문서화 시 어떤 인터페이스가 람다와 함께 사용되어지도록 설계되었다라는 것에 알려주는 힌트 용도인데, 
컴파일러는 이 어노테이션이 아니라 인터페이스의 구조로 함수형 인터페이스 여부르르 판단하기 때문이 이 어노테이션이 필요 하지 않습니다.

이 기사의 남은 부분 동안,  Runnable과 Comparator<T> 인터페이스를 실전 예제로 사용할 것입니다.
그러나 이 인터페이스들이 함수현 인터페이스의 유일 메서드 제약을 따르는 점 외에는 특별한 점은 없습니다.
어떤 개발자든지 언제든지 다음과 같이 람다의 인터페이스 타켓 타입이 될 새로운 함수형 인터페이스를 정의할 수 있습니다.

```java
interface Something {
  public String doit(Integer i);
}
```

위의 Something 인터페이스는 Runnable과 Comparator<T>처럼 유효하고 적절한 함수형 인터페이스입니다.
이 인터페이스는 몇 가지 람다 문법을 습득 한 후 다시 다루겠습니다.

## 람다 문법

자바에서 람다는 괄호 안의 매개 변수 집합, 화살표 그리고 하나의 표현식이거나 코드 블록이 될 수 있는 바디 이렇게 핵심적인 3개의 부분으로 이루어집니다.
일람 2와 같은 예제에서 run 메서드가 파라미터를 받지 않았고 void 반환했기 때문에 파라미터와 반환 타입이 없었습니다.
그러나 일람 4와 같이 Comparator<T>에 대한 예제는 이 문법을 좀 더 명확하게 보여줍니다.
Comparator는 2개의 문자열을 인수로 받고 정수를 반환하는데 첫 번째 스트링이 더 작을 경우에는 음수, 더 클 경우에는 양수, 같을 경우에는 0을 반환합니다.

### 일람 4
```java
public static void main(String... args) {
  Comparator<String> c = (String lhs, String rhs) -> lhs.compareTo(rhs);
  int result = c.compare("Hello", "World");
}
```

일람 5처럼 만약에 람다의 바디가 하나보다 많은 표현식을 필요로 한다면, 일반적인 자바 코드와 마찬가지로 반환 값은 return 키워를 통해서 반환되어질 수 있습니다.

### 일람 5
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

## 타입 추론

자바 외의 다른 언어에서 내세워온 특징 중 하나는 타입 추론입니다.
즉, 개발자가 매개 변수의 타입을 매번 명시하도록 강제하기 보다는 컴파일러가 스스로 타입 매개 변수가 무엇인지 알아낼 정도로 똑똑해야 한다는 건데요.

예를 들어 일람 5의 Comparator를 생각해보겠습니다.
만약 타겟 타입이 Comparator<String>이라면, 람다에 넘어오는 객체들은 문자열 또는 그 하위 타입이여야 합니다.
그렇지 않으면, 코드는 애초에 컴파일 되지 않을 것입니다.
(그런데 이 것은 새로운 내용은 아니군요. 상속의 기초 개념입니다.)

이 경우에, 자바8의 향상된 타입 추론 기능 덕분에 **lhs**와 **rhs** 앞에 **Stirng** 선언은 완전히 중복되며, 완전히 선택사항입니다. (일람 6)

### 일람 6 
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

### 일람 7
```java
public static void main4(String... args) {
  Object o = () -> System.out.println("Howdy, world!");
  // 컴파일 에러!
}
```

컴파일러는 Object가 함수형 인터페이스가 아니라고 불평할 것입니다.
그러나 실제 문제는 컴파일라는 이 람다가 어떤 함수형 인터페이스를 구현하고 있는지 알아낼 길이 없다는 것입니다.
Runnalbe일까요? 아니면 다른 걸까요? 일람 8처럼 늘 그래왔던 것 처럼 형변환을 통해 컴파일러를 도와줄 수 있습니다.

### 일람 8 
```java
public static void main4(String... args) {
  Object o = (Runnable) () -> System.out.println("Howdy, world!");
}
``` 

앞서 언급했듯이 람다 문법은 어떤 인터페이스와도 작동하므로 사용자 인터페이스로 추론되는 람다는 일람 9처럼 마찬가지로 쉽게 유추될 것입니다.
그런데 원시형 타입들은 각각 대응하는 래퍼 타입들과 동이랗게 작동합니다.

### 일람 9
```java
Something s = (Integer i) -> { return i.toString(); };
System.out.println(s.doit(4)); 
```

다시 말씀드리지만, 진짜 아무 것도 진짜 새로운 것은 없습니다. 
자바8은 자바의 오래된 원칙, 패턴과 새로운 기능에 대한 문법들을 적용하는 것 뿐입니다.
만약 아직 완전히 이해하지 못하셨다면, 코드를 통해 타입 추론을 이해하기 위해서 몇 분을 사용시면 크게 도움이 됩니다.


## 어희 범위

One thing that is new, however, is how the compiler treats names (identifiers) within the body of a lambda compared to how it treated them in an inner class. Consider the inner class example shown in Listing 10 for a moment.

그러나 한가지 새로운 것이 있는데요. 그 것은 컴파일러가 내부 클래스 대비 람다의 바디 내에서 어떻게 이름(식별자)을 다루냐는 것이지요.
일람 10의 내부 클래스 예제를 잠시 보시죠.

### 일람 10
```java
class Hello {
  public Runnable r = new Runnable() {
    public void run() {
      System.out.println(this);
      System.out.println(toString());
    }
  };

  public String toString() {
    return "Hello's custom toString()";
  }
}

public class InnerClassExamples {
  public static void main(String... args) {
    Hello h = new Hello();
    h.r.run();
  }
}
```

**run** 메서드가 실행될 때, 일람 10의 코드는 필자의 컴퓨터에서 **Hello$1@f7ce53**라는 직관적이지 않은 문자열을 만들어 냅니다.
이 것의 이유는 간단하게 이해되는데요.
익명 **Runnable**의 구현 내에서 **this** 키워드와 **toString** 메소드의 호출이 모두 표현식을 만족시키는 가장 내부 범위인 익명 내부 함수 구현에 
바인딩 되기 때문입니다.

예제가 암시하는 것처럼 **Hello** 클래스의 **toString**을 호출하라면 자바 사양의 내부 클래스 설명을 통해 외부 클래스의 **this** 문법을 사용하라고 일람 11처럼 명시적으로 표기해줘야 합니다.
그럼 외부 클래스의 **this**와 같은 구문은 직관적일까요?

### 일람 11
```java
class Hello {
  public Runnable r = new Runnable() {
    public void run() {
      System.out.println(Hello.this);
      System.out.println(Hello.this.toString());
    }
  };

  public String toString() {
    return "Hello's custom toString()";
  }
}
```

솔직히 이 것은 내부 클래스가 문제를 해결하는 것보다는 더 많은 혼선을 일으키는 형국입니다.
물론, **this** 키워드가 이렇게 오히려 직관적이지 않은 문법으로 나타나고 있는 배경에는 어느 정도 논리적 이유가 있습니다.
그러나 정치인의 특권이 일리가 있는 것과 같이 다소 일리가 있습니다. (?)

그러나 람다는 어휘 범위가 적용됩니다. 즉 람다는 다음 외부 범위를 둘러싼 직접적인 환경을 인식합니다.
그래서 일람 12의 람다 예제는 훨씬 더 직관적인 문법으로 일람 11의 내부 클래스와 동일한 결과를 만들어냅니다.

### 일람 12 
```java
class Hello {
  public Runnable r = () -> {
      System.out.println(this);
      System.out.println(toString());
    };

  public String toString() {
    return "Hello's custom toString()";
  }
} 
```

그런데 이 것은 더 이상 람다 자체에 대한 내용 그 이상이라는 것을 의미하며 흔하지는 않겠지만 어떤 상황에서는 훨씬 더 중요할 수도 있습니다.
게다가 이러한 상황이 발생한다면 (예를 들어, 람다가 다른 람다를 반환하려는 경우), 2번째로 생각해볼 비교적 쉬운 방법이 있습니다.


## 변수 캡쳐

람다가 클로저라고 불리우는 이유 중 하나는 어떤 함수 리터럴(여태까지 소개한 것과 같은 형식)이 감싸고 있는 범위 내에 있는 그 함수 리터럴 외부에 있는 변수 참조를 가둘 수 있다는 것입니다.
자바의 경우에는 일반적으로 람다로 정의된 메서드입니다.
내부 클래스로도 이러한 구조는 가능하지만 내부 클래스의 경우 내부 클래스들이 감싸고 있는 범위에서 오직 **final** 변수만 참조할 수 있다는 제약이 있었습니다.
이 것은 내부 클래스와 관련되어 자바 개발자들을 가장 고민했던 주제 중에서도 특히 중요한 것입니다.

람다는 이러한 제약을 다소 완화시킵니다.
해당 변수 참조가 실질적으로 **final** 하기만 하다면, **final** 수식어가 없어도 람다는 그 변수를 참조할 수 있습니다. (일람 13)
왜냐하면 **message**는 람다를 정의하고 있는 **main** 메서드의 범위 내부에서 한번도 변경되지 않았기 때문입니다.
그 것은 실질적으로 **final** 하다는 것이므로 **r**에 저장된 **Runnalbe** 람다 내부로 부터 참조당할 자격이 있습니다.

### 일람 13 
```java
public static void main(String... args) {
  String message = "Howdy, world!";
  Runnable r = () -> System.out.println(message);
  r.run();
} 
```

표면적으로 이 것은 별 거 아닌 것처럼 들릴 수 있지만, 람다의 의미론 규칙은 자바의 근본 성질을 바꾸지 않다는 것을 기억하세요.
즉, 일람 14처럼 람다 정의 이후에도 객체들이 여전히 접근가능하고 수정 가능합니다.

### 일람 14
```java
public static void main(String... args) {
  StringBuilder message = new StringBuilder();
  Runnable r = () -> System.out.println(message);
  message.append("Howdy, ");
  message.append("world!");
  r.run();
} 
```

기존의 내부 클래스의 구문과 의믜론에 익숙한 예리한 개발자들은 다음을 기억할 것입니다.
내부 클래스 내부에서 참조되는 **final**로 선언된 참조에 대해서도 만찬가지라고요.
이 것이 버그인지 기능인지에 대해서는 자바 커뮤니티에 의해 판단되도록 놔둬야 하겠지만 현재 모습은 인정해야겠지요.
개발자들은 예상치못한 버그가 발생하지 않도록 어떻게 람다 변수 캡쳐가 작동하는지에 대해서 이해할 정도로 현명해져야 합니다.
(사실, 이 행동도 새로운 것은 아니죠. 이 것은 단지 존재하는 자바의 기능을 컴파일러의 더 많은 도움으로 더 적은 코딩으로 재생산하고 있는 것입니다.)





