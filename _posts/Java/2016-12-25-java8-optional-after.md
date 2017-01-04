---
title: "Java8 Optional: Optional API로 스마트하게 null 처리하기"
modified: 2017-12-25T16:21:30+09:00
categories: 
  - Java
tags:
  - Java8
  - FP
  - Optional
  - Stream
published: false
---

> Java8 이 후에는 얼마나 스마트하게 null 처리를 할 수 있는지 알아봅시다.

이 전 [포스트](/java/2016-12-18-before)에서는 Java8 이 전에 얼마나 null 처리가 고통스러웠는지 알아보았습니다.
또한 그 근본적인 원인이 null 참조를 통해 값의 존재 여부를 표현하는 자바 언어의 설계적인 측면에 있다라는 것도 말미에 언급하였습니다.

## Null 문제 요약

이 전 포스트의 예제 코드를 통해 살펴본 Null과 관련된 문제들을 크게 2가지로 요약됩니다.

- NPE(NullPointerException)을 발생시키는 원인이 됩니다.
- NPE 방지를 위해서 들어간 null 체크 로직 때문에 코드 가독성과 유지 보수성이 떨어집니다.

그냥 두자니 예외를 일으키고, 적극적으로 조치를 하자니 코드를 더럽히는 null 문제 도대체 어떻게 해결할 수 있을까요?

## 함수형 언어에서 해법을 찾다

스칼라나 히스켈과 같은 소위 함수형 언어들은 전혀 다른 방법으로 이 문제에 접근합니다.
자바가 값의 존재 여부를 표현하기 위해서 널 참조를 사용했다면, 이 언어들은 "널이 될 가능성이 있는 값"을 표현할 수 있는 별개의 타입을 사용합니다.
그리고 이 타입은 값 존재 여부를 알려주는 API를 제공하기 때문에, 개발자는 명시적으로 널 체크를 할 수 밖에 없게 됩니다.
Java8은 이런한 함수형 언어의 접근법에서 영감을 받아 `java.util.Optional<T>`라는 새로운 클래스를 도입하였습니다.! :tada:

## Optional<T> 개념

`Optional<T>`는 널이 될 수도 있는 (물론, 안 될 수도 있는) 값을 감싸고 있는 일종의 래퍼 클래스라고 생각하시면 이해가 쉬우실 것 같습니다.
컬레션 API처럼 제네릭을 지원하기 때문에 모든 타입의 객체를 저장할 수 있으며, 널 값 대신에 싱글턴 인스턴스를 제공하여 값의 부재를 나타낼 수 있습니다.

```java
// 회원 객체를 저장하고 있는 Optional 타입의 변수
Optional<T> maybeMember = Optional.of(new Member());
// 아무 것도 저장하고 있는 않은 Optional 타입의 변수
Optional<T> maybeNotMember = Optional.empty();
```

위 코드와 같이 Optional 클래스가 제공하는 정적 팩토리 메소드를 통해서 값이 있는 Optional 객체와 값이 없는 Optional 객체를 만들 수 있습니다.


## 기존 데이터 모델 리펙토링

Optional 클래스를 활용하여 `Order` 클래스의 `member` 필드와 `Member` 클래스의 `address` 필드를 각각 Optional<Member>와 Optional<Address>로 변경하였습니다.
변경 후에 null 처리가 어떻게 개선되는지 기대하셔도 좋습니다.

```java
/* 주문 */
public class Order {
	private Long id;
	private Date date;
	private Optional<Member> member; // Optional
	// getters & setters
}

/* 회원 */
public class Member {
	private Long id;
	private String name;
	private Optional<Address> address; // Optional
	// getters & setters
}

/* 주소 */
public class Address {
	private String street;
	private String city;
	private String zipcode;
	// getters & setters
}
```

Optional 타입 필드는 비지니스 상으로도 명시적으로 해당 항목이 값이 없을 수도 있음을 나타내는도 용도로 쓰일 수 있습니다.
예를 들어, `Member` 클래스의 경우에는 `id`와 `name` 필드는 Optional 타입이 아니기 때문에 필수 입력 항목입니다.
하지만 `address` 필드는 Optional 타입이기 때문에 값이 있을 수도 있고 없을 수도 있는 선택 입력 항목입니다.

