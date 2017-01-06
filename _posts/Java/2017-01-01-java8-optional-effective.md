---
title: "자바8 Optional 3부: Optional을 Optional답게 "
modified: 2017-01-01T21:21:30+09:00
categories: 
  - Java
tags:
  - Java8
  - FP
  - Optional
  - Stream
published: true
---

> Optional을 좀 더 Java8 API 설계자의 의도에 맞게 쓰는 방법에 대해서 알아봅시다.

[이 전 포스트](/java/java8-optional-after/)를 통해서 Optional에 대해서 소개드렸습니다.
또한 Optional을 Optional답지 않게 사용할 경우, 어떤 부작용이 발생하는지도 살펴보았는데요.
이 번 포스트에서는 어떻게 코드를 작성해야 Optional을 Optional답게 쓸 수 있는지 알아보도록 하겠습니다.


## Stream처럼 사용하기

Optional을 제대로 사용하려면, Optional을 **최대 1개의 원소를 가지고 있는** 특별한 Stream이라고 생각하시면 좋습니다.
Optional 클래스와 Stream 클래스 간에 직접적인 구현이나 상속관계는 없지만 사용 방법이나 기본 사상이 매우 유사하기 때문입니다.
Stream 클래스가 가지고 있는 `map()`이나 `flatMap`(), `filter()`와 같은 메소드를 Optional도 가지고 있습니다.
따라서 Stream을 능숙하게 다루시는 분이시라면 Optional도 어렵지 않게 다루실 수 있으실 겁니다.


### `map()`으로 변신하기

그럼 `Stream` API를 나루듯이 `Optional` API를 사용하여 [첫 번째 포스트](/java/java8-optional-before/)의 `getCityOfMemberFromOrder()` 메소드를 리펙토링 해보겠습니다.

```java
/* 주문을 한 회원이 살고 있는 도시를 반환한다 */
public String getCityOfMemberFromOrder(Order order) {
	return Optional.ofNullable(order)
			.map(Order::getMember)
			.map(Member::getAddress)
			.map(Address::getCity)
			.orElse("Seoul");
}
```

첫 번째 포스트에서 다루었던 2가지 전통적인 NPE 방어 패턴에 비해 훨씬 간결하고 명확해진 코드를 볼 수 있습니다.
우선 기존에 존재하던 조건문들이 모두 사라지고 Optional의 수려한(fluent) API에 의해서 단순한 메소드 체이닝으로 모두 대체되었습니다.
메소드 체이닝의 간 단계 별로 좀 더 상세히 짚어보겠습니다.

- `ofNullable()` 정적 팩토리 메소드를 호출하여 Order 객체를 Optional로 감싸주었습니다. 혹시 Order 객체가 null인 경우를 대비하여 `of()` 대신에 `ofNullable()`을 사용했습니다.

- 3번의 `map()` 메소드의 연쇄 호출을 통해서 Optional 객체를 3번 변환하였습니다. 매 번 다른 메소드 레퍼런스를 인자로 넘겨서 Optional에 담긴 객체의 타입을 바꿔주었습니다. (`Optional<Order>` -> `Optional<Member>` -> `Optional<Address>` -> `Optional<String>`)

- 마무리 작업으로 `orElse()` 메소드를 호출하여 이 전 과정을 통해 얻은 Optional이 비어있을 경우, 디폴트로 사용할 도시 이름을 세팅해주고 있습니다.

어떠신가요? Optional를 제대로 활용하여 처음으로 null-safe한 코드를 작성해보았습니다. 이 전에 Stream을 사용하여 이런 식으로 코딩을 해보신 적이 없으시다면 많이 낯설 수도 있습니다. Java8의 람다식과 메소드 레퍼런스를 좋아하신다면 이 코드가 마음에 드실 겁니다. :smile:


### `filter()`로 레벨업
 
Java8 이 전에 NPE 방지를 위해서 다음과 같이 null 체크로 시작하는 if 조건문 패턴을 자주 보셨을 겁니다.

```java
if (obj != null && obj.do() ...)
```

예를 들어, 주어진 시간(분) 내에 생성된 주문을 한 경우에만 해당 회원 정보를 구하는 메소드를 위 패턴으로 작성해보았습니다.

```java
public Member getMemberIfOrderWithin(Order order, int min) {
	if (order != null && order.getDate().getTime > System.currentTimeMillis() - min * 1000) {
		return order.getMember();
	}
}
```

위 코드는 if 조건문 내에 null 체크와 비지니스 로직이 혼재되어 있어서 가독성이 떨어집니다.
게다가 null을 리턴할 수 있기 때문에 메소드 호출부에 NPE 위험을 전파하고 있습니다.

반면에 `filter()` 메소드를 사용하면 if 조건문 없이 메소드 연쇄 호출만으로도 좀 더 읽기 편한 코드를 작성할 수 있습니다.
뿐만 아니라, 메소드의 리턴 타입을 Optional로 사용함으로써 호출자에게 해당 메소드가 null을 담고 있는 Optional을 반환할 수도 있다는 것을 명시적으로 알려주고 있습니다.

```java
public Optional<Member> getMemberIfOrderWithin(Order order, int min) {
	return Optional.ofNullable(order)
			.filter(o -> o.getDate().getTime > System.currentTimeMillis() - min * 1000)
			.map(Order::getMember);
}
```

`filter()` 메소드는 넘어온 함수형 인자의 리턴 값이 `false`인 경우, Optional을 비워버리므로 그 이후 메소드 호출은 의미가 없어지게 됩니다. `Stream` 클래스의 `filter()` 메소드와 동작 방식이 동일하지만, `Optional`의 경우 원소가 하나 밖에 없기 때문에 이런 효과가 나타나게 됩니다.


