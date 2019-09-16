import * as phina from 'phina.js'
import MyShape from '../MyShape'

// ドラゴンの鱗クラス
// 必須引数：
// cdn(座標オブジェクト),
// dropSize(ドロップの大きさ)
export default phina.define('DragonScale', {
  superClass: MyShape,

  init (cdn, dropSize) {
    this.superInit({
      width: dropSize,
      height: dropSize,
    })
    this.moveTo(cdn.x, cdn.y)._rotate(cdn, dropSize)
  },

  postrender () {
    this._drawScale()
  },

  // V字型の鱗の線を描画するメソッド
  _drawScale () {
    const canvas = this.canvas
    const offsetX = 13
    const offsetY = 13
    const middleY = 3

    canvas.lineCap = 'butt'
    canvas.lineJoin = 'miter'
    canvas.lineWidth = 1.5
    canvas.strokeStyle = '#000'
    canvas.moveTo(0, offsetY).quadraticCurveTo(0, middleY, -offsetX, -offsetY).stroke()
    canvas.moveTo(0, offsetY).quadraticCurveTo(0, middleY,  offsetX, -offsetY).stroke()
  },

  // 線の種類に応じて移動・回転させるメソッド
  _rotate (cdn, dropSize) {
    const offset = dropSize * 0.135

    switch (cdn.lineType) {
    case 2: case 5: case 9:   // 横の直線（左から右）
      this.setRotation(90)
      break
    case 1: case 6: case 10:  // 横の直線（右から左）
      this.setRotation(-90)
      break
    case 4: case 7: case 11:  // 縦の直線（上から下）
      this.setRotation(180)
      break
    case 13:  // 円弧の右上（左から下）
      this.moveBy(-offset, offset)
      this.setRotation(135)
      break
    case 14:  // 円弧の右上（下から左）
      this.moveBy(-offset, offset)
      this.scaleX = -1
      this.setRotation(-45)
      break
    case 15:  // 円弧の右下（上から左）
      this.moveBy(-offset, -offset)
      this.setRotation(225)
      break
    case 16:  // 円弧の右下（左から上）
      this.moveBy(-offset, -offset)
      this.setRotation(45)
      break
    case 17:  // 円弧の左下（右から上）
      this.moveBy(offset, -offset)
      this.setRotation(-45)
      break
    case 18:  // 円弧の左下（上から右）
      this.moveBy(offset, -offset)
      this.setRotation(135)
      break
    case 19:  // 円弧の左上（下から右）
      this.moveBy(offset, offset)
      this.setRotation(45)
      break
    case 20:  // 円弧の左上（右から下）
      this.moveBy(offset, offset)
      this.setRotation(225)
      break
    }
  },
})