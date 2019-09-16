import * as phina from 'phina.js'
import MyShape from '../MyShape'

// ドラゴンの胴体クラス
// 必須引数：
// lineData(座標オブジェクト),
// dropSize(ドロップの大きさ),
// processLen(手順の長さ->グラデーションのために必要)
export default phina.define('DragonBody', {
  superClass: MyShape,

  init (lineData, dropSize, processLen) {
    this.superInit({
      width: dropSize,
      height: dropSize,
    })
    this.lineData = lineData
    this.processLen = processLen
    this.moveTo(lineData.x, lineData.y)
  },

  postrender () {
    this._drawBody()
  },

  // グラデーション付きの胴体を描画するメソッド
  _drawBody () {
    const canvas = this.canvas
    const { lineType, beginX, beginY, endX, endY } = this.lineData

    canvas.lineCap = 'round'
    canvas.lineJoin = 'round'
    canvas.lineWidth = 23
    canvas.strokeStyle = this._getCanvasGradient()

    if (lineType === 0) {
      canvas.drawLine(beginX, beginY, 0, 0).drawLine(0, 0, endX, endY)
    } else {
      canvas.moveTo(beginX, beginY).quadraticCurveTo(0, 0, endX, endY).stroke()
    }
    return this
  },

  // CanvasGradientオブジェクトを生成するメソッド
  _getCanvasGradient () {
    const { beginX, beginY, endX, endY, index } = this.lineData
    const grad = this.canvas.context.createLinearGradient(beginX, beginY, endX, endY)

    // 色相（0～360°）の角度の値で指定。
    const h1 = 200 - Math.round((220 / this.processLen) * index) % 360
    const h2 = 200 - Math.round((220 / this.processLen) * (index + 1)) % 360
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
})