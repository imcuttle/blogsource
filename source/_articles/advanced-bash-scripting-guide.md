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
    

### 脚本的执行方法

比如有`sh scriptname.sh` `bash scriptname.sh`，当然还有 `sh < scriptname.sh`  ( 这种方法不建议，因为不能在脚本中读 `stdin` )。最方便的方法还是，直接用`chmod`变成可执行（executable）文件。

    chmod 555 scriptname # readable/executable for all
    chmod +rx scriptname # readable/executable for all
    chmod u+rx scriptname # readable/executable for user

### 字符 `#`

1. 普通字符`#`
        echo "hello\n# comment\nworld" | \
        sed -e '/#/d' | # 删除带有`#`字符的行 \  
        tr -d '\n' | # 删除换行符 \   
        sed -e 's/world/,Bash scripting/g'  # 字符替换

2. 字符串匹配
        str=abc123456123ABC
        echo ${str#*123}  # 删除 str 中匹配*123的 最短匹配
        echo ${str##*123} # 删除 str 中匹配*123的 贪心匹配
3. 数字表达式
        echo $((2#101011))  # 二进制的101011

### 字符 `;`

在同一行中执行多条指令

    echo one; echo two
    
    if [ true ]; then  # ; 不能少, if/then 两条指令
        echo "true statement"
    fi
    
### 双分号 `;;`

在 case 选项中

    variable=abc
    case "$variable" in
        abc)  echo "\$variable = abc" ;;
        xyz)  echo "\$variable = xyz" ;;
    esac
    
### 逗号 `,`

字符串的拼接

    ls /usr{,/lib} # 列出 `/usr` 和 `/usr/lib` 下的文件
    
### 冒号 `:`

nop 操作，空操作，退出状态为0

    not-exist-command; echo $?
    
    not-exist-command; :; echo $?

P11

