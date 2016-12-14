---
title: "[번역] 자바8 람다 1부 - 메소드 참조, 가상 확장 메소드, 결론"
modified: 2016-11-27T19:11:24+09:00
source: http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html
categories: 
  - Java
tags:
  - Java8
  - Lambda
  - FP
  - 번역
---

> 본 포스트는 오라클 공식 웹사이트에 Ted Neward가 기고한 [Java 8: Lambdas, Part 1](http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html)를 번역하였습니다.

## 메소드 참조 (Method Reference)

지금까지 다룬 모든 람다는 사용 시점에 람다를 정의하는 익명 리터럴이였습니다.
이는 1회성 행위를 위해서는 훌륭하지만, 이 행위가 여러 곳에서 사용되어야 하는 상황에서는 별로입니다.
예를 들어 다음 `Person` 클래스를 생각해봅시다. (지금은 부적절한 캡슐화에 대해서는 무시하시죠.)

```java
class Person {
  public String firstName;
  public String lastName;
  public int age;
}; 
```

`Person` 객체를 `SortedSet`에 저정하거나 어떤 형태로든 리스트 내에서 정렬될 필요가 있을 때, `Persion` 인스턴스가 정렬되기 위한 다른 여러가지 방식을 필요로 합니다. 예를 들어, 이름으로 정렬하고 싶을 때도 있고 성으로 정렬하고 싶을 때도 있습니다.
이 목적으로 `Comparator<T>`를 사용하는데 `Comparator<T>` 인스턴스를 전달함으로써 정렬 방식을 정의할 수 있게 됩니다.

