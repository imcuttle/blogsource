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

### "``" 与 $()

指令运行输出结果赋值给某变量
    
    files=(*); echo ${files[@]} # or ${files}
    echo $(ls)
    echo `ls`
    
### 通配符

在 Unix 文件系统中，有 `*`、`?`、`[]`

    echo /usr/*    # * 配对任意长，任意字符
    echo /usr/li?  # ? 配对一个字符
    echo /usr/li[a-z]


### `? : ` 三目运算符

    ((x = 2>0?123:456)); echo $x

### `$$`

    echo $$;   # process ID
    
### `{}` 扩充

`{}` 内不允许任何空格，除非是转义后或是引号内

1. 字符串组合
        echo \"{These,words,are,quoted}\"   # " prefix and suffix
        # "These" "words" "are" "quoted"
        
        cp file22.{txt,backup}
        # Copies "file22.txt" to "file22.backup"
        
        echo {a..z} # a b c d e f g h i j k l m n o p q r s t u v w x y z
        # Echoes characters between a and z.
        echo {0..3} # 0 1 2 3
        # Echoes characters between 0 and 3.
        base64_charset=( {A..Z} {a..z} {0..9} + / = )
        
        echo {file1,file2}\ :{\ A," B",' C'}
        # file1 : A file1 : B file1 : C file2 : A file2 : B file2 : C
        echo {file1,file2} :{\ A," B",' C'}
        # file1 file2 : A : B : C
    
2. 代码块
    ```bash
    #!/bin/sh
    # readfile line by line
    File=${me=`basename "$0"`}
    {
        read line1
        read line2
    } < $File
    echo "First line in $File is:"
    echo "$line1"
    echo
    echo "Second line in $File is:"
    echo "$line2"
    ```
    ```bash
    #!/bin/sh
    # output save to out.html
    {
        echo "<html>"
        echo "<head></head>"
        echo "<body><h1>Output</h1></body>"
        echo "</html>"
    } > out.html
    
    open out.html
    ```
    
    


