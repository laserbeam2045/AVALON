import { STATE, LEADER } from '../constants'

export default {
  stateFlag: STATE.STANDBY, // 状態フラグ
  gameApp: null,            // ゲームインスタンス
  bestNode: null,           // 探索結果の最良ノード
  errorMessage: '',         // エラーメッセージ

  // API通信の成功・失敗フラグ
  apiConnectionFlag: {
    maximum: true,
    capture: true,
    search: true,
  },

  // リーダーに関する設定
  leaderSettings: {
    leader1: LEADER.METATRON, // 自分のリーダー
    leader2: LEADER.METATRON, // フレンドのリーダー
    maxCombo: 0,              // 盤面で可能な最大コンボ数
    maxMagnification: 1,      // 盤面で可能な最大倍率
  },

  // 盤面に関する設定
  boardSettings: {
    board: [],                      // 盤面の状態
    boardSize: '5x6',               // 盤面のサイズ
    dropFall: false,                // 落ちコンの有無
    greedy: false,                  // 最後まで探索するかどうか
    startPosition: -1,              // 開始位置指定
    immovablePositions: new Set(),  // 操作不可地点
  },

  // 探索方法全般に関する設定
  searchSettings: {
    width: {
      min: 1000,
      max: 50000,
      step: 1000,
      value: 10000,
    },
    depth: {
      min: 1,
      max: 60,
      step: 1,
      value: 38,
    },
    diagonalLimit: {
      min: 0,
      max: 0,
      step: 1,
      value: 0,
    },
    comboLimit: {
      min: 0,
      max: 0,
      step: 1,
      value: 0,
    },
  },

  // 消し方に関する設定
  clearingSettings: {
    twoWay      : [false, false, false, false, false, false, false],
    breakThrough: [false, false, false, false, false, false, false],
    line        : [false, false, false, false, false, false, false, false],
    cross       : [false, false, false, false, false, false, false],
    L           : [false, false, false, false, false, false, false],
    required    : [false, false, false, false, false, false, false, false, false, false],
    clearAll    : [false, false, false, false, false, false, false, false, false, false],
    clearZero   : [false, false, false, false, false, false, false, false, false, false],
    activeDrops : [true, true, true, true, true, true, true, false, false, false],
  },
}