---
title: 如何实现 “灭霸” 响指动效
datetime: 2019-05-08 14:29:02
---

<style>
    .transformer-react-render {
        border: 1px dashed #959da5;
        border-radius: 5px;
        display: block;
    }
</style>

## 效果一瞥

使用 [snap-fade-away](https://github.com/imcuttle/snap-fade-away) 能够直接灭霸动效

```react?placement=top
import snapFadeAway from 'snap-fade-away'

export default class extends Component {
    state = {
        animating: false
    }
    nodeRef;

    fadeAway = async () => {
        this.setState({animating: true})
        await snapFadeAway(this.nodeRef)
        this.setState({animating: false})
    }

    reset = () => {
        this.nodeRef.style.visibility = 'visible'
    }

    render() {
        return <div>
            <button disabled={this.state.animating} onClick={this.fadeAway}>FadeAway</button>
            <button disabled={this.state.animating} onClick={this.reset}>Reset</button>
            <div style={{textAlign:"center"}} ref={ref => this.nodeRef = ref}>
                <h4>Bye bye</h4>
                <p> imcuttle 🐟 </p>
                <img src="data:image/jpeg;base64,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"/>
            </div>
        </div>
    }
}
```

### 实现原理

下面说明一下 snap-fade-away 的实现要点

#### 首先进行 “DOM粒子化分割”

把输入的 DOM 元素转换为 canvas 画布，得到图像像素点数据，进而进行粒子化分割，如下效果展示:
其中红色表示**原DOM元素**；绿色表示**转换后的canvas**；蓝色表示**被粒子分割的n个canvas**，同时点击蓝色块可以聚合或分离，点击可以聚合在一起查看效果。

```react?placement=top
@./about-snap-fade-away/split-frames.js@
```

#### 进行动画

然后使用你喜欢的方式来随意定义你的动画吧! 下面例子是使用 transition 实现。

```react?placement=top
@./about-snap-fade-away/animate-frames.js@
```

#### 如何进行动画触发

先看一个例子，如下代码执行会有什么效果呢？
```javascript
dom.style.opacity = 0
dom.style.transition = 'opacity 1s ease'

dom.style.opacity = 1
```

在书写上述动效的时候遇到一个问题，如何*立即*进行动画的触发呢？

下例子分别对各种情况进行了实践

```react?placement=top
@./about-snap-fade-away/animate-methods.js@
```

在第五届 CSS 大会中，就有大佬分享过该 topic
- [使用一次RAF](https://birtles.github.io/cssconf2019/index.zh.html#/css-transitions-attempt-one)
- [使用两次RAF](https://birtles.github.io/cssconf2019/index.zh.html#/css-transitions-panel-attempt-two)
- [使用getComputedStyle](https://birtles.github.io/cssconf2019/index.zh.html#/css-transitions-panel-attempt-three)

## 实际应用

趁着复仇者联盟4的上映，Google 也即时加上了彩蛋，[在 Google 搜索 “Thanos” （灭霸）](https://www.google.com/search?q=thanos&oq=thanos&aqs=chrome..69i57j69i59j69i64j69i61l3.3236j0j8&sourceid=chrome&ie=UTF-8)，点击金手指出现动效

![](https://i.loli.net/2019/05/09/5cd30fd64cdaf.png)
