---
title: "소켓이란 무엇인가?"
modified: 2016-12-18T14:23:11+09:00
categories: 
  - Java
tags:
	- Socket
	- Network
published: true
---

> 본 포스트는 오라클 자바 튜토리얼의 [What Is a Socket?](https://docs.oracle.com/javase/tutorial/networking/sockets/definition.html)를 번역하였습니다.

일반적으로 서버는 특정 포트가 바인딩된 소켓를 가지고 특정 컴퓨터 위에서 돌아갑니다. 
해당 서버는 클라이언트의 연결 요청을 소켓에 리스닝하면서 그냥 기다릴 뿐이죠.

On the client-side: The client knows the hostname of the machine on which the server is running and the port number on which the server is listening. To make a connection request, the client tries to rendezvous with the server on the server's machine and port. The client also needs to identify itself to the server so it binds to a local port number that it will use during this connection. This is usually assigned by the system.

## 클라이언트 입장

클라이언트는 서버가 떠 있는 머신의 호스트네임과 서버가 리스닝하고 있는 포트 번호를 알고 있습니다. 
따라서 클라이언트는 이 호스트 네임과 포트를 통해서 서버와 연결을 시도하게 됩니다.
또한 클라이언트는 서버 상대로 자신을 식별시켜주기 위해서 연결동안 사용될 로컬 포트로 바인딩됩니다.
이 포트 바인딩 작업은 보통 시스템에 의해서 이뤄집니다.

![5connect](https://docs.oracle.com/javase/tutorial/figures/networking/5connect.gif)