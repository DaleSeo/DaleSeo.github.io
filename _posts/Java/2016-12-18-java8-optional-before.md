---
title: "Java8 Optional 1부: 널 체크로 NPE를 피하던 시절"
modified: 2017-12-18T16:59:26+09:00
categories: 
  - Java
tags:
  - Java8
  - FP
  - Optional
  - Stream
published: true
---

> Java8 이 전에는 어떻게 NPE를 피해왔었는지 알아봅시다.

## Null 참조의 탄생은 10억불 짜리 실수였을까?

null 참조는 1965년에 Tony Hoare라는 영국의 컴퓨터 과학자에 의해서 처음으로 고안되었습니다.
당시 그는 값의 존재 유무를 나타낼 수 있는 가장 편리한 방법이 null 참조라고 생각했다고 합니다.
하지만 그는 나중에 자신의 생각이 "10억불 짜리 실수" 였고, null 참조를 만든 것을 후회한다고 토로하였습니다.

## Null 참조의 부작용

null 참조하면 가장 먼저 떠오르는 것은 그 악명높은 NPE(NullPointerException)  문제일 것입니다.
자바 초보이든 고수이든 객체를 많이 사용하는 자바 개발자에게 NPE 문제는 피하기 어려운 지뢰같은 녀석입니다.
특히 중첩된 구조의 객체를 탐색할 때는 코드가 온통 null 처리를 위한 if 문으로 범벅이 되어 가독성을 심하게 해치게됩니다.

## Null 처리가 취약한 코드 예제

어떤 쇼핑몰에서 다음 예제와 같은 구조의 데이터 모델들이 있다고 가정해보시죠.
`Order` 클래스는 `Member` 타입의 `member` 필드를 가지며, `Member` 클래스는 다시 `Address` 타입의 `address` 필드를 가집니다.

```java
/* 주문 */
public class Order {
	private Long id;
	private Date date;
	private Member member;
	// getters & setters
}

/* 회원 */
public class Member {
	private Long id;
	private String name;
	private Address address;
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

그리고 주문으로부터 회원 주소의 도시를 알아내기 위해서 다음과 같은 메소드가 있다고 가정해봅시다.

```java
/* 주문으로부터 회원 주소의 도시를 알아낸다 */
public String getMemberCityFromOrder(Order order) {
	return order.getMember().getAddress().getCity();
}
```

위 메소드가 얼마나 NPE에 취약한 상태인지 보이시나요?
NPE가 발생할 수 있는 모든 시나리오를 정리해보겠습니다.

1. 메소드에 null 값인 `order`가 넘어옴
1. `order` 객체에 `member` 필드가 null 값임
1. `order.getMember()` 객체의 `address` 필드가 null 값임
1. `order.getMember().getAddress()` 객체의 `city` 필드가 null 값임

4번쨰 경우에는 엄밀히 얘기하면 이 메소드 자체에서는 NPE가 발생하지 않지만, 최종적으로 null 값을 반환하게 됩니다.
따라서, 이 메소드를 사용하는 부분에서 null 처리를 해주지 않으면, 해당 코드도 NPE 간접 영향권에 들어가게 되므로 포함시켰습니다.

## NPE를 피하는 전통적인 방법

Java8 이전에는 이렇게 취약한 메소드에 다음과 같은 방법으로 방어로직을 추가하여 NPE를 피했었습니다.

### 스타일 1: 중첩해서 null 체크하기

```java
public String getMemberCityFromOrder(Order order) {
	if (order != null) {
		Member member = order.getMember();
		if (member != null) {
			Address address = member.getAddress();
			if (address != null) {
				Strign city = address.getCity();
				if (city != null) {
					return city;
				}
			}
		}
	}
	return "Seoul";
}
```

아! 정말 끔찍하지만 현장에서 심심치 않게 볼 수 있는 코딩 스타일입니다.
객체 탐색의 매 단계마다 null 값이 반환되지 않을지 의심하여 null 값 여부를 체크합니다.
들여쓰기가 많기 때문에 코드를 읽기가 매우 어렵습니다.

### 스타일 2: 여러 곳에서 Return 하기

```java
public String getMemberCityFromOrder(Order order) {
	if (order == null) {
		return "Seoul";
	}
	Member member = order.getMember();
	if (member == null) {
		return "Seoul";
	}
	Address address = member.getAddress();
	if (address == null) {
		return "Seoul";
	}
	Strign city = address.getCity();
	if (city == null) {
		return "Seoul";
	}
	return city;
}
```

첫 번째 스타일의 코드를 조금 개선해보았습니다. (정확히 개선이 맞는지는 모르겠습니다만... :sweat:)
일단 코드 읽기는 조금 쉬워졌지만, 결과를 반환할 수 있는 return 문이 여러 곳에 위치하기 때문에 유지 보수하기가 난해해졌습니다.

## Null 체크의 모순과 한계

코드가 이지경에 이르면 과연 이 문제가 개발자의 무능함 때문인지 아니면 다른 근본적인 원인이 있는건지 궁금해 집니다.
우리가 원하는 건 단순히 "주문으로부터 회원 주소의 도시를 알아내기"인데, 코드는 중첩 if 문이나 여러 개의 return 문으로 오염되어,
애초에 우리가 하려던 것이 "null 체크"인지 비즈니스 로직인지 햇갈리기까지 합니다. :cry:

NPE 때문에 시스템이 다운되서 한 두번 데어보신 분이라면, 위와 같은 코드를 작성하고 있는 자신을 발견하실 것입니다.
시스템 장애를 겪는 것 보다는 코드 가독성과 유지 보수성을 희생하는 게 현실적인 선택이기 때문입니다.
그리고 결정적으로 NPE를 피하기 위해서 위와 같은 방법 외에는 마땅한 대안이 있는 것도 아니었습니다.

자바 언어는 (많은 다른 언어들처럼) 값의 유무를 나타내기 위해 null 참조를 사용하도록 설계되었습니다.
Java8에서는 Optional<T> API를 도입하여 null 참조를 대하는 새로운 접근 방식을 제시하게 됩니다.

이 부분에 대해서는 다음 포스트에서 알아보도록 하겠습니다.