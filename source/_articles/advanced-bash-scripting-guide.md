---
title: （译）进阶Bash Script指南
date: 2017-01-24 20:42:54
categories:
tags: [bash, 翻译]
cover:
skip: true
---

原文：[Advanced Bash-Scripting Guide](http://www.tldp.org/LDP/abs/abs-guide.pdf)

只做部分翻译，一些个人遗漏的点。


### 关于脚本头

Bash 中头部 `#!` ，如果没有用上 Bash 专用的语法（比如 A=abc，赋值语句），是可以被不加上。

`#!/bin/sh` 调用的是默认的 Shell 解释器，在 Linux 中是 `/bin/bash`


### 参数个数到数组长度

下面脚本中，`$#` 是参数数组的长度，可以用下面脚本判断参数的输入
```sh
#!/bin/sh

E_WRONG_ARGS=85
script_parameters="-a -h -m -z"
Number_of_expected_args=1
# -a = all, -h = help, etc.
if [ $# -ne $Number_of_expected_args ]
then
 echo "Usage: `basename $0` $script_parameters"
 # `basename $0` is the script's filename.
 exit $E_WRONG_ARGS
fi
```

上面例子可以看到`#`可以表示一个数组（字符串）的长度，如下例

    arr=(a b c) && str=string && echo ${#arr}-${#str} # 3-6

