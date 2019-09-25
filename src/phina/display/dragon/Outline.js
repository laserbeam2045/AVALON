import * as phina from 'phina.js'
import MyShape from '../MyShape'

// ドラゴンの輪郭クラス
// 必須引数：
// lineData(座標オブジェクト)
export default phina.define('Outline', {
  superClass: MyShape,

  init (lineData) {
    const { dropSize, lineType, x, y } = lineData
    this.superInit({
      width: dropSize,
      height: dropSize,
    })
    this.dropSize = dropSize
    this.lineType = lineType
    this.moveTo(x, y).$_rotate()
  },

  postrender () {
    this.$_drawOutline(12, 12, 'rgba(255,215,0,0.7)')
    this.$_drawOutline(8, 12, 'rgba(255,255,255,0.5)')
    this.$_drawOutline(3, 12, 'black')
  },

  // 胴体の輪郭線を描画するメソッド
  $_drawOutline (lineWidth, offset, color) {
    const canvas = this.canvas,
          val_0 = -this.dropSize / 2,
          val_1 = -offset,
          val_2 = 0,
          val_3 = offset,
          val_4 = this.dropSize / 2

    canvas.shadowColor = 'rgb(255, 255, 255)'
    canvas.shadowBlur = 5
    canvas.lineCap = 'round'
    canvas.lineWidth = lineWidth
    canvas.strokeStyle = color

    switch (this.lineType) {
    // 最初または最後の直線（横）
    case 1: case 2: case 3: case 4:
    case 5: case 6: case 7: case 8:
      canvas.drawLine(val_0, val_1, val_2, val_1)
      canvas.drawLine(val_0, val_3, val_2, val_3)
      break
    // 端から端までの直線（横）
    case 9: case 10: case 11: case 12:
      canvas.drawLine(val_0, val_1, val_4, val_1)
      canvas.drawLine(val_0, val_3, val_4, val_3)
      break
    // 円弧（右上）
    case 13: case 14: case 15: case 16: 
    case 17: case 18: case 19: case 20:
      canvas.moveTo(val_0, val_3).quadraticCurveTo(val_1, val_3, val_1, val_4)
      canvas.moveTo(val_0, val_1).quadraticCurveTo(val_3, val_1, val_3, val_4).stroke()
      break
    }
    return this
  },

  // 線の種類に応じて回転させるメソッド
  $_rotate () {
    switch (this.lineType) {
    case 2: case 6: case 17: case 18:
      this.setRotation(180)
      break
    case 3: case 7: case 11: case 12: case 15: case 16:
      this.setRotation(90)
      break
    case 4: case 8: case 19: case 20:
      this.setRotation(270)
      break
    }
    return this
  },
})