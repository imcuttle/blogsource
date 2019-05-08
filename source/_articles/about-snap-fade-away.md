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

## about-snap-fade-away

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
            <div ref={ref => this.nodeRef = ref}>
                <h2>Bye bye</h2>
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
