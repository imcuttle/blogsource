---
title: DIY 一个 CommonJS 运行环境吧
datetime: 2019-07-03T07:03:11.236Z
---
## 问题背景
在写 React PropTypes 定义的时候，比如如下 Button 组件：

```jsx
import {ICON_SIZE_LIST} from 'comps/Icon'
export const BUTTON_TYPE_LIST = ['default', 'primary', 'normal', 'success', 'danger', 'pale', 'bare', 'link']
export const BUTTON_SIZE_LIST = ['default', 'small', 'large', 'x-small']

export default class Button extends React.Component {
    static propTypes = {
        /**
         * 按钮类型类型 'default' | 'primary' | 'success' | 'danger' | 'normal' | 'pale'
         */
        type: PropTypes.oneOf(BUTTON_TYPE_LIST),

        /**
         * 尺寸 'default' | 'small' | 'x-small' | 'large'
         * 实际没有large，因为规范上没有定义
         */
        size: PropTypes.oneOf(BUTTON_SIZE_LIST),

        /**
         * 图标前缀，仅限于已经收录于 Icon 的 font 类型图标
         */
        icon: PropTypes.string,

        /**
         * 指定前缀图标的尺寸，即 Icon 的 prop.size
         */
        iconSize: PropTypes.oneOf(ICON_SIZE_LIST),
        // ...
    }
}
```

定义 Button 的 propTypes 包括一些需要计算的参数，如 `ICON_SIZE_LIST` 来自外部。
这时候如果使用 [react-docgen](https://github.com/reactjs/react-docgen) 来静态分析代码，对于 `ICON_SIZE_LIST` 将不能解析出其真实值。也就是说使用静态代码分析对于 computed value 不能很好的处理。

那么对于上述的问题有什么比较优雅的解决方式呢？

## 问题解决思路
对于 computed value，需要执行脚本才能正确地获取值。那么如何才能在 Node.js 中执行上述 React 代码？ 有过 SSR（服务端渲染）开发经验的同学，对于这个问题应该不陌生，一般的解决方式是：在 Node.js 环境中 `require('babel-register')`，然后直接 `require` 前端模块代码，然后在书写前端代码时候，需要注意判断是 Node.js 环境还是 Browser 环境，如
```js
if (typeof document !== 'undefined') {
  // Browser
} else {
  // Node.js
}
```

这种解决方式有可能带来问题，如在前端代码中执行 node.js 端 api，如 `require('fs').writeFileSync(...)`，正常在 Webpack 环境（target 为 web）下执行是不被允许的，但这时候在 Node.js 环境下执行却被运行，所以可能带来一些危险操作。

所以考虑模拟实现一个 CommonJS 环境，如 Webpack，可以用来自定义 global 和 require 的规则，甚至进行代码转化。同时避免污染 Node.js 的 CommonJS 环境

### CommonJS 环境实现思路

在实现 CommonJS 环境前，先需要了解一下 [CommonJS 是什么](https://javascript.ruanyifeng.com/nodejs/module.html)

所以 CommonJS 需要实现的重点对象为：`require` / `module` / `global`，以及模块加载的机制实现。在这里使用 [vm](https://nodejs.org/api/vm.html) 模块创建沙盒环境。

#### require 模块加载流程
```
输入 moduleName
     |
     |
id = require.resolve(moduleName)
     |
     |
判断加载模块是否存在在 require.cache  —————————————>  return require.cache[id]
     |                                  存在
     | 不存在
     |
创建 newModule，写入 require.cache
     |
     |
在沙盒环境执行，注入 `require/module/global/...`
     |
     |
newModule.exports = module.exports
newModule.loaded = true
     |
     |
return module.exports
```

我们来看一个环形依赖具体的例子

- `a.js`
```js
console.log('a.js exports entry', module.exports)
module.exports = {
  b: require('./b'),
  a: 'a'
}
console.log('a.js exports', module.exports)
```

- `b.js`
```js
console.log('b.js exports entry', module.exports)
module.exports = {
  a: require('./a'),
  b: 'b'
}
console.log('b.js exports', module.exports)
```

执行 `node a.js` 和 `node b.js` 分别 log 如何呢？

具体代码实现参看 [my-runner](https://github.com/imcuttle/my-runner)

它具有类似 [Jest](https://jestjs.io/docs/en/configuration) 的配置，可见 Jest 的原理其实也是使用 vm 模拟了 CommonJS 环境。

## 应用场景

自定义 CommonJS 环境除了解决上述说明的背景问题以外，还有很多的应用场景，如：
1. SSR（Node.js 端执行前端代码，得到 View，使用 transform 转换代码，不需要载入 `babel-register`）
2. 测试（自定义 Module Name，进而 Mock Module）
3. 前端内容骨架生成 （Node.js 端执行前端代码，得到 View）

## 相关资料
- [my-runner](https://github.com/imcuttle/my-runner) - CommonJS 模拟环境
- [resolve](https://www.npmjs.com/package/resolve) - implements the node `require.resolve()` algorithm
