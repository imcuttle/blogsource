---
title: 从零开始写Babel插件 (danger-remove-unused-import)
datetime: 2017-11-30 09:42:58
categories:
keywords: [babel, plugin, babel-plugin, remove-unused-import, unused-import]
tags: [babel]
cover:
---

在现代Web前端开发中，离不开JavaScript es6/7，而 ES6/7 中最常用的语法翻译当属 Babel 了。

这篇文章将带读者从零开始开发一个自定义的Babel插件。

## Babel是什么

Babel 使用 babylon 解析 JavaScript 代码，得到抽象语法树（Abstract Syntax Tree，后文简称 AST）。  
同时也可以使用`babel-generator`，输入一个合法的 AST，还原成 JavaScript 代码

<img src="http://obu9je6ng.bkt.clouddn.com/FkKXk5xwPpo_reQHW3U3Y_yGF991?imageslim" width="434" height="98"/>

代码如下： 
```javascript
cosnt babel = require('babel-core')
const code = `
import e from './where'
const [ a, b, c ] = [ 1, 2, 3 ]
`
const { ast } = babel.transform(code, { ast: true })

const generate = require('babel-generator')
const { code: codeFromBabel } = generate(ast)
```

### AST

ast 在这是指将 JavaScript 代码进行解析得到的抽象语法树（数据结构）。  
如代码
```javascript
const key = 'value'
```
解析产生的 AST 如下图所示
<img src="http://obu9je6ng.bkt.clouddn.com/Foe8OrdCEPOhQX4-VHbqkOtDruF9?imageslim" width="426" height="488"/>

