---
title: "자바8 Optional 2부: null을 대하는 새로운 방법"
modified: 2017-12-25T16:21:30+09:00
categories: 
  - Java
tags:
  - Java8
  - FP
  - Optional
  - Stream
published: true
---

> Java8의 Optional API를 통해 어떻게 null 처리를 할 수 있는지 알아봅시다.

[이 전 포스트](java8-optional-before)를 통해 Java8 이 전에는 얼마나 null 처리가 고통스러웠는지 살펴보았습니다.
그리고 문제의 본질이 null 참조를 통해 "값의 부재"를 표현하는 자바 언어의 초기 설계에 기인한다라는 것도 말미에 언급하였습니다.


## null 관련 문제 돌아보기

이 전 포스트의 예제 코드를 통해 살펴본 null과 관련된 문제들을 크게 2가지로 요약됩니다.

- 런타임에 NPE(NullPointerException)라는 예외를 발생시킬 수 있습니다.
- NPE 방어를 위해서 들어간 null 체크 로직 때문에 코드 가독성과 유지 보수성이 떨어집니다.

그냥 두자니 곳곳에 숨어서 일으켜 장애를 유발하고, 조치를 하자니 코드를 엉망으로 만드는 null, 어떻하면 좀 더 현명하게 다룰 수 있을까요?


## 함수형 언어에서 그 해법을 찾다

스칼라나 히스켈과 같은 소위 함수형 언어들은 전혀 다른 방법으로 이 문제을 해결합니다.
자바가 값의 "존재하지 않는 값"을 표현하기 위해서 null을 사용했다면, 이 함수형 언어들은 "존재할지 안 할지 모르는 값"을 표현할 수 있는 별개의 타입을 가지고 있습니다.
그리고 이 타입은 이 존재할지 않 할지 모르는 값을 제어할 수 있는 여러가지 API를 제공하기 때문에 개발자들 해당 API를 통해서 간접적으로 그 값에 접근하게 됩니다.
Java8은 이러한 함수형 언어의 접근 방식에서 영감을 받아 `java.util.Optional<T>`라는 새로운 클래스를 도입하였습니다! :tada:


## Optional이란?

`Optional`는 "존재할 수도 있지만 안 할 수도 있는 객체", 즉, "null이 될 수도 있는 객체"을 감싸고 있는 일종의 래퍼 클래스입니다.
원소가 없거나 최대 하나 밖에 없는 `Collection`이나 `Stream`으로 생각하셔도 좋습니다.
직접 다루기에 위험하고 까다로운 null을 담을 수 있는 특수한 그릇으로 생각하시면 이해가 쉬우실 것 같습니다.

## Optional의 효과

Optional을 사용해서 객체를 감싸서 사용하시게 되면...

- NPE를 유발할 수 있는 null을 직접 다루지 않아도 됩니다.
- 번거로운 null 체크를 직접 하지 않아도 됩니다.
- 명시적으로 해당 변수가 null일 수도 있다는 가능성을 표현할 수 있습니다. (따라서 방어적인 불필요한 null 체크를 줄일 수 있습니다.)

## Optional 기본 사용법

자, 그럼 각설하고 `java.util.Optional<T>` 클래스를 어떻게 사용하는지 좀 더 구체적으로 살펴볼까요?


### Optional 변수 선언하기

제네릭을 제공하기 때문에, 변수를 선언할 때 명기한 타입 파라미터에 따라서 감쌀 수 있는 객체의 타입이 결정됩니다.

```java
Optional<Order> maybeOrder = ... // Order 타입의 객체를 감쌀 수 있는 Optional 타입의 변수
Optional<Member> optMember = ... // Member 타입의 객체를 감쌀 수 있는 Optional 타입의 변수
Optional<Address> address = ... // Address 타입의 객체를 감쌀 수 있는 Optional 타입의 변수
```

변수명은 그냥 클래스 이름을 사용하기도 하지만 "maybe"나 "opt"와 같은 접두어를 붙여서 Optional 타입의 변수라는 것을 좀 더 명확히 나타내기도 합니다.


### Optional 객체 생성하기

Optional 클래스는 간편하게 객체 생성을 할 수 있도록 3가지 정적 팩토리 메소드를 제공합니다.

1. `Optional.empty()`

null을 담고 있는, 한 마디로 비어있는 Optional 객체를 얻어옵니다.
이 비어있는 객체는 Optional 내부적으로 미리 생성해놓은 싱글턴 인스턴스입니다.

```java
Optional<Member> maybeMember = Optional.empty();
```

2. `Optional.of(value)`

null이 아닌 객체를 담고 있는 Optional 객체를 생성합니다.
null이 넘어올 경우, NPE를 던지기 때문에 **주의해서 사용해야 합니다**.

```java
Optional<Member> maybeMember = Optional.of(aMember);
```

3. `Optional.ofNullable(value)`

