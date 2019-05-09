import toCanvas from 'html2canvas'
import React from 'react'

const splitFrames = (canvas, frameCount) => {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  // 获取 canvas 的像素数据
  const originalFrame = ctx.getImageData(0, 0, width, height)

  const frames = new Array(frameCount).fill({}).map(() => ctx.createImageData(width, height))
  // 将原始的像素数据，随机分散到多个canvas上面，粒子化
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // 随机获取 像素对象
      const frameIndex = Math.floor(Math.random() * frameCount)
      // 当前的像素位置：通过 x、y 计算出当前遍历到哪个像素点，实际就是从左到右，一行一行的遍历
      const pixelIndex = 4 * (y * width + x)
      // 一个像素 rgba，所以需要设置 4 个值
      for (let z = 0; z < 4; z++) {
        frames[frameIndex].data[pixelIndex + z] = originalFrame.data[pixelIndex + z]
      }
    }
  }
  return frames
}

export default class extends React.Component {
  frameCount = 10
  canvasNodes = []

  componentDidMount() {
    this.initialize()
  }

  async initialize() {
    const container = this.containerRef
    const mirror = this.mirrorRef
    const node = this.nodeRef
    const canvas = await toCanvas(node)
    const frames = splitFrames(canvas, this.frameCount)

    mirror.appendChild(canvas)
    canvas.style.border = '1px solid green'
    canvas.style.marginBottom = '10px'

    this.canvasNodes = frames.map((item, i) => {
      const cloneNode = canvas.cloneNode(true)
      cloneNode.getContext('2d').putImageData(item, 0, 0)
      cloneNode.style.marginBottom = '4px'
      cloneNode.style.border = '1px solid blue'
      container.appendChild(cloneNode)

      this.setUpEachCanvas(cloneNode, i)
      return cloneNode
    })

  }

  setUpEachCanvas(cloneNode) {
    cloneNode.addEventListener('click', () => {
      if ('absolute' === cloneNode.style.position) {
        cloneNode.style.position = ''
        cloneNode.style.left = ''
        cloneNode.style.top = ''
      } else {
        cloneNode.style.position = 'absolute'
        cloneNode.style.left = '0'
        cloneNode.style.top = '0'
      }
    })
  }

  render() {
    return <div>
      <div style={{ border: '1px solid red', marginBottom: 10 }}>
        <div ref={r => this.nodeRef = r}>ABCDEFGHIJKLMNOPQRST 💯</div>
      </div>
      <div ref={r => this.mirrorRef = r}/>
      <div ref={r => this.containerRef = r} style={{ position: 'relative' }}>
      </div>
    </div>
  }
}
