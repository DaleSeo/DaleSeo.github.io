---
title: "자바8 Optional 1부: Java8 이 전의 null 처리"
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

> Java8이 나오기 이 전에는 어떻게 null 처리를 했었는지 알아봅시다.


## null 창시자가 스스로 인정한 null 탄생의 실수

우선 null이라는 개념은 언제 누구에 의해 만들어졌을까요?
null 참조는 1965년에 Tony Hoare라는 영국의 컴퓨터 과학자에 의해서 처음으로 고안되었습니다.
당시 그는 "존재하지 않는 값"을 표현할 수 있는 가장 편리한 방법이 null 참조라고 생각했다고 합니다.
하지만 나중에 그는 그 당시 자신의 생각이 "10억불 짜리 큰 실수"였고, null 참조를 만든 것을 후회한다고 토로하였습니다.


## NPE(NullPointerException)

null 참조로 인해 자바 개발자들이 가장 골치아프게 겪는 문제는 그 악명높은 널 포인터 예외(소위, NPE)일 것입니다.
자바 초보이든 고수이든 객체를 사용하여 모든 것을 표현하는 자바 개발자에게 NPE는 코드 베이스 곳곳에 깔려있는 지뢰같은 녀석입니다.
컴파일 타임에서는 조용히 잠복해있다가 런타임 때 펑펑 터지는 NPE의 스택 트레이스에 자바 개발자들은 속수무책으로 당할 수 밖에 없었습니다. :fearful:

```bash
java.lang.NullPointerException
	at seo.dale.java.practice(OptionalTest.java:26)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:497)
```

## null 처리가 취약한 코드

null 처리가 취약한 코드에서는 NPE 발생 확률이 높습니다.
예를 들어 어떤 쇼핑몰에서 다음과 같은 구조의 데이터 모델들이 있다고 가정해보시죠.

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

`Order` 클래스는 `Member` 타입의 `member` 필드를 가지며, `Member` 클래스는 다시 `Address` 타입의 `address` 필드를 가집니다.

그리고 "어떤 주문을 한 회원이 어느 도시에 살고 있는지 알아내기"위해서 다음과 같은 메소드가 있다고 가정해봅시다.

```java
/* 주문을 한 회원이 살고 있는 도시를 반환한다 */
public String getCityOfMemberFromOrder(Order order) {
	return order.getMember().getAddress().getCity();
}
```

위 메소드가 얼마나 NPE 위험에 노출된 상태이신지 보이시나요?
(안 보이신다면 평소에 null 처리를 열심히 하시지 않으시는 분으로... :disappointed:)


## NPE 발생 시나리오

위 메소드에서 구체적으로 어떤 상황에서 NPE가 발생할까요?
여러 단계로 이뤄진 객체 탐색의 과정을 짚어보면 다음과 같이 NPE 위험 포인트를 도출할 수 있습니다.

1. `order` 파라미터에 null 값이 넘어옴
2. `order.getMember()`의 결과가 null 임
3. `order.getMember().getAddress()`의 결과가 null 임
4. `order.getMember().getAddress().getCity()`의 결과가 null 임

4번쨰 경우에는 엄밀히 얘기하면 이 메소드 내부에서 NPE가 발생하지 케이스는 아닙니다.
하지만 null을 리턴함으로써 호출부에 NPE 위험을 전파시키는 케이스이므로 포함시켰습니다.

호출부에서 적절히 null 처리를 해주지 않으면, 다음 코드와 같이 호출부에서 NPE를 발생시킬 수 있습니다.

```java
String city = getCityOfMemberFromOrder(order); // returns null
System.out.println(city.length()); // throws NPE!
```


## 전통적인(?) NPE 방어 패턴

Java8 이전에는 이렇게 NPE의 위험에 노출된 코드를 다음과 같은 코딩 스타일로 회피하였습니다.

1. 중첩 null 체크하기

```java
public String getCityOfMemberFromOrder(Order order) {
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
	return "Seoul"; // default
}
```

아! :scream: 정말 끔찍하지만 현장에서 심심치 않게 볼 수 있는 코드입니다.
객체 탐색의 모든 단계마다 null이 반환되지 않을지 의심하면서 null 체크를 합니다.
들여쓰기 때문에 코드를 읽기가 매우 어려우며 핵심 비즈니스 파악이 쉽지 않습니다.

2. 사방에서 return 하기

```java
public String getCityOfMemberFromOrder(Order order) {
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

첫 번째 코드를 조금 개선해보았습니다. (개인 취향 따라 악화라고 생각하시는 분도 계실 것 같습니다만... :sweat:)
전반적으로 코드 읽기가 조금 쉬워지긴 했지만, 결과를 여러 곳에 리턴하기 때문에 유지 보수하기가 남해해졌습니다.

2가지 방법 모두 기본적으로 객체의 필드나 메소드에 접근하기 전에 null 체크를 함으로써 NPE를 방지하고 있습니다.
하지만 안타깝게도 이로 인해 초기 버전의 메소드보다 코드가 상당히 길어지고 지저분해졌음을 볼 수 있습니다.

이 밖에도 null object 패턴 등 NPE 문제를 해결하기 위한 다양한 시도들이 있었지만 그닥 만족스러운 대안을 찾을 수 없었습니다.


## null의 저주

코드가 이 지경에 이르면 과연 문제의 원인이 개발자의 무능함 때문인지 다른 곳에서 근본 원인을 찾아야 하는지 혼란스러워집니다.
애초에 `getCityOfMemberFromOrder()` 메소드에 대한 우리의 요구 사항은 상당히 명확하고 간단했습니다.

"어떤 주문을 한 회원이 어느 도시에 살고 있는지 알려주시오!"

하지만 우리의 코드는 중첩된 if 조건문과 사방에 return 문으로 도배되고 말았습니다.
유지 보수 기간이 길어질수록 비즈니스 로직은 점점 null 체크에 가려지곤 했습니다.
이쯤되면 애초에 우리가 하려던 것이 null 체크인지 비즈니스 로직인지 햇갈리기까지 합니다. :sob:

NPE 때문에 시스템이 다운되서 한 두번 데어보신 분이라면, 위와 같은 코드를 작성하고 있는 자신을 발견하실 것입니다.
장애를 겪을 바엔 코드 가독성과 유지 보수성을 희생하는 게 현실적인 선택이기 때문입니다.

자바 언어는 (대부분의 다른 언어들처럼) "값의 부재"를 나타내기 위해 null을 사용하도록 설계되었습니다.
하지만 null 창시자가 의도 했던 바와 다르게 null은 자바 개발자들에게 NPE 방어라는 끝나지 않는 숙제를 남겼습니다.


## 구세주 Java8

Java8에서는 null을 대하는 완전히 새로운 페러다임을 제시합니다.
이 부분에 대해서는 다음 포스트에서 알아보도록 하겠습니다.
