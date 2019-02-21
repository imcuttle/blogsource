---
title: 多叉树的差异对比算法与应用
date: 2019-02-21T03:17:59.426Z
---
## 问题

netify !!

在书写 markdown 文本的时候，为了追求好的体验，需要在 markdown 预览页面中，高亮且定位在正在编辑的节点上，如图

![](https://i.loli.net/2018/10/28/5bd58a95c6b7d.gif)

很显然，这个问题需要转换成两颗树（抽象语法树）的差异对比，

## 思考

如例子，将树 A 与树 B 对比，相对于树 A 来说，它的哪些节点有改动呢？

<p align=center><img src=https://i.loli.net/2019/02/04/5c581a4fc921f.png /></p>
<center>树 A</center>

<p align=center><img src=https://i.loli.net/2019/02/04/5c581a856fab4.png /></p>
<center>树 B</center>

那么首先对于某节点来说，有哪些类型的改动呢？

* 更新 (updated)
* 删除 (removed)
* 某节点存在新增的子节点 (has-added-child)
* 存在子节点被更新（包括存在子节点被删除、新增、更新） (child-changed)

对于树 A 来说，其节点的更改类型如下图，

![](https://i.loli.net/2019/02/07/5c5c4341682fe.png)

<!-- <p align=center><img src=https://i.loli.net/2019/02/04/5c581c6eae424.png /></p> -->

<center>树 A 的节点更改类型</center>

### 算法

#### 基本概念

* **E(A)**：表示树 A 的 E 节点  
* **Paths(E(A))**: E(A) 节点的路径\
  从 A(A)（根节点）向下寻找 F(A) 节点，经过 B(A) 节点和 F(A) 节点，其中 B(A) 在相对于 A(A) 索引 0 的位置，F(A) 在相对 B(A) 索引 1 的位置，所以
  **Paths(F(A)) = \[0, 1]**
* **向上回溯**：从节点往上依次寻找祖先节点

#### 流程描述

1. 对树 A 进行后续遍历
2. 遍历 X(A) 节点，根据 Paths(X(A)) 寻找到 Y(B)，若未找到 Y(B)，X(A) 标记为 removed，并且向上回溯，标记 child-changed；若找到，进行对比。若节点内容不同，标记为 updated，并且向上回溯，标记 child-changed；若 X(A) 孩子数小于 Y(B) 孩子数，标记为 has-added-child，并且向上回溯，标记 child-changed

<!-- !\[](https://i.loli.net/2019/02/07/5c5c43ada9545.png) -->

![](https://i.loli.net/2019/02/07/5c5c44497df63.png)

<!-- <p align=center><img src=https://i.loli.net/2019/02/04/5c5855f115cb4.png /></p> -->

<center>树 A 和树 B 对比流程示意</center>

以上，只需要遍历一遍树 A (O(n)) 即可标记出所有的变化信息，但是在根据树 A 节点寻找对应树 B 节点需要 O(lgn) \~ O(n) 时间复杂度，所以最终的时间复杂度未 O(nlgn) \~ O(n^2)，下面将会讲述如何优化寻找对应树 B 节点的时间复杂度。

#### 根据路径寻找节点时间的优化

还是以上面的例子为例，在第一次遍历中，需要根据路径 `[0, 0]` 定位 E(B)；第二次遍历中，根据路径 `[0, 1]` 定位 null，**但其实这个时候，我们应该是知道路径 `[0]` 和 `[0, 0]` 对应树 B 上的节点**，所以快捷使用 `[0]` 路径对应的树 B 节点，然后再定位至 `[0, 1]` 节点即可，以上便是动态规划 (Dynamic programming) 的思想。

## 实现与应用

* [detect-tree-changed](https://github.com/imcuttle/detect-tree-changed) - 多叉树的差异对比
* [detect-one-changed](https://github.com/imcuttle/detect-one-changed) - 检测 html 和 markdown 第一个更新的 ast 节点
* [live-markd](https://github.com/imcuttle/live-markd) - Github Favorite Markdown preview with live rendering & location and highlight changed block.
* [picidae](https://github.com/picidaejs/picidaejs) - The document generator which has gentle experience.
