---
title: Babel插件开发
datetime: 2017-10-22 20:00:58
categories:
tags:
cover:
---

Babel是什么我就不多介绍了，不懂的同学百度或者谷歌一下。

Babel的插件工作原理就是将ast(语法分析树)，按照ast的规则，进行转换。

[AST Expolorer](http://astexplorer.net/#/Z1exs6BWMq) 提供是一个线上AST预览的环境，包括Javascript、css...语言的AST预览

其中babel的ast词法语法分析树的产生是来自开源项目 [babylon](https://www.npmjs.com/package/babylon).


...后面有空，比较有兴致的时候再来完善 :dash:

## 开发实践

- [babel-plugin-tiny-import](https://github.com/imcuttle/babel-plugin-tiny-import)

## 参考学习

[Babel 插件手册](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-babel-traverse)