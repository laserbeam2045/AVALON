import * as phina from 'phina.js'
import MySprite from './MySprite'


// ベースとなるドロップクラス
//（必須引数：baseDropSize)
export const Drop = phina.define('Drop', {
  superClass: MySprite,
  init (baseDropSize) {
    this.superInit('drops', baseDropSize, baseDropSize)
  },
})


// 通常の移動可能なドロップクラス
// (必須引数：baseDropSize)
export const NormalDrop = phina.define('NormalDrop', {
  superClass: 'Drop',
  init (baseDropSize) {
    this.superInit(baseDropSize)
  },
  // (x, y)にdurationミリ秒かけて移動させるメソッド
  // 既にアニメーションが設定されている場合、先にその地点に即座に移動させる。
  tweenMoveTo (x, y, duration = 0) {
    if (this.destination) {
      this.tweener.clear()
      this.moveTo(...this.destination)
    }
    if (typeof(x) === 'number' && typeof(y) === 'number') {
      this.destination = [x, y]
      this.tweener.moveTo(x, y, duration)
        .call(() => delete this.destination).play()
    }
    return this
  },
})


// ドロップの操作中に表示する半透明のドロップクラス
// (必須引数：baseDropSize)
export const GrabbedDrop = phina.define('GrabbedDrop', {
  superClass: 'Drop',
  init (baseDropSize) {
    this.superInit(baseDropSize)
  },
  // イベントの位置に応じて移動させるメソッド
  move (event) {
    const x = event.pointer.x,
          y = event.pointer.y - 5
    return this.moveTo(x, y)
  },
})


// INPUTシーンの選択アイテムとしてのドロップクラス
// (必須引数：baseDropSize)
export const ItemDrop = phina.define('ItemDrop', {
  superClass: 'Drop',
  init (baseDropSize) {
    this.superInit(baseDropSize)
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