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

    // 同じ座標に既にラベルがあるなら先に削除する
    if (oldLabel) {
      oldLabel.remove()
      this.labelMap.delete(index)
    }
    this.labelMap.set(index, ComboEffect(options).addChildTo(this))

    if (1 === this.labelMap.size) {
      this.update = this.updateColor
    }
  },

  // 全てのラベルをフェードアウトさせるメソッド
  clear () {
    this.children.forEach(label => {
      label.clear()
    })
    this.labelMap.clear()
    this.update = null
  },

  // 全てのラベルの色をランダムに変更するイベントハンドラ
  updateColor (app) {
    if ((app.frame % 1) === 0) {
      let index
      do {
        index = Math.floor(Math.random() * 8)
      } while (index === this.colorIndex)
      this.colorIndex = index

      const color = this.colors[index]  
      this.children.forEach(label => {
        label.setColor(color)
      })
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