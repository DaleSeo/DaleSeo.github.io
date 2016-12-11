---
title: "[문서 번역] 자바8 람다 - 1부"
modified: 2016-11-13T11:45:04-04:00
source: http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html
categories: 
  - Java
tags:
  - Java8
  - Lambda
  - FP
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


