import * as phina from 'phina.js'
import MyShape from '../MyShape'

// 開始位置指定の直線クラス
export default phina.define('Line', {
  superClass: MyShape,

  init (baseDropSize, radius, lineLength, color1, color2) {
    this.superInit({
      width: baseDropSize,
      height: baseDropSize,
    })
    this.$_y0 = radius - (lineLength / 2)
    this.$_y1 = radius + (lineLength / 2)
    this.$_color1 = color1
    this.$_color2 = color2
  },

  postrender () {
    this.$_drawLine('round', 2, this.$_color1)
    this.$_drawLine('butt', 1, this.$_color2)
  },

  // 直線を描画するメソッド
  $_drawLine (lineCap, lineWidth, color) {
    const canvas = this.canvas

    canvas.lineCap = lineCap
    canvas.lineWidth = lineWidth
    canvas.strokeStyle = color
    canvas.drawLine(0, this.$_y0, 0, this.$_y1)
  },
})