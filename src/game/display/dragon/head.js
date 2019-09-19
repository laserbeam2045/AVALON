import * as phina from 'phina.js'
import MySprite from '../MySprite'

// ドラゴンの頭クラス
// 必須引数：
// lineData(座標オブジェクト)
export default phina.define('DragonHead', {
  superClass: MySprite,

  init (lineData) {
    const { dropSize, x, y , lineType } = lineData
    const IMG_SIZE = 1000
    const scale = (dropSize / IMG_SIZE) * 1.5

    this.superInit('dragon_head', IMG_SIZE, IMG_SIZE)
    this.setScale(scale).moveTo(x, y)._rotate(lineType)
  },

  // 線の種類に応じて回転させるメソッド
  _rotate (lineType) {
    switch (lineType) {
      case 6: this.scaleX *= -1; break     //（右から来た場合）
      case 8: this.setRotation(-90); break //（下から来た場合）
    }
    return this
  },
})