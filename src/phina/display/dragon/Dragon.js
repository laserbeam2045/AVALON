import * as phina from 'phina.js'
import MyDisplayElement from '../MyDisplayElement'
import MySprite from '../MySprite'
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

    this.$_createParts()
    setTimeout(this.$_advent.bind(this), this.duration)
  },

  // ドラゴンを構成するパーツを作成するメソッド
  $_createParts () {
    this.parts = []
    this.$_getLineData().forEach((lineData, index) => {
      const body = this.$_createBody(lineData)

      body.moveTo(lineData.x, lineData.y)
      this.$_transform(body, lineData)

      this.parts[index] = [body]
      if (index === 0)
        this.parts[index].push(Tail(lineData))  // 尻尾
      else if (this.$_isLast(index))
        this.parts[index].push(Head(lineData))  // 頭
    })
  },

  // 胴体オブジェクトと鱗オブジェクトを生成し、スプライトとして纏めるメソッド
  $_createBody (lineData) {
    const canvas = phina.graphics.Canvas()
    const renderer = phina.display.CanvasRenderer(canvas)
    const layer = MyDisplayElement()

    // 胴体オブジェクトを生成
    const body = Body(lineData).moveTo(canvas.width / 2, canvas.height / 2).addChildTo(layer)

    // 鱗オブジェクトを生成
    if ([3, 4].includes(lineData.lineType)) {
      Scale(lineData).addChildTo(body)
    }
    // layerの中身を canvasに描画
    renderer.renderObject(layer)

    return MySprite(canvas)
  },

  // 初めは透明にしておき、徐々にフェードインさせるメソッド
  $_advent () {
    this.parts.forEach((part, index) => {
      part.forEach(object => {
        if (!this.displayFlag || this.fadeTime) {
          object.setAlpha(0)
          if (this.displayFlag) {
            object.tweener
            .wait(this.fadeTime * index)
            .to({alpha: 1}, this.fadeTime * 3, this.easing)
            .play()
          }
        }
        object.addChildTo(this)
      })
    })
  },

  // indexが最後かどうかを返すメソッド
  $_isLast (index) {
    return (index === (this.process.length - 1))
  },

  // 描画する際に必要な、座標などの情報を、手順別にまとめるメソッド
  $_getLineData () {
    return this.process.map((Z, index, arr) => {
      const X = Z % this.boardWidth,
            Y = Math.floor(Z / this.boardWidth),
            x = this.dropSize * (X + 0.5),
            y = this.dropSize * (Y + 0.5),
            directions = this.$_getLineDirections(index),
            lineType = this.$_getLineType(directions)

      return {
        x,          // Group全体の中でのx座標
        y,          // Group全体の中でのy座標
        directions, // 描画の開始・終了方向
        lineType,   // 線の種類
        index,
        processLen: arr.length,
        dropSize: this.dropSize,
      }
    })
  },

  // index手目として描画する際の、開始方向と終了方向を取得するメソッド
  // 戻り値：inlet(0～8), outlet(0～8)をプロパティに持つオブジェクト
  $_getLineDirections (index) {
    let inlet, outlet, diff1, diff2

    if (index === 0) {
      diff1 = null
      diff2 = this.process[index] - this.process[index + 1]
    }
    else if (this.$_isLast(index)) {
      diff1 = this.process[index] - this.process[index - 1]
      diff2 = null
    } else {
      diff1 = this.process[index] - this.process[index - 1],
      diff2 = this.process[index] - this.process[index + 1]
    }
    inlet = this.$_getLineDirection(diff1)
    outlet = this.$_getLineDirection(diff2)

    return { inlet, outlet }
  },

  // 座標の差をもとに、座標の位置関係を表すフラグを返すメソッド
  // MEMO: 1～7は、canvasの上端から時計回りに8方向を意味し、0は中心を意味する
  $_getLineDirection (diff) {
    const width = this.boardWidth

    switch (diff) {
      case width      : return 1  // 上
      case width - 1  : return 2  // 右上
      case -1         : return 3  // 右
      case -width - 1 : return 4  // 右下
      case -width     : return 5  // 下
      case -width + 1 : return 6  // 左下
      case 1          : return 7  // 左
      case width + 1  : return 8  // 左上
      default         : return 0  // 中心
    }
  },

  // 線の種類を表すフラグを取得するメソッド
  // 5以上は斜めの位置が関係する
  $_getLineType ({ inlet, outlet }) {
    if (!inlet) {
      if (outlet % 2) return 1  // 開始地点
      else            return 5  // 開始地点（斜め）
    }
    if (!outlet) {
      if (inlet % 2) return 2  // 終了地点
      else           return 6  // 終了地点（斜め）
    }
    if (inlet % 2) {
      if (outlet % 2) {
        if (
          (inlet + outlet === (1 + 5)) ||
          (inlet + outlet === (3 + 7))
        ) {
          return 3  // 端から端までの直線
        } else {
          return 4  // 円弧のような曲線
        }
      } else {
        if ((Math.abs(inlet - outlet) % 6) === 1) {
          return 7  // フのような形の線
        } else {
          return 8  // ヘのような形の線
        }
      }
    } else {
      if ((Math.abs(inlet - outlet) % 6) === 1) {
        return 9  // フのような形の線
      }
      else if ((Math.abs(inlet - outlet) % 4) === 2) {
        return 10  // ＞のような形の線
      }
      else if (Math.abs(inlet - outlet) !== 4) {
        return 11  // ヘのような形の線
      }
      else {
        return 12  // 隅から隅までの斜めの直線
      }
    }
  },

  // 線の種類に応じて胴体を回転・移動させるメソッド
  $_transform (object, lineData) {
    const { directions, lineType } = lineData

    switch (lineType) {
    case 1  : this.$_transformType1(object, directions); break
    case 2  : this.$_transformType2(object, directions); break
    case 3  : this.$_transformType3(object, directions); break
    case 4  : this.$_transformType4(object, directions); break
    case 5  : this.$_transformType5(object, directions); break
    case 6  : this.$_transformType6(object, directions); break
    case 7  : this.$_transformType7(object, directions); break
    case 8  : this.$_transformType8(object, directions); break
    case 9  : this.$_transformType9(object, directions); break
    case 10 : this.$_transformType10(object, directions); break
    case 11 : this.$_transformType11(object, directions); break
    case 12 : this.$_transformType12(object, directions); break
    }
    return this
  },

  $_transformType1 (object, { outlet }) {
    switch (outlet) {
    case 1: object.setRotation(-90); break
    case 5: object.setRotation(90); break
    case 7: object.setRotation(180); break
    }
  },

  $_transformType2 (object, { inlet }) {
    switch (inlet) {
    case 1: object.setRotation(90); break
    case 3: object.setRotation(180); break
    case 5: object.setRotation(-90); break
    }
  },

  $_transformType3 (object, { inlet }) {
    switch (inlet) {
    case 1: object.setRotation(90); break
    case 3: object.setRotation(180); break
    case 5: object.setRotation(-90); break
    }
  },

  $_transformType4 (object, { inlet, outlet }) {
    switch (inlet) {
    case 1:
      switch (outlet) {
      case 3: object.setRotation(-90).setScale(-1, 1); break
      case 7: object.setRotation(90); break
      }
      break
    case 3:
      switch (outlet) {
      case 1: object.setRotation(180); break
      case 5: object.setScale(-1, 1); break
      }
      break
    case 5:
      switch (outlet) {
      case 3: object.setRotation(-90); break
      case 7: object.setRotation(90).setScale(-1, 1); break
      }
      break
    case 7:
      switch (outlet) {
      case 1: object.setScale(1, -1); break
      case 5: break
      }
      break
    }
  },

  $_transformType5 (object, { outlet }) {
    switch (outlet) {
    case 2: object.setRotation(-90); break
    case 6: object.setRotation(90); break
    case 8: object.setRotation(180); break
    }
  },

  $_transformType6 (object, { inlet }) {
    switch (inlet) {
    case 2: object.setRotation(90); break
    case 4: object.setRotation(180); break
    case 6: object.setRotation(-90); break
    }
  },

  $_transformType7 (object, { inlet, outlet }) {
    switch (inlet) {
    case 1:
      switch (outlet) {
      case 2: object.setRotation(90).setScale(1, -1); break
      case 8: object.setRotation(90); break
      }
      break
    case 3:
      switch (outlet) {
      case 2: object.setRotation(180); break
      case 4: object.setRotation(180).setScale(1, -1); break
      }
      break
    case 5:
      switch (outlet) {
      case 4: object.setRotation(-90); break
      case 6: object.setRotation(-90).setScale(1, -1); break
      }
      break
    case 7:
      switch (outlet) {
      case 6: break
      case 8: object.setScale(1, -1); break
      }
      break
    }
  },

  $_transformType8 (object, { inlet, outlet }) {
    switch (inlet) {
    case 1:
      switch (outlet) {
      case 4: object.setRotation(90).setScale(1, -1); break
      case 6: object.setRotation(90); break
      }
      break
    case 3:
      switch (outlet) {
      case 6: object.setScale(-1, 1); break
      case 8: object.setScale(-1); break
      }
      break
    case 5:
      switch (outlet) {
      case 2: object.setRotation(-90); break
      case 8: object.setRotation(-90).setScale(1, -1); break
      }
      break
    case 7:
      switch (outlet) {
      case 2: object.setScale(1, -1); break
      case 4: break
      }
      break
    }
  },

  $_transformType9 (object, { inlet, outlet }) {
    switch (inlet) {
    case 2:
      switch (outlet) {
      case 1: object.setRotation(90); break
      case 3: object.setScale(-1, 1); break
      }
      break
    case 4:
      switch (outlet) {
      case 3: object.setRotation(180); break
      case 5: object.setRotation(90).setScale(-1, 1); break
      }
      break
    case 6:
      switch (outlet) {
      case 5: object.setRotation(-90); break
      case 7: object.setScale(1, -1); break
      }
      break
    case 8:
      switch (outlet) {
      case 1: object.setRotation(90).setScale(1, -1); break
      case 7: break
      }
      break
    }
  },

  $_transformType10 (object, { inlet, outlet }) {
    switch (inlet) {
    case 2:
      switch (outlet) {
      case 4: object.setScale(-1, 1); break
      case 8: object.setRotation(90); break
      }
      break
    case 4:
      switch (outlet) {
      case 2: object.setRotation(180); break
      case 6: object.setRotation(-90).setScale(1, -1); break
      }
      break
    case 6:
      switch (outlet) {
      case 4: object.setRotation(-90); break
      case 8: object.setScale(1, -1); break
      }
      break
    case 8:
      switch (outlet) {
      case 2: object.setRotation(90).setScale(1, -1); break
      case 6: break
      }
      break
    }
  },

  $_transformType11 (object, { inlet, outlet }) {
    switch (inlet) {
    case 2:
      switch (outlet) {
      case 5: object.setScale(-1, 1); break
      case 7: object.setRotation(90); break
      }
      break
    case 4:
      switch (outlet) {
      case 1: object.setRotation(180); break
      case 7: object.setRotation(-90).setScale(1, -1); break
      }
      break
    case 6:
      switch (outlet) {
      case 1: object.setScale(1, -1); break
      case 3: object.setRotation(-90); break
      }
      break
    case 8:
      switch (outlet) {
      case 3: object.setRotation(90).setScale(1, -1); break
      case 5: break
      }
      break
    }
  },

  $_transformType12 (object, { inlet }) {
    switch (inlet) {
    case 2: object.setRotation(90); break
    case 4: object.setRotation(180); break
    case 6: object.setRotation(-90); break
    case 8: break
    }
  },
})