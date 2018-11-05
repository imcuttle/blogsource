---
title: 本地实时书写 markdown + 同步定位修改节点
datetime: 2018-11-05 11:06:45
keywords:
  - markdown
  - live
---

## 前言
16 年在 SF 中发布了文章 ["探究SegumentFault Markdown编辑器"](https://segmentfault.com/a/1190000006260582)，目的是仿 SF 线上书写 Markdown 文档的体验：**高亮定位修改节点**

在上述文章中的工具已经不再维护（😢代码写太乱），而且是在浏览器中书写 markdown 文本。

于是现在使用全新的思路实现了一个：**在本地任意编辑器书写 markdown，同时同步定位修改节点** 工具 [live-markd](https://github.com/imcuttle/live-markd)

预览效果如图:  
![](https://i.loli.net/2018/11/05/5bdfb82f1239d.gif)

## 如何使用

1. 安装 nodejs 环境，如已经有则跳过此步

2. 全局安装 `live-markd`  
  ```bash
  npm install live-markd -g
  ```

3. 进入到 markdown 文件目录
  ```bash
  live-markd path/to/markdown
  ```

## 如何实现

### 如何实现修改节点的检测

使用 [remark](https://github.com/remarkjs/remark) 解析 markdown，得到 [markdown 抽象语法树](https://github.com/syntax-tree/mdast) 

如下例子，现在有两个 markdown 文件 `old.md` 和 `new.md`

- `old.md`
  ```markdown
  # hi
  world
  ```

- `new.md`
  ```markdown
  # hi
  world!
  ```

可以看到 `new.md` 相比于 `old.md` 最后多了 `!` 

进一步的，对比两个 markdown 文本的语法树

```javascript
// old.md
{
  type: 'root',
  children: [
    {
      type: 'heading',
      depth: 1,
      children: [{
        type: 'paragraph',
        children: [{ type: 'text', value: 'world' }]
      }]
    }
  ]
}

// new.md
{
  type: 'root',
  children: [
    {
      type: 'heading',
      depth: 1,
      children: [{
        type: 'paragraph',
        children: [{ type: 'text', value: 'world!' }]
      }]
    }
  ]
}
```

然后分别对两个树结构进行 DFS，依次对比节点，判断出第一个不同的节点即可，最后对修改的节点注入 class，最后转换成带 class 的 html
```javascript
{
  hProperties: {
    className: ['detected-updated']
  },
  type: 'paragraph',
  children: [{ type: 'text', value: 'world!' }]
}
```
```html
<h1>hi</h1>
<p class="detected-updated">world!</p>
```

当然，以上 markdown 比对工作由 [detect-one-changed](https://github.com/imcuttle/detect-one-changed) 完成

### 如何实现数据推送

live-markd 使用 服务器推送（EventStream）来实现客户端和服务端的长连接，就如 [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware) 实现，只有单向的服务端向客户端的数据推送。同时为了让服务器知晓客户端是否还存在，还具有每隔 30s 的心跳检测，用于及时回收服务端资源。

![](https://i.loli.net/2018/11/05/5bdfd3b887888.png)

#### 客户端

在客户端只需要接受服务器推送数据即可
```javascript
// 建立连接
const source = new EventSource(location.pathname + '?sse=on')
source.addEventListener('message', function(ev) {
  let data = {}
  try {
    data = JSON.parse(ev.data)
  } catch (e) {}

  if (data.type === 'change') {
    document.querySelector('.markdown-body').innerHTML = data.value
    const node = document.querySelector('.markdown-body .detected-updated')
    if (node) {
      // 定位
      node.scrollIntoView({ behavior: 'smooth' })
    }
  }
})
```

同时注入高亮样式：
```css
@keyframes bling {
  from {
    background-color: #d9edf7;
  }
  to {
    background-color: #d9edf7;
  }
}
.markdown-body .detected-updated {
  animation: bling 2.5s 1;
}
```

## 最后

在 [mdx](https://github.com/mdx-js/mdx) 生态中，该功能也能够被使用，详见 [detect-one-changed](https://github.com/imcuttle/detect-one-changed)

在 [mdx-go](https://github.com/jxnblk/mdx-go/pull/22) 和 [docz](https://github.com/pedronauck/docz/pull/433) 中都已经提供 PR 以引入该书写体验！等待作者的回复。

欢迎大家 Star :+1:！
- [live-markd](https://github.com/imcuttle/live-markd) - GitHub markdown 风格本地实时书写 markdown + 同步定位修改节点
- [detect-one-changed](https://github.com/imcuttle/detect-one-changed) - Markdown / Html 修改检测