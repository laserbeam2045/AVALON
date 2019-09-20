import * as phina from 'phina.js'
import BaseScene from './base'
import StylishButton from '../ui/stylishButton'
import { GrabbedDrop } from '../display/drops'
import Dragon from '../display/dragon/dragon'
import MoveCountLabel from '../display/moveCountLabel'
import ComboEffects from '../display/ComboEffects'

export default () => {
  phina.define('MainScene', {
    superClass: BaseScene,

    init (options) {
      this.superInit(options)
      this._initFlags()
      this._initButtons()
      this._initMoveCountLabel()
      this.initializeDrops()
      this.initializeStartPosition()
      this.initializeImmovablePositions()
      this._initDragons(options)
      this.comboEffects = ComboEffects().moveTo(this.leftMargin, this.topMargin).addChildTo(this)
    },

    // 手順線を作成するメソッド
    // process: 操作手順の配列
    // fadeTime: １パーツのフェードインにかける時間
    // duration: 実行までの待機時間
    createDragon (process, fadeTime, duration) {
      this.process = process
      this.dragon = Dragon({
        process,
        fadeTime,
        duration,
        dropSize: this.dropSize,
        boardWidth: this.boardWidth,
        displayFlag: this.lineFlag,
      })
      .moveTo(this.leftMargin, this.topMargin)
      .addChildTo(this)
    },

    // 手順通りにドロップを自動で動かすメソッド
    // process: 操作手順の配列
    // moveTime: １マスあたりの移動にかける時間
    // duration: 実行までの待機時間
    moveDrops (process, moveTime, duration = 0) {
      this.process = process
      setTimeout(() => {
        this._moveDrops(moveTime)
      }, duration)
    },

    // 各種フラグ、パラメータを初期化するメソッド
    _initFlags () {
      this.dragOkFlag = true    // ドロップを動かしていいかどうか
      this.changeFlag = false   // ドロップを動かしたかどうか
      this.combo = 0            // コンボ数
    },

    // ボタンを配置するメソッド
    _initButtons () {
      const buttonNum = 6
      const GridX = phina.util.Grid(this.screenPixelWidth, buttonNum)
      const buttonData = {
        INPUT   : this._inputButtonProcessing,
        RESET   : this._resetButtonProcessing,
        SHUFFLE : this.vueMethods.shuffle,
        SEARCH  : this.vueMethods.search,
        MOVE    : this._moveButtonProcessing,
        HIDE    : this._hideButtonProcessing,
      }
      Object.entries(buttonData).forEach(([name, func], index) => {
        const x = GridX.span(0.5 + index)
        const y = GridX.span(0.5)
        StylishButton(name).moveTo(x, y).addChildTo(this.buttonGroup)
          .addEventListener('pointstart', func.bind(this))
      })
      this._switchHideButtonName()
    },

    // 移動回数ラベルを配置するメソッド
    _initMoveCountLabel () {
      const x = this.screenPixelWidth - 65
      const y = this.topMargin - 185
      this.moveCountLabel = MoveCountLabel().moveTo(x, y).addChildTo(this)
    },

    // 場合によりドラゴンを表示させ、場合によりドロップを動かすメソッド
    _initDragons (options) {
      if (this.process) {
        if (options.resetButtonFlag || !this.dragon) {
          this.createDragon(options.process, 80)
        } else {
          this.dragon.addChildTo(this)
        }
        if (options.moveButtonFlag) {
          this.moveDrops(this.process, 100)
        }
      }
    },

    // ドロップの操作を開始したときのイベント処理
    onpointstart (event) {
      if (!this.dragOkFlag) return

      const { X, Y, Z } = this.getPositionOfDrop(event)
      if (this.isOutOfBoard(X, Y)) return

      const color = this.board[Z]
      this.dragStartIndex = Z
      this.dragStartDrop = this.dropSprites[Z].setAlpha(0.3)
      this.grabbedDrop = GrabbedDrop(this.baseDropSize).setFrameIndex(color).move(event)
                          .setScale(this.dropScale * 1.1).setAlpha(0.7).addChildTo(this)
      if (this.dragon && this.lineFlag) {
        this.dragon.setAlpha(0.6, 300)
      }
    },

    // ドロップを動かしているときのイベント処理
    onpointmove (event) {
      if (!this.dragOkFlag) return
      if (this.dragStartIndex === undefined) return

      const { Z } = this.getPositionOfDrop(event, true)

      this.grabbedDrop.move(event)

      if (this.dragStartIndex !== Z) {
        this.playSound('move')
        this._swapDrops(this.dragStartIndex, Z, true)
        this.combo = 0
        this.changeFlag = true
        this.dragStartIndex = Z
        this.moveCountLabel.increment()
      }
    },

    // ドロップの操作を終了したときのイベント処理
    onpointend () {
      if (!this.dragOkFlag) return
      if (this.dragStartIndex === undefined) return

      this.dragStartDrop.setAlpha(1)
      this.grabbedDrop.remove()
      delete this.dragStartIndex
      delete this.dragStartDrop
      delete this.grabbedDrop

      if (this.changeFlag) {
        this.dragOkFlag = false
        this._fadeOutObjects(50)
        this._finishMoveAnimation()
        setTimeout(this._clearDrops.bind(this), 200)
      } else {
        if (this.lineFlag) {
          this._fadeInObjects(200)
        }
      }
    },

    // ドロップを入れ替えるメソッド
    // 引数：moveFlag(アニメーションでの移動をさせるかどうか)
    _swapDrops (index_1, index_2, moveFlag = false) {
      const { board, dropSprites } = this

      if (moveFlag) {
        const [x1, y1] = this.getCoordinatesOfDrop(index_1)
        const [x2, y2] = this.getCoordinatesOfDrop(index_2)
        const time = 100
        this._finishMoveAnimation()
        dropSprites[index_1].tweenMoveTo(x2, y2, time)
        dropSprites[index_2].tweenMoveTo(x1, y1, time)
      }
      // 配列要素をスワップする
      [board[index_1], board[index_2]] =
      [board[index_2], board[index_1]];
      [dropSprites[index_1], dropSprites[index_2]] =
      [dropSprites[index_2], dropSprites[index_1]];
    },

    // 全てのドロップの移動を完了させるメソッド
    _finishMoveAnimation () {
      this.dropSprites.forEach(drop => drop.tweenMoveTo())
    },

    // コンボ時のエフェクトを実行するメソッド
    _playComboEffect (index) {
      this.combo++
      const soundNum = Math.min(18, this.combo)
      this.playSound(`combo_${soundNum}`)

      let fontSize
      switch (this.boardSize) {
        case '5x6': fontSize = 23; break
        case '6x7': fontSize = 19; break
      }
      const text = `Combo ${this.combo}`
      const [x, y] = this.getCoordinatesOfDrop(index)
      this.comboEffects.addLabel({ text, x, y, index, fontSize })
    },

    // 与えられた配列の中央値(偶数の場合は先頭に近い方)を返すメソッド
    _getMedian (arr) {
      const half = (arr.length / 2) | 0

      return arr.sort((a, b) => a - b)[half]
    },

    // ドロップを消すメソッド
    _clearDrops () {
      const FADE_TIME = 410   // 一つのコンボが消えるのにかかる時間（ミリ秒）
      const clearablePlaces = this._getClearablePlacesAsArray()
      const comboNum = clearablePlaces.length

      // 消えるドロップがなければ終了
      if (!comboNum) {
        if (this.dropFall) {
          this.dragOkFlag = true
        }
        setTimeout (() => this.comboEffects.clear(), 1000)
        return
      }
      // コンボごとに処理の実行をずらす
      for (let i = 0; i < comboNum; i++) {
        setTimeout(() => {
          clearablePlaces[i].forEach(index => {
            const drop = this.dropSprites[index]
            drop.tweener.fadeOut(FADE_TIME).call(() => drop.remove()).play()
            this.board[index] = 0
          })
          const index = this._getMedian(clearablePlaces[i])
          this._playComboEffect(index)
        }, FADE_TIME * i)
      }
      // 全てのドロップが消えるのを待ってから、ドロップを落とすメソッドを呼び出す
      setTimeout(this._dropDrops.bind(this), FADE_TIME * comboNum)
    },

    // ドロップを落とすメソッド
    _dropDrops () {
      const FALL_TIME = 325 // ドロップが落ちるまでにかかる時間(ミリ秒)
      const { board, dropSprites, boardWidth, boardHeight } = this

      // 盤面に残ったドロップを落とす
      for (let X = 0; X < boardWidth; X++) {
        for (let Y = boardHeight - 1; 0 < Y; Y--) {
          let lowIndex = this.get1dIndex(X, Y)
          if (board[lowIndex] !== 0) continue

          for (let i = 1; i <= Y; i++) {
            let highIndex = lowIndex - (boardWidth * i)
            if (board[highIndex] === 0) continue

            const drop = dropSprites[highIndex]
            const [x, y] = this.getCoordinatesOfDrop(X, Y)
            this._swapDrops(lowIndex, highIndex)
            drop.tweenMoveTo(x, y, FALL_TIME)
            break
          }
        }
      }
      // 落ちコンありの設定なら、新しいドロップを作成する
      if (this.dropFall) this._dropNewDrops(FALL_TIME)

      // ドロップが落ちるのを待ってから、ドロップを消すメソッドを呼び出す
      setTimeout(this._clearDrops.bind(this), FALL_TIME)
    },

    // 盤面の上から降ってくるドロップを作成して落とすメソッド
    // fallTime: ドロップが落ちるまでにかかる時間(ミリ秒)
    _dropNewDrops (fallTime) {
      const { board, dropSprites, boardWidth, boardHeight } = this

      for (let X = 0; X < boardWidth; X++) {
        let dropCount = 0   // 1列ごとの新規ドロップの数

        for (let Y = boardHeight - 1; 0 <= Y; Y--) {
          const index = this.get1dIndex(X, Y)
          if (board[index] !== 0) continue

          const color = this._getRandomColor()              // 新しいドロップの色
          const newDrop = this.createDrop(color, index)     // 新しいドロップ
          const y0 = this.dropGridY.span(-dropCount - 0.5)  // 少し間引いたy座標
          const { x, y } = newDrop   // 落とす先の座標

          board[index] = color
          dropSprites[index] = newDrop
          newDrop.moveTo(x, y0).addChildTo(this.dropGroup).tweenMoveTo(x, y, fallTime)
          dropCount++
        }
      }
    },

    // ランダムな色を返すメソッド
    _getRandomColor () {
      let color = 0
      if (this.activeDrops[0]) {
        do {
          color = Math.floor(Math.random() * 10 + 1)
        } while(!this.activeDrops[color])
      }
      return color
    },

    // 消えるドロップの座標を取得するメソッド
    // 戻り値：2次元配列(消える座標の配列を含む配列)、
    // または、空の配列（一つも消えないとき）
    _getClearablePlacesAsArray () {
      const board = Array.from(this.board)
      const clearablePlaceArray = []
      const checked = new Set()
      let X, Y, comboCount = 0

      // ドロップが消える座標を取得
      const clearablePlaceSet = this._getClearablePlacesAsSet(board)

      // コンボごとに消える座標の配列を作る
      for (Y = this.boardHeight; Y--;) {
        for (X = 0; X < this.boardWidth; X++) {
          const index = this.get1dIndex(X, Y)
          if (clearablePlaceSet.has(index) && !checked.has(index)) {
            const color = board[index]
            const array = clearablePlaceArray[comboCount] = []
            this._pushClearablePlaces({ board, index, color, clearablePlaceSet, array, checked })
            comboCount++
          }
        }
      }
      return clearablePlaceArray
    },

    // 消えるドロップの座標を取得するメソッド
    // 戻り値：消える座標を値として持つSetインスタンス
    _getClearablePlacesAsSet (board) {
      const { boardHeight, boardWidth } = this
      const clearablePlaceSet = new Set()

      // 横に同じ色が３つ並んでいるかどうかを調べる
      for (let Y = 0; Y < boardHeight; Y++) {
        for (let X = 0; X < boardWidth - 2; X++) {
          const idx_1 = this.get1dIndex(X, Y)
          const idx_2 = idx_1 + 1
          const idx_3 = idx_2 + 1
          this._addClearablePlaces(board, idx_1, idx_2, idx_3, clearablePlaceSet)
        }
      }
      // 縦に同じ色が３つ並んでいるかどうかを調べる
      for (let X = 0; X < boardWidth; X++) {
        for (let Y = 0; Y < boardHeight - 2; Y++) {
          const idx_1 = this.get1dIndex(X, Y)
          const idx_2 = idx_1 + boardWidth
          const idx_3 = idx_2 + boardWidth
          this._addClearablePlaces(board, idx_1, idx_2, idx_3, clearablePlaceSet)
        }
      }
      return clearablePlaceSet
    },

    // 与えられた配列について、与えられたIndexの要素がすべて等しく、
    // かつ０ではないときだけ、setに各Indexを追加するメソッド
    _addClearablePlaces (array, idx_1, idx_2, idx_3, set) {
      if (array[idx_1] !== 0 &&
          array[idx_1] === array[idx_2] &&
          array[idx_1] === array[idx_3])
      {
        set.add(idx_1)
        set.add(idx_2)
        set.add(idx_3)
      }
    },

    // board[index]のドロップ、及び、縦横で繋がっている同色のドロップの座標を、配列に格納するメソッド
    // コンボごとに座標をまとめるため、座標を格納することと、その座標を確認済みとする目的で使う
    _pushClearablePlaces (conditions) {
      const index = conditions.index
      const [X, Y] = this.get2dIndex(index)

      conditions.array.push(index)   // この座標を配列に追加
      conditions.checked.add(index)  // この座標を調査済みとする

      // 上下左右を確認し、条件を満たす場合は、再帰呼び出しを行う
      this._directions.forEach(direction => {
        const nextX = X + direction.X,
              nextY = Y + direction.Y,
              nextIndex = this.get1dIndex(nextX, nextY)

        if (this._checkRecursionCondition(nextX, nextY, nextIndex, conditions)) {
          conditions.index = nextIndex
          this._pushClearablePlaces(conditions)
        }
      })
    },

    // 上下左右へ展開する際の移動量の配列
    // _pushClearablePlacesメソッドで使用する
    _directions: [
      {X:  0, Y: -1},
      {X:  0, Y: +1},
      {X: -1, Y:  0},
      {X: +1, Y:  0},
    ],

    // 与えられた座標が、再帰呼び出しを行う条件を満たしているかどうかを返すメソッド
    // _pushClearablePlacesメソッドで使用する
    // 戻り値：true(条件を満たしている) or false(条件を満たしていない)
    _checkRecursionCondition (X, Y, index, conditions) {
      return (
        this.isInsideOfBoard(X, Y) &&                   // 座標が盤面の内側であるかどうか
        conditions.clearablePlaceSet.has(index) &&      // 座標のドロップが消えるかどうか
        conditions.board[index] === conditions.color && // 座標のドロップが同じ色かどうか
        !conditions.checked.has(index)                  // 座標が非調査済みであるかどうか
      )
    },

    // 手順通りにドロップを自動で動かすメソッド
    // moveTime: １マスの移動にかける時間(ミリ秒)
    _moveDrops (moveTime) {
      const grabbedDrop = this.dropSprites[this.process[0]]

      this.dragOkFlag = false
      grabbedDrop.setAlpha(0.5).addChildTo(this.dropGroup)

      for (let i = 0; i < this.process.length - 1; i++) {
        const currIndex = this.process[i],
              nextIndex = this.process[i + 1],
              nextDrop = this.dropSprites[nextIndex],
              [curr_x, curr_y] = this.getCoordinatesOfDrop(currIndex),
              [next_x, next_y] = this.getCoordinatesOfDrop(nextIndex)

        this._swapDrops(currIndex, nextIndex)
        grabbedDrop.tweener.call(() => {
          nextDrop.tweener
            .wait(moveTime / 2)
            .moveTo(curr_x, curr_y, 100)
            .play()
        })
        .moveTo(next_x, next_y, moveTime)
      }
      grabbedDrop.tweener.call(() => {
        grabbedDrop.setAlpha(1)
        this.dragOkFlag = true
        this.changeFlag = true
      })
      .play()
    },

    // INPUTボタン押下時の処理
    _inputButtonProcessing () {
      this.exitTo('input')
    },

    // RESETボタン押下時の処理
    _resetButtonProcessing () {
      this.exitTo('main', {
        resetButtonFlag: true,
      })
    },

    // MOVEボタン押下時の処理
    _moveButtonProcessing () {
      this.exitTo('main', {
        moveButtonFlag: true,
      })
    },

    // HIDEボタン押下時の処理
    _hideButtonProcessing () {
      if (this.lineFlag) {
        this._fadeOutObjects()
      } else {
        this._fadeInObjects()
      }
      this.lineFlag = !this.lineFlag
      this._switchHideButtonName()
    },

    // ドラゴン・操作不可・開始位置指定オブジェクトを非表示にするメソッド
    _fadeOutObjects (duration = 200) {
      if (this.dragon) {
        this.dragon.fadeOut(duration)
      }
      this.harassmentGroup.children.forEach(obj => {
        obj.fadeOut(duration)
      })
    },

    // ドラゴン・操作不可・開始位置指定オブジェクトを表示状態にするメソッド
    _fadeInObjects (duration = 200) {
      if (this.dragon) {
        this.dragon.fadeIn(duration)
      }
      this.harassmentGroup.children.forEach(obj => {
        obj.fadeIn(duration)
      })
    },

    // lineFlagに応じてHIDE(SHOW)ボタンの表示名を変えるメソッド
    _switchHideButtonName () {
      if (this.lineFlag) {
        this._setButtonName(5, 'HIDE')
      } else {
        this._setButtonName(5, 'SHOW')
      }
    },

    // ボタンの表示名を変更するメソッド
    _setButtonName (btnIndex, text) {
      this.buttonGroup.children[btnIndex].text = text
    },
  })
}