---
title: 谈一谈React高阶组件
datetime: 2017-09-03 20:51:47
categories:
tags:
cover:
keywords:
---


## 定义

高阶组件（Higher Order Components, HOC）: 通过它，将一个组件包装成另一个组件
```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

## 两种HOC方式

### wrap方法

如下：将 Pagination 进行一层 wrap，为了与 rd 接口对接上，同时去掉自动计算"多余"的 `totalPage`
```js
function myPagination(Pagination) {
    return class MyPagination extends React.Component {

        render() {
            const {pageNum, pageSize, total, children, ...rest} = this.props
            return (
                <Pagination
                    currentPage={parseInt(pageNum, 10)}
                    currentLine={parseInt(pageSize, 10)}
                    totalNumber={parseInt(total, 10)}
                    totalPage={Math.ceil(parseInt(total, 10) / parseInt(pageSize, 10))}
                    {...rest}
                >
                    {children}
                </Pagination>
            )
        }
    }
}
```

### 倒转继承方法

如下，可以用于包装 style/useable 的 api，而且对外无影响（除了静态方法）
```js
function styleUseable(WrappedComponent) {
    return class Enhancer extends componentClass {
        componentWillMount(...args) {
            styleInstance.use && styleInstance.use();
            if (super.componentWillMount) {
                super.componentWillMount.apply(this, args)
            }
        }

        componentWillUnmount(...args) {
            styleInstance.unuse && styleInstance.unuse();
            if (super.componentWillUnmount) {
                super.componentWillUnmount.apply(this, args)
            }
        }
    }
}
```

## 实践

[React-Editable: 可视化编辑 React 数据](https://m-cuttlefish.github.io/react-mhoc/page)

<video src="http://obu9je6ng.bkt.clouddn.com/editable-preview.mp4" controls="controls" width="500" height="300"/>

可以方便 “编辑” React 组件（包括 Props、State、甚至一些其他自定义数据）
其中对于 Props 数据的“可编辑”实现，是基于 wrap 方法的，其他数据则都是通过倒转继承的方法实现。
并且视图进行同步更新

## HOC带来的问题
- static方法需要手动copy
    该问题2种方法都存在
    [解决方法: hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)

- refs不会传递
    该问题只存在于wrap方法

## 对比两种方法
1. wrap 方法可以用于修改 WrappedComponent 的 props
2. 倒转继承方法可以嵌入自定义方法至WrappedComponent的方法中（包括生命周期）
2. 因为 refs 的问题存在，倒转继承方法可以更加容易“不被察觉地”工作
3. 倒转继承方法不能修改 WrappedComponent 的 props，因为 this.props 是 readonly

