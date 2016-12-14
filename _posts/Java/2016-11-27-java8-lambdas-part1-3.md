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

> 본 포스트는 오라클 공식 웹사이트에 Ted Neward가 쓴 [Java 8: Lambdas, Part 1](http://www.oracle.com/technetwork/articles/java/architect-lambdas-part1-2080972.html)를 번역하였습니다.

## 메소드 참조

지금까지 다룬 모든 람다는 사용 시점에 람다를 정의하는 익명 리터럴이였습니다.
이는 1회성 행위를 위해서는 훌륭하지만, 이 행위가 여러 곳에서 사용되어야 하는 상황에서는 별로입니다.
예를 들어 다음 *Person* 클래스를 생각해봅시다. (지금은 부적절한 캡슐화에 대해서는 무시하시죠.)

```java
class Person {
  public String firstName;
  public String lastName;
  public int age;
}; 
```

*Person* 객체를 *SortedSet*에 저정하거나 어떤 형태로든 리스트 내에서 정렬될 필요가 있을 때, *Persion* 인스턴스가 정렬되기 위한 다른 여러가지 방식을 필요로 합니다. 예를 들어, 이름으로 정렬하고 싶을 때도 있고 성으로 정렬하고 싶을 때도 있습니다.
이 목적으로 *Comparator<T>*를 사용하는데 *Comparator<T>* 인스턴스를 전달함으로써 정렬 방식을 정의할 수 있게 됩니다.

람다는 일람 15처럼 확실히 정렬 코드를 더 쉽게 작성하게 해줍니다.
그러나 *Person* 인스턴스를 이름에 의해 정렬하는 것은 코드 기반 내에서 여러 번 수행된 필요가 있을지도 모르는데,
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

*Comparator*는 확실히 *Person* 자체의 멤버가 될 수도 있습니다. (일람 16)
그 다음에 *Comparator<T>*는 다른 정적 필드 처럼 참조당할 수 있습니다. (일람 17)
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

그러나 간단하게 *Comparator<T>*의 시그니쳐에 맞는 메서드를 생성했던 전통적인 자바 개발자들은 어색하게 느낄 것입니다.
사실 이 메소드를 바로 사용하는 것이 메서드 참조가 정확하게 해주는 일입니다. (일람 18)
*Person*에 정의된 *compareFirstNames* 메서드가 사용될 것이라고 컴파일러에게 알려주는 콜론 2개가 사용된 메서드 명명 스타일을 주목하세요.

일람 18 
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

궁금해하실 분들의 위한 또 다른 방식은 아래처럼 *Comparator<Person>* 인스턴스를 생성하기 위해서 *compareFirstNames* 메서드를 사용하는 것입니다.

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