建议使用 [AST Explorer](http://astexplorer.net/#/Z1exs6BWMq) 在线预览 AST



## Plugin 和 Preset

我们在使用 Babel 的时候，通常需要配置一些预设（presets）和插件（plugins）。
如  
```json
{
  "presets": ["env"],
  "plugins": ["async-to-generator"]
}
```

其实，preset是一堆plugin的结合，那么plugin又是什么呢？  
如下图，plugin 会转换 AST，对 AST 进行处理，从而也能够影响到产生出来的 JS Code。

<img src="http://obu9je6ng.bkt.clouddn.com/FmBuevqTrAt8VApb-bnWygS6cwrK?imageslim" width="489" height="114"/>

在后文中学习了开发 Babel 插件后，将阐述一下 Babel plugin 和 preset 的执行过程和顺序。

## 开发 Babel 插件

了解了 Babel 插件的概念后，让我们动手撸一个 Babel 插件吧！  

### 情景再现  
在使用构建工具 Webpack 开发大型项目的时候，我们可能通常需要 import 一大串依赖

```javascript
import a from 'a'
import b from 'b'
import c from 'c'
// ...

// code here
```

但是在开发的逻辑中可能只需要用到其中的一丢丢依赖，比如 `a`，那么依赖`b` `c` 都是“无效”的依赖。

**注意：** 无效只是相对而言的，因为在 `'b', 'c'` 依赖中可能会执行一些副作用的逻辑。如设置全局变量，环境变量，做些初始化工作...

在优化项目的时候，就需要考虑到去除掉无效的 `import` 语句了，这样可以一定程度上加快程序执行速度，缩小打包出来的 bundle 大小。

### 开发插件！

不想偷懒的墨鱼不是好程序员！对于上面的问题，可以通过开发 Babel 插件来实现，减少我们的人力工作量。

**程序思路**
1. 根据 `import ...` 语法，得到 imported 变量名集合
2. 过滤掉使用过的 imported 变量名
3. 移除没有使用到的 `import ...` 语句

思路总是很简单，但只有真正实现过的人才知道里面的具体种种。

Babel 插件返回一个 function ，入参为 babel 对象，返回 Object。

其中 `pre`, `post` 分别在进入/离开 AST 的时候触发，所以一般分别用来做初始化/删除对象的操作

```javascript
module.exports = (babel) => {
  return {
    pre(path) {
      this.runtimeData = {}
    },
    visitor: {},
    post(path) {
      delete this.runtimeData
    }
  }
}
```

然后是 visitor 访问者对象。

先看个简单的例子：  
如需要将如下代码中的 x 变量重命名为 y
```javascript
const x = 'x'
alert(x)
```
visitor 书写为：
```javascript
const visitor = {
    Identifier(path, data) {
        if (path.node.name === 'x') {
            path.node.name = 'y'
        }
    }
}
```
输出为：
```javascript
const y = 'x'
alert(y)
```

可以看出，visitor 是 Object 类型，其中的 key 对应 AST 中的各个节点的 type，`path.node` 是 AST 中的节点数据。

简单了解 visitor 后，开始我们的开发吧！


#### 得到 imported 变量名集合

我们需要关心 `import` 语句有：
```javascript
import lodash from 'loadsh'
import { extend, cloneDeep as clone } from 'lodash'
```
而对于 `import 'babel-polyfill'` 语句，则不关心。

以 `import { extend, cloneDeep as clone } from 'lodash'` 为例，得到的 AST 为：
<img src="http://obu9je6ng.bkt.clouddn.com/FmoMJFEwtRgN9pPLZeQW2-wmuFC-?imageslim" width="475" height="329"/>

其中的数组 `specifiers` 为：
<img src="https://i.loli.net/2017/11/30/5a201ece80d93.jpg" width="356" height="505"/>

所以我们只需要得到 `specifiers` 中的 `local.name` 即可，单为了后续对该 AST 结点进行操作(删除)，所以也需要存储结点信息，如下代码：

```javascript
function getSpecifierIdentifiers(specifiers = [], withPath = false) {
  const collection = []
  function loop(path, index) {
    const node = path.node
    const item = { path, name: node.local.name }
    switch (node.type) {
      case 'ImportDefaultSpecifier':
      case 'ImportSpecifier':
        collection.push(item)
        break;
    }
  }
  specifiers.forEach(loop)

  return collection
}
```

以上代码将返回 
```javascript
[
  { path: NodePath, name: 'extend' },
  { path: NodePath, name: 'clone' }
]
```
得到该条 `import` 语句的引入的变量数组后，还需要存储一份 `import` 语句的 NodePath，为了后续操作(删除)
```javascript
{
  'extend': {
    parent: path, // `import` 语句的 NodePath
    children: [
      { path: NodePath, name: 'extend' },
      { path: NodePath, name: 'clone' }
    ],
    data: { path: NodePath, name: 'extend' }
  },
  'clone': {
    parent: path,
    children: [
      { path: NodePath, name: 'extend' },
      { path: NodePath, name: 'clone' }
    ],
    data: { path: NodePath, name: 'clone' }
  }
}
```

#### 去除使用过的 imported 变量名
在去除使用过的 imported 变量名之前，需要明确一点：  
在 ES6 标准中，import 中定义的变量名是不能被重新定义的，如下代码是不被允许的。
```javascript
import _ from 'lodash'
const _ = 'hello'
```

那么什么情况下 `extend` 是被使用的呢？
```javascript
extend = 'extend'
[ extend ]
{ key: extend }
extend - 2
extend / 2
extend > 2
extend <= 2
extend['key']()
extend.key = 233
extend.key > 233
<extend />
<A data={extend} />
// ...
```
情况太多了 :cry:
既然正面列举被使用的情况比较复杂，那何不逆向思维，考虑 `extend` 没被使用的情况呢？
```javascript
const extend = 'value'
{ extend: 'value' }
ref.extend
class A { 
  extend() {}
  extend = 233
}
<Component extend={233} />
```
果然情况就好多了嘛 :smile:

于是，去除使用过的 imported 变量名也可以欢快地完成啦！

#### 移除没有使用到的 `import ...` 语句

1. 遍历最终得到的没有使用到变量集合 A；
2. 如果 item 中的 `children` 中每一个 `name` 都存在于 A 中，删除 `item.parent` 结点，否则只删除 `item.data.path` 结点；

### 打完收工！

完成了上面一系列的分析后，得到的最终插件代码大概这个样子：
```javascript
module.exports = {
  pre() {
    this.runtimeData = {}
  }
  visitor: {
    ImportDeclaration(path, data) {
      const locals = getSpecImport(path);
      if (locals) {
        locals.forEach((pathData, index, all) => {
          const {name} = pathData
          this.runtimeData[name] = {
            parent: path,
            children: all,
            data: pathData
          }
        })
        // 跳过当前path的子节点的向下遍历
        // 为了防止遍历 import 语句中的 Identifier
        path.skip()
      }
    },
    Identifier() {
      // 书写步骤2逻辑，删除使用过的Identifier
    },
    JSXIdentifier() {
      // 书写步骤2逻辑，删除使用过的Identifier  
    }
  },
  post() {
    // 书写步骤3逻辑
    delete this.runtimeData
  }
}
```

以上代码咋看一下逻辑的确没问题。   
**但是！**搭配`preset-es2015`使用时，将会不能正确删除未使用的变量名或者 import 语句。  
报错：`NodePath has been removed so is read-only. `
因为 es2015 中会将 import 语句进行替换，相当于存储的 NodePath 已经被删除了。

关于Babel中plugin和preset的执行顺序，官方的解释如下：
> Plugins run before Presets.  
> Plugin ordering is first to last.  
> Preset ordering is reversed (last to first).

既然 Plugins run before Presets，那为什么还会有上诉的问题呢？

Babel的核心开发人员 @hzoo 做出下列解释:
> Plugins do go before presets, but it just adds the same visitors first before merging them.

意思是，Babel 在处理 plugins 的时候，会将 visitor 里面各个对应的单元统一合并，然后再按照插件的顺序去执行。

<img src="http://obu9je6ng.bkt.clouddn.com/FmNs17OZT1JSki4bVtVQ0Tepxk5P?imageslim" width="501" height="139"/>

所以在执行到 post() 方法时，其实es2015中的插件已经将 import 语句替换了 :cry:

那么该问题如何解决呢？

可以 AST 最外层的 Program 结点遍历 path，逻辑同上。

最终代码为：
```javascript
const traverseObject = {
  ImportDeclaration(path, data) {
    // ...
  },
  Identifier() {
    // ...
  }
  JSXIdentifier() {
    // ...
  }
}

module.exports = function (babel) {
  return {
    pre(path) {
      this.runtimeData = {}
    },
    visitor: {
      Program(path, data) {
        // 在最外层的 Program 遍历 path
        path.traverse(traverseObject, {
          runtimeData: this.runtimeData
        })
        handleRemovePath(this.runtimeData)
      }
    },
    post() {
      delete this.runtimeData
    }
  }
}
```

## 参考资料

- [Discussion: Fix Plugin Ordering #5623](https://github.com/babel/babel/issues/5623)  
- [babel handbook](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)





