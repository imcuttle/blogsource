---
title: ESOP项目前端开发模式介绍
---

# ESOP项目前端开发模式介绍

前几天亮亮分享了他在智慧 HR 多维系统项目的前端开发模式，提出了一个 VM 的概念。
下面来一个 之前Mobx项目、Offer入职项目，Redux/MST项目，HR 多维系统项目的开发模式对比介绍

## 之前 Mobx 项目

### 代码目录结构
```text
AbcPage/
├── index.js
├── State.js
└── style.use.less
```

### 样例代码
```javascript
// index.js
@inject('app')
export default class AbcPage extends Component {
  local = {
    state = new State()
  }

  componentWillMount() {
    // 通过 injector 挂载至全局 app 中
    // injector.mount(this.props.app, { name: this.local.state })
    style.use()
  }
  componentWillUnmount() {
    // injector.unmount(this.props.app, { name: this.local.state })
    style.unuse()
  }
  // ...
}

```

## Offer 入职项目

### 代码目录结构
```text
AbcPage/
├── index.js
├── State.js
└── style.use.less
```

### 样例代码
```javascript
// index.js
@inject('app')
@sio(State) // -> 绑定了 View 层的生命周期至 State 中 (init/update/exit)
@suh(style)
export default class AbcPage extends Component {

  componentWillMount() {
    // 通过 injector 挂载至全局 app 中
    // injector.mount(this.props.app, { name: this.local })
  }
  componentWillUnmount() {
    // injector.unmount(this.props.app, { name: this.local })
  }
  // ...
}
```

## Redux/MST项目

```
State Tree      Comp Tree  
   O                O      
  /|\  distribute  / \     
 O O O    --->    O   O    
```

## HR 多维系统项目

```
State/Comp Tree

      O    
     /|\  
    O O O 
```

具有一个 ViewModel 概念，
提供一个 render 方法，来渲染 ViewModel

## 代码示例

如下面是一个 ViewModel 的节点的示例代码
```javascript
// View.js
@model // -> 绑定 View 层的生命周期至 State 中 (init/update/exit)
class View extends Component {
  // ...
}

// State.js
class ExampleVM {
  @observable fetching = true

  init() {}
  update () {}
  exit() {}
}
ExampleVM.prototype.defaultComp = View
```

如果需要渲染上面一个VM的实例，在页面级别的代码如下

```javascript
// Page.js
@sio(State)
class RootPage extends Component {
  render() {
    // 渲染 VM 实例
    r(this.local.vm, { /* ...props */ })
  }
}

// State.js
class State {
  vm = new ExampleVM()

  init() {}
  update () {}
  exit() {}
}
```

ViewModel 把同一页面下（前端路由相同）的 state
```
路由：/detail
    O   
   /|\  
  O O O 

路由：/edit
    O    
   / \  
  O   O 
```