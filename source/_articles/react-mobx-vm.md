---
title: "view model 开发模式 （基于react + mobx）"
datetime: 2018-03-02 20:20:49
---

## [React-Mobx-VM](https://github.com/be-fe/react-mobx-vm)

纵观主流的react状态管理库，Redux、mobx-state-tree
大致的开发app的流程是：先创建一个全局的唯一的store，全局store的数据包括一些子页面的page store 和一些全局的context（如user information），其中page store内的数据又包括页面内的数据，ui方面（isLoading/isFetching）和逻辑方面（list 列表数据）。在页面中又将一些统一的视图独立成一个个component，数据通过react props按需传递下去。所以我们需要在构建一个 st（state tree），如下图
<img src="https://i.loli.net/2018/03/02/5a9967bc17b90.jpg" width="406" height="538"/>

但是这仅仅是数据层面的事情儿，需要将数据和视图关联起来，还需要维护一个vt（view tree）结构与st基本一致，通过react props传递机制去关联 st 与 vt。

上面介绍的仅仅为从上至下的传递，如果一个component想要去修改全局store或page store的数据呢？
我们需要去传递callback(redux) 或者是父亲的reference（通过props或是react context接收，mobx）进而去改变数据。

<img src="https://i.loli.net/2018/03/02/5a9967d5e324d.jpg" width="536" height="415"/>

以上便是以前我们的开发模式的概况。
我们需要维护两份tree（st和vt）


---
下面介绍的view model模式，则只需要维护一份tree（view和state捆绑在一起成为一个节点），不需要我们额外考虑在view中的数据分发。

1. view model 提供 [bindView](https://be-fe.github.io/react-mobx-vm/api/decorator#bindview) 修饰器，传入参数 React Component Class ，修饰model class，那么被修饰的model 就会与view绑定起来成为 view model。同时传入的view会被mobx observe修饰，除外还同步了view层的componentDidMount/componentWillReceiveProps/componentWillUnmount 几个生命周期至model中

```js
import { Root, bindView, observable } from  'react-mobx-vm'
class View extends React.Component {
    render() {
        return <div>{this.local.val}</div>
    }
}
@bindView
class Model extends Root {
    @observable val = '123'
}
```

2. React.createElement 是不能够用来渲染vm实例的，因此我们还提供了[ h ](https://be-fe.github.io/react-mobx-vm/api/others#h)方法 用于渲染vm实例。
3. 应用中难免会出现一些子页面、组件需要修改父页面或全局的状态。vm针对这类情景提供了类mobx inject的修饰器，直接调用 [inject](https://be-fe.github.io/react-mobx-vm/api/decorator#inject) 即可注入 this.app 在view中，也就是全局store的引用。[栗子](https://be-fe.github.io/react-mobx-vm/examples/inject-collect)

```js
@inject
class View extends React.Component {
    render() {
     // this.app
    }
}
```
4. 除外还提供了 [binding](https://be-fe.github.io/react-mobx-vm/api/decorator#binding) 修饰器，用于修饰view，可以使用简洁的方式来实现双向绑定。于此相关的还有 [bindable](https://be-fe.github.io/react-mobx-vm/api/decorator#bindable)，用来实现自定义的双向绑定规则（降低组件调用代码书写的开销）；与之对应的是unBindable方法。[binding 栗子](https://be-fe.github.io/react-mobx-vm/examples/binding)

```js
@bindView(View)
class Model extends Root {
   @observable abc = '123'
}
// 一劳永逸的用法
@binding
class View extends React.Component {
   render() {
     return (
       <div>
         <input data-bind="abc" />
       </div>
     )
   }
}

class View extends React.Component {
   // 在成员方法里面修饰
   @binding
   renderSomething() {
     // return ...
   }
   // 在getter方法里面修饰
   @binding
   get Something() {
     // return ...
   }
   render() {
     // 或者绑定指定的 react-element
     return (
       <div>
         {binding(this.local)(
           <input data-bind="abc" />
         )}
         // 或者直接传入 element
         // 注意：需要绑定 `data-scope` 作用域
         {binding(<input data-bind="abc" data-scope={this.local} />)}
       </div>
     )
   }
}
```
5. 提供 [stateless](https://be-fe.github.io/react-mobx-vm/api/decorator#stateless) 来书写简单的组件（Function Component）

```js
export default stateless((local, props) =>
  <div></div>
)
```
6. **提供非常优雅的深链同步（数据同步至url）修饰器，不需要书写多余的代码。[在线栗子](https://be-fe.github.io/react-mobx-vm/examples/url-sync#/?abc=hi)**
7. reaction  基于mobx reaction和model生命周期实现的reaction，监控到数据改变就会触发该方法
8. autorun  类似于reaction，不同的是初始化时会惩罚该方法，更多介绍请查阅mobx文档

在react router 3中，接收的route中的component 为 react component class，所以我们提供了一个针对react router 3的router 用法与官方的一致，但它支持vm节点的渲染。

view model的开发模式给我们带来更多便捷，但同时也产生了一个**新问题 代码分割**

我们可以在全局app store中挂载异步加载每个页面的vm实例，然后在 routes 中对应 getComponent（需要使用提供的 [Router 组件](https://be-fe.github.io/react-mobx-vm/api/others#/router)），这样便可以实现vm的代码分割。
但是这样实现后，如何才能进行子操控父或跨页面数据操控呢？于是提供 [collect](https://be-fe.github.io/react-mobx-vm/api/decorator#/collect) API来收集那些异步的 vm 实例。

