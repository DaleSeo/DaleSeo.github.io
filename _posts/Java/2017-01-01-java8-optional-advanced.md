---
title: "Java8 Optional: Optional을 Optional답게 사용하기"
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

이 전의 두 편의 관련 포스트를 통해서 null-safe한 코드를 보기 좋게 작성할 수 있도록 도와주는 `Optional` 클래스에 대해서 알아보았습니다.
또한 Optional을 Optional답지 않게 사용할 경우, 어떤 부작용이 발생하는지도 살펴보았는데요.
이 번 포스트에서는 어떻게 코드를 작성하면 Optional을 Optional답게 쓸 수 있는지 알아보도록 하겠습니다.

## Java8 이 전에 개발된 API들을 Optional하게 바꾸기

Java8 이 전에 개발된 API들은 안타깝게도 당시에 `Optional` 클래스가 없었기 때문에 null-safe하지 않습니다.
심지어 Java 표준 API 조차 하위 호환성을 보장을 위해서 기존 API에 `Optional` 클래스를 적용할 수 없었습니다.
그렇게 때문에 우리는 `Optional` 클래스를 사용하여 스스로 우리의 코드가 null-safe하도록 바꿔줄 필요가 있습니다.

### 기존 메소드들의 존재하지 않는 반환값 처리 패턴

이전 개발된 메소드들은 존재하지 않는 반환값 처리 패턴은 크게 2가지로 나눠볼 수 있습니다.
첫 번째는 널 반환이며 두 번째는 예외 발생인데요.
각 처리 패턴을 어떻게 개선할 수 있는지 예제 코드를 통해 살펴보겠습니다.

### 1. 널 반환

`Map` 인터페이스의 `get()` 메소드는 주어진 인덱스에 해당하는 값이 없으면 널을 반환합니다.

```java
List<Integer, String> cities = new HashMap<>();
cities.put(1, "Seoul");
cities.put(2, "Busan");
cities.put(3, "Daejeon");
```

따라서 해당 API를 사용하는 코드를 null-safe하게 만들기 위해서 널 체크를 해줘야 합니다.

```java
String city = cities.get(4); // returns null
int length = city == null ? 0 : city.length(); // null check
System.out.println(length);
```

다음과 같이 `get()` 메소드의 반환 값을 `Optional` 클래스의 `ofNullable()` 메소드로 감싸주면, null-safe한 코드가 됩니다.

```java
Optional<String> maybeCity = Optional.ofNullable(cities.get(4)); // Optional
int length = maybeCity.map(String::length).orElse(0); // null-safe
System.out.println("length: " + length);
```

읽기 쉬운 코드를 작성하기 위해 `map()`과 `orElse()` 메소드가 어떻게 사용되었는지 주의깊게 보세요.
도시 문자열을 길이로 변환하고 디폴트 값을 설정해주는 과정을 한눈에 파악하기 편하지 않으? :smile:

### 2. 예외 발생

두번째 패턴은 널을 반환하지 않고 예외를 던저버리는 경우입니다.
`List` 인터페이스의 `get()` 메소드는 주어진 인덱스에 해당하는 값이 없으면 ArrayIndexOutOfBoundsException을 던집니다.

```java
List<String> cities = Arrays.asList("Seoul", "Busan", "Daejeon");
```

따라서, 다음과 같이 try-catch 구문을 사용하여 예외 처리를 해줘야 하며, 예외 처리 후에도 null check도 해줘야 하기 때문에 코드가 지저분해보입니다.

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
`Optional` 클래스의 정적 팩토리 메소드를 사용하여 정상 처리 시와 예외 처리 시에 반환할 Optional 객체를 지정해주었습니다.

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









