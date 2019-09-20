import ComboEffect from './ComboEffect'

phina.globalize()

// ComboEffectをまとめて管理するクラス
export default phina.define('ComboEffects', {
  superClass: 'phina.display.DisplayElement',

  init () {
    this.superInit()
    this.labelMap = new Map()
  },

  // コンボラベルを追加するメソッド
  addLabel (options) {
    const index = options.index
    const oldLabel = this.labelMap.get(index)
    const newLabel = ComboEffect(options).addChildTo(this)

    // 同じ座標に既にラベルがあるなら先に削除する
    if (oldLabel) {
      oldLabel.remove()
      this.labelMap.delete(index)
    }
    this.labelMap.set(index, newLabel)

    // 負荷軽減のためにラベルが追加されてからイベントを設定する
    if (1 === this.labelMap.size) {
      this.update = this.updateColor
    }
  },

  // 全てのラベルをフェードアウトさせるメソッド
  clear () {
    this.update = null
    this.labelMap.forEach(label => label.clear())
    this.labelMap.clear()
  },

  // 全てのラベルの色をランダムに変更するイベントハンドラ
  updateColor (app) {
    if ((app.frame % 2) === 0) {
      let index
      do {
        index = Math.floor(Math.random() * this.colors.length)
      } while (index === this.colorIndex)
      this.colorIndex = index

      const color = this.colors[index]  
      this.labelMap.forEach(label => label.setColor(color))
    }
  },

  colors: [
    'rgb(  0,   0,   0)', // black
    'rgb(255,  11,   0)', // red
    'rgb(  0, 251,   0)', // green
    'rgb(  0,   0, 255)', // blue
    'rgb(255, 255,   0)', // yellow
    'rgb(255,  27, 255)', // purple
    'rgb(  6, 255, 255)', // skyblue
    'rgb(255, 255, 255)', // white
  ],
})