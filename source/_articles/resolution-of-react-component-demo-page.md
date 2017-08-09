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

具体效果看视频

<video src="http://obu9je6ng.bkt.clouddn.com/editable-preview.mp4" controls="controls"/>

可以方便 “编辑” React 组件（包括 Props、State、甚至一些其他自定义数据）
并且视图进行同步更新

是不是很方便的就可以对一个组件进行深层次的剖析了！！

[Demo点我](https://m-cuttlefish.github.io/react-mhoc/page/)

- 参数
    - groupName: string  
        编辑视图的组名(默认为组件名)
    - attrNames: Array  
        需要编辑的数据keyNames, props强制支持 (默认['state'])

```jsx
import {editable} from 'react-mhoc'

@editable
class MyComponent extends React.Component {
    // ....

    // ref Api
    open() {}
}


class App extends React.Component {

    componentDidMount() {
        // not existed open
        // this.ref.open()

        // ok
        this.ref.comp.open()
    }

    render() {
        <MyComponent ref={r => this.ref = r} />
    }
}
```

## 展望

1. 后续可以定义数据（props/state/...）的描述信息，如

```jsx
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



