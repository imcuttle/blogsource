---
title: 妈妈再也不用担心RD部署环境，影响FE开发了
datetime: 2017-09-15 17:16:10
categories:
tags:
cover:
keywords:
---

## 头痛

erp这边rd用的编译型语言Java，每次发版代码都需要重新编译一下，然后才能生效。
但就是这个编译重新载入的时间，经常会影响我们FE开发！
破坏我们创作代码的热情！

于是为了解决该问题，基于birdV3的standup应运而生

## 原理

首先了解一下BirdV3的基本原理
```
Client(Browser)  -------->    Bird    --------->   Remote Server 
		      1. client request 	2. bird request
			  4. bird response		3. remote response
				 <--------			  <---------
```

nodejs实现转发的代码 [forward-request.js](https://github.com/imcuttle/simple-hot-reload-server/blob/master/src/helpers/forward-request.js)

如上面的简单示意，通过Bird可以实现跨域的请求转发
然后我们需要在 3 -> 4 之间，加上一个拦截器(interceptor)的东西

通过拦截器，可以解决上面让我们头疼的问题，思路如下
1. 如果这个请求（url）对应的响应是我们需要cache的，进入2，否则不进行拦截
2. 如果对于remote response，我们认为它是服务器错误，则进入3，否则进入4
3. 如果在cache中找到该请求（url）对应缓存的响应，则进行拦截！并且bird response响应缓存中的数据。否则不进行拦截
4. 将remote response写入缓存中

这样当服务器出错时候，默认认为是 `statusCode >= 400`，会把最新成功的数据给返回，这样本地就感受不到远端的崩溃了


## 使用

配置bird远程服务器配置

```
module.exports = {
    server: 'http://sit-offer-web.dev.weiyun.baidu.com',
    plugin: 'uuap2',

    useUser: 'tangrui',

    users: {
        tangrui: 'tangrui7700',
    },

    intercept: {
        name: 'standup',
        option: {
            matcher: function (url) {
                return url !== '/favicon.ico';
            },
            checkIsBroken: function (res) {
                return parseInt(res.statusCode, 10) >= 400;
            },
			// 是否在程序结束时保存缓存
            saveLastCache: true
        }
    },

    reloginSeq: 35
}
```