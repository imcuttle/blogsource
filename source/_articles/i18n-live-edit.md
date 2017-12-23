---
title: 国际化可视化编辑
datetime: 2017-12-21 09:42:58
categories:
tags:
keywords: [i18n live edit]
cover:
---

## 痛点
前端技术栈：React + Mobx
国际化解决方案：通过一个全局的 translate 方法输入对应翻译译文的 key

如：现在的中文的英文翻译字典数据有，
```js
// zh-CN
{
    cuttle: '墨鱼'
}

// en-US
{
    cuttle: 'imcuttle'
}
```
依次在中英文环境下调用 `translate('cuttle')` 会分别返回 `'墨鱼'` `'imcuttle'` 字符串，所以如果需要修改中文环境中可见文本 `墨鱼` 的译文，则需要：  

1. js 源码中找到 Key：`cuttle`   
2. 在中英文字典数据文件中修改 `cuttle` 对应的 value

**而我们会在步骤 1 花费比较多的时间！**

其次：目前部分的国际化字典由前端来维护，添加 FE 的（无意义）工作量

## 解决方案
考虑一种可以在线编辑的模式，既方便前端修改，又方便 PM 对国际化文本进行修改；同时这种在线编辑模式的实现又需要兼容 `translate` API 的使用

<img src="https://i.loli.net/2017/12/21/5a3bb22977eed.jpg" width="1193" height="461"/>
<img src="https://i.loli.net/2017/12/21/5a3bb24eb7359.jpg" width="1069" height="543"/>

### 思路一：输出 React Element

```js
function newTranslate(key) {
    const raw = translate(key)
    const ele = <i18n>{raw}</i18n>
    // ele.toString = function () {return raw}
    // 不能扩展 toString 方法
    
    
    return new Proxy(ele, {
        get() {
            // 拦截 toString
            ...
        }
    })
}
```

这种方式够简单明了，但是有一个致命的缺陷：破坏了原有的 DOM 结构

### 思路二：输出带数据的特殊 Object

```js
function newTranslate(key) {
    const rlt = new String(key)
    // typeof rlt === 'object'
    rlt['__i18n__'] = { raw, key }
    return rlt
}
```
该方法不会破坏原有的 DOM 结构；同时需要拦截 React.createElement 方法

```js
const createElement = React.createElement
function newCreateElement (name, props, ...children) {
    // DOM Component
    if (typeof name === 'string') {
        for (var key in props) {
            const value = props[key]
            if (value instanceof String && value['__i18n__']) {
                // 检查到经过 translate 处理
                // 记录 value['__i18n__'] 中的 id
                ...
            }
        }
        
        children.forEach(child => {
            // 对 child 处理逻辑同上
        })
        
        // 之前检查到了有 translated 
        if (validate) {
            props.className =  props.className + ' i18n-badge'
            
            const onMouseEnter = props.onMouseEnter
            props.onMouseEnter = function () {
                // ... 交互逻辑
                
                return onMouseEnter.apply(this, arguments)
            }
        }
    }
    
    return createElement(name, props, ...children)
}

```


最后效果参考:
https://demo.crowdin.com/profile/demo

## 提问环节
- 前端页面修改结果，在不刷新页面的情况下，如何同步至页面？
-  怎么解决 `translate('a') + translate('b')` 的检测