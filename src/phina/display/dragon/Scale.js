import * as phina from 'phina.js'
import MyShape from '../MyShape'

// ドラゴンの鱗クラス
// 必須引数：
// lineData(座標オブジェクト)
export default phina.define('Scale', {
  superClass: MyShape,

  init (lineData) {
    this.superInit({
      width: lineData.dropSize,
      height: lineData.dropSize,
    })
    this.lineData = lineData
  },

  postrender () {
    this.$_drawScale().$_transform()
  },

  // V字型の鱗の線を描画するメソッド
  $_drawScale () {
    const canvas = this.canvas
    const offsetX = 13
    const offsetY = 13

    canvas.lineCap = 'round'
    canvas.lineJoin = 'miter'
    canvas.lineWidth = 1.5
    canvas.strokeStyle = '#000'
    canvas.shadowBlur = 3
    canvas.shadowColor = 'rgb(255, 215, 0)'
    canvas.moveTo(-offsetX, -offsetY)
          .quadraticCurveTo(0, 0, 0, offsetY)
          .quadraticCurveTo(0, 0, offsetX, -offsetY)
          .stroke()

    return this
  },

  // 線の種類に応じて移動・回転させるメソッド
  $_transform () {
    const { dropSize, lineType } = this.lineData
    const offset = dropSize * 0.132  // 増やすほど内周寄りになる
    const offsetAngle = 4            // 増やすほど内周に傾きが増す

    switch (lineType) {
    case 3: this.setRotation(90); break
    case 4: this.setRotation(135 + offsetAngle).moveBy(-offset, offset); break
    }
    return this
  },
})