null인지 아닌지 확신할 수 없는 객체를 담고 있는 Optional 객체를 생성합니다.
`Optional.empty()`와 `Optional.ofNullable(value)`를 합쳐놓은 메소드라고 생각하시면 됩니다.
null이 넘어올 경우, NPE를 던지지 않고 `Optional.empty()`와 동일하게 비어 있는 Optional 객체를 얻어옵니다.
해당 객체가 null인지 아닌지 자신이 없는 상황에서는 이 메소드를 사용하셔야 합니다.

```java
Optional<Member> maybeMember = Optional.ofNullable(aMember);
Optional<Member> maybeNotMember = Optional.ofNullable(null);
```


### Optional이 담고 있는 객체 접근하기

Optional 클래스는 담고 있는 객체를 꺼내오기 위해서 다양한 인스턴스 메소드를 제공합니다.
아래 메소드들은 모두 Optional이 담고 있는 객체가 존재할 경우 동일하게 해당 값을 반환합니다.
반면에 Optional이 비어있는 경우(즉, null을 담고 있는 경우), 다르게 작동합니다.
따라서 비어있는 Optional에 대해서 다르게 작동하는 부분만 설명드리겠습니다.

- `get()`

비어있는 Optional 객체는 `NoSuchElementException`을 던집니다.

- `orElse(T other)`

비어있는 Optional 객체는 넘어온 인자를 반환합니다.

- `orElseGet(Supplier<? extends T> other)`

비어있는 Optional 객체는 넘어온 함수형 인자를 통해 생성된 객체를 반환합니다. 
`orElse(T other)`의 게으른 버전이라고 보시면 됩니다. 
비어있는 경우에만 함수가 호출되기 때문에 `orElse(T other)` 대비 성능상 이점을 기대할 수 있습니다.

- `orElseThrow(Supplier<? extends X> exceptionSupplier)`

비어있는 Optional 객체는 넘어온 함수형 인자를 통해 생성된 예외를 던집니다.

지금까지 Optional에서 제공하는 주요 메소드들에 대해서 알아보았습니다.
이제부터 이 메소드들을 어떻게 활용하는지에 대해서 얘기해보도록 하겠습니다.


## Optional답지 않은 null 체크 

위에서 설명드린 것 처럼 `get()` 메소드는 비어있는 Optional 객체를 대상으로 호출할 경우, 예외를 발생시키므로 다음과 같이 객재 존재 여부를 bool 타입으로 반환하는 `ifPresent()`라는 메소드를 통해 null 체크가 필요합니다.

```java
Optional<String> maybeText = getText();
int length;
if (maybeText.isPresent()) {
	length = maybeText.get().length();
} else {
	length = 0;
}
```

같은 코드를 다시 Optional 없이 작성해보겠습니다.

```java
String text = getText();
int length;
if (text != null) {
	length = maybeText.get().length();
} else {
	length = 0;
}
```

이럴꺼면 뭐하러 Optional을 사용하는 걸까요? Optional을 사용해서 도대체 뭐가 좋아진거죠?! 
사실 이렇게 코딩하실 거라면 차라리 Optional을 사용하지 않는 편이 나을 것 같습니다.

안타깝게도 Optional 관련해서 개발자들이 제일 많이 하는 질문 중 하나가 "Optional 적용 후 어떻게 null 체크를 해야하나요?" 입니다.
사실 이 질문에 대한 답변은 "null 체크를 하실 필요가 없으시니 하시면 안 됩니다." 입니다.

제 말이 무슨 말인지 혼란스러우신 분도 있으실 겁니다. :dizzy_face: 저도 처음 Optional을 접했을 때 그랬으니까요.
우리가 Optional을 사용하려는 이유는 앞에서 설명드렸던 것 처럼 **고통스러운 null 처리를 직접하지 않고 Optional 클래스에 위임하기** 위함입니다.

따라서 위와 같은 방식으로 Optional을 사용하게 되면 Java8 이 전에 직접 null 체크를 하던 코딩 수준에서 크게 벗어나지 못하게 됩니다.

```java
public String getMemberCityFromOrder(Order order) {
	Optional<Order> maybeOrder = Optional.ofNullable(order);
	if (maybeOrder.isPresent()) {
		Optional<Member> maybeMember = Optional.ofNullable(maybeOrder.get());
		if (maybeMember.isPresent()) {
			Optional<Address> maybeAddress = Optional.ofNullable(maybeMember.get());
			if (maybeAddress.isPresent()) {
				Address address = maybeAddress.get();
				Optinal<String> maybeCity = Optional.ofNullable(address.getCity());
				if (maybeCity.isPresent()) {
					return maybeCity.get();
				}
			}
		}
	}
	return "Seoul";
}
```

다른 잘못된 예제로 이 전 포스트에서 보았던 `getMemberCityFromOrder()` 메소드를 같은 스타일로 작성해보았습니다.
이 전 포스트에서 보았던 코드와 별반 다르지 않은 수준의, 사실 오히려 살짝 더 복잡해 보이는 코드가 탄생하였습니다.
어디서부터 잘못된 걸까요? :sob:

기존에 null을 대하던 자세를 완전히 바꿔야 할 때입니다.
다음 포스트에서 Optional을 좀 더 Optional답게 사용하는 방법에 대해서 알아보도록 하겠습니다.
