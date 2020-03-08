import * as phina from 'phina.js'
import MySprite from '../MySprite'

// ドラゴンの尻尾クラス
// 必須引数：
// lineData(座標オブジェクト)
export default phina.define('Tail', {
  superClass: MySprite,

  init (lineData) {
    const { dropSize, x, y , directions } = lineData
    const IMG_SIZE = 600
    const scale = (dropSize / IMG_SIZE) * 1.3

    this.superInit('dragonTail', IMG_SIZE, IMG_SIZE)
    this.setScale(scale).moveTo(x, y).$_rotate(directions)
  },

  // 線の種類に応じて回転させるメソッド
  $_rotate ({ outlet }) {
    switch (outlet) {
    case 2: this.setRotation(45);  break
    case 3: this.setRotation(90);  break
    case 4: this.setRotation(135); break
    case 5: this.setRotation(180); break
    case 6: this.setRotation(225); break
    case 7: this.setRotation(270); break
    case 8: this.setRotation(315); break
    }
  },
})