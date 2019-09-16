import * as phina from 'phina.js'

phina.globalize()

// SpriteクラスにsetAlphaを持たせたクラス（何故か無い）
export default phina.define('MySprite', {
  superClass: 'Sprite',

  init (spriteName, width, height) {
    this.superInit(spriteName, width, height)
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