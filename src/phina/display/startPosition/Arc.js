import * as phina from 'phina.js'
import MyShape from '../MyShape'

// 開始位置指定の円弧クラス
export default phina.define('Arc', {
  superClass: MyShape,

  init (baseDropSize, radius, offset, color1, color2) {
    this.superInit({
      width: baseDropSize,
      height: baseDropSize,
    })
    this._startAngle = (0 + offset) * Math.PI / 180
    this._endAngle = (90 - offset) * Math.PI / 180
    this._radius = radius
    this._color1 = color1
    this._color2 = color2
  },
  postrender () {
    this._drawArc('round', 2, this._color1);
    this._drawArc('butt', 1, this._color2);
  },
  // 円弧(右下)の線を描画するメソッド
  _drawArc (lineCap, lineWidth, color) {
    const canvas = this.canvas;

    canvas.shadowColor = 'rgb(36,84,145)'
    canvas.shadowBlur = 3
    canvas.lineCap = lineCap
    canvas.lineWidth = lineWidth
    canvas.strokeStyle = color
    canvas.strokeArc(0, 0, this._radius, this._startAngle, this._endAngle)
  },
})