---
title: Node.js 前后端分离开发新思路
datetime: 2019-06-24T14:42:24.051Z
---
从事 Web 开发的程序员，对于前后端分离模式多半不陌生，这也是目前主流的 Web 开发模式，具体关于前后端分离的模式可以参看文章[《你不得不了解的前后端分离原理!
》](https://juejin.im/post/5b71302351882560ea4afbb8)，在这里写者不进行说明。

好了，让我们进入主题 —— Node.js 前后端分离开发新思路  
在进入新思路之前，我们现需要了解“老思路”是什么？（注意：后面的案例都是以全栈工程师为例，即前后端代码在一起）

## 前后端分离开发常规思路
以一种具体情景为例：小牛是一名全栈工程师，喜欢前端后端全干，前端使用目前主流的 Webpack + React 全家桶（或 Vue 全家桶），后端使用 express（或 Koa），小牛在同时开发前后端过程中，开启两个进程（前后端各一个），同时使用 [nodemon](https://www.npmjs.com/package/nodemon) 热重启后台服务，使用 Webpack Proxy 转发实现跨域请求，然后哼哧哼哧开发。
如例子：[一个前后端分离的简单案例
](https://juejin.im/entry/58aa5ccf2f301e006c32a3be)

```text
 Process 1                Process 2
 ___________          ____________________
|           | Proxy  |          |         |
| FrontEnd  | <----> | Nodemon  | BackEnd |
|           |        |          | (cp 1)  |
-------------        ----------------------
```
如上示意，该模式启动需要启动两个进程（前端 和 Nodemon），其中 BackEnd 程序作为子进程挂载在 Nodemon 进程，而且前端和 Nodemon 进程通过 Proxy 转发实现通信。

乍看一下这样挺美好的，但是这种模式的缺陷也很容易暴露出来
### 传统思路的缺陷
1. BackEnd 程序复杂度提升后，启动时间也变得不可控，每次热启动后台服务时间过长；
2. 需要同时开启两个进程，一定程度提高了开发成本

那么对于上述的问题，需要介绍一下我们今天的主角！

## 前后端分离开发新思路
依旧是小牛的例子，大牛同样使用小牛相同的前后端技术栈，但不同的是，大牛不使用 Nodemon 实现后端程序的热重启，而是使用类似 [Webpack HMR（Hot Module Replacement）](https://webpack.docschina.org/guides/hot-module-replacement/) 的思路，热更新 Node.js 中的 module，具体实现使用 [hot-module-require](https://github.com/imcuttle/hot-module-require)。

原理图如下，前后端在一个进程（同一个端口）中，通过 Fs Watcher 热替换更新的 Module，而不是全量重启。
```text
          Process
 _________________________
|          | File Watcher |
| Frontend |       +      |
|          |    Backend   |
---------------------------
```

具体的应用代码可以参看[这里](https://github.com/imcuttle/live-markd/blob/adc84ee310a90c9aa6cdbc7c545c24fa0b09fa29/client/webpack.config.js#L63-L71)

！！todo（配置说明+思路）

相比与传统模式，新思路的优点十分突出
### 优势
1. 细化 Module 更新的颗粒度，避免不必要的更新开销，大大缩减服务更新时间
2. 只有一个进程，一定程度上缩减了进程调度，进程切换的开销

用一个具体的场景对比举例，如后端使用内存存储用户 session 数据。如使用传统方式开发，则每一次更新后台代码，都会丢失内存中的用户数据，所以每次都需要重新进行登录；但是在新方式，只需要不修改用户登录模块代码，则不会重置用户 session 数据，即不需重新登录。

```
      Backend 入口
  /                \
 -                   -
登录 --> Common <-- 某业务逻辑
```
如上简易模块依赖图，A -> B 表示 A 依赖 B，所以上图中，Backend 入口直接依赖 “登录”和“某业务逻辑”，间接依赖“Common”；这时候我们只有在修改了“登录”或“Common”的代码，才会触发登录模块的热更新。

但是新方法也不是无缺陷
### 缺陷
1. 如代码模块中包含全局副作用代码，可能会有各种奇怪问题出现

## 扩展
使用 Node.js HMR 可以实现各种各样的热更新体验，如热更新 proxy，热更新 mock 数据，热更新配置文件...，非常 Cool！
