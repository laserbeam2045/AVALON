import * as phina from 'phina.js'
import MySprite from '../MySprite'

// ドラゴンの頭クラス
// 必須引数：
// lineData(座標オブジェクト)
export default phina.define('Head', {
  superClass: MySprite,

  init (lineData) {
    const { dropSize, x, y , directions } = lineData
    const IMG_SIZE = 1000
    const scale = (dropSize / IMG_SIZE) * 1.5

    this.superInit('dragonHead', IMG_SIZE, IMG_SIZE)
    this.setScale(scale).moveTo(x, y).$_rotate(directions, scale)
  },

  // 線の種類に応じて回転させるメソッド
  $_rotate ({ inlet }, scale) {
    switch (inlet) {
    case 1: this.setRotation(45); break
    case 2: this.setRotation(-45).setScale(-scale, scale); break
    case 3: this.setScale(-scale, scale); break
    case 4: this.setRotation(45).setScale(-scale, scale); break
    case 5: this.setRotation(-90); break
    case 6: this.setRotation(-45); break
    case 7: break
    case 8: this.setRotation(45); break
    }
  },
})