---
title: "告别庞大 PSD，轻松测量尺寸"
datetime: 2018-09-18 22:37:29
categories:
tags: [psd, measure, 测量, 前端, 切图]
---

## 起因
作为前端工程师，日常开发离不开 psd 文件。

但是日常开发的一个小弹窗页面，它的 psd 居然需要 **30+Mb**，所以经常得定期清理 psd...

对于我一个 PS 小菜鸡来说，用 PSD 无非只是需要用来度量元素大小（元素间距），查看属性等简单的功能。

## 思考，对比
相对比于 sketch，sketch 具有 [sketch-measure](https://github.com/utom/sketch-measure)，设计师导出成静态资源给前端即可。

![](https://i.loli.net/2018/09/18/5ba0be21d368f.png)

对于 PSD 来说，市面上已经有如 pxcook / lanhuapp，体验也很不错，但是需要下载 U 同学提供的 (庞大的) psd 才能进行标注体验。

而且有时候还是需要 U 同学给(庞大的) PSD 文件，我们才能在 pxcook / lanhuapp 中自动标注。

于是鉴于以上，考虑做一个开源项目，类似于 sketch-measure， 定位为 psd-measure。


## 效果展示

[DEMO](https://imcuttle.github.io/measure/)

![](http://obu9je6ng.bkt.clouddn.com//1537411054.png?imageMogr2/thumbnail/!100p)

[源码](https://github.com/imcuttle/measure)



### 命令行

我们也可以使用命令行来导出页面标注

bash
```
npm i measure-export-cli -g
# 开启服务，在线预览 `path/to/psdDir` 下的 psd
measure-export start path/to/psdDir
# 构建 `path/to/psdDir` 下的 psd 至 `dist` 文件目录
measure-export build path/to/psdDir
```

### Chrome 插件

提供 Chrome 插件，当我们点击 psd 链接时候跳出 Measure UI，而不是下载 PSD，当然我们也可以点击右上方的下载进行下载。

![](https://i.loli.net/2018/09/24/5ba8bd6ba8f09.png)

#### 安装
  1. 下载扩展，[点击下载](https://github.com/imcuttle/measure/raw/master/packages/chrome-extension-measure-viewer/measure-viewer.zip)
  2. 打开 Chrome 扩展页面： chrome://extensions/
  3. 拖拽下载的包至页面中进行安装
    ![](https://i.loli.net/2018/09/24/5ba8bdd4c9096.png)
  4. 出现该图标表示安装完成
    ![](https://i.loli.net/2018/09/24/5ba8be05d9f9a.png)

## 设计与实现

流程如下：

![](http://obu9je6ng.bkt.clouddn.com/psd-measure.svg)


### PSD 文件格式介绍

![](https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/images/PhotoshopFileFormatsStructure.gif)

- File Header（定长）             主要包括这个 psd 文件整体的数据，如版本，尺寸大小，图片通道数，使用的颜色类别（rgb、cmyk...）
- Color Mode Data Section（变长） 主要是部分颜色类型图片需要用到
- Image Resources（变长）         放置一些外部的图片资源
- Layer and Mask（变长）          放置图层和蒙层的各种信息，大小位置，字体，描边等等
- Image Data（变长）              放置图像像素数据

### PSD.js

使用 psd.js 便是解析上述文件结构，得到可读的数据结构。
其中 psd.js 使用 getter 得到懒解析数据，即如下代码：

```javascipt
const obj = Object.defineProperty({}, 'someParsedVal', {
  get: function () {
    if (!this._someParsedVal) {
      const afterMs = Date.now() + 3000
      while (true) {
        if (Date.now() >= afterMs) {
          this._someParsedVal = 'ok'
          break
        }
      }
    }
    return this._someParsedVal
  }
})

obj.someParsedVal // 3s 后出来
obj.someParsedVal // 很快
```

在 mobx3 中也有类似的设计（LazyInitializer）

### psd-html

将 PSD 解析为 [HAST]([hast-url])，进而转换为 HTML

#### HAST (HTML 抽象语法树)

如下 html：
```html
<a href="http://alpha.com" class="bravo" download></a>
```

对应 HAST 为
```json
{
  "type": "element",
  "tagName": "a",
  "properties": {
    "href": "http://alpha.com",
    "id": "bravo",
    "className": ["bravo"],
    "download": true
  },
  "children": []
}
```

#### 前后端同构

前后端同构的意思：同时运行在客户端和服务端，具体便是同时执行在浏览器环境和 nodejs 环境

实现前后端同构的一些常用方式，借助构建工具 browserify / rollup / webpack 来分别打包不同环境的 js

##### 模拟环境

- 在 nodejs 环境，对于 [nodejs built-in modules](https://www.w3schools.com/nodejs/ref_modules.asp) 不进行打包
- 在 browser 环境，则将预设的 built-in modules 打包进去，以及一些 global 变量（如 `process.env / __dirname`）也会进行 mock

#####  利用 变量替换 + treeshake 区分不同环境的代码

- 如 webpack 配置 `DefinePlugin`
  ```
  {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.RUN_ENV': JSON.stringify('browser')
      })
    ]
  }
  ```

- 在代码中对不同环境打包进行区分
  ```javascript
  module.exports =
    process.env.RUN_ENV === 'browser'
      ? {
          psdToHtml,
          psdToHtmlFromBuffer,
          psdToHtmlFromURL,
          psdToHAST,
          psdToHASTFromBuffer
        }
      : {
          psdToHtml,
          psdToHtmlFromPath,
          psdToHtmlFromBuffer,
          psdToHAST,
          psdToHASTFromBuffer,
          psdToHASTFromPath
        }
  ```

- 最终打包出来的 js 则会剔除掉 `psdToHASTFromPath` 相关代码

##### `package.json` 配置

如下：

```json
{
  "main": "dist/psd-html.cjs.js",
  "browser": "dist/psd-html.browser.cjs.js",
  "cdn": "dist/psd-html.browser.umd.min.js",
  "unpkg": "dist/psd-html.browser.umd.min.js"
}
```

- `main`: nodejs 环境加载的 js
- `browser`: browser 环境加载的 js
- `cdn`: 部分 cdn 服务加载的 js
- `unpkg`: unpkg cdn 服务加载的 js （主要使用 UMD 规范打包）

直接访问 https://unpkg.com/@moyuyc/psd-html 则会重定向至 https://unpkg.com/@moyuyc/psd-html@{latest-version}/dist/psd-html.browser.umd.min.js

### html-measure 交互

#### 布局定位

![](https://i.loli.net/2018/09/18/5ba0c06942981.png)

将 psd 导出成整个图片，利用每一个图层的定位和大小来自动标注。

#### 其他
2 个 div，相对与同一个父级的绝对定位，如何判断他们是否相交？

.
.
.
.
.
.
.
.
.
.

正面直接判断是很费力的，要考虑各种情况，这时候需要逆向思维，考虑不相交的情况。
这时候就简单了

不相交只要满足下面四种情况之一就可以

![](https://i.loli.net/2018/09/20/5ba2fd9e30a0b.png)

![](https://i.loli.net/2018/09/20/5ba2fe0ac7cd4.png)

```
function isIntersect(node1, node2) {
  const rect1 = node1.getBoundingClientRect()
  const rect2 = node2.getBoundingClientRect()
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  )
}
```

### measure-export(-cli) 

输入 psd / html 导出 `meas-ui` 静态资源，流程如图（区分 prod 和 dev 环境）

![](http://obu9je6ng.bkt.clouddn.com//measure-export(-cli).svg)

## Todo
- [ ] 提供 chrome 插件：当浏览器打开 psd 时候，渲染测量尺寸 UI

## 相关项目
- [@moyuyc/psd.js](https://github.com/imcuttle/psd.js) - 解析 psd 文件，格式化 (Forked from [psd.js](https://github.com/meltingice/psd.js))
- [@moyuyc/psd-html](https://github.com/imcuttle/measure/tree/master/packages/psd-html) - psd -> hast -> html
- [html-measure](https://github.com/imcuttle/measure/tree/master/packages/html-measure) - 标注交互
- [meas-ui](https://github.com/imcuttle/measure/tree/master/packages/meas-ui) - 前端 UI 展示，包含标注交互
- [measure-export(-cli)](https://github.com/imcuttle/measure/tree/master/packages/measure-export-cli) - 输入 psd / html 导出 `meas-ui` 静态资源

## 参考资料
- [Adobe Photoshop File Formats Specification](https://www.adobe.com/devnet-apps/photoshop/fileformatashtml) PS 文件格式官方标准
- [Photoshop Styles File Format](https://www.tonton-pixel.com/Photoshop%20Additional%20File%20Formats/styles-file-format.html#toc-parsing-styles-files)
- [JS. 如何判断两个矩形是否相交](https://zhuanlan.zhihu.com/p/29704064)
- [HAST]([hast-url])

[hast-url]: https://github.com/syntax-tree/hast
