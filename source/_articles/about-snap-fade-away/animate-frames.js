import SplitFrame from '@/about-snap-fade-away/split-frames'

const duration = '1.5s'

export default class extends SplitFrame {
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

  state = {
    ...super.state,
    key: 0
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

  reset = () => {
    this.setState(
      ({ key }) => ({ key: key + 1 }),
      () => {
        this.initialize()
      }
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.animate}>Animate It!</button>
        <button onClick={this.reset}>Reset!</button>
        <div key={this.state.key}>{super.render()}</div>
      </div>
    )
  }
}
