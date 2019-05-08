import SplitFrame from '@/about-snap-fade-away/split-frames'

const duration = '2.5s'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const raf = ms => new Promise(resolve => requestAnimationFrame(resolve))

export default class extends SplitFrame {
  async initialize() {
    await super.initialize()
    await this.onAfterInitialized()
  }

  setUpEachCanvas(node, i) {
    if (i !== 0) {
      Object.assign(node.style, {
        position: 'absolute',
        left: '0',
        top: '0'
      })
    }

    Object.assign(node.style, {
      border: 'none',
      transition: `transform ${duration} ease-out ${i /
        this.frameCount}s, opacity ${duration} ease-out`,
      userSelect: 'none',
      pointerEvents: 'none',
      opacity: 1,
      transform: 'rotate(0deg) translate(0px)'
    })
  }

  async onAfterInitialized() {
    // 根据不同 method 触发动画
    switch (this.state.method) {
      case 'setTimeout': {
        await delay()
        break
      }
      case 'RAF': {
        await raf()
        break
      }
      case 'RAF*2': {
        await raf()
        await raf()
        break
      }
      case 'GCS-layout': {
        getComputedStyle(this.nodeRef).margin
        break
      }
      case 'GCS-painting': {
        getComputedStyle(this.nodeRef).transform
        break
      }
      case 'offsetLeft': {
        this.nodeRef.offsetLeft
        break
      }
    }

    this.animate()
  }

  state = {
    ...super.state,
    key: 0,
    method: null
  }

  animate = () => {
    this.canvasNodes.forEach((item, i) => {
      if (i !== 0) {
        let base = i % 2 === 0 ? 1 : -1
        let tx = base * Math.random() * i
        let rotate = -base * i * Math.random()
        item.style.transform = `rotate(${rotate}deg) translate(${tx}px)`
      }
      item.style.opacity = 0
    })
  }

  reset = (method) => () => {
    this.setState(
      ({ key }) => ({ key: key + 1, method }),
      () => {
        this.initialize()
      }
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.reset(null)}>Use *nothing*</button>
        <button onClick={this.reset('setTimeout')}>Use setTimeout</button>
        <button onClick={this.reset('RAF')}>Use requestAnimationFrame</button>
        <button onClick={this.reset('RAF*2')}>Use requestAnimationFrame * 2</button>
        <button onClick={this.reset('GCS-layout')}>Use getComputedStyle layout</button>
        <button onClick={this.reset('GCS-painting')}>Use getComputedStyle painting</button>
        <button onClick={this.reset('offsetLeft')}>Use offsetLeft</button>
        <div key={this.state.key}>{super.render()}</div>
      </div>
    )
  }
}
