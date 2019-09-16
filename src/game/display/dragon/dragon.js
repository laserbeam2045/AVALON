import * as phina from 'phina.js'
import MyDisplayElement from '../MyDisplayElement'
import DragonOutline from './outline'
import DragonBody from './body'
import DragonScale from './scale'
import DragonTail from './tail'
import DragonHead from './head'

// ドラゴンクラス(手順線)
// 必須引数：
// options(以下をプロパティに含むオブジェクト)
//   process(手順＝座標の配列)
//   dropSize(ドロップの大きさ)
//   boardWidth(盤面内で横に並ぶドロップの数)
export default phina.define('Dragon', {
  superClass: MyDisplayElement,

  init (options) {
    options = (options || {}).$safe({
      time: 100,
      duration: 500,
      easing: 'lenear',
    })
    this.superInit(options)
    Object.assign(this, options)

    this.parts = []
    this._getLineData().forEach((data, index) => {
      // 胴体の輪郭線
      const outline = DragonOutline(data, this.dropSize)
      // 胴体
      const body = DragonBody(data, this.dropSize, this.process.length)
      // 胴体の鱗
      const scale = DragonScale(data, this.dropSize)

      this.parts[index] = [outline, body, scale]

      if (index === 0) {
        // 尻尾
        const tail = DragonTail(data, this.dropSize)
        this.parts[index].push(tail)
      } else if (this._isLast(index)) {
        // 頭
        const head = DragonHead(data, this.dropSize)
        this.parts[index].push(head)
      }
    })
    setTimeout(this._advent.bind(this), this.duration)
  },

  // 初めは透明にしておいて、徐々にフェードインさせるメソッド
  _advent () {
    this.parts.forEach((part, index) => {
      part.forEach(object => {
        object.setAlpha(0)
              .addChildTo(this)
              .tweener
              .wait(this.time * index)
              .to({alpha: 1}, this.time * 3, this.easing)
              .play()
      })
    })
  },

  // indexが最後かどうかを返すメソッド
  _isLast (index) {
    return (index === (this.process.length - 1))
  },

  // 描画する際に必要な、座標などの情報を、手順別にまとめるメソッド
  _getLineData () {
    return this.process.map((Z, index) => {
      const X = Z % this.boardWidth,
            Y = Math.floor(Z / this.boardWidth),
            x = this.dropSize * (X + 0.5),
            y = this.dropSize * (Y + 0.5),
            lineType = this._getLineType(index),
            [beginX, beginY, endX, endY] = this._getCoordinates(lineType)

      return {
        index   : index,    // 何手目であるか
        lineType: lineType, // 線の種類
        beginX  : beginX,   // dropSize x dropSize の範囲内における描画開始x座標
        beginY  : beginY,   // dropSize x dropSize の範囲内における描画開始y座標
        endX    : endX,     // dropSize x dropSize の範囲内における描画終了x座標
        endY    : endY,     // dropSize x dropSize の範囲内における描画終了y座標
        x       : x,        // Group全体の中でのx座標
        y       : y,        // Group全体の中でのy座標
      }
    })
  },

  // index手目として描画すべき線の種類を返すメソッド
  // 戻り値：数値(0～20)
  _getLineType (index) {
    const width = this.boardWidth
    const process = this.process

    if (index === 0) {
      // 最初の場合は、次の座標との差で場合分けをする
      const diff = process[index] - process[index + 1]
      if (diff === 1)       return 1 // 横の直線（中心から左）
      if (diff === -1)      return 2 // 横の直線（中心から右）
      if (diff === width)   return 3 // 縦の直線（中心から上）
      if (diff === -width)  return 4 // 縦の直線（中心から下）
    } else if (this._isLast(index)) {
      // 最後の場合は、前の座標との差で場合分けをする
      const diff = process[index] - process[index - 1]
      if (diff === 1)       return 5  // 横の直線（左から中心）
      if (diff === -1)      return 6  // 横の直線（右から中心）
      if (diff === width)   return 7  // 縦の直線（上から中心）
      if (diff === -width)  return 8  // 縦の直線（下から中心）
    } else {
      // 中間（胴体部分）の場合は、前の座標と次の座標の、両方との差で場合分けをする
      const diff1 = process[index] - process[index - 1],
            diff2 = process[index] - process[index + 1]
      if (diff1 === 1 && diff2 === -1)                return 9   // 横一直線（左から右）
      else if (diff1 === -1     && diff2 === 1)       return 10  // 横一直線（右から左）
      else if (diff1 === width  && diff2 === -width)  return 11  // 縦一直線（上から下）
      else if (diff1 === -width && diff2 === width)   return 12  // 縦一直線（下から上）
      else if (diff1 === 1      && diff2 === -width)  return 13  // 円弧の右上（左から下）
      else if (diff1 === -width && diff2 === 1)       return 14  // 円弧の右上（下から左）
      else if (diff1 === width  && diff2 === 1)       return 15  // 円弧の右下（上から左）
      else if (diff1 === 1      && diff2 === width)   return 16  // 円弧の右下（左から上）
      else if (diff1 === -1     && diff2 === width)   return 17  // 円弧の左下（右から上）
      else if (diff1 === width  && diff2 === -1)      return 18  // 円弧の左下（上から右）
      else if (diff1 === -width && diff2 === -1)      return 19  // 円弧の左上（下から右）
      else if (diff1 === -1     && diff2 === -width)  return 20  // 円弧の左上（右から下）
    }
    return 0 // TODO: 前後との位置関係が斜めの場合は0が返る（場合分けが必要）
  },

  // 線の種類に応じて、始点(x, y)と終点(x, y)の座標を返すメソッド
  // 戻り値：要素数４の数値配列
  _getCoordinates (lineType) {
    const half = this.dropSize / 2

    switch (lineType) {
      case  1: return [0, 0, -half, 0]
      case  2: return [0, 0, half, 0]
      case  3: return [0, 0, 0, -half]
      case  4: return [0, 0, 0, half]
      case  5: return [-half, 0, 0, 0]
      case  6: return [half, 0, 0, 0]
      case  7: return [0, -half, 0, 0]
      case  8: return [0, half, 0, 0]
      case  9: return [-half, 0, half, 0]
      case 10: return [half, 0, -half, 0]
      case 11: return [0, -half, 0, half]
      case 12: return [0, half, 0, -half]
      case 13: return [-half, 0, 0, half]
      case 14: return [0, half, -half, 0]
      case 15: return [0, -half, -half, 0]
      case 16: return [-half, 0, 0, -half]
      case 17: return [half, 0, 0, -half]
      case 18: return [0, -half, half, 0]
      case 19: return [0, half, half, 0]
      case 20: return [half, 0, 0, half]
      default: return [0, 0, 0, 0]
    }
  },
})