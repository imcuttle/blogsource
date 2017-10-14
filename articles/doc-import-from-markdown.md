---
title: 导入markdown至树状文档
datetime: 2017-08-20 22:04:05
categories:
tags: [markdown, 编译原理]
cover:
keywords:
---

## 为什么有这个需求

1. 个人习惯于书写原生的Markdown（纯粹的文本编辑）。不需要记各种快捷键。
2. 书写原始 markdown 文件方便进行个人博客文章的部署和备份。
3. 方便将文章发布至其他平台（GitHub/SF...）

## 如何使用

[repo地址(doc-import-md)](https://github.com/imcuttle/doc-import-md)


- cli

```bash
npm i -g doc-import-md
docin -h
docin set-username <your name>
docin set-password

cat file/to/markdown | docin
```

- package  

```js
var DocImportMd = require('doc-import-md');
var import = new DocImportMd('username', 'pwd', 'address')
var markdown = '# H1\n ## hhh'

// new an document & push to server.
import
    .new(markdown, 'title')
    .then(function (listId) {

    });

// insert document to document
// which is already existed
import
    .insert('listId', markdown, 'parentId <maybe is null>').then(function (data) {
        // data.listId
        // data.nodeId // maybe undefined
    });

```

## 实现思路

````markdown
# A               ->  # A --- i'm an apple.
i'm an apple.             |-- i'm an egg.
i'm an egg.               |-- > ```
> ```                     |   > code A
> code A                  |   > ``` 
> ```                     \-- ## A-1 --- text in A-1 
                                     |-- 1. A-1-1
## A-1                               |      |-- description1 in A-1-1 
                                     |      \-- description2 in A-1-1
text in A-1                          |-- 2. A-1-2
                                     |-- 3. A-1-3
1. A-1-1                             |-- not description 
description1 in A-1-1                \-- ~~~\ncode\n~~~
description2 in A-1-1
2. A-1-2

3. A-1-3


not description

~~~
code B
~~~
````

上面为 markdown 的输入和需要输出的中间数据结构。

1. #难点 解析 Markdown 文本（借助亮亮的 [TokenParserV2](https://github.com/imcuttle/doc-import-md/blob/master/lib/TokenParser.js)设计）得到[树形数据结构](https://github.com/imcuttle/doc-import-md/blob/master/lib/parser-factory/md-to-tree.js)。

2. 分析 doc.eux 的传参规则. [code](https://github.com/imcuttle/doc-import-md/blob/master/lib/actions.js)

3. 进行 登录 -> 新建文章 -> 修改文章名 -> 添加内容节点. [code](https://github.com/imcuttle/doc-import-md/blob/master/index.js)

## Todo

- 加入 `doc -> md` 的方向，与 `md -> doc` 互逆

- 同构 request 实现  浏览器端的支持

- 考虑后续加入项目配置 `.docinrc`

    ```js
    // 后续提交 `docRoot` 下的`*.md` 文件
    // git可以自动同步至doc
    {
        "docRoot": "./doc",
        "docAddress": "....",
        "user": {...}
    }
    ```