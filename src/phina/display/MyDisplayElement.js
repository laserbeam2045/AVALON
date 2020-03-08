import * as phina from 'phina.js'

// DisplayElementを継承し、alpha関係のメソッドを持たせたクラス
export default phina.define('MyDisplayElement', {
  superClass: 'phina.display.DisplayElement',

  init () {
    this.superInit()
  },

  // 透明度を変更するメソッド
  // alpha: 透明度(0~1)
  // duration: 変更完了までの時間(ミリ秒)
  setAlpha (alpha, duration = 0) {
    this.children.forEach(object => {
      if (duration) {
        object.tweener.to({ alpha }, duration).play()
      } else {
        object.alpha = alpha
      }
    })
    return this
  },

  // 徐々に透明にするメソッド
  fadeOut (duration) {
    this.children.forEach(object => {
      object.tweener.fadeOut(duration).play()
    })
    return this
  },

  // 徐々に不透明にするメソッド
  fadeIn (duration) {
    this.children.forEach(object => {
      object.tweener.fadeIn(duration).play()
    })
    return this
  },
})