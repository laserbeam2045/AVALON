import * as phina from 'phina.js'
import MyShape from '../MyShape'

// ドラゴンの胴体クラス
// 必須引数：
// lineData(座標オブジェクト)
// index(何手目であるか。グラデーションのために必要)
// processLen(手順の長さ。グラデーションのために必要)
export default phina.define('Body', {
  superClass: MyShape,

  init (lineData, index, processLen) {
    const { dropSize, x, y } = lineData
    this.superInit({
      width: dropSize,
      height: dropSize,
    })
    this.lineData = lineData
    this.index = index
    this.processLen = processLen
    this.moveTo(x, y).$_rotate()
  },

  postrender () {
    this.$_drawBody()
  },

  // グラデーション付きの胴体を描画するメソッド
  $_drawBody () {
    const { lineType, dropSize } = this.lineData
    const canvas = this.canvas
    let begin = {}, end = {}

    switch (lineType) {
    // 左端から中央へ向かう、半分の直線
    case 1: case 2: case 3: case 4:
    case 5: case 6: case 7: case 8:
      begin.x = -dropSize
      begin.y = 0
      end.x = 0
      end.y = 0
      break
    // 左端から右端へ向かう、端から端までの直線
    case 9: case 10: case 11: case 12:
      begin.x = -dropSize / 2
      begin.y = 0
      end.x = dropSize / 2
      end.y = 0
      break
    // 左端から下へ向かう、円弧の右上
    case 13: case 14: case 15: case 16: 
    case 17: case 18: case 19: case 20:
      begin.x = -dropSize / 2
      begin.y = 0
      end.x = 0
      end.y = dropSize / 2
      break
    }
    // 線の種類に応じて最低限のパターンで描画し、回転などで使い回す
    canvas.lineCap = 'round'
    canvas.lineJoin = 'round'
    canvas.lineWidth = 23
    canvas.strokeStyle = this.$_getCanvasGradient(begin, end)
    canvas.moveTo(begin.x, begin.y).quadraticCurveTo(0, 0, end.x, end.y).stroke()

    return this
  },

  // CanvasGradientオブジェクトを生成するメソッド
  $_getCanvasGradient (begin, end) {
    const grad = this.canvas.context.createLinearGradient(begin.x, begin.y, end.x, end.y)

    // 色相（0～360°）の角度の値で指定。
    const h1 = 200 - Math.round((220 / this.processLen) * this.index) % 360
    const h2 = 200 - Math.round((220 / this.processLen) * (this.index + 1)) % 360
    // 彩度（0～100%）の割合で指定。（100％＝純色、0%＝灰色）
    const s1 = 100
    const s2 = 100
    // 輝度（0～100%）の割合で指定。（100%=白、50％=純色、0%=黒）
    const l1 = 50
    const l2 = 50
    // 始点と終点の色指定
    grad.addColorStop(0, `hsl(${h1}, ${s1}%, ${l1}%)`)
    grad.addColorStop(1, `hsl(${h2}, ${s2}%, ${l2}%)`)

    return grad
  },

  // 線の種類に応じて回転・移動させるメソッド
  $_rotate () {
    const { lineType, dropSize } = this.lineData

    switch (lineType) {
    case 1:
      this.setRotation(180)
      this.moveBy(-dropSize / 2, 0)
      break
    case 2:
      this.moveBy(dropSize / 2, 0)
      break
    case 3:
      this.setRotation(270)
      this.moveBy(0, -dropSize / 2)
      break
    case 4:
      this.setRotation(90)
      this.moveBy(0, dropSize / 2)
      break
    case 6: case 10: case 17:
      this.setRotation(180)
      break
    case 7: case 11: case 15:
      this.setRotation(90)
      break
    case 8: case 12: case 19:
      this.setRotation(270)
      break
    case 14:
      this.setScale(-1, 1)
      this.setRotation(90)
      break
    case 16:
      this.setScale(-1, 1)
      this.setRotation(180)
      break
    case 18:
      this.setScale(-1, 1)
      this.setRotation(270)
      break
    case 20:
      this.setScale(-1, 1)
      break
    }
    return this
  },
})