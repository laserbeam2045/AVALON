import * as phina from 'phina.js'
import MyDisplayElement from '../MyDisplayElement'
import Arc from './Arc'
import Line from './Line'
import Triangle from './Triangle'

// 開始位置指定アイコンクラス
export default phina.define('StartPosition', {
  superClass: 'MyDisplayElement',

  init (baseDropSize) {
    this.superInit()

    this.$_setObjects(baseDropSize)
    this.setSize(baseDropSize, baseDropSize)
  },

  // パーツを作成して配置するメソッド
  $_setObjects (baseDropSize) {
    const BLEND_MODE = 'lighter'
    const color1 = 'blue'
    const color2 = '#FFFFFF'
    const radius = (baseDropSize / 2) - 12
    const arcOffset = 20
    const lineLength = 5
    const triangleOffset = baseDropSize / 2 - 4

    this.innerGroup = MyDisplayElement().addChildTo(this)
    this.outerGroup = MyDisplayElement().addChildTo(this)
    // 円弧の部分
    for (let i = 0; i < 4; i++) {
      Arc(baseDropSize, radius, arcOffset, color1, color2)
        .setRotation(90 * i).addChildTo(this.innerGroup)
    }
    // 直線の部分
    for (let i = 0; i < 4; i++) {
      Line(baseDropSize, radius, lineLength, color1, color2)
        .setRotation(90 * i).addChildTo(this.innerGroup)
    }
    // 三角形の部分
    for (let i = 0; i < 2; i++) {
      Triangle(baseDropSize, triangleOffset, color2, color2)
        .setRotation(180 * i).addChildTo(this.innerGroup)
    }
    // 三角形の部分(別グループ)
    for (let i = 0; i < 2; i++) {
      Triangle(baseDropSize, triangleOffset, color1, color2)
        .setRotation(180 * i).addChildTo(this.outerGroup)
    }
    this.innerGroup.children.each(obj => obj.blendMode = BLEND_MODE)
    this.outerGroup.children.each(obj => obj.blendMode = BLEND_MODE)
  },

  // 回転させるメソッド
  rotate () {
    this.update = () => {
      this.innerGroup.rotation += 3
      this.outerGroup.rotation -= 3
    }
    return this
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

  // 所属シーンのアイテムを選択するメソッドを呼び出すイベント処理
  onpointstart () {
    this.$_scene.selectItem(this.$_itemIndex)
  },
})