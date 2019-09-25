import * as phina from 'phina.js'
import MySprite from '../MySprite'
import MyDisplayElement from '../MyDisplayElement'
import NoEntryPosition from '../NoEntryPosition'
import StartPosition from '../startPosition/StartPosition'
import { Drop, NormalDrop } from '../drops'

// 共通のベースとなるシーン
export default phina.define('BaseScene', {
  superClass: 'DisplayScene',

  init (options) {
    this.superInit({
      width: options.width,
      height: options.height,
    })
    this.$_initSetterAndGetter()
    this.$_initAttributes(options)
    this.$_initComputedAttributes()
    this.$_initObjects()
  },

  // シーンを移動するメソッド
  exitTo (label, options = {}) {
    this.exit(label, Object.assign({
      boardData: this.boardData,
      screenData: this.screenData,
      dragon: this.dragon,
      process: this.process,
      lineFlag: this.lineFlag,
      dropFall: this.dropFall,
      activeDrops: this.activeDrops,
      startPosition: this.startPosition,
      noEntryPositions: this.noEntryPositions,
    }, options))
  },

  // 盤面にドロップを初期配置するメソッド
  initDrops () {
    this.dropSprites = []   // ドロップを管理するための配列
    let DropClass = null

    // sceneによって使用するクラスを変える
    switch (this.className) {
      case 'MainScene'  : DropClass = NormalDrop; break
      case 'InputScene' : DropClass = Drop; break
    }
    this.board.forEach((color, index) => {
      const drop = this.createDrop(color, index, DropClass)
      this.dropSprites[index] = drop.addChildTo(this.dropGroup)
    })
  },

  // 盤面配置用のドロップスプライトを作成するメソッド
  createDrop (color, index, DropClass = NormalDrop) {
    const [x, y] = this.getCoordinatesOfDrop(index)

    return DropClass(this.baseDropSize).moveTo(x, y)
            .setFrameIndex(color).setScale(this.dropScale)
  },

  // 盤面に開始位置指定スプライトを初期配置するメソッド
  initStartPosition () {
    const index = this.startPosition
    if (index !== -1) {
      this.startPositionSprite = this.createStartPositionSprite(index)
                                      .addChildTo(this.gimmickGroup)
    }
  },

  // 盤面配置用の開始位置指定スプライトを作成するメソッド
  createStartPositionSprite (index) {
    const [x, y] = this.getCoordinatesOfDrop(index)

    return StartPosition(this.baseDropSize)
            .moveTo(x, y).setScale(this.dropScale * 1.3).rotate()
  },

  // 盤面に操作不可スプライトを初期配置するメソッド
  initNoEntryPositions () {
    this.noEntryPositionSprites = new Map()

    for (let index of this.noEntryPositions) {
      const sprite = this.createNoEntryPositionSprite(index)
                         .addChildTo(this.gimmickGroup)
      this.noEntryPositionSprites.set(index, sprite)
    }
  },

  // 盤面配置用の操作不可位置スプライトを作成するメソッド
  createNoEntryPositionSprite (index) {
    const [x, y] = this.getCoordinatesOfDrop(index)

    return NoEntryPosition(this.baseDropSize)
            .moveTo(x, y).setScale(this.dropScale)
  },

  // 効果音を再生するメソッド
  playSound (name, volume = 1) {
    phina.asset.SoundManager.setVolume(volume)
    phina.asset.SoundManager.play(name)
  },

  // 二次元座標を一次元座標に変換して返すメソッド
  get1dIndex (X, Y) {
    return this.boardWidth * Y + X
  },

  // 一次元座標を二次元座標に変換して返すメソッド
  get2dIndex (index) {
    const X = index % this.boardWidth,
          Y = Math.floor(index / this.boardWidth)
    return [X, Y]
  },

  // 二次元座標、または一次元座標から、ドロップの座標(pixel)を取得するメソッド
  // 2つ目の引数が渡されなければ、一次元座標が渡されたものとみなす
  getCoordinatesOfDrop (X, Y) {
    if (typeof(X) === 'number') {
      if (typeof(Y) !== 'number') {
        const index = X
        X = index % this.boardWidth
        Y = Math.floor(index / this.boardWidth)
      }
    }
    const x = this.dropGridX.span(X + 0.5)
    const y = this.dropGridY.span(Y + 0.5)
    return [x, y]
  },

  // イベントからドロップの位置を割り出すメソッド（第二引数がtrueの場合は盤外の値を補正する）
  getPositionOfDrop (event, adjust = false) {
    let X = Math.floor((event.pointer.x - this.leftMargin) / this.dropSize),
        Y = Math.floor((event.pointer.y - this.topMargin) / this.dropSize)

    if (adjust) {
      X = Math.max(0, Math.min(X, this.boardWidth - 1))
      Y = Math.max(0, Math.min(Y, this.boardHeight - 1))
    }
    const Z = this.boardWidth * Y + X

    return { X, Y, Z }
  },

  // X、Yのどちらとも、盤面の内側の座標であるときにtrueを返すメソッド
  // 戻り値：真偽値（内側:true, 外側:false)
  isInsideOfBoard (X, Y) {
    if (
      0 <= X && X < this.boardWidth &&
      0 <= Y && Y < this.boardHeight
    ) {
      return true
    } else {
      return false
    }
  },

  // X、Yのいずれかが、盤面の外側の座標であるときにtrueを返すメソッド
  // 戻り値：真偽値（外側:true, 内側:false)
  isOutOfBoard (X, Y) {
    if (
      X < 0 || this.boardWidth <= X ||
      Y < 0 || this.boardHeight <= Y
    ) {
      return true
    } else {
      return false
    }
  },

  // 盤面に関する情報・ゲーム作成に必要な情報を、シーンのメンバ変数にセットするメソッド
  $_initAttributes (options) {
    const { boardData, screenData, vueMethods } = options

    // 各オブジェクトをシーンに持たせる
    this.boardData = boardData
    this.screenData = screenData
    this.vueMethods = vueMethods

    // オブジェクトの各値もシーンに持たせる(thisから直接参照できないと不便なため)
    Object.assign(this, boardData, screenData)

    this.dragon = options.dragon
    this.process = options.process
    this.lineFlag = options.lineFlag
    this.dropFall = options.dropFall
    this.activeDrops = options.activeDrops
    this.board = Array.from(boardData.board)
  },

  // あると便利な変数を作るメソッド
  $_initComputedAttributes () {
    // ゲームキャンバス全体のうち、盤面領域の高さと幅
    this.boardPixelHeight = this.screenHeight - this.topMargin
    this.boardPixelWidth = this.screenWidth - (this.leftMargin + this.rightMargin)
    // 実際に表示されるドロップのサイズ
    this.dropSize = this.boardPixelWidth / this.boardWidth
    // ボタン領域のグリッド
    const buttonNum = 6
    this.buttonGridX = phina.util.Grid(this.screenWidth, buttonNum)
    // 盤面領域のグリッド
    this.dropGridX = phina.util.Grid(this.boardPixelWidth, this.boardWidth)
    this.dropGridY = phina.util.Grid(this.boardPixelHeight, this.boardHeight)
  },

  // 基本的なオブジェクトを初期配置するメソッド
  $_initObjects () {
    // 市松模様のタイル画像（下部）
    MySprite(`tile_${this.boardSize}`).setOrigin(0, 0).moveTo(0, this.topMargin).addChildTo(this)

    // ドロップのスプライトを入れるグループ
    this.dropGroup = MyDisplayElement().moveTo(this.leftMargin, this.topMargin).addChildTo(this)

    // 背景画像（上部）
    MySprite(`space_${this.boardSize}`).setOrigin(0, 0).addChildTo(this)

    // ボタンを入れるグループ
    this.buttonGroup = MyDisplayElement().moveTo(0, this.topMargin - 136).addChildTo(this)
    
    // 開始位置指定、操作不可地点のスプライトを入れるグループ
    this.gimmickGroup = MyDisplayElement().moveTo(this.leftMargin, this.topMargin).addChildTo(this)
  },

  // Setter関数とGetter関数を定義するメソッド
  $_initSetterAndGetter () {
    this.setter('dropFall', newValue => {
      this._dropFall = newValue
    })
    this.getter('dropFall', () => {
      return this._dropFall
    })
    this.setter('activeDrops', newValue => {
      this._activeDrops = Array.from(newValue)
    })
    this.getter('activeDrops', () => {
      return Array.from(this._activeDrops)
    })
  },
})