---
title: 高度内容自适应的 textarea
author: teeeemoji
datetime: 2018-04-12
cover: http://upload-images.jianshu.io/upload_images/4217515-6fd8b07173997039.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
---

# 高度内容自适应的 _textarea_

## 背景介绍

正如我们所知道的 _textarea_ 是一个行内块元素 `display: inline-block` 并且它的默认宽高由 cols & rows 决定, 也就是说 _textarea_ 的 height 并不会自适应于内容长度.

> **_textarea_ 的宽高是如何决定的?**
>
> 参考文章: http://www.zhangxinxu.com/wordpress/2016/02/html-textarea-rows-height/

那么, 我们今天的任务就是来思考如何创建一个 **高度内容自适应的 _textarea_ 组件**.

我将介绍三种思路实现 **高度内容自适应的 _textarea_**.

这三种思路的 React 组件实现代码如下:

> [https://github.com/teeeemoji/textareaAutoSizeSolutions](https://github.com/teeeemoji/TextareaAutoSizeSolutions)

所有参考链接*(锚点失效, 参考链接在最后)*

## 方案概要

这是三种方案的概述和实现思路的简介, 实现方案 & 遇到的坑 & 拓展知识点, 点击 _(查看更多)_ or 直接看 [teeeemoji 的 demo](https://github.com/teeeemoji/TextareaAutoSizeSolutions).

- 方案一两次调整 `textarea.style.height`

        *textarea* 的 onchange 触发 resize 方法
        下面是 resize 方法的逻辑
        ① textarea.style.height = 'auto';// 让 textarea 的高度恢复默认
        ② textarea.style.height = textarea.scrollHeight + 'px';// textarea.scrollHeight 表示 *textarea* 内容的实际高度

- 方案二: 利用一个 ghostTextarea 获得输入框内容高度, 再将这个高度设置给真实的 _textarea_

  _textarea_ 构建时创建 ghostTextarea, onchange 触发 resize 方法
  ① 创建 _textarea_ 的时候, 同时创建一个一模一样的隐藏 ghostTextarea;
  ② ghostTextarea 的属性全部克隆自 _textarea_, 但是 ghostTextarea 是**隐藏**的, 并且 ghostTextarea.style.height = 0; 也就是说 ghostTextarea.scrollHeight 就是 _textarea_ 中内容的真是高度
  resize 方法处理流程
  _ step-1: textarea.value 先设置给 ghostTextarea,
  _ step-2: 拿到 ghostTextarea.scrollHeight \* step-2: 将 textarea.style.height = ghostTextarea.scrollHeight

* 方案三: 使用 (div | p | ...).contenteditable 代替 _textarea_ 作为输入框
  div 是块级元素, 高度本身就是内容自适应的(除非设置 _max-width_ or _min-widht_
  使用 contenteditable 让 div 代替 _textarea_, 省去各种计算高度的逻辑

## 方案对比

满分 3 分, 三种方案通过优化, 在用户体验和兼容性上都能达到满分. 因此差别仅仅在于这几个方案的实现难度. (仅仅是基于 react 组件的实现复杂度).

用户体验对比*(在最后面, 简书对 markdown 内嵌 html 支持不友好, 锚点都不能用了)*

    |方案对比|
    -|-|-|-|--
    方案|用户体验|兼容性|易用性|综合评价
    方案一| 3| 3|3|10
    方案二| 3| 3|1|7
    方案三| 3| 3|2|8

毫无疑问方案一是最优选择, 多加 1 分以示奖励;

## 方案一: 两次调整 textarea.style.height

### 实现思路

1. 渲染一个 _textarea_ 元素

```
<textarea
    ref={this.bindRef}
    className={style['textarea'] + ' ' + className}
    placeholder={placeholder}
    value={value}
    onChange={this.handleChange} // 看这里
/>
```

2. _textarea_ 的 onChange 事件触发 resize

```
handleChange(e) {
    this.props.onChange(e.target.value);
    this.resize();	// 看这里
}
```

3. reize 事件的实现

```
// 重新计算 textarea 的高度
resize() {
    if (this.inputRef) {
        console.log('resizing...')
        this.inputRef.style.height = 'auto';
        this.inputRef.style.height = this.inputRef.scrollHeight + 'px';
    }
}
```

4. 注意 componentDidMount 的时候, 执行一次 resize 方法, 初始化 _textarea_ 的高度哦.

### 优化点

#### 避免两次渲染,造成内容抖动

在 react 中, 组件 receiveProps 的时候会 render 一次, 直接调整 _textarea_ 的 height 也会浏览器的重绘.那么就会造成两次重绘, 并且两次重绘的时候, _textarea_ 的内容可能会发生抖动.

**优化思路**

先触发 resize 后触发 render \*\*用最简单的思路完美解决问题

## 方案二: 利用一个 ghostTextarea 获得输入框内容高度, 再将这个高度设置给真实的 _textarea_

### 实现思路

* 同时渲染两个 _textarea_, 一个真实 _textarea_ 一个隐藏 _textarea_

```
return (
    <div className={style['comp-textarea-with-ghost']}>
        <textarea // 这个是真的
            ref={this.bindRef}
            className={style['textarea'] + ' ' + className}
            placeholder={placeholder}
            value={value}
            onChange={this.handleChange}
            style={{height}}
        />
        <textarea // 这个是 ghostTextarea
            className={style['textarea-ghost']}
            ref={this.bindGhostRef}
            onChange={noop}
        />
    </div>
)
```

* 初始化的时候拷贝属性
  初始化必须使用工具方法将 _textarea_ 的属性拷贝到 ghostTextarea 去. 因为 _textarea_ 的样式再组件外也能控制, 因此初始化的时候 copy style 是最安全的
  **这是所以要拷贝的属性的列表**

   const SIZING_STYLE = [
  'letter-spacing',
  'line-height',
  'font-family',
  'font-weight',
  'font-size',
  'font-style',
  'tab-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'box-sizing'
  ];
  **这是 ghostTextarea 的隐藏属性列表**
  const HIDDEN_TEXTAREA_STYLE = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0',
  };
  这是拷贝 style 的工具方法
  // 拿到真实 textarea 的所有 style
  function calculateNodeStyling(node) {
  const style = window.getComputedStyle(node);
  if (style === null) {
  return null;
  }
  return SIZING_STYLE.reduce((obj, name) => {
  obj[name] = style.getPropertyValue(name);
  return obj;
  }, {});
  }
  // 拷贝 真实 textarea 的 style 到 ghostTextarea
  export const copyStyle = function (toNode, fromNode) {
  const nodeStyling = calculateNodeStyling(fromNode);
  if (nodeStyling === null) {
  return null;
  }
  Object.keys(nodeStyling).forEach(key => {
  toNode.style[key] = nodeStyling[key];
  });
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(key => {
  toNode.style.setProperty(
  key,
  HIDDEN_TEXTAREA_STYLE[key],
  'important',
  );
  });
  }

- _textarea_ 的 onChange 事件
  先 reize 再触发 change 事件
  handleChange(e) {
  this.resize();
  let value = e.target.value;
  this.props.onChange(value);
  }

- _textarea_ 的 resize 方法

        resize() {
            console.log('resizing...')
            const height = calculateGhostTextareaHeight(this.ghostRef, this.inputRef);
            this.setState({height});
        }

- calculateGhostTextareaHeight 工具方法
  先将内容设置进 ghostTextarea, 再拿到 ghostTextarea.scrollHeight
  export const calculateGhostTextareaHeight = function (ghostTextarea, textarea) {
  if (!ghostTextarea) {
  return;
  }
  ghostTextarea.value = textarea.value || textarea.placeholder || 'x'
  return ghostTextarea.scrollHeight;
  }

### 优化点

#### 避免两次渲染,造成内容抖动

    在 react 中, 组件 receiveProps 的时候会 render一次, 给 *textarea* 设置 height 属性也会浏览器的重绘.那么就会造成两次重绘, 并且两次重绘的时候, *textarea* 的内容可能会发生抖动.

_下面两种思路, 再 demo 中均有体现_

**优化思路一: 合并祯渲染**

使用 window.requestAnimationFrame & window.cancelAnimationFrame 来取消第一祯的渲染, 而直接渲染高度已经调整好的 _textarea_;

**优化思路二: 减少渲染次数**

利用 react 批处理 setState 方法, 减少 rerender 的特性;
在 _textarea_ onChange 方法中同时触发两个 setState;
<img src="http://upload-images.jianshu.io/upload_images/4217515-05b7453c02c59c1a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="123.png" width="1240" height="339" />

### 更多优化思路

* 页面存在多个 _textarea_ 的时候, 能不能考虑 复用同一个 ghostTextarea

## 方案三: 使用 div.contenteditable 代替 _textarea_

### 实现思路

* 渲染一个 div.contenteditable=true
  return (

    <div className={style['comp-div-contenteditable']}>
      <div
          ref={this.bindRef}
          className={classname(style['textarea'], className, {[style['empty']]: !value})}
          onChange={this.handleChange}
          onPaste={this.handlePaste}
          placeholder={placeholder}
          contentEditable
      />
  </div>
  )

* 获取 & 设置 编辑去呀的内容
  _textarea_ 通过 textarea.value 来取值 or 设置值, 但换成了 div 之后, 就要使用 div.innerHTML or div.innerText 来取值 or 设置值.
  使用 div.innerHTML 会出现以下两种问题:
  _ & 会被转码成 &amp ;
  _ 空白符合并
  使用 div.innerText 在低版本 firfox 上要做兼容处理.

      	因此使用哪种方式**主要看需求**.

* placeholder 的实现
  div 的 placeholder 属性是无效, 不会显示出来的, 现存一种最简单的方式, 使用纯 css 的方式实现 div 的 placeholder
  .textarea[placeholder]:empty:before { /_empty & before 两个伪类_/
  content: attr(placeholder); /_attr 函数_/
  color: #555;
  }

### 优化点

#### 去除支持富文本

div.contenteditable 是默认支持富文本的, 可能会以 _粘贴_ or _拖拽_ 让输入框出现富文本;
<img src="http://upload-images.jianshu.io/upload_images/4217515-942edb0bb73b3810.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="234.png" width="786" height="325" />

监听 div 的 onPaste 事件

```
handlePaste(e) {
    e.preventDefault();
    let text = e.clipboardData.getData('text/plain'); // 拿到纯文本
    document.execCommand('insertText', false, text); // 让浏览器执行插入文本操作
}
```

[**handlePaste 的更多兼容性处理**](http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)

## 几个大网站的高度自适应 _textarea_ 对比

我分别查看了[微博](weibo.com), [ant.design 组件库](ant.design), [知乎](www.zhihu.com) 的自适应输入框的实现.

### 微博: 采用方案二

未输入时

<img src="http://upload-images.jianshu.io/upload_images/4217515-ec0ae559ecac069f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="5aa4b41fdf0082f1c9.png" width="648" height="247" />

输入后

<img src="http://upload-images.jianshu.io/upload_images/4217515-6fd8b07173997039.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="5aa4b4517a668254df.png" width="639" height="344" />

但是微博的实现存在**用户体验**上的缺陷, **会抖动!!!**

<img src="http://upload-images.jianshu.io/upload_images/4217515-2bb4d2992db9c18f.gif?imageMogr2/auto-orient/strip" alt="weibo.git.gif" width="360" height="240" />

### ant.design: 采用方案二

体验超级棒哦

<img src="http://upload-images.jianshu.io/upload_images/4217515-614691d5b58f4e18.gif?imageMogr2/auto-orient/strip" alt="antd.gif" width="360" height="240" />

### 知乎: 采用方案三

看上去竟然存在 bug , 其实上面的截图也有

<img src="http://upload-images.jianshu.io/upload_images/4217515-3210eab87c15f92f.gif?imageMogr2/auto-orient/strip" alt="zhih.gif" width="360" height="240" />

## 参考链接列表

* [textarea mdn 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/textarea): 看看有哪些影响 textarea 宽高的属性
* [HTML textarea cols,rows 属性和宽度高度关系研究](http://www.zhangxinxu.com/wordpress/2016/02/html-textarea-rows-height/)
* [CSS Tricks](https://css-tricks.com/textarea-tricks/): textarea 使用上的小技巧. 一些样式技巧.
* [开源的 react auto resize textarea](https://andreypopp.github.io/react-textarea-autosize/): 一个更好的方案二的实现, 源码优雅短小
* [can i use 兼容性检查工具](www.caniuse.com): execCommand, innerText, requireAnimationFrame, 等等各种各样属性的兼容性检查
* [contenteditable MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)
* [一个方案三的实现, a good demo](https://gist.github.com/Schniz/e398a630c81cfd8a3d1e)
* [小 tip: 如何让 contenteditable 元素只能输入纯文本](http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)
