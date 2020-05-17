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

1. 协同编辑
2. 评论
3. 分享
4. 权限控制
5. 内容搜索
6. 文稿模板
7. 消息通知

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

### 分布式 & 集群
