import * as phina from 'phina.js'
import MySprite from '../MySprite'

// ドラゴンの尻尾クラス
// 必須引数：
// lineData(座標オブジェクト),
// dropSize(ドロップの大きさ)
export default phina.define('DragonTail', {
  superClass: MySprite,

  init (lineData, dropSize) {
    const IMG_SIZE = 600
    const scale = (dropSize / IMG_SIZE) * 1.3

    this.superInit('dragon_tail', IMG_SIZE, IMG_SIZE)
    this.setScale(scale)._move(lineData)
  },

  // 所定の位置に移動させ、場合により回転させるメソッド
  _move ({ x, y, lineType }) {
    this.moveTo(x, y)

    switch (lineType) {
      case 1: this.setRotation(-90); break //（中心から左に進む場合）
      case 2: this.setRotation(90);  break //（中心から右に進む場合）
      case 4: this.setRotation(180); break //（中心から下に進む場合）
    }
    return this
  },
})