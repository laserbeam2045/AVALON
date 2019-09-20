import * as phina from 'phina.js'

phina.globalize()

// カウントラベルクラス
export default phina.define('CountLabel', {
  superClass: 'phina.display.Label',
  init () {
    this.superInit({
      text: '',
      fontSize: 70,
      fontFamily: "'ＭＳ 明朝', 'ＭＳ ゴシック', 'Times New Roman', serif, sans-serif",
      fontStyle: 'italic',
      fill: 'white',
      stroke: 'white',
      strokeWidth: 0,
      shadow: 'gold',
      shadowBlur: 5,
    })
    this.count = 0
  },

  setAlpha (value) {
    this.alpha = value
    return this
  },

  fadeIn (duration) {
    this.tweener.to({alpha: 1}, duration).play()
    return this
  },

  setText (text) {
    this.text = text
    return this
  },

  increment () {
    this.count++
    this.text = this.count
    return this
  },

  reset () {
    this.count = 0
    this.text = ''
    return this
  }
})