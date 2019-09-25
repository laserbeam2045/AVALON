import * as phina from 'phina.js'
import BaseScene from './BaseScene'
import FrameButton from '../../ui/FrameButton'
import { ItemDrop } from '../drops'
import StartPosition from '../startPosition/StartPosition'
import NoEntryPosition from '../NoEntryPosition'

const COLOR_MAX = 9                 // ドロップの種類
const MAX_PER_LINE = 6              // 横に並べるドロップの数
const ITEM_DROP_SCALE = 1.90        // アイテムドロップの拡大率
const SELECTED_ITEM_ALPHA = 1       // 選択されているアイテムの透明度
const UNSELECTED_ITEM_ALPHA = 0.4   // 選択されていないアイテムの透明度

// 盤面を入力するシーン
export default () => {
  phina.define('InputScene', {
    superClass: BaseScene,

    init (options) {
      this.superInit(options)
      this.initDropSprites()
      this.initStartPositionSprite()
      this.initNoEntryPositionSprites()
      this.$_initSetter()
      this.$_initGetter()
      this.$_initItems()
      this.$_initStartButton()
    },

    // アイテムを選択状態にする唯一のパブリックメソッド
    selectItem (newItem) {
      if (this.selectedItem === newItem) {
        return
      }
      this.selectedItem = newItem
      this.playSound('select', 0.2)

      this.itemGroup.children.forEach((item, index) => {
        if ((index + 1) === this.selectedItem) {
          item.setAlpha(SELECTED_ITEM_ALPHA)
        } else {
          item.setAlpha(UNSELECTED_ITEM_ALPHA)
        }
      })
    },

    // setter関数を初期化するメソッド
    $_initSetter () {
      this.setter('selectedItem', item => {
        this.$_selectedItem = item
      })
      this.setter('lastMoveIndex', index => {
        this.$_lastMoveIndex = index
      })
    },

    // getter関数を初期化するメソッド
    $_initGetter () {
      this.getter('selectedItem', () => {
        return this.$_selectedItem
      })
      this.getter('lastMoveIndex', () => {
        return this.$_lastMoveIndex
      })
    },

    // 選択アイテムを初期配置するメソッド
    $_initItems () {
      // 選択アイテムを入れるグループを作成
      const x = 65, y = this.topMargin - 71
      this.itemGroup = phina.display.DisplayElement().moveTo(x, y).addChildTo(this)

      // アイテムドロップ
      for (let i = 1; i <= COLOR_MAX; i++) {
        ItemDrop(this.baseDropSize).setFrameIndex(i).addChildTo(this.itemGroup)
      }
      // 操作不可・開始位置指定アイコン
      NoEntryPosition(this.baseDropSize).addChildTo(this.itemGroup)
      StartPosition(this.baseDropSize).addChildTo(this.itemGroup)

      // イベント時にこのシーンのメソッドを呼び出せるようにするため、
      // 各アイテムのメンバ変数に、このシーンと、それぞれの識別用インデックスを持たせる
      this.itemGroup.children.forEach((item, index) => {
        const [x, y] = this.$_getCoordinatesOfItem(index)

        item.setScene(this).setItemIndex(index + 1).setInteractive(true)
          .moveTo(x, y).setScale(ITEM_DROP_SCALE).setAlpha(UNSELECTED_ITEM_ALPHA)
      })
    },

    // 選択アイテムの座標を計算するメソッド
    $_getCoordinatesOfItem (index) {
      const dropSize = this.baseDropSize * ITEM_DROP_SCALE,
            x = dropSize * (index % MAX_PER_LINE),
            y = -dropSize * Math.floor(index / MAX_PER_LINE)

      return [x, y]
    },

    // STARTボタンを初期配置するメソッド
    $_initStartButton () {
      const x = this.buttonGridX.span(5.5)
      const y = this.buttonGridX.span(0.5)
      FrameButton('START')
        .moveTo(x, y)
        .addChildTo(this.buttonGroup)
        .addEventListener('pointstart', () => {
          // Vue側のデータを更新する
          this.vueMethods.updateBoard(this.boardData)
          // メインシーンへ移動する
          this.exitTo('main')
        })
    },

    // 盤面の操作を開始したときのイベント処理
    onpointstart (event) {
      if (this.selectedItem !== undefined) {
        this.$_applyChange({ ...this.getIndicesOfDrop(event) })
      }
    },

    // 盤面をドラッグしながら移動したときのイベント処理
    onpointmove (event) {
      if (this.selectedItem !== undefined) {
        this.$_applyChange({ ...this.getIndicesOfDrop(event) })
      }
    },

    // 盤面の操作を終了したときのイベント処理
    onpointend () {
      delete this.lastMoveIndex
    },

    // アイテムの種類に応じて処理を振り分けるメソッド
    $_applyChange ({ X, Y, Z }) {
      if (this.isOutOfBoard(X, Y) || this.lastMoveIndex === Z) {
        return
      } else {
        this.lastMoveIndex = Z
      }
      switch (this.selectedItem) {
      case (COLOR_MAX + 1):
        this.$_updateNoEntryPosition(Z)
        break
      case (COLOR_MAX + 2):
        this.$_updateStartPosition(Z)
        break
      default:
        this.$_updateDrop(Z)
      }
    },

    // 盤面に操作不可アイコンを設置・削除するメソッド
    $_updateNoEntryPosition (index) {
      // 開始位置指定とは排他的（同じ座標に存在できない）
      if (this.startPosition === index) {
        return
      }
      // 引数の座標が既に配置済みの場合
      if (this.noEntryPositions.has(index)) {
        this.noEntryPositionSprites.get(index).remove()
        this.noEntryPositions.delete(index)
      // 引数の座標が未配置の場合
      } else {
        const sprite = this.createNoEntryPositionSprite(index)
        this.noEntryPositionSprites.set(index, sprite)
        this.noEntryPositions.add(index)
      }
    },

    // 盤面に開始位置指定アイコンを設置・削除するメソッド
    $_updateStartPosition (index) {
      // 操作不可とは排他的（同じ座標に存在できない）
      if (this.noEntryPositions.has(index)) {
        return
      }
      // 初めて配置する場合
      if (this.startPosition === -1) {
        const sprite = this.createStartPositionSprite(index)
        this.startPositionSprite = sprite
        this.startPosition = index
      // 配置してあるものを削除する場合
      } else if (this.startPosition === index) {
        this.startPositionSprite.remove()
        this.startPosition = -1
      // 配置してあるものを移動する場合
      } else {
        const [x, y] = this.getCoordinatesOfDrop(index)
        this.startPositionSprite.moveTo(x, y)
        this.startPosition = index
      }
      this.boardData.startPosition = this.startPosition
    },

    // ドロップの色を変更するメソッド
    $_updateDrop (index) {
      const color = this.selectedItem
      this.board[index] = color
      this.boardData.board[index] = color
      this.dropSprites[index].setFrameIndex(color)
    },
  })
}