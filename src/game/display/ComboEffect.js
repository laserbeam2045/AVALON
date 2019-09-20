import * as phina from 'phina.js'

// コンボエフェクトクラス
export default phina.define('ComboEffect', {
  superClass: 'phina.display.Label',
  
  init (options) {
    const { x, y } = options

    options = (options || {}).$safe({
      fontWeight: 'bold',
      fill: 'white',
      stroke: 'black',
    })
    this.superInit(options)

    this.moveTo(x, y)
        .setScale(2)
        .tweener
        .to({y: y - 50}, 100)
        .to({scaleX: 1, scaleY: 1, y}, 100)
        .play()
  },

  // 色を変更するメソッド
  setColor (color) {
    this.fill = color
  },

  // フェードアウトするメソッド
  clear () {
    this.tweener
      .to({scaleX: 2, scaleY: 2, alpha: 0, y: this.y - 50}, 100)
      .call(() => this.remove()).play()
  }
})