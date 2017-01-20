---
title: 刷脸签到系统回顾
date: 2017-01-19 19:09:14
categories:
tags: [react, redux, webpack, express, nodejs, 人脸识别, https]
cover: https://ooo.0o0.ooo/2017/01/19/5880a68dc28c2.jpg
skip: false
---

[毕设 👉 南师大刷脸签到系统 👉  face.moyuyc.xyz](https://face.moyuyc.xyz)
![](https://ooo.0o0.ooo/2017/01/18/587eea50913fd.jpg)

写该文是为了准备写毕业论文的材料，所以文字介绍较多，比较面向大众程序员。

## 系统架构

![ClipboardImage](https://ooo.0o0.ooo/2017/01/20/588222a61e47b.jpg)

### 前端 (Front-End)

1. 使用主流 [Webpack](https://webpack.github.io/) 构建，进行前端模块自动化管理。
2. 使用Facebook提出的 [React](https://facebook.github.io/react/) , 将HTML DOM进行上层抽象，提出Component概念，一套理念，实现了Server render, Web UI, mobile UI的统一。  Learn Once, Write Anywhere
3. [Redux](https://github.com/reactjs/redux)，随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state (状态)，state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰, Redux则是为了解决该痛点而产生。
4. [React Router](https://github.com/ReactTraining/react-router) 是一个基于 React 之上的强大路由库，它可以让你向应用中快速地添加视图和数据流，既保证了单页应用的畅快，同时保持页面与 URL 间的同步。
5. *[Babel](https://babeljs.io/) => 使用 JavaScript 实现的编译器，正如官网所说的那样 Use next generation JavaScript, today.
 ，可以利用 Babel 书写最新的 JavasScript 语法标准，如 ECMAScript 6 ，搭配 Webpack 使用更佳。
6. *[ECMAScript6](http://es6-features.org/) => 2015 年提出的JavaScript标准，目标是使得JavaScript语言可以用来编写复杂的大型应用程序，成为企业级开发语言。ECMAScript和JavaScript的关系是，前者是后者的规格，后者是前者的一种实现。ES 6 具有一系列简明的语法糖，更佳的书写体验。但为了保证浏览器, Node 环境兼容性，往往配合 Babel 书写。
7. *less => 一种 CSS 预处理语言，增加了诸如变量、混合（mixin）、函数等功能，让 CSS 更易维护、方便制作主题、扩充。

### 后端 (Back-End)



### 

<!--more-->
## 涉及知识

1. 
