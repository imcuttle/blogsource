---
title: "自研协同文档服务 - Dozo "
datetime: 2020-05-17T15:16:28.641Z
---


最近一段时间，疫情爆发，对于全球工作人员复工提出了新的挑战！**远程办公，远程授课**成为刚需。
对于远程办公，肯定离不开一个词：**协同**。对于我们日常工作最常见的工作输出载体：文档，也离不开协同

如下图，为个人实现的协同编辑服务 - Dozo 的示意图：
![dozo.gif](https://i.loli.net/2020/05/17/ypOQxwzKYXtHloE.gif)

相比于市面上成熟的商用协同产品：如 yuque、feishu、腾讯文档、石墨文档...，只能是小巫见大巫，但是对于个人使用，团队内使用还是值得一试的，后续将会开源，敬请期待。

下面将对 Dozo 的功能、架构设计和实现展开说明。

## Dozo 功能介绍

### 协同编辑
如上图，Dozo 能够协同编辑，会实时同步其他用户的编辑光标

### 评论
如下图，Dozo 文档支持行评论
![image.png](https://i.loli.net/2020/05/20/PeGhkHyu1zWpo8b.png)

### 分享
如下图，Dozo 文档支持对外分享，发送分享链接至被分享人
![image.png](https://i.loli.net/2020/05/20/jQErMP8evfynwKm.png)

可以设置密码，设置外部访问的权限：可读或可写

### 权限控制
除了分享文档设置读写权限以外，还可以设置文档权限，可以设置为 完全公开、组织内可见、私有，如下
![image.png](https://i.loli.net/2020/05/20/1zRK98CYQjxvmHb.png)

同时，组织的拥有者和管理员，能够管理组织成员
![image.png](https://i.loli.net/2020/05/20/jgDLZSnzvJ95xYa.png)

### 内容搜索
Dozo 基于 Elasticsearch 实现了自己权限内的内容搜索
![image.png](https://i.loli.net/2020/05/20/FytTm3NIJa5KcZw.png)

### 文稿模板
可以设置文稿类型为模板，从而可以从新文稿中选择模板
![image.png](https://i.loli.net/2020/05/20/LsA56fkSI4ytJgU.png)

![image.png](https://i.loli.net/2020/05/20/FGkby4IKRwLhaf5.png)

### 消息通知
当有人对你的文稿评论，或者文档中 @ 你，你将会收到邮件通知

![image.png](https://i.loli.net/2020/05/20/K7LbPip3ahlv9Vs.png)

## Dozo 架构设计 & 实现

### Dozo 前端
- React
- Antd
- Mobx
- Socket.IO Client
- Slate.js

### Dozo 后端

- Express
- Socket.IO
- Redis
- Elasticsearch
- MySQL

### 协同编辑的实现
前端使用 `slate.js` 实现富文本编辑器，其中 `slate.js` 能够将每一次的操作抽象成自己的数据模型 `Operation`，于是我们只需要每一次操作，传递该操作的 `operation` 数据即可，服务端获取来自客户端的 `operation` 之后，更新于服务端的文稿对象；并且会节流的写入数据库，防止服务崩溃导致数据丢失；同时在某一篇   

### 分布式 & 集群

Dozo 服务的架构如下，由 8 个分布式子服务组成，各个节点又可以构成各自的集群，如下图
![未命名绘图.png](https://i.loli.net/2020/05/20/GVq7U8R1Pb4wHhX.png)

其中：
- web: HTTP Web Service，负责主要的业务逻辑
- fileman: 负责文件处理上传、存储
- static: 前端静态服务
- ws: Websocket service，协同实现的服务端关键
- worker: 负责处理其他任务，如发送通知，邮件；推送文档数据至 elasticsearch
- 其他 redis / elasticsearch / mysql 服务就不多介绍了，第三方十分主流的服务

#### 多节点集群的搭建
使用多节点集群和负载均衡，可以大幅度减少单节点的并发数；其中 web / fileman / static 服务多节点集群的搭建比较简单，直接搭配负载均衡，分流到不同节点即可；但是对于 websocket 服务来说，多节点服务并不简单！

其中有以下问题：
1. 对于 socket.io 来说，建立连接之前，会一段（多个）HTTP请求响应的通信，这时候需要始终保存与固定的 ws 服务通信，所以不能通过简单的轮询来负载均衡，需要通过 ip 网段映射表来分流（会话保持），可就是同一个 ip 始终走同一个 ws 服务；
2. 多个不同 ws 服务之间需要共享数据，共享 socket 通道；  
   如，ws1 服务有 a b 客户端连接，ws2 服务有 c d 客户端连接；这时候 ws1 如何才能知道整体 ws 服务当前有多少客户端连接？  ws1 可以通过 redis 发布 getSockets 消息，ws2 在订阅 getSockets 消息后，返回 ws2 所有的 sockets，从而 ws1 通过 ws2.sockets 和 ws1.sockets 合并，即可获取整体 ws 服务的 sockets；  
   又如，ws1 服务需要对整体 ws 客户端广播发送 hello 消息，除了需要对自身 ws1 进程中的 sockets 进行广播；还需要广播消息 `{type: 'broadcase', value: 'hello'}`, ws2 / ws3 /... 接受消息后，也在当前进程广播消息 `hello`；
