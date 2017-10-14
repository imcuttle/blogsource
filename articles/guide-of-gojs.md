---
title: go-js 介绍
datetime: 2017-08-17 09:29:58
categories:
tags: [webpack]
cover:
keywords: [webpack, gojs]
---

## 是什么

首先，此gojs非彼gojs(图表库)

该工具将 webpack v1 "内嵌"，可以很方便快捷的"搭建"一个commonjs前端执行环境。

## 概念

`gojs` 认为一个js文件就是一个入口(entry)

## 特征

1. 程序运行时，自动下载依赖包，包括：
    - webpack中的loader
    - gojs当前工作目录中的`.babelrc`配置
    - js文件中静态`import/require`的依赖

    来自 [npm install webpack plugin](https://github.com/webpack-contrib/npm-install-webpack-plugin)  

2. 入口动态添加，如：

    文件目录结构如下：

    ```
    go-js-test/
    ├── a/
    │   ├── a/
    │   ├── jq.html
    │   ├── jq.js
    │   ├── style.css
    │   └── style.less
    ├── jq.js
    └── react.js
    ```
    1. 在 `go-js-test/` 下执行 `gojs .`
    2. 请求 `/jq.js`
    3. 添加 `jq.js` 至入口中, webpack building....
    4. 请求 `a/jq.js`
    5. 添加 `a/jq.js` 至入口中, webpack building....

3. 颗粒化 webpack compiler 和 HMR 的处理  

    在第二点(入口动态添加)中，对于`jq.js`和`a/jq.js`两个入口，分别**各自对应webpack compiler 和 HMR 单元**。
    也就是说，`jq.js`和`a/jq.js`是两个相互独立的webpack处理单元。
    那么这样给我们带来什么便利呢？

    1. 如果`jq.js`中出错，在`a/jq.js`中是不被察觉的。
    2. 后面加入的`a/jq.js`入口，不影响`jq.js`入口，所以之前对`jq.js`的webpack bundle cache是依然生效的。（对比与 一股脑将2个入口重新用一个webpack单元处理）

## 适用于

适用于一些小型项目或者demo的快速搭建开发。
如，`package.json`中

```
{
    ...
    "scripts": {
        "start": "gojs -i demo.js"
    },
    ...
    "devDependencies": {
        "go-js": "^1.2.4"
    }
}
```

用户只需要执行

```
npm install && npm start
```
就可以直接看到demo.js了！


## 预览

<iframe width="500" height="300" src="https://www.youtube.com/embed/VDfcNhSxbQY" frameborder="0" allowfullscreen></iframe>

## 使用

- cli

```
npm install -g go-js
gojs -h  # 查看帮助
```

- package

```
const GoJS = require('go-js')
const gojs = new GoJS({
    verbose: true,
    path: '.',
    type: 'js',
    port: null
})

gojs.start(function(error, port) {
    console.log('server listening on '+port)
    
    // gojs.stop()
})

gojs.on('error', error => {})
gojs.on('server', port => {})
gojs.on('request', (req, res, start) => {})
gojs.on('addEntry', entry => {})
gojs.on('rmEntry', entry => {})
gojs.on('watch', (type, filePath) => {})
```
