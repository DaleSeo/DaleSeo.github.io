---
title: "자바8: 반복문에서 벗어나기"
modified: 2016-12-04T13:59:24+09:00
source: http://www.deadcoderising.com/2015-05-19-java-8-replace-traditional-for-loops-with-intstreams/
categories: 
  - Java
tags:
  - Java8
  - Stream
  - FP
  - 번역
---

> 본 포스트는 [Dead Code Rising](http://www.deadcoderising.com/)의 [Java 8: No more loops](http://www.deadcoderising.com/java-8-no-more-loops/)를 번역하였습니다.

이전 [포스트](http://www.deadcoderising.com/java-8-no-more-loops/)통해 자바의 판도를 바꿀 자바8의 새로운 함수형 기능들에 대해서 살펴보았습니다.
자바 개발자들에게는 새로운 세상이 열렸으며, 이제 우리가 그 새로운 세상에 적응해야 할 때 입니다.

이번 포스트에서는 전통적인 반복문에 대한 몇가지 대안들에 대해서 알아보겠습니다.
자바8의 새로운 함수형 기능의 훌륭한 점은 어떻게 실행하는지 대신에 무엇이 실행되야 할지를 명시할 수 있다는 것입니다.
이런 측면에서 반복문이 탈락되게 됩니다.
물론 반복문은 유연하지만 이러한 유연성은 공짜가 아닙니다.
`return` 또는 `break`, `continue`문은 반복문이 어떻게 실행될지를 극적으로 바꾸기 때문에,
우리는 단지 코드가 무엇을 달성하려는지 뿐만 아니라 반복문이 어떻게 작동하는지까지 세부적으로 이해해야합니다.
자바8의 스트림의 도입에 의해서 우리는 컬렉션 대상으로 사용할 수 있는 몇가지 훌륭한 함수형 연산을 얻게 되었습니다.
이제 어떻게 기존 반복문들을 더 간단하고 가독성있는 코드로 탈바꿈시킬 수 있는지 알아봅시다.

## 그럼 코딩을 시작해보시죠!

설명은 충분했으니 이제 예제들을 봅시다.

우선 기사(Article)에 대한 코드를 작성해보겠습니다.
하나의 기사는 제목(title)과 저자(author)그리고 여러 개의 태그를 가집니다.

```java
private class Article {

    private final String title;
    private final String author;
    private final List<String> tags;

    private Article(String title, String author, List<String> tags) {
        this.title = title;
        this.author = author;
        this.tags = tags;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public List<String> getTags() {
        return tags;
    }
}
```

각각의 예제는 전통적인 반복문 해법과 자바8의 새로운 기능을 사용한 해법이 포함되어 있을 것 입니다.

첫 번째 예제로 컬렉션에서 "Java" 태그를 포함하는 첫 번째 기사를 찾고 싶습니다.

먼저 for 반복문을 이용한 해법을 보시죠.

```java
public Article getFirstJavaArticle() {

    for (Article article : articles) {
        if (article.getTags().contains("Java")) {
            return article;
        }
    }

    return null;
}
```

이제, 스트림 API의 연산을 이용하여 같은 문제를 해결해 봅시다.

```java
public Optional<Article> getFirstJavaArticle() {  
    return articles.stream()
        .filter(article -> article.getTags().contains("Java"))
        .findFirst();
}
```

꽤 근사하죠?
먼저 "Java" 태그를 가지는 모든 기사를 찾기 위해서 `filter` 오퍼레이션을 사용 후에 그 중 첫 번째 원소를 찾기위해서 `findFirst` 오퍼레이션을 사용하였습니다.
스트림은 게으르고(lazy) 필터는 스트림을 반환하니까 이 접근법은 스트림이 처음으로 일치하는 원소를 찾을 때까지만 원소들을 처리합니다.

자! 이제, 첫 번째 원소 대신에 일치하는 모든 원소를 구해보시죠.

먼저, for 반복문을 이용한 해법입니다.

```java
public List<Article> getAllJavaArticles() {

    List<Article> result = new ArrayList<>();

    for (Article article : articles) {
        if (article.getTags().contains("Java")) {
            result.add(article);
        }
    }

    return result;
}
```

스트림 API를 이용한 해법입니다.

```java
public List<Article> getAllJavaArticles() {  
    return articles.stream()
        .filter(article -> article.getTags().contains("Java"))
        .collect(Collectors.toList());
}
```

이 예제에서 우리는 직접 컬렉션을 선언하고 명시적으로 일치하는 기사들을 추가하는 대신에, `collect` 오퍼레이션을 사용하여 결과 스트림을 대상으로 reduction을 수행하였습니다.

지금까지 좋군요. 이제 정말로 스트림 API를 눈부시게 만들어줄 예제들을 볼 때입니다.

각 저자에 대해서 모든 기사들을 분류해봅시다.

보통 우리는 반복문을 이용해서 이를 해결을 하려고 합니다.

```java
public Map<String, List<Article>> groupByAuthor() {

    Map<String, List<Article>> result = new HashMap<>();

    for (Article article : articles) {
        if (result.containsKey(article.getAuthor())) {
            result.get(article.getAuthor()).add(article);
        } else {
            ArrayList<Article> articles = new ArrayList<>();
            articles.add(article);
            result.put(article.getAuthor(), articles);
        }
    }

    return result;
}
```

스트림 오퍼레션을 이용해서 깔끔한 해법을 찾을 수 있을까요?

```java
public Map<String, List<Article>> groupByAuthor() {  
    return articles.stream()
        .collect(Collectors.groupingBy(Article::getAuthor));
}
```

훌륭합니다! `groupingBy` 오퍼레이션과 `getAuthor`에 대한 메소드 참조를 사용하여 깔끔하고 읽기 쉬운 코드를 작성하였습니다.

이제 기사 컬렉션에서 사용된 모든 태그들을 찾아봅시다.

반복문 예제로 시작합시다.

```java
public Set<String> getDistinctTags() {

    Set<String> result = new HashSet<>();

    for (Article article : articles) {
        result.addAll(article.getTags());
    }

    return result;
}
```

스트림 오퍼레이션을 통해서 이 것을 어떻게 해결하는지 보시죠.

```java
public Set<String> getDistinctTags() {  
    return articles.stream()
        .flatMap(article -> article.getTags().stream())
        .collect(Collectors.toSet());
}
```

좋습니다! `flatmap`은 태그 리스트들을 하나의 결과 스트림으로 평탄화(flaten)시켜주고, 우리는 세트(set)를 반환하기 위해서 `collect`를 사용합니다.

## 무한한 가능성

어떻게 반복문을 더 일기 쉬운 코드로 탈바꿈시키는지에 대해서 4개의 예제를 보았습니다.
이 포스트는 수박 겉핥기 정도만 하였으니 꼭 [스트림 API](
http://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)에 대해서 더 자세히 알아보세요.


> 원문: [Java 8: No more loops](http://www.deadcoderising.com/java-8-no-more-loops/)