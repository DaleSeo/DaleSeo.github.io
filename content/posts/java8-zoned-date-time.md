---
title: Java8 Time API ZonedDateTime 사용법
date: 2017-02-11
tags:
  - Java
  - Java8
---

자바 8에서는 java.time 패키지에서 새로운 날짜/시간 관련 API를 제공합니다. 이번 글에서는 ZonedDateTime 사용법을 알아보겠습니다.

## ZonedDateTime = LocalDateTime + 타임존/시차

LocalDateTime에 타임존(ZoneId)을 추가하면 ZonedDateTime이 됩니다.

```java
LocalDateTime localDateTime = LocalDateTime.of(2002, 6, 18, 20, 30);
ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.of("KST"));

System.out.println("Date = " + zonedDateTime.toLocalDate());
System.out.println("Time = " + zonedDateTime.toLocalTime());
```

```
Date = 2002-06-18
Time = 20:30
```
