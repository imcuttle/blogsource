---
title: 页面标注助手 - Markme
datetime: 2018-05-06 22:11:15
---

## 抛出问题

- 情景A
小明在网上查找资料时（如百度百科、wiki），觉得网页上的一些话（错误或是重点）需要记录下来，于是使用截图的方式记录下来。

截图虽然比较方便，但是不方便还原及随后的查阅。

- 情景B
小红和小蓝想对网上的一篇文章一起讨论学习。于是他们事先各自完成自己的任务，最后把总结文章互相分享出来。

上面的情景有统一问题是：需要共享自己在同一个网页上的数据。 其实类似的问题情景还有许多；比如我们前端工程师做的UI还原，UE图的共享等等。

针对上面类似的问题，做了一版产物雏形（还有很多需要完善的地方）- [markme](https://github.com/big-wheel/iioo/blob/master/packages/markme/Readme.md)

## Markme

![markme snapshot](https://github.com/big-wheel/iioo/raw/master/packages/markme/snapshot.gif)

如图是 markme 在 wiki 页面上的效果，可以使用鼠标左键选中的方式来对页面文本进行标注，书写备注。

### Markme leancloud
leancloud 是一个国内的云存储服务平台，利用该平台的数据存储能力，可以把我们在页面上的标注数据存储。

[markme-leancloud](https://github.com/big-wheel/iioo/tree/master/packages/markme-leancloud) 便是对 markme 和 leancloud 功能的整合。

同时搭配[暴力猴](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=zh-CN)(使用暴力猴可以在指定的页面注入额外的js代码)，可以对任意网页进行页面标注。[脚本点这](https://gist.github.com/imcuttle/c345279c6b7a690a5722a8506ba8f1a9)

## 产物实现原理

![](./Markme.svg)

## 问题

* 页面数据更新后，页面标注？

添加 `content` 属性，定位成功后，对比 `content` 是否一致？

## 提升

当然还是有可以提升的地方，如：
* 协同编辑
* 更多样的交互