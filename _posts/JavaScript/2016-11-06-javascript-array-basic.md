---
title:  "자바스크립트 배열 기본 사용법"
categories: JavaScript
tags:
  - JavaScript
  - js
  - array
  - 자바스크립트
  - 배열
---

## 배열을 사용하는 이유?
3개의 과일 이름을 변수에 저장하려면 다음과 같이 3개의 변수를 사용할 것이다.

```js
var fruit1 = "Apple";
var fruit2 = "Lemon";
var fruit3 = "Coconut";
```

하지만 만약에 저장한 과일 이름이 300개라면? 위와 같이 일일이 하나 하나의 변수에 저장하기 힘들 것이다.
배열을 이용하면 하나의 변수에 여러 가지 값을 저장할 수 있고, 색인(Index)을 통해 이 값에 접근할 수 있다.

## 새로운 배열 생성 하기
기본적으로 대괄호 기호인 배열 리터럴(literal)을 이용해서 배열을 생성한다.
배열 리터럴 내에서는 공백이나 줄바꿈은 중요하지 않으므로 각 엘리먼트의 길이기 길 경우 가독성을 위해 여러 줄로 배열을 생성하기도 한다.

```js
// 새로운 배열 생성하기 1
var fruits = ["Apple", "Banana", "Coconut"];
// 새로운 배열 생성하기 2
var fruits = {
  "Apple",
  "Banana",
  "Coconut"
}
```

마지막 원소 뒤에는 쉼표를 찍지 않도록 주의한다.
직접 Array() 생성자를 통해서 배열을 생성하는 방법도 있는데 권장되지 않는다.

## 배열의 길이 알아내기

length 프로퍼티를 이용해서 배열의 길이를 알아낸다.

```js
// 배열의 길이 알아내기
console.log(fruits.length);
```

## 배열의 원소에 개별 접근하기

인덱스(index)라고 부르는 색인 번호를 통해서 배열 내 원소에 접근할 수 있다.
인덱스는 1이 아닌 0부터 시작하며, 마지막 인덱스는 배열의 크기보다 1 작다.
해당 인덱스에 값이 비어있을 경우, undefined가 반환된다.

```js
// 배열의 원소에 개별 접근하기
var fruit1 = fruits[0];
var fruit2 = fruits[1];
var fruit3 = fruits[2];
var fruit3 = fruits[3]; // undefined
```

## 배열의 원소를 변경하기

인덱스를 통해서 배열 내 원소에 저장된 값을 변경할 수 있다.

```js
fruits[1] = "Lemon" // ["Apple", "Lemon", "Coconut"]
```

## 배열에 새로운 원소를 추가하기

push 메서드를 이용해서 새로운 원소를 추가할 수 있다.
length 프로퍼티를 이용해서 추가할 수도 있지만 권장되지 않는다.

```js
// 배열에 새로운 원소 추가하기 1
fruits.push("Orange"); // ["Apple", "Banana", "Coconut", "Orange"]
fruits.push("Strawberry"); // ["Apple", "Banana", "Coconut", "Orange", "Strawberry"]

// 배열에 새로운 원소 추가하기 2
fruits[fruits.length] = "Melon" // ["Apple", "Banana", "Coconut", "Orange", "Strawberry", "Melon"]
```

## 배열의 원소가 될 수 있는 것들

배열의 원소는 문자열 뿐만 아니라 숫자, 불리언(true/false)을 사용할 수 있으며, 함수나 객체, 그리고 또 다른 배열이 될 수도 있다.
또한 하나의 배열에 다른 종류의 데이터를 섞어서 저장할 수도 있다.

```js
var objects = [];
// number
objects[0] = 1000
// boolean
objects[1] = true
// string
objects[2] = "test"
// function
objects[3] = function() {
  console.log('test');
}
// object
objects[4] = {
  name: "iPad",
  price: 800,
}
// array
objects[5] = ["Apple", "Lemon", "Coconut"]
```

지금까지 배열의 기본 사용법에 대해서 알아보았다.
다음 포스트에서 배열로 할 수 있는 일들에 대해서 알아보도록 하자.
