---
title: 毕设周记二  
date: 2017-04-11 19:30:30
categories:
tags:
cover:
keywords:
---

题目：刷脸签到系统  
姓名：余聪

最近几周主要完成了web前端页面的开发，与后端接口的开发。

界面如下：
1. 学生签到
<img src="https://ooo.0o0.ooo/2017/01/22/588485d5c5134.jpg" alt="学生签到-1" width="1440" height="810">
<img src="https://ooo.0o0.ooo/2017/01/22/58848618b06ff.jpg" alt="学生签到-2" width="1440" height="810">

2. 人脸录入
<img src="https://ooo.0o0.ooo/2017/04/11/58ecc6f371fe7.jpg" width="1345" height="721"/>

3. 关于
<img src="https://ooo.0o0.ooo/2017/01/22/588486cf622d8.jpg" alt="" width="1440" height="810">

4. 管理员入口
<img src="https://ooo.0o0.ooo/2017/01/22/588486ef8446d.jpg" alt="" width="1440" height="810">


前后端架构如下图：
<img src="https://ooo.0o0.ooo/2017/04/11/58ecc1672afba.jpg" width="379" height="219"/>

<img src="https://ooo.0o0.ooo/2017/01/22/58848833b7414.jpg" alt="系统模块" width="770" height="401">

## 前端

1. 前端采用SPA（ single page web application，单页web应用 ）架构。  
SPA是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。 浏览器一开始会加载必需的HTML、CSS和JavaScript，所有的操作都在这张页面上完成，都由 JavaScript 来控制。因此，对单页应用来说模块化的开发和设计显得相当重要。

2. 使用主流 Webpack 构建，进行前端模块自动化管理。

3. 使用Facebook提出的 React 框架进行 View 开发， 将 HTML DOM 进行上层抽象，提出 Virtual DOM 概念，一套理念，实现了Server render, Web UI, mobile UI 的统一。 Learn Once, Write Anywhere
<img src="https://ooo.0o0.ooo/2017/01/23/5884d71e7ed1d.jpg" alt="ClipboardImage" width="623" height="396">

4. 使用 HTML5 的 getUserMedia 方法，调用计算机音频视频等硬件设备。为了安全问题，Chrome 只能在本地地址上调用该方法
5. WebWorker: 利用 Web Worker 起一个进程代码，主要做的是输入图片数据，输出人脸的位置大小，就是 JavaScript 版的人脸检测，之所以起另一个线程，是因为对于视频的人脸检测，对于实时性要求也比较高，检测也比较耗时，为了效率考虑使用了Web Worker多进程。
6. ...

## 后端

1. 采用 nodeJs 作为后端，采用 JavaScript 脚本语言开发。 nodeJs 具有异步事件驱动、非阻塞（non-blocking）IO 特性，采用 Google 的 V8 引擎来执行代码。
2. isomorphic render（同构渲染）： 指的是前后端使用同一份代码。前端通过 Webpack 实现 CommonJs 的模块规范（Node亦是 CommonJs ）+ React 提出的 JSX ，使得 NodeJs 通过解析请求的 URL，适配 react-router 中的前端路由规则，得到 routing Props，还可以 dispatch(action) 同步或异步（一般是 isomorphic-fetch ），又或是直接读取数据，从而更新 store ，最后 nodeJs 通过 store 中的 state 渲染 JSX ，产生静态的 HTML，从而实现了前后端的同构渲染。<img src="https://ooo.0o0.ooo/2017/01/23/5884dc559b020.jpg" alt="isomorphic render" width="640" height="400">
3. Express（Node.js Web 应用程序框架），很方便的定义 restful api. 十分适合 spa 的架构
4. ...

## 文件结构

```
app/ # 前端目录
├── App.js          # 父组件(Container)
├── common/         # 一些通用的资源或模块
├── components/     # 一些封装的组件
├── index.tpl.html  # html模板
├── main.js         # 入口文件
├── pages/          # 所有页面
├── reducers/       # 数据修改集合
├── router.js       # 路由定义
└── workers/        # WebWorker：用于前端页面的人脸检测，多线程

gp-njnu-photos-backend/ # 后端代码目录
├── cache.json          # 学生帐号和密码验证结果的缓存
├── cpptest/            # 一些c++ opencv测试的代码
├── data/               # 一些数据文件：级联分类器/预处理后的人脸/人脸特征数据/...
├── database/           # 数据库访问代码，主要是人脸录入表
├── index.js            # 入口
├── lib/                # 一些 library
├── opencv/             # node-opencv 
├── package.json        
├── pretreat/           # 预处理代码
├── provider.js         # 开发环境下的入口
├── readme.md           # 说明
├── routes/             # express路由定义
├── server.js           # http服务 入口
├── ssl/                # https 证书
└── test/               # 一些测试
```

## 部分代码解读

### 开发环境（热部署）脚本
```javascript
// gp-njnu-photos-backend/provider.js
// language: javascript
// env: node
// usage: (cd gp-njnu-photos-backend && npm run dev:w)

var cp = require('child_process')
var p = require('path')
var fs = require('fs')

const isDir = (filepath) => fs.statSync(filepath).isDirectory()

/* 去除掉 非文件夹，node_modules文件夹，`.`开头的文件夹 */
const children = fs.readdirSync(__dirname).filter(n=>n!='node_modules' && !n.startsWith('.') && isDir(p.join(__dirname, n)));

[__dirname].concat(children).forEach(dir => fs.watch(dir, watchHandle))

/* 监听到文件被修改则触发 */
function watchHandle (type, filename) {
    // 无视不是js文件和点开头命名的文件
    if(filename.startsWith('.') || !filename.endsWith(".js")) {
        return;
    }

    console.log(type, filename);
    // 杀死内存中的服务器进程
    serverProcess.kill('SIGINT');
    serverProcess = runServer();
}

var serverProcess = runServer();
/* fork index.js 进程 */
function runServer() {
    return cp.fork('./index.js', process.argv, {stdio: [0, 1, 2, 'ipc']})
}
```

### 服务器自动更新代码

- 服务器端  

```javascript
// gp-njnu-photos-backend/routes/control.js

/* 访问 /api/ctrl/pull 服务器执行 git pull，从 github 更新代码 */
ctrl.all('/pull', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    var ls = require('child_process').spawn('git', ['pull', 'origin', 'master'])
    ls.stdout.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(`${data}`);
    });
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        res.end(`child process exited with code ${code}`);
    });

})
```

- 本机（开发机）

```javascript
#!/bin/bash

msg="from bash"
if [ -n "$1" ]; then
    msg=$1
    # 重新 build 前端代码
    (cd gp-njnu-photos-app && npm run build)
fi

git add .
git commit -m "$msg"
git push

# 如果push成功（exitcode=0），则访问远端 /api/ctrl/pull，从而服务器也更新了代码
if [ $? = 0 ]; then
    curl https://face.moyuyc.xyz/api/ctrl/pull
fi
```