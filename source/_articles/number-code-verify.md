---
title: 数字验证码识别
datetime: 2016-07-25 00:06:44
categories: [图像处理]
tags: [图像处理,后端]
---

# VerifyCode

Java 实现的数字验证码识别, ...准确率不是很高, 模式识别和去噪处理的不是很好, 但学习入门已经够了，

而且！！！已经运用至之前做的教务系统的验证码识别
<!--more-->
整体的流程结构

<img src="http://obu9je6ng.bkt.clouddn.com/FjF5YYLISm4gTezikrNep3RISdDW?imageslim" alt="ClipboardImage" width="823" height="595" />

# 识别思路

首先，得到图片数据，如

<img src="http://obu9je6ng.bkt.clouddn.com/Fq0DWmDYGc-hjV-gW7UJArsx2ClO?imageslim" alt="ClipboardImage" width="66" height="26" />

然后我试着对图片进行各种处理，比如...

1. 变成灰化图
<img src="http://obu9je6ng.bkt.clouddn.com/FubU9uTrN3cnPhPnuO5bOQykn5eG?imageslim" alt="ClipboardImage" width="66" height="26" />

2. 去噪...好像效果不明显
<img src="http://obu9je6ng.bkt.clouddn.com/Ft_mbtLqREICr8bOaFyi5zEC0W2b?imageslim" alt="ClipboardImage" width="66" height="26" />

3. 对灰化图去噪
<img src="http://obu9je6ng.bkt.clouddn.com/FosHgQkXuW3B-xmlrhUK6aqYfeIC?imageslim" alt="ClipboardImage" width="66" height="26" />

4. 灰化图转成二值图（阈值128）
<img src="http://obu9je6ng.bkt.clouddn.com/Fm7deFoygmibuLpMu3fD87I6_Pjn?imageslim" alt="ClipboardImage" width="66" height="26" />

5. 原图转成二值图（阈值128）
<img src="http://obu9je6ng.bkt.clouddn.com/Fm7deFoygmibuLpMu3fD87I6_Pjn?imageslim" alt="ClipboardImage" width="66" height="26" />

6. 对二值图膨胀运算
<img src="http://obu9je6ng.bkt.clouddn.com/FhITj_7bt_Wq_h1p8TeThRlaL3Wi?imageslim" alt="ClipboardImage" width="70" height="30" />

7. 对二值图腐蚀运算
<img src="http://obu9je6ng.bkt.clouddn.com/Fjgst5D9y5GEDzhmDlyyn7EZomQs?imageslim" alt="ClipboardImage" width="70" height="30" />

8. 对二值图开运算 (先腐蚀后膨胀)
<img src="http://obu9je6ng.bkt.clouddn.com/FhJ9RJll2ol5i2imagXHgvQSNPib?imageslim" alt="ClipboardImage" width="70" height="30" />

9. 对二值图闭运算 (先膨胀后腐蚀)
<img src="http://obu9je6ng.bkt.clouddn.com/FrdLH6OY1OsJ8v11HhpaiON_q43d?imageslim" alt="ClipboardImage" width="70" height="30" />

多次实验对比后，发现还是对原图的二值化图最好处理。

然后，便是将图片中的数字分割为固定大小的图片（固定大小是为了后续的模式学习与识别）

其实在这里我可以使用一种比较无赖的方式处理，将这种有规律的数字验证码按照像素点位置进行分割，

但是这样做就没意思了...，所以我选择了用深度优先搜索算法（利用堆栈结构，如果递归，会导致栈溢出），

并且带标记（防止重复处理处理过的点），将八连通的集合分割出来

<img src="http://obu9je6ng.bkt.clouddn.com/FkK1GV7Np4iV8QNWLqvupBvPD9S3?imageslim" alt="ClipboardImage" width="427" height="347" />

<img src="http://obu9je6ng.bkt.clouddn.com/Fu5_Ay5Jkg1eiU6i4X5vpNOU3krr?imageslim" alt="ClipboardImage" width="632" height="530" />

效果如下

<img src="http://obu9je6ng.bkt.clouddn.com/FgwUfefH7e0ruE-yCg4iVDnlNFwN?imageslim" alt="ClipboardImage" width="10" height="16" />

<img src="http://obu9je6ng.bkt.clouddn.com/FrQ5LqtTGxpX7vPTxSRkAtpYQUzV?imageslim" alt="ClipboardImage" width="8" height="16" />

<img src="http://obu9je6ng.bkt.clouddn.com/FkhARQBT0IdX6-S2euZ7i0pHH42X?imageslim" alt="ClipboardImage" width="11" height="16" />

<img src="http://obu9je6ng.bkt.clouddn.com/FlXueQN2XdLsPvHne09vp7Bczmo4?imageslim" alt="ClipboardImage" width="11" height="16" />

当然二值图中的噪点会影响字符的划分

最后便是模式识别算法的选择了，我没有选中书上与网上说的基于向量距离的方法，而是自己想了一个方法，所以识别能力有限...

思路是：先将将一些已知数字的样本进行存储为一串字符串，白色存为"0"，黑色为"1"

效果如下

<img src="http://obu9je6ng.bkt.clouddn.com/FkB74y5to0WAqFUxD9Ot8NiDmmd4?imageslim" alt="ClipboardImage" width="10" height="16" />

```
0111111111
0111111111
0111111111
1100000011
1000000011
0000000110
0000000110
0000001100
0001001100
0000001100
0000011000
0000011000
0000011000
0000110000
0000110000
0000110000

```

<img src="http://obu9je6ng.bkt.clouddn.com/Fh2IM_GGns3WCSWAQ_FKWEyiij5s?imageslim" alt="ClipboardImage" width="10" height="16" />

```
0000000110
0000000110
0000001110
0000011110
0000101110
0001001110
0001001110
0010001110
0100001110
1000001110
1111111111
1111111111
0000001110
0000001110
0000001110
0000001110

```

将图像编码完成后，对比待识别图片与10种数字样本之间字符"1"的位置吻合度，最高的即为识别出来的数字

<img src="http://obu9je6ng.bkt.clouddn.com/Fv0mcAA5fwfpfmtsEeuDVIccS3ev?imageslim" alt="ClipboardImage" width="697" height="523" />

但是这种方法容易将3，5，8识别错误，或者因为分割的不成功而导致的识别错误。

最后！提下Node调用Java的方法

目前我用的是`child_process`创建新进程，在新进程调用Java，传人图片文件地址进行处理。

但是！这种方法每次都需要重新启动Java，训练样本需要重新载入，效率是个问题。

2016/07/25更新!!! 改用 `WebService` 进行通信!

# 代码地址
- Java源码
    [VerifyCode](https://github.com/moyuyc/VerifyCode)

- 一键查分（运用该技术）
    [njnu-quick-get-score](https://github.com/moyuyc/njnu-quick-get-score)

# 参考资料

形态学运算

http://blog.csdn.net/bagboy_taobao_com/article/details/5574159
http://blog.csdn.net/hellousb2010/article/details/37939809

字符分割

https://www.zhihu.com/question/19702292
http://www.voidcn.com/blog/beechina/article/p-5761020.html

PDF 299 模式识别