또한 필드 타입만 보더라도 값이 존재하지 않을 가능성이 있는지 명시적으로 알 수 있기 때문에,
예전처럼 모든 필드를 의심하면선, 무조건 null 체크로 도배해버리는 삽질(?)도 하지 않을 수 있습니다.

## Optional 클래스 사용 방법

Optional 클래스를 어떻게 사용하는지 좀 더 구체적으로 알아 봅시다.

### Optional 객체 생성하기

Optional 클래스는 편리하게 객체 생성을 할 수 있도록 3가지 정적 팩토리 메소드를 제공합니다.

- `Optional.empty()`: 값이 존재 하지 않는. 즉, 비어있는 값을 감싸는 Optional 객체를 생성합니다. 이 객체는 싱글톤 객체입니다.

```java
Optional<Member> maybeMember = Optional.empty();
```

- `Optional.of(value)`: 존재하는 값을 감싸는 Optional 객체를 생성합니다.

```java
Optional<Member> maybeMember = Optional.of(newMember);
```

- `Optional.ofNullable(value)`: 존재할지 말지 확신하 수 없는 값을 감싸는 Optional 객체를 생성합니다.

```java
Optional<Member> maybeMember = Optional.of(newMember);
```

`Optional.of(value)`의 경우 null 값이 들어올 경우, NullPointerException을 발생시키기 때문에 주의해서 사용해야 합니다.
null 값이 일지 아닐지 확실치 않은 경우에는 더 유연한 `Optional.ofNullable(value)`를 사용하면 됩니다.
`Optional.ofNullable(value)`는 null 값이 넘어왔을 경우, NPE를 발생시키는 대신에 `Optional.empty()`를 반환하기 때문입니다.

### Optional 객체가 감싸고 있는 값을 추출하기

Optional 클래스는 값을 추출하기 위한 다양한 인스턴스 메소드를 제공합니다.
아래 메소드 모두 Optional 객체가 감싸고 있는 값이 존재할 경우 동일하게 해당 값을 반환합니다.
하지만 Optional 객체가 감싸고 있는 값이 존재하지 않을 경우(즉, 널인 경우)에는 다르게 작동합니다.

- `get()`: 널을 감싸고 있으면 NoSuchElementException을 던지기 때문에 값이 반드시 있다고 확신되는 경우외에는 사용이 권장되지 않습니다. 

- `orElse(T other)`: 널을 감싸고 있으면 주어진 인자를 반환합니다.

- `orElseGet(Supplier<? extends T> other)`: 널을 감싸고 있으면 주어진 함수형 인자를 통해 생성된 객체를 반환합니다. `orElse(T other)`의 게으른 버전이라고 보시면 됩니다. 값이 있는 경우에는 수행되지 함수형 인자가 수행되지 않기 때문에 적절히 사용하면 성능 형상을 기대할 수 있습니다.

- `orElseThrow(Supplier<? extends X> exceptionSupplier)`: 널을 감싸고 있으면 주어진 함수형 인자를 생성된 예외를 던집니다.

- `ifPresent(Consumer<? super T> consumer)`: 이 메소드는 특정 결과를 반환하는 대신에 Optional 객체가 감싸고 있는 값이 존재할 경우에만 실행될 로직을 함수형 인자로 넘길 수 있습니다.

### Optional 객체를 Optional답게 다루기

`Optional` 객체를 제대로 다루려면, `Optional` 객체를 최대 1개의 원소를 가지고 있는 특별한 `Stream`이라고 생각하셔야 합니다.
`Stream` 클래스 간에 직접적인 구현이나 상속관계는 없지만, `Stream` 클래스가 가자고 있는 `map()`이나 `filter()`와 같은 메소드를 Optional 클래스도 가지고 있고, 사용 방법이나 기본 사상이 매우 유사하기 때문입니다.

`Stream` 클래스는 원소를 변환하여 제공하기 위해서 `map()`과 `flatMap()` 메소드를 제공합니다.
`flatMap()` 메소드는 변환 결과가 일반 클래스 타입이 아닌 `Optional` 타입일 경우 사용합니다.
변환 결과가 `Optional` 타입을 경우에 `map()`을 사용했을 경우, `Optional<Optional<T>>`처럼 중첩된 `Optional` 타입이 타입이 얻어지기 때문입니다.

