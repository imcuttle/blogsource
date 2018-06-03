---
title: 如何录制命令行交互？
datetime: 2018-06-03 20:23:47
---

使用 Mac 的同学需要先安装 [brew](https://brew.sh/)，
然后使用 brew 安装 [asciinema](https://github.com/asciinema/asciinema) 即可

    brew install asciinema
    
    # 开始录制屏幕，数据放在 local.json 中
    asciinema rec local.json
    
执行 `asciinema rec` 后，便可以在当前会话中演示你的命令行交互了，最后 Ctrl + D 结束录制即可，local.json 文件就保存了我们的命令行交互记录。

然后还需要安装 [svg-term-cli](https://www.npmjs.com/package/svg-term-cli)，用于转换 `local.json` 到 svg

    npm install -g svg-term-cli
    
    cat local.json | svg-term --height=40 --out=svg.svg --window
    
最终录制的效果如下图，瞬间高大上：

![](./how-to-record-command-line.svg)