람다는 일람 15처럼 확실히 정렬 코드를 더 쉽게 작성하게 해줍니다.
그러나 `Person` 인스턴스를 이름에 의해 정렬하는 것은 코드 기반 내에서 여러 번 수행된 필요가 있을지도 모르는데,
어러한 종류의 알고리즘을 여러 번 작성하는 것은 분명히 DRY(Don't Repeat Yourself) 법칙에 위배됩니다.

### 일람 15 
```java
public static void main(String... args) {
  Person[] people = new Person[] {
    new Person("Ted", "Neward", 41),
    new Person("Charlotte", "Neward", 41),
    new Person("Michael", "Neward", 19),
    new Person("Matthew", "Neward", 13)
  };
  // Sort by first name
  Arrays.sort(people, (lhs, rhs) -> lhs.firstName.compareTo(rhs.firstName));
  for (Person p : people)
    System.out.println(p);
}
```

`Comparator`는 확실히 `Person` 자체의 멤버가 될 수도 있습니다. (일람 16)
그 다음에 `Comparator<T>`는 다른 정적 필드 처럼 참조당할 수 있습니다. (일람 17)
솔직히 말하면 함수형 프로그래밍의 지지자들은 함수가 여러가지 방식으로 조합될 수 있는 이런 스타일을 선호합니다.

### 일람 16 
```java
class Person {
  public String firstName;
  public String lastName;
  public int age;

  public final static Comparator<Person> compareFirstName =
    (lhs, rhs) -> lhs.firstName.compareTo(rhs.firstName);

  public final static Comparator<Person> compareLastName =
    (lhs, rhs) -> lhs.lastName.compareTo(rhs.lastName);

  public Person(String f, String l, int a) {
    firstName = f; lastName = l; age = a;
  }

  public String toString() {
    return "[Person: firstName:" + firstName + " " +
      "lastName:" + lastName + " " + "age:" + age + "]";
  }
}
```

### 일람 17 
```java
public static void main(String... args) {
  Person[] people = . . .;

  // Sort by first name
  Arrays.sort(people, Person.compareFirstName);
  for (Person p : people)
    System.out.println(p);
}
```

그러나 간단하게 `Comparator<T>`의 시그니쳐에 맞는 메서드를 생성했던 전통적인 자바 개발자들은 어색하게 느낄 것입니다.
사실 이 메소드를 바로 사용하는 것이 메서드 참조가 정확하게 해주는 일입니다. (일람 18)
`Person`에 정의된 `compareFirstNames` 메서드가 사용될 것이라고 컴파일러에게 알려주는 콜론 2개가 사용된 메서드 명명 스타일을 주목하세요.

### 일람 18 
```java
class Person {
  public String firstName;
  public String lastName;
  public int age;

  public static int compareFirstNames(Person lhs, Person rhs) {
    return lhs.firstName.compareTo(rhs.firstName);
  }

  // ...
}

public static void main(String... args) {
  Person[] people = . . .;
  // Sort by first name
  Arrays.sort(people, Person::compareFirstNames);
  for (Person p : people)
    System.out.println(p);
} 
```

궁금해하실 분들의 위한 또 다른 방식은 아래처럼 `Comparator<Person>` 인스턴스를 생성하기 위해서 `compareFirstNames` 메서드를 사용하는 것입니다.

```java
Comparator cf = Person::compareFirstNames; 
```

또한 더 견갈하게 위해서는 아래와 같이 새로운 라이브러리의 기능을 사용해여 구문 오버헤드를 완전히 회피할 수 있습니다.
고차 함수 (함수의 인자로 전달되는 또 다른 함수)를 이용하여 기존 코드를 탈비하고 한 줄짜리 코드로 대체할 수 있게됩니다.

```java
Arrays.sort(people, comparing(
  Person::getFirstName));
```

이 예제는 왜 람다와 람다와 함께 사용되는 함수형 프로그랭이 이토록 강력한지를 설명해줍니다.


## 가상 확장 메소드 (Virtual Extention Mehtod)

하지만 인터페이스에 대해서 자주 지적되는 한가지 단점은 그 구현이 뻔하더라도 기본 구현을 할 수 없다는 점입니다.
예를 들어 비교 연산자(>, <, >=, ...)를 흉내내는 일련의 메소드를 가지는 가상의 `Relational` 인터페이스를 생각해봅시다.
이 메소드 중에서 어떤 하나라도 정의가 되기만 한다면, 첫 번째 메소드와 관련하여 다른 메소드들이 어떻게 정의될지 쉽게 파악할 수 있습니다.
실제로 모든 메소드들은 `Comparable<T>`의 `compare` 메소드를 참조하여 정의될 수 있습니다.
하지만 인터페이스는 기본 행위를 가질 수 없고, 추상 클래스는 여전히 클래스이며 서브 클래스의 유일한 상속 기회를 차지해 버립니니다.

하지만 자바8에서는 이러한 함수 리터럴이 더 굉범위하게 사용되어지기 때문에, 인터페이스 다움을 잃지 않고 기본 행위를 기술하는 것이 더 중요하게 되었습니다.
따라서 자바8은 이제 가상 확장 메소드를 도입합니다. (이전 초안에서는 defender 메소드라고 불렀습니다.)
기상 확장 메소드는 구현 클래스에서 메소드 구현이 기술되지 않는 경우 인터페이스가 기본 동작을 기술할 수 있도록 합니다.

잠시만 `Iterator` 인터페이스를 볼까요?
현재 이 인터페이스는 `hasNext`, `next`, `remove` 이렇게 3개의 메소드를 가지며, 각 메소드는 정의가 필요합니다.
그러나 일부 스트림 반복에서는 다음 객체를 건너뛰는 능력이 도움이 될지도 모릅니다.
`Iterator` 구현은 다른 3개의 메소드을 참조해서 쉽게 정의될 수 있기 때문에, 일람 19처럼 `skip` 메소드를 기본 구현할 수 있습니다.

### 알람 19  
```java
interface Iterator<T> {
	boolean hasNext();
	T next();
	void remove();

	void skip(int i) default {
  	for (; i > 0 && hasNext(); i--) next();
	}
} 
```

자바 커뮤니티 내에 몇몇 분들은 이 메커니즘이 인터페이스의 선언적인 능력을 약화시키고 자바에서 다중 상속을 허용하는 구조를 양산할 거라고 주장하실 것입니다. 
특히 이 경우(하나의 클래스가 서로 다른 기본 구현을 가진 동일한 메소드를 가진 여러 개의 인터페이스를 동시에 구현할 때)에 대해서는 기본 구현의 우선순위와 관련된 규칙들에 대해서 앞으로 차근 차근 연구가 필요할 것입니다.

하지만 가상 확장 메소드는 이름 그대로 기존 상속 구조를 파괴하지 않고 기존의 인터페이스를 확장하기 위한 강력한 수단입니다.
이 메커니즘을 활용해서 오라클은 다른 개발자들이 기존 클래스를 변경하지 않게 하면서 기존 라이브러리에 강력한 행위들을 추가시킬 수 있습니다.
개발자들이 기존 컬렉션에 새로운 기능을 사용하기 위해서 다운 캐스팅해야하는 `SkippingIterator` 클래스는 존재하지 않습니다.
사실상, 어떤 코드도 바뀔필요가 없고 모든 `Iterator<T>`에는 언제 작성되었든지 자동으로 건더뛰기 동작이 추가됩니다.

It is through virtual extension methods that the vast majority of the changes that are happening in the Collection classes are coming. The good news is that your Collection classes are getting new behavior, and the even better news is that your code won’t have to change an iota in the meantime. The bad news is that we have to defer that discussion to the next article in this series.

`Collection` 관련 클래스에서 나타날 대부분의 변화들이 가상 확장 메소드를 통해서 이루어질 것입니다.
좋은 소식은 당신의 `Collection` 관련 클래스들도 새로운 동작이 추가될 것이고, 더 좋은 소식은 이를 위해 당신의 코드는 전혀 바뀔 필요가 없다는 것이지요.
나쁜 소식은 우리는 그 논의를 연재되고 있는 다음 기사까지 기다려야 한다는 것입니다.

## 결론

람다는 자바 코드의 작성과 설계 방식에 커다란 변화를 가져올 것입니다.
함수형 언어에 영감을 받은 일부 변화들은 자바 개발자들이 코드 작성에 대해서 생각하는 방식조차 바꿀 것이며 이것은 기회이자 번거로움일 것입니다.

연재되고 있는 다음 기사에서 이러한 변화들이 자바 라이브러리에 가져올 충격에 대해서 얘기해볼 것입니다.
그리고 어떻게 이 새로운 API와 인터페이스 그리고 클래스들이 기존에는 내부 클래스의 어색한 문법 때문에 실용적이지 않았던 새로운 설계 접근 방식을 만들어낼지 얘기하는데 시간을 할애하겠습니다.

자바8은 매우 흥미로운 릴리스가 될 것입니다. 자 각오를 다지고 새로운 세계로 날아 오릅시다.

> **저자 소개 :**
> Ted Neward([@tedneward](https://twitter.com/tedneward))는 Neudesic 사의 설계 컨설턴트입니다.
> 그는 몇몇 전문가 그룹에서 활동했으며 *Effective Enterprise Java (Addison-Wesley Professional, 2004)* and *Professional F# 2.0 (Wrox, 2010)*를 포함한 다수의 저서를 가지고 있습니다.
> 자바와 스칼라를 비롯한 다른 기술에 대한 수 많은 기사를 썼으며 컨퍼런스에서 강연도 많이 하였습니다.