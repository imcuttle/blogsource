---
title: [项目] Offer入职项目复盘 (余聪)
datetime: 2018-01-02 21:27:42
---

## i18n

我的 i18n 从无到有的过程如下：  
1. 提取需要翻译的 i18n (含中文) 文本  
    使用方法:  
     `matriks2 gen-zh src/frontend/OfferHandling/**/*.js > zh_list.js`
2. PM 提供翻译完成的 excel 文件（或者其他格式）
3. 利用 tingcen 的 [cyou-i18n](https://www.npmjs.com/package/cyou-i18n) 批量替换 `_i('xxx')`
4. 后续部分的修改利用**i18n在线编辑**修改（可以提供给PM）  
    使用方法：
    - 在url上加上`?i18n-edit-live=true` 或者 `localStorage.setItem('i18n-edit-live', true)`, 然后刷新页面
    - 默认只在 **生产环境** 中生效


## [待加入种子工程] 深链及其相关 hoc/decorator/models

### HOC

|名|描述|使用|参数|
|--|-----|---|--|
|lazy-render|延迟渲染，可以用于Loading的渲染，延迟500ms，才真正显示Loading| `@lazyrender(timeout: number)`|timeout: 800|
|uncontrolled|用于非控制组件，绑定componentWillReceiveProps，同步props到state| `@uncontrolled(...name: oneOfType([array, string))`|name: 需要绑定的props的keyName，可以是string，array；如需将props.a 同步到 state.b，则传入['a', 'b']|
|style-useable-hmr|起初使用该hoc是为了解决样式的HMR问题，主要在生命周期中绑定style.use/unuse方法|`@suh(style: object)`|style: usable 的 style 对象|
|state-in-out|将State或者new State传入，并加上一些与视图绑定的生命周期钩子，state实例中应该有`init/update/exit`方法对应View层中的`componentWillMount/componentWillReceiveProps/componentWillUnmont`|`@sio(ClassOrInstance, name: string, initialData)`|ClassOrInstance可以是方法或者State实例；name是绑定在View中的key名，默认为`localState`|

**注意：** state-in-out中的`init/update/exit`方法是下面decorator autorun/url-sync 的前提条件

### decorator

|名|描述|使用|参数|
|-|----|----|---|
|url-sync|深链: 在state中需要init/update/exit来同步视图的生命周期。同时提供在react View中使用的decorator|`@urlsync(rename: string, { initialWrite: false }) prop = 'xx'`|rename: 重命名，默认为prop名；initialWrite: 是否初始是写在url上|
|autorun| 对mobx的封装，加上了dispose的生命周期控制，要求同url-sync。同时提供在react View中使用的decorator|`@autorun method(dispose) {}`|dispose: 调用dispose 会销毁该autorun，初始dispose为undefined|

### models

|名|描述|使用|
|-|----|----|
|Root|提供`toJSON/setValue/assignShallow/assign/init/exit`方法| `class State extends Root`|

## [待加入种子工程] babel-preset-es2015-ie

兼容 ie>=9 环境下的 babel 插件预设。  
可能会遇到的坑：
https://www.npmjs.com/package/babel-plugin-transform-es2015-classes#loose

## [待加入种子工程] ie9-polyfill

1. ie9 不能使用 `console.log.apply`
2. ie9 不能使用[dom4](https://www.w3.org/TR/dom/)标准的方法属性，如classList

```html
<!--[if lte IE 9]>
    <script src="../extra/ie9-polyfill.js"></script>
<![endif]-->
```

## 关于urlUtils

1. 新增 `parse(parseQuery = true)` 方法，返回 `{query, path, module}`，parseQuery表示是否调用parseQuery解析query
2. 新增 `parseQuery(query)` 方法，解析querystring到object
3. 修改 linkPrivate 方法，加上了 location.search 的拼接

## [待加入种子工程] react-routes-loader

简化书写routes规则，同时很方便的自动加上chunkname。之前的繁琐写法如下：

```javascript
function getComponent(location, callback) {
  require.ensure([], function() {
     callback(null, require('Page').default)
  }, 'chunkname')
}
```

源码见[async-router-loader](https://github.com/picidaejs/picidae-backstage-system/blob/master/src/frontend/node_modules/%40rd/async-router-loader/index.js)

使用方法参见：
1. [require书写](https://github.com/picidaejs/picidae-backstage-system/blob/21c1b86fdc6475b1bd780f03f307f4735692442e/src/frontend/index.js#L29)
2. [routes.js书写](https://github.com/picidaejs/picidae-backstage-system/blob/21c1b86fdc6475b1bd780f03f307f4735692442e/src/frontend/main/routes.js#L1-L22)

## [待加入种子工程] extra html/css/js minify

思路：之前是直接将extra的资源copy至dist下；现在提供一个`cp-flow`，主要是读取文件内容，做一些转换过程后，再把最终的数据送至目的地。目前支持两种转换过程 (fileTransform/chunkTransform)。

- fileTransform  
  数据处理的单元为文件
- chunkTransform  
  数据处理的单元为数据片段

我们使用fileTransform来处理css/html/js资源的minify操作。  
可以考虑放到plugin做（代码改动较大）：[copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)

## gka -> 序列帧生成动画

[gka](https://github.com/gkajs/gka) 只需一行命令，快速生成动画文件，支持效果预览。

U同学提供动画序列帧，通过gka指令生成 canvas/css3/svg... 动画代码和雪碧图，

结合 [PreloadJS](https://github.com/CreateJS/PreloadJS) 得到加载图片资源的进度

## swagger 插件

安装chrome扩展：[暴力猴](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=zh-CN)

之后安装该脚本：https://greasyfork.org/zh-CN/scripts/36982-swagger-ui-v1

## [待加入种子工程] webpack loader相关

- babel-loader  
  1. [babel-plugin-danger-remove-unused-import](https://github.com/imcuttle/babel-plugin-danger-remove-unused-import)
  2. [babel-plugin-tiny-import](https://github.com/imcuttle/babel-plugin-tiny-import)
  
- less-reference-import-loader  
  自动为 `*.use.less` import 添加上 `(reference)`

## [待加入种子工程] Picidae相关

```bash
# @todo: 考虑把 picidae 配置和依赖放置 erp-comps-demo repo 下？
#        更加增强了耦合度
# @todo: 有需要的同学自行进入erp-comps-demo，npm install -D
npm install
npm run picidae-start # 开启picidae服务
```

更多关于Picidae: https://github.com/picidaejs/picidaejs


