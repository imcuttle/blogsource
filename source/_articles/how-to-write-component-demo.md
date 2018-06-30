---
title: 书写组件 DEMO 的一些方案
datetime: 2018-06-30 15:55:46
---

目前前端开发都推崇一致组件化的开发思想，即看到业务页面之后，先不着急写页面；而是先观察，把一些具有共性的UI控件包装成组件（如 React/Vue/Web Component）。这样做的好处不言而喻，提供组件复用率，团队开发效率提升明显。

既然组件化的思想这么重要，那么对于某个组件单元，它本身是不依赖外部环境（如外部静态资源）的；同时它内部也需要有它自己的单元测试、文档，甚至包含 DEMO 代码。

对于单元测试、文档的意义不属于该文讨论范畴，下面展开说说组件 DEMO 的意义

## 组件 DEMO 的意义

### 沟通、共享
项目开发人数一般为多人，多人开发的情境下，多了一份沟通的开销。

在没有 DEMO 的情景下，项目成员都是交叉沟通的（如该组件具体怎么用），而且这种沟通大都是低效的（无沉淀）；
而 组件 DEMO 的出现将内容聚合起来，项目成员都是面向 DEMO，去除了项目成员冗余沟通，表现方式也更为直观。

如果 DEMO 可以可视化集成文档，那么体验则更美妙。

### 集成测试
组件 DEMO 另一个更为重要的意义则是方便 “集成测试”。拥有 DEMO 之后，我们可以直接使用 DEMO 服务去进行集成测试，而不需要额外搭建环境。

## 实现组件 DEMO

不同组件有不同的 DEMO，一个组件还可能拥有多个 DEMO case，所以 DEMO 服务应该是有多路由的，

基于添加路由的方式不同，我将实现组件 DEMO 的方式划为两种方式：静态添加路由、动态添加路由。

### 静态（不推荐）

通过模板去自动生成各个组件的 DEMO 路由代码；触发流程应该为：新建 demo 后，执行命令去写入静态路由

这种方法相对简单、不优雅，本文不展开说明

### 运行时，动态路由匹配

其实市面上已经有一些现场的 DEMO 服务解决方案，如 [storybook](https://github.com/storybooks/storybook) 和 [react-styleguidist](https://github.com/styleguidist/react-styleguidist)
它们的共同点是他们都是独立的 webpack 环境，生态都很全面；

但是对于有些情况下，我们组件代码和 DEMO 是依赖我们项目环境的（如 webpack 配置，或者其他老项目依赖外部的静态资源），所以以上的方案可能不太适合，这时候就需要我们自己动手写一个 DEMO 架子了。

#### DEMO 架子
其实动态路由添加的实现是基于 Webpack 中的  `require.context`  方法的

`require.context(path, useSubdirectories, regExp)` 方法有三个参数

-  `path`: 要搜索的文件夹目录
-  `useSubdirectories`: 是否还应该搜索它的子目录
-  `regExp` 一个匹配文件的正则表达式

`require.context` 返回一个（require）函数，这个函数可以接收一个参数：`path` （这个 path 是基于要搜索的文件夹目录的）

实际上 `require.context` 是一个 Webpack 编译阶段用到的语法，而不是前端代码，所以如果执行  `console.log(require.context)` 打印的是 `undefined`


如果我们组件的文件结构为:
```
components/
    Button/
        ...
        demo/  # 对应不同 case 的 demo 代码
            caseA.js
            caseB.js
```

使用该方法，我们可以使用如下代码来动态选择加载 DEMO 代码

```javascript
const req = require.context('components', true, /\/demo\/.+?\.js$/)
// 加载 DEMO
req.keys().map(filename => req(filename))
```

基于以上代码，我们可以动态的生成路由，从而渲染组件 DEMO

同时安利一个 React 高阶组件 [react-hoc/editable](https://github.com/m-cuttlefish/react-mhoc)，使用这个高阶组件可以**可视化操作更新组件数据**，使我们更方便的修改组件内部的数据，从而更了解组件的使用。

[react-hoc/editable DEMO 地址](https://m-cuttlefish.github.io/react-mhoc/page/)

你觉得你只有 DEMO 视图还不够，还需要 DEMO 源码展示？

##### 加上 DEMO 源码展示

使用 webpack 的 `raw-loader`，即可加载 DEMO 为源码文本

```javascript
const rawReq = require.context('!raw-loader!dulife-ui', true, /\/demo\/.+?\.js$/)
```

最终效果如下：
![](https://i.loli.net/2018/06/30/5b3741de4ed1e.png)


## 结尾
本人还是推荐动态添加路由方式中的 [storybook](https://github.com/storybooks/storybook) 和 [react-styleguidist](https://github.com/styleguidist/react-styleguidist) 生态！

