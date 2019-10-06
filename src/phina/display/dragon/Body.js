import * as phina from 'phina.js'
import MyShape from '../MyShape'

// ドラゴンの胴体クラス
// 必須引数：
// lineData(座標オブジェクト)
export default phina.define('Body', {
  superClass: MyShape,

  init (lineData) {
    this.superInit({
      width: lineData.dropSize,
      height: lineData.dropSize,
    })
    this.lineData = lineData
  },

  postrender () {
    const coordinates = this.$_getCoordinates()
    const gradient = this.$_getCanvasGradient(coordinates)

    // 外側の輪郭から順番に塗り重ねる
    this.$_drawBody(coordinates, 37, 'butt', 'round', 'rgba(255,215,0,0.7)')
    this.$_drawBody(coordinates, 34, 'butt', 'round', 'rgba(255,255,255,0.5)')
    this.$_drawBody(coordinates, 27, 'butt', 'round', 'black')
    this.$_drawBody(coordinates, 23, 'round', 'round', gradient)
  },

  // 胴体を描画するメソッド
  $_drawBody ({ begin, end }, lineWidth, lineCap, lineJoin, lineColor) {
    const canvas = this.canvas

    canvas.lineCap = lineCap
    canvas.lineJoin = lineJoin
    canvas.lineWidth = lineWidth
    canvas.strokeStyle = lineColor

    if (5 <= this.lineData.lineType) {
      canvas.moveTo(begin.x, begin.y).lineTo(0, 0).lineTo(end.x, end.y).stroke()
    } else {
      canvas.moveTo(begin.x, begin.y).quadraticCurveTo(0, 0, end.x, end.y).stroke()
    }
  },

  // 線の種類に応じて、描画の開始・終了位置を取得するメソッド
  $_getCoordinates () {
    const { lineType, dropSize } = this.lineData
    const half = dropSize / 2
    let begin = null, end = null

    switch (lineType) {
    case 1:
      begin = {x: 0, y: 0}
      end   = {x: half, y: 0}
      break
    case 2:
      begin = {x: -half, y: 0}
      end   = {x: 0, y: 0}
      break
    case 3:
      begin = {x: -half, y: 0}
      end   = {x: half, y: 0}
      break
    case 4:
      begin = {x: -half, y: 0}
      end   = {x: 0, y: half}
      break
    case 5:
      begin = {x: 0, y: 0}
      end   = {x: half, y: half}
      break
    case 6:
      begin = {x: -half, y: -half}
      end   = {x: 0, y: 0}
      break
    case 7:
      begin = {x: -half, y: 0}
      end   = {x: -half, y: half}
      break
    case 8:
      begin = {x: -half, y: 0}
      end   = {x: half, y: half}
      break
    case 9:
      begin = {x: -half, y: -half}
      end   = {x: -half, y: 0}
      break
    case 10:
      begin = {x: -half, y: -half}
      end   = {x: -half, y: half}
      break
    case 11:
      begin = {x: -half, y: -half}
      end   = {x: 0, y: half}
      break
    case 12:
      begin = {x: -half, y: -half}
      end   = {x: half, y: half}
      break
    }
    return { begin, end }
  },

  // CanvasGradientオブジェクトを生成するメソッド
  $_getCanvasGradient ({ begin, end }) {
    const { index, processLen } = this.lineData
    const gradient = this.canvas.context.createLinearGradient(begin.x, begin.y, end.x, end.y)

    // 色相（0～360°）の角度の値で指定。
    const h1 = 200 - Math.round((220 / processLen) * index) % 360
    const h2 = 200 - Math.round((220 / processLen) * (index + 1)) % 360
    // 彩度（0～100%）の割合で指定。（100％＝純色、0%＝灰色）
    const s1 = 100
    const s2 = 100
    // 輝度（0～100%）の割合で指定。（100%=白、50％=純色、0%=黒）
    const l1 = 50
    const l2 = 50
    // 始点と終点の色指定
    gradient.addColorStop(0, `hsl(${h1}, ${s1}%, ${l1}%)`)
    gradient.addColorStop(1, `hsl(${h2}, ${s2}%, ${l2}%)`)

    return gradient
  },
})