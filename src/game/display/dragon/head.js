import * as phina from 'phina.js'
import MySprite from '../MySprite'

// ドラゴンの頭クラス
// 必須引数：
// lineData(座標オブジェクト),
// dropSize(ドロップの大きさ)
export default phina.define('DragonHead', {
  superClass: MySprite,

  init (lineData, dropSize) {
    const IMG_SIZE = 1000
    const scale = (dropSize / IMG_SIZE) * 1.5

    this.superInit('dragon_head', IMG_SIZE, IMG_SIZE)
    this.setScale(scale)._move(lineData)
  },

  // 所定の位置に移動させ、場合により回転させるメソッド
  _move ({ x, y, lineType }) {
      this.moveTo(x, y)

    switch (lineType) {
      case 6: this.scaleX *= -1; break     //（右から来た場合）
      case 8: this.setRotation(-90); break //（下から来た場合）
    }
    return this
  },
})