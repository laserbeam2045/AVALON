import * as phina from 'phina.js'

const SCREEN_PIXEL_HEIGHT = 1334  // ゲームキャンバス全体の高さ
const SCREEN_PIXEL_WIDTH = 750    // ゲームキャンバス全体の幅
const BASE_DROP_SIZE = 53         // 元となるドロップ画像のサイズ

// ドロップに適用するサイズの比率
const DROP_SCALE = {
  '5x6': 2.32,
  '6x7': 1.92,
}
// 盤面の余白（上部）
const TOP_MARGIN = {
  '5x6': 718,
  '6x7': 719,
}
// 盤面の余白（左側）
const LEFT_MARGIN = {
  '5x6': 5,
  '6x7': 17,
}
// 盤面の余白（右側）
const RIGHT_MARGIN = {
  '5x6': 6,
  '6x7': 19,
}

// ゲームが使用する画像データのPATH
const ASSETS = {
  image: {
    drops: require('../assets/img/drops.png'),
    tile_5x6: require('../assets/img/tile_5x6.png'),
    tile_6x7: require('../assets/img/tile_6x7.png'),
    space_5x6: require('../assets/img/space_5x6.png'),
    space_6x7: require('../assets/img/space_6x7.png'),
    immovable: require('../assets/img/immovable.png'),
    dragon_head: require('../assets/img/dragon_head_.png'),
    dragon_tail: require('../assets/img/dragon_tail_.png'),
  },
  sound: {
    move: require('../assets/sound/move.mp3'),
    button: require('../assets/sound/button.mp3'),
    select: require('../assets/sound/Cyber17-1.mp3'),
  },
}

// コンボ時のサウンド（数が多いのでfor文で入れる）
for (let i = 1; i <= 18; i++) {
  ASSETS.sound[`combo_${i}`] = require(`../assets/sound/combo_${i}.mp3`)
}

// ゲームを構成するシーン
const SCENES = [
  {
    label: 'main',
    className: 'MainScene',
  },
  {
    label: 'input',
    className: 'InputScene',
    nextLabel: 'main',
  },
]

// デフォルトのGameAppを継承してカスタム機能を持たせたクラス
// Vueがこのクラスのインスタンスメソッドを使用することを想定している
export default phina.define('MyGameApp', {
  superClass: 'phina.game.GameApp',
  
  init (options) {
    const boardData = this._getBoardData(options)
    const screenData = this._getScreenData(boardData.boardSize)
    const { dropFall, activeDrops, vueMethods } = options

    options = (options || {}).$safe({
      query: options.query,
      startLabel: 'main',
      assets: ASSETS,
      scenes: SCENES,
      width: SCREEN_PIXEL_WIDTH,
      height: SCREEN_PIXEL_HEIGHT,
      fit: false,
      lineFlag: true,
      boardData,
      screenData,
      dropFall,
      activeDrops,
      vueMethods,
    })
    this.superInit(options)

    // 以下のプロパティはセッター関数を通じて直接代入できる
    this.setter('process', newValue => {
      this.currentScene.process = newValue
    })
    this.setter('dropFall', newValue => {
      this.currentScene.dropFall = newValue
    })
    this.setter('activeDrops', newValue => {
      this.currentScene.activeDrops = newValue
    })
  },

  // 手順線を表示させるメソッド
  displayLine (fadeTime, duration) {
    if ('summonDragon' in this.currentScene) {
      this.currentScene.summonDragon(fadeTime, duration)
    }
    return this
  },

  // 手順通りにドロップを動かすメソッド
  // moveTime: １マスあたりの移動にかける時間
  // duration: メソッド呼び出しまでの待機時間
  moveDrops (moveTime = 120, duration = 0) {
    if ('moveDrops' in this.currentScene) {
      this.currentScene.moveDrops(moveTime, duration)
    }
    return this
  },

  // ゲームを新しい状態で開始するメソッド
  // options: 以下のプロパティを持つオブジェクト
  //   board: 盤面の状態を表す配列（必須）
  //   process: 操作手順
  //   dropFall: 落ちコンの有無（真偽値）
  //   activeDrops: 落ちる可能性のある色（真偽値の配列）
  //   startPosition: 開始位置指定（-1以上の整数値）
  //   immovablePositions: 操作不可位置（Setオブジェクト）
  startNewGame (options) {
    const boardData = this._getBoardData(options)
    const screenData = this._getScreenData(boardData.boardSize)

    this.currentScene.exitTo('main', { boardData, screenData, ...options, dragon: null })
    return this
  },

  // 盤面に関する情報を整形してまとめるメソッド
  _getBoardData (options) {
    let { board, startPosition, immovablePositions } = options
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
      board, boardHeight, boardWidth, boardSize,
      startPosition, immovablePositions,
    }
  },

  // ゲーム作成に必要な情報を、盤面のサイズに応じてまとめるメソッド
  _getScreenData (boardSize) {
    return {
      screenPixelHeight : SCREEN_PIXEL_HEIGHT,
      screenPixelWidth  : SCREEN_PIXEL_WIDTH,
      baseDropSize      : BASE_DROP_SIZE,
      dropScale         : DROP_SCALE[boardSize],
      topMargin         : TOP_MARGIN[boardSize],
      leftMargin        : LEFT_MARGIN[boardSize],
      rightMargin       : RIGHT_MARGIN[boardSize],
    }
  },
})