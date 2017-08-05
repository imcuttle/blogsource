---
title: React组件化 -> Demo 解决方案
date: 2017-08-05 18:47:32
categories:
tags: [React组件化]
cover:
keywords:
---

## 为什么

 React组件化的开发思维，大大地缩减了我们的开发时间。
 于此同时也带来了一些问题：
 
  1. 大量组件的维护和兼容问题
  2. 对于组件的学习使用，需要组件Demo展示
  3. ...
  
对于第二点问题，Demo 的书写可能不能够对组件覆盖全面
甚至需要深入查看组件源码才能明白配置项的功能

## Editable React

抛出一个工具（Editable React）

具体效果看图

<img src="http://obu9je6ng.bkt.clouddn.com/FkVW1A_OJ5Nw5m2wNFQL5QrtIGfF?imageslim" width="1221" height="322"/>

可以方便 “编辑” React 组件（包括 Props、State、甚至一些其他自定义数据）
并且视图进行同步更新

是不是很方便的就可以对一个组件进行深层次的剖析了！！

[Demo点我](https://m-cuttlefish.github.io/react-mhoc/page/)

## 展望

后续可以定义数据（props/state/...）的描述信息，如

```jsx harmony
import editable from 'react-mhoc/lib/editable'
import 'react-mhoc/lib/attrEditable/style.css'

@editable({groupName: 'MyComponent'})
class Component extends React.Component {
    
    static defaultProps = {
        color: 'red'
    }
    
    static propsDescription = {
        color: '我是文字的颜色配置'
    }
    
    render() {
        
    }
}
```




