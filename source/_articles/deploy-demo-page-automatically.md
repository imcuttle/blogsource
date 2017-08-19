---
title: 组件库Demo页发布自动化
date: 2017-08-19 10:25:57
categories:
tags: [web hooks]
cover:
keywords:
---

## 必要性

### 自动化是个好东西

自动化可以帮我们简化一些枯燥（重复）的工作，提高工作效率。

### Demo是个好东西

Demo可以帮助我们更快捷地了解某组件的用法。


## 自动化流程

1. Dev Local: git push origin release/demo
2. Git Remote: origin(remote git server) received the commit
3. Git Remote: trigger *push* web hook


### What should *push* web hook to do?

Release Server: 

1. check whether the push event is from branch named `release/demo`
2. (sudo) git pull -f origin theme/react-mobx-v2
3. some initial works
4. webpack build
5. response 'ok' or 'fail'

**Need to be considered**
- concurrent (Lock Symbol)
- Content-Type: 'text/event-stream'

## 使用说明书

1. 已经在 react-mobx-v2 种子工程中加入 `deploy` 指令
2. 当需要发布demo page时，执行 `matriks2 deploy` 即可

- 相关repo
    1. [WebHooks Server](http://gitlab.baidu.com/yucong02/release-scripts/)
    2. [种子工程](http://gitlab.baidu.com/be-fe/matriks2-seed/)
