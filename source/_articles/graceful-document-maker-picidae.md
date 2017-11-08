---
title: 优雅的文档生成器 —— Picidae
datetime: 2017-11-07 19:15:56
---

## Picidae 的前世

![](https://i.loli.net/2017/11/07/5a01cf65f08b3.jpg)

- 万恶之源  
    还得回到百度面试的时候，当时一面面试官建议我多写写个人（技术）博客，当时我就被忽悠到了，说完就用Hexo造了一个博客。  
    从此便一发不可收拾，啥破事小事鸟事都喜欢往上面BB。  
    ![](https://i.loli.net/2017/11/07/5a01ae6932978.jpg)
    
- 自我的挣扎  
    由于感受到了Webpack+React搭建SPA的优质体验，于是撸了个[Moka ](https://github.com/imcuttle/moka)出来，类Hexo的静态单页博客生成工具。
    ![](https://i.loli.net/2017/11/07/5a01b0438ea5b.jpg)
    其中的数据通讯是用的静态JSON文件，但是为了图方便和实现简单，将**所有**的md文章都存到一个文件中；而且使用Hash作为路由，这对于爬虫是不友好的。 (:fearful:这是一个很！不！好！的实现)

- 挣扎+1  
    鉴于Moka的两点致命的实现方式，最终还是被我扼杀在摇篮里；  
    接着第二胎则是[个人同构博客](https://github.com/imcuttle/isomorphic-blog) (同构：一份代码同时可以运行在node和browser环境中)。  
    使用同构技术可以实现服务器渲染（Server Side Render - SSR），使用 Express 做 HTTP 服务也可以颗粒化markdown的数据。  
    但该博客不具有通用性，需要个人服务器。
    
- 升华！  
    Picidae 出生！  
    Picidae 全方位地超越了他的哥哥姐姐们，单页 + 高度定制化 + SEO 于一身

## Picidae 的今生

Picidae 继承了 Hexo 的自动化构建，插件化的定制设计；同时学习了 Moka 的单页特性。  
不仅如此，Picidae 保证了 code split 和 SEO 的优质体验。

### Picidae 能做什么

- [个人博客:kissing_smiling_eyes:](https://imcuttle.github.io)  
    :point_right: SPA + SEO + sitemap.xml/robots.txt
- [ERP 公共组件库](http://origin.eux.baidu.com:8110/demo-v2-picidae/comps/button)  
    - [picidae-transfomer-file-syntax](https://github.com/picidaejs/picidae-transformer-file-syntax)
    - [picidae-transfomer-style-loader](https://github.com/picidaejs/picidae-transformer-style-loader)
    - [picidae-transfomer-less-loader](https://github.com/picidaejs/picidae-transformer-less-loader)
    - js-runnable
    - [picidae-transfomer-react-render](https://github.com/picidaejs/picidae-transformer-react-render)
- ...

### 为什么Picidae这么叼

看懂下图你也能跟picidae一样nb了 :running:
![](https://i.loli.net/2017/11/07/5a01c6630dc5f.jpg)

### 秀一波操作 :tongue:

#### 安装/使用
<iframe width="854" height="480" src="https://www.youtube.com/embed/zHrFPTQ-2v0" frameborder="0" gesture="media" allowfullscreen></iframe>

#### Transformer 的使用  
<iframe width="854" height="480" src="https://www.youtube.com/embed/cnLSxesDt1U" frameborder="0" gesture="media" allowfullscreen></iframe>

#### Picidae Build
<iframe width="854" height="480" src="https://www.youtube.com/embed/AmX3L9oh9tk" frameborder="0" gesture="media" allowfullscreen></iframe>

#### Picidae 配置

```js
module.exports = {
    // 更新webpack的配置
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    // picidae start 服务的端口
    port: 9999,
    // 与webpack中publicPath概念相同
    publicPath: '/picidaejs/public/',
    // 配置的主题
    theme: '../theme',
    // 文档的根目录
    docRoot: './docs',
    // build后资源放置的根目录
    distRoot: './public',
    // 模板的根目录，其中html模板为 templateRoot 下的index.html
    templateRoot: './templates',
    // build过程中额外的资源，将会被复制到distRoot
    extraRoot: './extra',
    // build 后产生 robots.txt 和 sitemap.xml 的 host
    host: 'http://imcuttle.github.io',
    // 写文档的时候，符合什么规则的文件改动后触发热更新
    hotReloadTests: [/\.jsx?$/],
    // 主题的配置根目录
    themeConfigsRoot: './theme-configs',
    // docRoot中被排除的规则，可以是 RegExp | String | (filename) => exclude
    excludes: [/example/, /api/, /\/refs\//],

    transformers: [
        'picidae-transformer-react-render?lang=render-jsx', 'picidae-transformer-file-syntax',
        './test/style-loader?lang=style'
    ],

    commanders: [
        '../commanders/new?title=abc',
        '../commanders/preview',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}
```

### 来一波星星

[Picidae:+1:](https://github.com/picidaejs/picidaejs)