그럼 `Stream` API를 다루듯이 `Optional` API를 사용하여 이 전 포스트의 코드를 리펙토링 해봅시다.

```java
/* 주문으로부터 회원 주소의 도시를 알아낸다 */
public String getMemberCityFromOrder(Optional<Order> order) {
	return order.flatMap(Order::getMember)
							.flatMap(Member::getAddress)
							.map(Address::getCity)
							.orElse("Seoul");
}
```

```java
/* 주문으로부터 회원 주소의 도시를 알아낸다 */
public String getMemberCityFromOrder(Order order) {
	return Optional.ofNullable(order)
						.map(Order::getMember)
						.map(Member::getAddress)
						.map(Address::getCity)
						.orElse("Seoul");
}
```

이 전 포스트의 2가지 방법에 비해 훨씬 간결하고 명확해진 코드를 볼 수 있습니다.
메소드 체이닝을 이용하여 기존에 존재하던 조건문들을 모두 제거되었음을 볼 수 있습니다.
메소드 체이닝 과정에서 어떤 메소드가 비어있는 Optional 객체를 반환하였을 경우, 그 이후로는 계속해서 비어있는 Optional 객체만 전달되게 되기 때문에, NPE 걱정없이 메소드를 체이닝할 수 있습니다.
마지막으로 `orElse(other)` 메소드를 통해 비어있는 Optional 객체가 얻어졌을 경우, 디폴트로 반환할 city 값을 세팅해주고 있습니다.

메소드의 파라미터가 Optional 타입으로 변경되었기 때문에, 메소드 시그니쳐만 보고도 이 메소드에는 널이 들어있는 Optional이 넘어 올 수 있음을 명시적으로 알 수 있습니다.

위 코드에서 객체의 변환 과정을 보면 다음과 같습니다.

```
Optional<Order> => Optional<Member> => Optional<Address> => Optional<String> => city 값 또는 "Seoul" 
```

### `filter()` 메소드를 활용하여 좀 더 세련되게 널 처리하기

NPE 방지를 위해서 다음과 같이 널 체크로 시작하는 if 조건문 패턴을 자주 볼 수 있습니다.

```java
if (obj != null && obj.do() ...)
```

예를 들어, 주어진 분 단위 시간 내에 생성된 주문일 경우에만 회원 정보를 구하는 메소드를 작성하는 경우, 위의 패턴을 이용하면 다음과 같이 작성할 수 있습니다.

```java
public Member getMemberIfOrderWithin(Order order, int min) {
	if (order != null && order.getDate().getTime > System.currentTimeMillis() - min * 1000) {
		return order.getMember();
	}
}
```

위 코드는 if 조건문 때문에 가독성이 떨이질 뿐만 아니라 널 값을 반환할 수 있기 때문에 메소드 호출부에 NPE 위험을 전가하고 있습니다.

반면에 `filter()` 메소드를 사용하면 if 조건문 없이 메소드 채이닝 만으로도 좀 더 명확하고 null-safe한 코드를 작성할 수 있습니다.

```java
public Optional<Member> getMemberIfOrderWithin(Order order, int min) {
	return Optional.ofNullable(order)
						.filter(o -> o.getDate().getTime > System.currentTimeMillis() - min * 1000)
						.map(Order::getMember);
}
```



## 주의 사항

아무리 좋은 기술도 오납용 하면 오히려 부작용이 생길 수 있습니다.
값이 존재하지 않을 가능성이 없는 필드들에 대해서도 무분별하게 Optional 타입을 사용하게되면,
객체 탐색이 복잡해지기만 하고 Optional의 효용을 누릴 수 없기 때문입니다.

`Optional` 클래스에는 값 존재 여부를 bool 타입으로 반환하는 `isPresent()` 메서드와 오직 값만을 반환하는(값이 존재하지 않음녀 예외 발생) `get()` 이라는 메소드가 있는데요.
이 메소드를 사용할 경우 이 전 포스트에서 작성한 코드와 별반 다르지 않은 수준의 코드를 작성하고 되고 이는 `Optional` 클래스의 설계 의도에 맞지 않으므로 주의합시다.

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


