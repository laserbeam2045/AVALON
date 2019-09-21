import * as phina from 'phina.js'
import MyDisplayElement from '../MyDisplayElement'
import Outline from './Outline'
import Body from './Body'
import Scale from './Scale'
import Tail from './Tail'
import Head from './Head'

// ドラゴンクラス(手順線)
// 必須引数：
// options(以下をプロパティに含むオブジェクト)
//   process(操作手順の配列)
//   fadeTime(１パーツのフェードインにかける時間)
//   duration(表示までの待機時間)
//   dropSize(ドロップの大きさ)
//   boardWidth(盤面内で横に並ぶドロップの数)
//   lineFlag(表示させるかどうか)
export default phina.define('Dragon', {
  superClass: MyDisplayElement,

  init (options) {
    options = (options || {}).$safe({
      fadeTime: 100,
      duration: 0,
      easing: 'lenear',
    })
    this.superInit(options)
    Object.assign(this, options)

    this._createParts()
    setTimeout(this._advent.bind(this), this.duration)
  },

  // ドラゴンを構成するパーツを作成するメソッド
  _createParts () {
    this.parts = []
    this._getLineData().forEach((data, index) => {
      this.parts[index] = [
        Outline(data),                          // 輪郭線
        Body(data, index, this.process.length), // 胴体
        Scale(data),                            // 鱗
      ]
      if (index === 0)
        this.parts[index].push(Tail(data))  // 尻尾
      else if (this._isLast(index))
        this.parts[index].push(Head(data))  // 頭
    })
  },

  // 初めは透明にしておき、徐々にフェードインさせるメソッド
  _advent () {
    this.parts.forEach((part, index) => {
      part.forEach(object => {
        object.setAlpha(0).addChildTo(this)
        if (this.displayFlag) {
          object.tweener
          .wait(this.fadeTime * index)
          .to({alpha: 1}, this.fadeTime * 3, this.easing)
          .play()
        }
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
            lineType = this._getLineType(index)

      return {
        x,        // Group全体の中でのx座標
        y,        // Group全体の中でのy座標
        lineType, // 線の種類
        dropSize: this.dropSize,
      }
    })
  },

  // index手目として描画すべき線の種類を返すメソッド
  // 戻り値：数値(0～20)
  _getLineType (index) {
    const width = this.boardWidth
    const process = this.process

    if (index === 0) {
      // 最初（尻尾部分）の場合は、次の座標との差で場合分けをする
      const diff = process[index] - process[index + 1]
      if (diff === 1)       return 1  // 横の直線（中心から左）
      if (diff === -1)      return 2  // 横の直線（中心から右）
      if (diff === width)   return 3  // 縦の直線（中心から上）
      if (diff === -width)  return 4  // 縦の直線（中心から下）
    } else if (this._isLast(index)) {
      // 最後（頭部分）の場合は、前の座標との差で場合分けをする
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
})