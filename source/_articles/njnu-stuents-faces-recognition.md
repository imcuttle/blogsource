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

![ClipboardImage](https://ooo.0o0.ooo/2017/01/21/58826eb274d3a.jpg)

下面进行一些较为粗略的介绍，蜻蜓点水说说涉及的技术

### 前端（Front-End）

1. 单页Web应用（single page web application，SPA），就是只有一张Web页面的应用。单页应用程序 (SPA) 是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。[1]  浏览器一开始会加载必需的HTML、CSS和JavaScript，所有的操作都在这张页面上完成，都由 JavaScript 来控制。因此，对单页应用来说模块化的开发和设计显得相当重要。
2. 使用主流 [Webpack](https://webpack.github.io/) 构建，进行前端模块自动化管理。
3. 使用Facebook提出的 [React](https://facebook.github.io/react/) , 将HTML DOM进行上层抽象，提出Component概念，一套理念，实现了Server render, Web UI, mobile UI的统一。  Learn Once, Write Anywhere
4. [Redux](https://github.com/reactjs/redux)，随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state (状态)，state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰, Redux则是为了解决该痛点而产生。
5. [React Router](https://github.com/ReactTraining/react-router) 是一个基于 React 之上的强大路由库，它可以让你向应用中快速地添加视图和数据流，既保证了单页应用的畅快，同时保持页面与 URL 间的同步。
6. *[Babel](https://babeljs.io/) => 使用 JavaScript 实现的编译器，正如官网所说的那样 Use next generation JavaScript, today.
 ，可以利用 Babel 书写最新的 JavasScript 语法标准，如 ECMAScript 6 ，搭配 Webpack 使用更佳。
7. *[ECMAScript6](http://es6-features.org/) => 2015 年提出的JavaScript标准，目标是使得JavaScript语言可以用来编写复杂的大型应用程序，成为企业级开发语言。ECMAScript和JavaScript的关系是，前者是后者的规格，后者是前者的一种实现。ES 6 具有一系列简明的语法糖，更佳的书写体验。但为了保证浏览器, Node 环境兼容性，往往配合 Babel 书写。
8. *less => 一种 CSS 预处理语言，增加了诸如变量、混合（mixin）、函数等功能，让 CSS 更易维护、方便制作主题、扩充。
9. 使用 HTML5 的 getUserMedia 方法，调用计算机音频视频等硬件设备。为了安全问题，Chrome 只能在本地地址上调用该方法，外网地址则只能在通过证书检测的 HTTPS 服务中调用。

### 后端（Back-End）

1. 采用 [nodeJs](https://nodejs.org/) 作为后端，采用 JavaScript 脚本语言开发。 nodeJs 具有异步事件驱动、非阻塞（non-blocking）IO 特性，采用 Google 的 V8 引擎来执行代码。
2. Node.js以单线程运行，使用非阻塞I/O调用，这样既可以支持数以万计的并发连接，又不会因多线程本身的特点而带来麻烦。众多请求只使用单线程的设计意味着可以用于创建高并发应用程序。Node.js应用程序的设计目标是任何需要操作I/O的函数都使用回调函数。
这种设计的缺点是，如果不使用cluster、StrongLoop Process Manager或pm2等模块，Node.js就难以处理多核或多线程等情况。
3. pm2 => https://segmentfault.com/a/1190000004621734
4. isomorphic render（同构渲染）=> 指的是前后端使用同一份代码。前端通过 Webpack 实现 CommonJs 的模块规范（Node亦是 CommonJs ）+ React 提出的 JSX ，使得 NodeJs 通过解析请求的 URL，适配 react-router 中的前端路由规则，得到 routing Props，还可以 dispatch(action) 同步或异步（一般是 isomorphic-fetch ），又或是直接读取数据，从而更新 store ，最后 nodeJs 通过 store 中的 state 渲染 JSX ，产生静态的 HTML，从而实现了前后端的同构渲染。
5. [nodeJs C++ Addons](https://nodejs.org/api/addons.html)，nodeJs 就是使用C++语言实现的，图像处理最强大的库 opencv 便是用 C++ 实现的，这就不得不需要 nodeJs 与 C++ 之前通信，通过 nodeJs 调用 opencv 的方法，[node-opencv](https://github.com/peterbraden/node-opencv) 便是利用 [nan](https://github.com/nodejs/nan) （解决平台间兼容性问题，将异步事件驱动封装）与 [v8](https://github.com/v8/v8) （javascript 对应的数据类型与 C++映射） ，通过 [node-gyp](https://github.com/nodejs/node-gyp) 工具，将 C++ 打包成 一个动态链接库 *.node，通过 require 即可调用。
6. [node-mysql](https://github.com/mysqljs/mysql) ，由于 NodeJs 具有 non-blocking IO 与异步事件驱动的特性，所以很适合于 IO 密集型高并发业务，而访问数据库正是常用的 IO 操作。

## 涉及知识

1. 
