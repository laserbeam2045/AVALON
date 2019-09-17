import * as phina from 'phina.js'
import BaseScene from './base'
import StylishButton from '../ui/stylishButton'
import { GrabbedDrop } from '../display/drops'
import Dragon from '../display/dragon/dragon'
import MoveCountLabel from '../display/moveCountLabel'

export default () => {
  phina.define('MainScene', {
    superClass: BaseScene,

    init (options) {
      this.superInit(options)

      this._initializeFlags()
      this._initializeButtons()
      this._setMoveCountLabel()
      this.initializeDrops()
      this.initializeStartPosition()
      this.initializeImmovablePositions()

      // 場合により手順線を表示させ、場合によりドロップを動かす
      if (this.process && this.process.length) {
        if (this.dragon) {
          this.dragon.addChildTo(this)
          if (this.lineFlag) {
            this.dragon.setAlpha(1)
          }
        } else {
          this.summonDragon(options.moveTime, options.moveDuration)
        }
        if (options.moveFlag) {
          setTimeout(() => {
            this._moveDrops(options.moveTime)
          }, options.moveDuration)
        }
      }
    },

    // 手順線を表示させるメソッド
    summonDragon (time, duration) {
      this.dragon = Dragon({
        time,
        duration,
        process: this.process,
        dropSize: this.dropSize,
        boardWidth: this.boardWidth,
      })
      .moveTo(this.leftMargin, this.topMargin)
      .addChildTo(this)
    },

    // 手順通りにドロップを自動で動かすメソッド
    // (ゲームを初期化してから実際のメソッドを呼び出す)
    // moveTime: １マスの移動にかける時間(ミリ秒)
    // moveDuration: メソッド呼び出しまでの待ち時間
    moveDrops (moveTime, moveDuration = 0) {
      if (this.process) {
        this.exitTo('main', {
          moveFlag: true,
          moveTime,
          moveDuration,
        })
      }
    },

    // 各種フラグ、パラメータを初期化するメソッド
    _initializeFlags () {
      this.dragOkFlag = true    // ドロップを動かしていいかどうか
      this.changeFlag = false   // ドロップを動かしたかどうか
      this.combo = 0            // コンボ数
    },

    // ボタンを配置するメソッド
    _initializeButtons () {
      const buttonNum = 6
      const GridX = phina.util.Grid(this.screenPixelWidth, buttonNum)
      const buttonData = {
        INPUT   : () => { this.exitTo('input') },
        RESET   : () => { this.exitTo('main') },
        SHUFFLE : () => { this.vueMethods.shuffle() },
        SEARCH  : () => { this.vueMethods.search() },
        MOVE    : () => { this._moveProcessing() },
        HIDE    : () => { this._switchDisplayFlag() },
      }
      Object.entries(buttonData).forEach(([name, func], index) => {
        const x = GridX.span(index) - 4
        StylishButton(name).setOrigin(0, 0).moveTo(x, 0)
          .addEventListener('pointstart', func).addChildTo(this.buttonGroup)
      })
    },

    // 移動回数ラベルを配置するメソッド
    _setMoveCountLabel () {
      const x = this.screenPixelWidth - 65
      const y = this.topMargin - 185
      this.moveCountLabel = MoveCountLabel().moveTo(x, y).addChildTo(this)
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
    _playComboEffect () {
      this.combo++
      const soundNum = Math.min(18, this.combo)
      this.playSound(`combo_${soundNum}`)
    },

    // ドロップを消すメソッド
    _clearDrops () {
      const FADE_TIME = 400   // 一つのコンボが消えるのにかかる時間（ミリ秒）
      const clearablePlaces = this._getClearablePlacesAsArray()
      const comboNum = clearablePlaces.length

      // 消えるドロップがなければ終了
      if (!comboNum) {
        if (this.dropFall) {
          this.dragOkFlag = true
        }
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
          this._playComboEffect()
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
      const firstIndex = this.process[0]
      const grabbedDrop = this.dropSprites[firstIndex]

      this.dragOkFlag = false
      grabbedDrop.setAlpha(0.5)
      for (let i = 0; i < this.process.length - 1; i++) {
        const currIndex = this.process[i],
              nextIndex = this.process[i + 1],
              nextDrop = this.dropSprites[nextIndex],
              [curr_x, curr_y] = this.getCoordinatesOfDrop(currIndex),
              [next_x, next_y] = this.getCoordinatesOfDrop(nextIndex)

        grabbedDrop.tweener.call(() => {
          nextDrop.tweener.wait(moveTime / 2).moveTo(curr_x, curr_y, moveTime / 2).play()
        })
        .moveTo(next_x, next_y, moveTime)

        this._swapDrops(currIndex, nextIndex)
      }
      grabbedDrop.tweener.call(() => {
        grabbedDrop.setAlpha(1)
        this.dragOkFlag = true
        this.changeFlag = true
      })
      .play()
    },

    // MOVEボタン押下時の処理
    _moveProcessing () {
      if (this.lineFlag) {
        this.moveDrops(100)
      } else {
        this.moveDrops(100)
      }
    },

    // ドラゴン・操作不可・開始位置指定オブジェクトの表示・非表示を切り替えるメソッド
    _switchDisplayFlag () {
      if (this.lineFlag) {
        this._fadeOutObjects()
      } else {
        this._fadeInObjects()
      }
      this.lineFlag = !this.lineFlag
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
  })
}