## Java8 이 전에 개발된 코드를 Optional하게 바꾸기

Java8 이 전에 개발된 API들은 안타깝게도 당시에 `Optional` 클래스가 없었기 때문에 null-safe하지 않습니다.
심지어 Java 표준 API 조차 하위 호환성을 보장을 위해서 기존 API에 `Optional` 클래스를 적용할 수 없었습니다.
다행이도 우리는 스스로 `Optional` 클래스를 사용하여 기존 코드가 null-safe하도록 바꿔줄 수 있습니다.


### 메소드의 반환값이 존재하지 않을 때 전통적인 처리 패턴

이전 개발된 메소드들은 반환할 갑싱 존재하지 않을 경우, 크게 2가지 패턴으로 처리하였습니다.
각 처리 패턴을 어떻게 개선할 수 있는지 예제 코드를 통해 살펴보겠습니다.


### 1. null 반환

`Map` 인터페이스의 `get()` 메소드는 주어진 인덱스에 해당하는 값이 없으면 null을 반환합니다.

```java
List<Integer, String> cities = new HashMap<>();
cities.put(1, "Seoul");
cities.put(2, "Busan");
cities.put(3, "Daejeon");
```

따라서 해당 API를 사용하는 코드를 null-safe하게 만들기 위해서 null 체크를 해줘야 합니다.

```java
String city = cities.get(4); // returns null
int length = city == null ? 0 : city.length(); // null check
System.out.println(length);
```

다음과 같이 `get()` 메소드의 반환 값을 Optional로 감싸주면, 자연스럽게 null-safe한 코드가 됩니다.

```java
Optional<String> maybeCity = Optional.ofNullable(cities.get(4)); // Optional
int length = maybeCity.map(String::length).orElse(0); // null-safe
System.out.println("length: " + length);
```

읽기 쉬운 코드를 작성하기 위해 `map()`과 `orElse()` 메소드가 어떻게 사용되고 있는지 주의깊게 보시기 바랍니다.
도시 문자열을 길이로 변환하고 디폴트 값을 설정해주는 과정을 한눈에 파악하기 편하지 않으신가요? :smile:


### 2. 예외 발생

두번째 패턴은 null을 반환하지 않고 예외를 던저버리는 경우입니다.
`List` 인터페이스의 `get()` 메소드는 주어진 인덱스에 해당하는 값이 없으면 ArrayIndexOutOfBoundsException을 던집니다.

```java
List<String> cities = Arrays.asList("Seoul", "Busan", "Daejeon");
```

따라서, 다음과 같이 try-catch 구문을 사용하여 예외 처리를 해줘야 하며, 예외 처리 후에도 null check도 해줘야 하기 때문에 코드가 지저분해집니다.

```java
String city = null;
try {
	city = cities.get(3); // throws exception
} catch (ArrayIndexOutOfBoundsException e) {
	// ignore
}
int length = city == null ? 0 : city.length(); // null check
System.out.println(length);
```

이런 경우, 다음과 같이 예외 처리부를 감싸서 정적 유틸리티 메소드로 분리해주면 좋습니다.
`Optional` 클래스의 정적 팩토리 메소드를 사용하여 정상 처리 시와 예외 처리 시에 반환할 Optional 객체를 각각 지정해주었습니다.
이 경우에는 Optional에 담을 객체가 null인지 아닌지 확실히 알 수 있기 때문에 `Optional.ofNullable()` 대신에 다른 2개의 정적 팩토리 메소드를 쓸 수 있다는 점을 주의깊게 보시기 바랍니다.

```java
public static <T> Optional<T> getAsOptional(List<T> list, int index) {
	try {
		return Optional.of(list.get(index));
	} catch (ArrayIndexOutOfBoundsException e) {
		return Optional.empty();
	}
}
```

아래와 같이 정적 유틸리티 메소드를 통해 Optional 객체를 확보 후에 null-safe하게 코딩할 수 있습니다.

```java
Optional<String> maybeCity = getAsOptional(cities, 3); // Optional
int length = maybeCity.map(String::length).orElse(0); // null-safe
System.out.println("length: " + length);
```


## `ifPresent()` 메소드

아, 이 전 포스트에서 미처 소개드리지 않은 조금 특별한 메소드가 하나 있습니다.
바로 `ifPresent()` 메소드인데요. 많은 분들이 `isPresent()`와 혼동하기도 하는 녀석입니다.

- `ifPresent(Consumer<? super T> consumer)`: 이 메소드는 특정 결과를 반환하는 대신에 Optional 객체가 감싸고 있는 값이 존재할 경우에만 실행될 로직을 함수형 인자로 넘길 수 있습니다.

함수형 인자로 람다식이나 메소드 레퍼런스가 넘어올 수 있는데요. 마치 비동기 메소드의 콜백 함수처럼 작동합니다.
바로 전 예제의 코드를 `ifPresent()` 메소드를 이용해서 재작성하면 다음과 같습니다.

```java
Optional<String> maybeCity = getAsOptional(cities, 3); // Optional
maybeCity.ifPresent(city -> {
	System.out.println("length: " + city.length());
});
```


## 마치면서

총 3부의 포스트를 통해서 Java8의 Optional에 대해서 탐구해보았습니다.
이 포스트를 통해 더 많은 자바 개발자들이 Optional을 잘 쓰셔서 null 체크의 스트레스에서 벗어나셨으면 좋겠습니다.
