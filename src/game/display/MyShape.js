import * as phina from 'phina.js'

phina.globalize()

// ShapeクラスにsetAlphaメソッドを持たせたクラス
export default phina.define('MyShape', {
  superClass: 'phina.display.Shape',

  init (options) {
    options = (options || {}).$safe({
      padding: 1,
      backgroundColor: 'transparent',
    })
    this.superInit(options)
  },

  // 透明度を設定するメソッド
  setAlpha (value) {
    this.alpha = value
    return this
  },

  // 徐々に透明にするメソッド
  fadeOut (duration) {
    this.tweener.fadeOut(duration).play()
    return this
  },
  
  // 徐々に不透明にするメソッド
  fadeIn (duration) {
    this.tweener.fadeIn(duration).play()
    return this
  },
})