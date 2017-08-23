---
title: markdown导入doc核心算法剖析
date: 2017-08-22 09:32:02
categories:
tags:
cover:
keywords:
---

## 算法需要做什么事情

- Input -> Output  
    将原始的markdown文本解析成为一颗树形结构。
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

## 树形数据结构的储存方式

简单的有两种(Java 代码，针对于**单棵树**)

1. 多叉树  
    ```
        root
    /   |  \
    a1   a2   a3
    |    / \    \
    null b1  b2   b3
        |     \     \
        null   null   null
    ```

    ```java
    class TreeNode {
        TreeNode[] children;
        Object value;
        // 可有可无
        TreeNode parent;
    }

    class Tree {
        TreeNode root;
    }
    ```

2. 一维数组  
    ```
    {}:          {}:        {}:        {}:        {}:        {}:         ...
    pid: null    pid: 0;    pid: 0;    pid: 0;    pid: 2;    pid: 2;
    val: root;   val: a1;   val: a2;   val: a3;   val: b1;   val: b2;   
    ```

    其中节点id是数组中的索引位置。  
    这种方式相比于多叉树方法，逻辑更简单，但是对于父子之间的关系联系没有多叉树"密切"。

    ```java
    class Node {
        Object value;
        int parentId;
    }
    ```

## 思考

最后树的存储方式使用的是**一维数组**，更多的原因是doc本身用的就是这种方式传参。

下面较为详细地解释解析markdown文本的算法。  

**注意：以下语法解析单元均是以行为单位**
1. 首先需要"拎出"会产生父子关系的语法  
    形如:
    ```
    # Head

    ## child of Head

    - Disorder  Item A
        child of Item A
    - Disorder  Item B

    1. Order Item 1
        child of Item 1
    2. Order Item 2
    ```

2. "拎出"多行的语法块  
    形如:
    ````
    ```
    int a = 123;
    ```

    > BlockQuote line1
    > BlockQuote line2
    ````
3. "拎出"空行  
    因为空行可能是区分父子关系的依据
    
    ```
    - item a

        child of a

      i'm child of a

    i'm not child of a

    - item b
        child of b

        i'm child of b


    i'm not child of b
    ```

4. 匹配一些无关的语法行

### 一些特殊情况

1. 列表的父子关系区分  
    ```
    - a                a
    - b                b 
     - c         ->     \- c
      - d               |   \- d
     - e                |- e
    ```

    ```
    - c                c
      - d        ->     \- d
     - e                    \- e
    ```

2. 标题的父子关系区别（较列表简单）  
    ```
    # a           a
    ### b          \- b
    ## c     ->    |- c
    ## d           |- d
    # e           e  
    ```

[源码实现](https://github.com/imcuttle/doc-md-import/blob/master/lib/parser-factory/md-to-tree.js)