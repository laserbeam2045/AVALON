import * as phina from 'phina.js'
import MyShape from '../MyShape'

// 開始位置指定の直線クラス
export default phina.define('Triangle', {
  superClass: MyShape,

  init (baseDropSize, offsetY, strokeColor, fillColor) {
    this.superInit({
      width: baseDropSize,
      height: baseDropSize,
    })
    phina.display.TriangleShape({
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 1,
      radius: 2,
    })
    .moveTo(0, offsetY)
    .addChildTo(this)
  },

  setAlpha (alpha) {
    this.children[0].alpha = alpha
    return this
  },
})