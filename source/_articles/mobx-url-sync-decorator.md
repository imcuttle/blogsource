---
title: 基于Mobx实现 数据 - Url 同步
date: 2017-09-10 00:51:14
categories:
tags:
cover:
keywords:
---


## 需求

在项目开发初期，未考虑到需要做数据列表页面的数据（如分页、排序、条件查询...）同步至 url.

但这种需求在对于数据列表是必要的。

因此需要一种较为“优雅的”方式来“独立”实现数据-url 的同步

## 思路

1. 首先，项目中的页面结构如下
```
state.js    # mobx 
index.js    # react page
...
```
一个view 对应一个 state

2. 我们需要同步的数据一般在 state.js 中

3. 约定一个 state "生命周期"规范
```
componentWillMount() -> trigger -> state.init(props)
componentWillReceiveProps() -> trigger -> state.update(newProps) | state.init(newProps)
componentWillUnmount() -> trigger -> state.exit(props)
```

4. 在 init 方法中，注入下面的逻辑
```
观察需要同步数据的改动，如果改动了，则将其数据写入url
```

5. 在 exit 方法中，注入销毁 init 观察者的逻辑

## 需要注意的点

- 适用于 state 独立于一个 class 的架构
- state 必须有 `init/exit` 周期方法（继承）
- 在对应 View 的生命周期方法中，绑定 state 的 `init/exit` 方法（HOC）

## 使用方法

- State
    ```js
    import {urlsync} from 'common/decorator'
    
    export default class State {
    
        @observable initialized = false
    
        // 若不是observable，urlsync将自动转化为observable
        @urlsync
        deptId = ''
    
        // 避免重名，使用 page 命名
        @urlsync('page')
        @observable pagination = new Pagination({
            pageNum: 1,
            total: 0,
            pageSize: 10
        })
        
        init() {}
        exit() {}
        ...
    }
    ```

- View
    ```js
    export default class View extends React.Component {
        
        local = new State();
        
        componentWillMount() {
            this.local.init(this.props)
        }
        
        componentWillUnmount() {
            this.local.exit(this.props)
        }
        
        ...
    }
    ```

## 其他问题

- 不适用于数据嵌套过深的数据结构
- url 变得“丑陋”