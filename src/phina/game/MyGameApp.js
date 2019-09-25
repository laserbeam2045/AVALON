import * as phina from 'phina.js'
import * as $CONST from './MyGameAppConstants'

// デフォルトのGameAppを継承してカスタム機能を持たせたクラス
// Vueがこのクラスのインスタンスメソッドを使用することを想定している
export default phina.define('MyGameApp', {
  superClass: 'phina.game.GameApp',
  
  init (options) {
    const boardData = getBoardData(options)
    const screenData = getScreenData(boardData.boardSize)
    const vueMethods = options.vueMethods

    options = (options || {}).$safe({
      query: options.query,
      startLabel: 'main',
      assets: $CONST.ASSETS,
      scenes: $CONST.SCENES,
      width: $CONST.SCREEN_WIDTH,
      height: $CONST.SCREEN_HEIGHT,
      fit: false,
      boardData,
      screenData,
      vueMethods,
      lineFlag: true,
    })
    this.superInit(options)
  },

  // 外部に公開するメソッドを取得するメソッド
  getGameMethods () {
    return {
      displayLine   : this.displayLine.bind(this),
      moveDrops     : this.moveDrops.bind(this),
      startNewGame  : this.startNewGame.bind(this),
      setDropFall   : this.setDropFall.bind(this),
      setActiveDrops: this.setActiveDrops.bind(this),
    }
  },

  // 手順線を表示させるメソッド
  // process: 操作手順の配列
  // fadeTime: １パーツのフェードインにかける時間
  // duration: 実行までの待機時間
  displayLine (process, fadeTime, duration) {
    if (process && 'createDragon' in this.currentScene) {
      this.currentScene.createDragon(process, fadeTime, duration)
    }
  },

  // 手順通りにドロップを自動で動かすメソッド
  // process: 操作手順の配列
  // moveTime: １マスあたりの移動にかける時間
  // duration: 実行までの待機時間
  moveDrops (process, moveTime, duration) {
    if (process && 'moveDrops' in this.currentScene) {
      this.currentScene.moveDrops(process, moveTime, duration)
    }
  },

  // ゲームを新しい状態で開始するメソッド
  // options: 以下のプロパティを持つオブジェクト
  //   board: 盤面の状態を表す配列（必須）
  //   dropFall: 落ちコンの有無（真偽値）
  //   activeDrops: 落ちる可能性のある色（真偽値の配列）
  //   startPosition: 開始位置指定（-1以上の整数値）
  //   immovablePositions: 操作不可地点（Setオブジェクト）
  startNewGame (options) {
    const boardData = getBoardData(options)
    const screenData = getScreenData(boardData.boardSize)

    this.currentScene.exitTo('main', {
      boardData,
      screenData,
      ...options,
      dragon: null,
      process: null,
    })
  },

  // dropFallプロパティをセットするメソッド
  // value: 真偽値
  setDropFall (value) {
    this.currentScene.dropFall = value
  },

  // activeDropsプロパティをセットするメソッド
  // value: 真偽値の配列
  setActiveDrops (value) {
    this.currentScene.activeDrops = value
  },
})


// 盤面に関する情報を抽出してまとめる関数
// 戻り値：オブジェクト
function getBoardData(options) {
  const { board, dropFall, activeDrops, startPosition, immovablePositions } = options
  let boardHeight = null
  let boardWidth = null
  let boardSize = null

  switch (board.length) {
  case 30:
    boardHeight = 5
    boardWidth = 6
    boardSize = '5x6'
    break
  case 42:
    boardHeight = 6
    boardWidth = 7
    boardSize = '6x7'
    break
  }
  return {
    board, dropFall, activeDrops, startPosition, immovablePositions,
    boardHeight, boardWidth, boardSize,
  }
}

// ゲーム作成に必要な情報を、盤面のサイズに応じてまとめる関数
// 戻り値：オブジェクト
function getScreenData(boardSize) {
  return {
    screenHeight : $CONST.SCREEN_HEIGHT,
    screenWidth  : $CONST.SCREEN_WIDTH,
    baseDropSize : $CONST.BASE_DROP_SIZE,
    dropScale    : $CONST.DROP_SCALE[boardSize],
    topMargin    : $CONST.TOP_MARGIN[boardSize],
    leftMargin   : $CONST.LEFT_MARGIN[boardSize],
    rightMargin  : $CONST.RIGHT_MARGIN[boardSize],
  }
}