import * as phina from 'phina.js'
import MySprite from './MySprite'

// 操作不可スプライトクラス
export default phina.define('NoEntryPosition', {
  superClass: MySprite,

  init (baseDropSize) {
    this.superInit('noEntry', baseDropSize, baseDropSize)
  },
  // アイテムを識別するための変数をセットするメソッド
  setItemIndex (index) {
    this.$_itemIndex = index
    return this
  },
  // 所属するシーンをセットするメソッド
  setScene (scene) {
    this.$_scene = scene
    return this
  },
  // 所属シーンのアイテムを選択するメソッドを呼び出す
  onpointstart () {
    this.$_scene.selectItem(this.$_itemIndex)
  },
})