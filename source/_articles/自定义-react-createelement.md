---
title: 自定义 React.createElement
datetime: 2020-02-16T07:49:44.526Z
---
# 背景
在开发 React 应用中，可能会有这么一个需求，对于浏览器默认的 hovering title 行为，如下图：
![Jietu20200216-161740.jpg](https://i.loli.net/2020/02/16/zP8EfqWRK6NXvDZ.jpg)

有一天，PM 或者 UI MM 突然要求换成自定义的样式，甚至希望显示的时间更可控，如下图
![](https://i.loli.net/2020/02/16/69kyKxUWlsPRBoE.png)

对于这个需求，我们一般就需要全局搜索 `title` 这种关键字，然后进行如下替换

```
<p title="我是一个无辜的title">Hi!</p>
// =>
// HoverTitle 为实现了 Hovering title 交互的组件
<HoverTitle title="我是一个无辜的title">
    <p>Hi!</p>
</HoverTitle>
```

这样改动量比较大，也容易有几个漏网之鱼。
有没有什么一劳永逸的方法呢？


# 有什么方式

下面有几种方式来实现以上需求：
但实现思路都是覆盖 `React.createElement`，如下代码：
```jsx
const rawCreateElement = React.createElement;
const myCreateElement = (name, props, ...children) => {
    const next = () => rawCreateElement(name, props, ...children);
    if (typeof name === 'string' && typeof props.title === 'string' && props.title) {
        return <HoverTitle title={props.title}>{next()}</HoverTitle>
    }
    return next()
}
```

那么我们应该如何才能快捷地全局覆盖 `React.createElement` 呢？
下面介绍如下几种方法

### 语法匹配替换用

使用 [`babel-plugin-transform-react-jsx`](https://www.npmjs.com/package/babel-plugin-transform-react-jsx) 来更改 jsx 转化逻辑，将 jsx 用到的 `createElement` 替换成 `myCreateElement`

但是这样并不完备，比如直接显示使用 `React.createElment` 或者 `React.createFactory` 的地方则不能涵盖到，所以我们还需要额外书写 Babel 插件来替换 `React.createElment` `React.createFactory` 关键字

### 替换引入路径

我们还可以换种思路，将 `import React from 'react'` 替换成 `import React from 'my-custom-react'`

在 `'my-custom-react'` 文件中，覆盖 React
```
const React = require('react')

module.exports = Object.assign({}, React, {
    createElement: require('./my-custom-create-element'),
    createFactory: require('./my-custom-create-factory')
})
```

同时我们在 `./my-custom-create-element` 和 `./my-custom-create-factory` 文件中用到的 `React.createElement` 和 `React.createFactory` 需要是原始的，不然会陷入无穷套娃中。

下面有两种方式来实现这种方式
1. babel 插件修改规则
2. [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 插件修改规则

enhanced-resolve 是 Webpack 中使用的可拔插的 resolve 路径包，其实现了 Node.js 中的 `require.resolve` 算法(支持异步)，我们可以利用其暴露的一些勾子来自定义自己的 `resovle` 逻辑。即我们可以将 `resolve('react')` 输出为 `'my-custom-react'`

以上两种方式各有优劣
|方式 | 优点 | 缺点|
|---|----|----|
|Babel插件|生态好，基本可以方便接入任何构建工具`webpack`/`rollup` 等|对于动态引入的模块，匹配麻烦，如 require('rea' + 'ct')|
|enhanced-resolve插件|webpack 接入方便，实现方便|在非webpack生态中，可能不好接入|


除了以上两种思路之外，还有一个不大合适的思路

### 自定义 React Renderer
在这里不深入展开，主要是自己使用[react-reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler)实现 `ReactDOM.render`。  

对于该需求，自己实现一个 `ReactDOM.render` 有些舍近求远，该方式更适合于渲染同一份 React 代码，在不同的运行环境（如浏览器: `ReactDOM`、服务端 `ReactDOMServer`、移动端 `ReactNative`）

# 实现

在这里，我使用的是 `enhanced-resolve` 插件实现 [module-mock-plugin](https://github.com/imcuttle/module-mock-plugin)，这里有一篇相当详尽的 [`Webpack resolve`](https://juejin.im/post/5c6b78cdf265da2da15db125) 介绍

使用该插件，我们可以如下组织我们的项目代码 
```
src/
    __mock/
        react/ # custom react
node_modules/
    react/
```

在 `src/__mock/react/index.js` 中可以覆写 React 实现
