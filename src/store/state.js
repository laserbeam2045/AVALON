import { STATE, LEADER } from './constants'

export default {
  stateFlag: STATE.STANDBY, // 状態フラグ
  gameMethods: null,        // ゲームインスタンスのメソッド
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
    leader1: LEADER.YASHAMARU, // 自分のリーダー
    leader2: LEADER.YASHAMARU, // フレンドのリーダー
    maxCombo: 0,               // 盤面で可能な最大コンボ数
    maxMagni: 1,               // 盤面で可能な最大倍率
  },

  // 盤面に関する設定
  boardSettings: {
    typeA: {
      // 盤面のサイズ
      boardSize: {
        value: '5x6',
        values: ['5x6', '6x7'],
        labels: ['5x6', '6x7'],
      },
      // 最後まで探索するかどうか
      greedy: {
        value: false,
        values: [true, false],
        labels: ['ON', 'OFF'],
      },
    },
    typeB: {
      // 初期設定
      default: {
        clearable: [true, true, true, true, true, true, true, true, true, true, true],
        fallDrop: [true, true, true, true, true, true, true, false, false, false],
      },
      // 消せるドロップかどうか
      clearable: [true, true, true, true, true, true, true, true, true, true, true],
      // 落ちてくる可能性のあるドロップかどうか
      fallDrop: [true, true, true, true, true, true, true, false, false, false],
    },
    typeC: {
      board: [],                    // 盤面の状態
      startPosition: -1,            // 開始位置指定
      noEntryPositions: new Set(),  // 操作不可地点  
    },
  },

  // 探索方法全般に関する設定
  searchSettings: {
    width: {
      min: 1000,
      max: 90000,
      step: 1000,
      value: 50000,
    },
    depth: {
      min: 1,
      max: 90,
      step: 1,
      value: 38,
    },
    diagonalLimit: {
      min: 0,
      max: 5,
      step: 1,
      value: 0,
    },
    addCombo: {
      min: 0,
      max: 20,
      step: 1,
      value: 0,
    },
  },

  // 消し方に関する設定
  clearingSettings: {
    four      : [false, false, false, false, false, false, false],
    line      : [false, false, false, false, false, false, false, false],
    L         : [false, false, false, false, false, false, false],
    cross     : [false, false, false, false, false, false, false],
    square    : [false, false, false, false, false, false, false],
    numberOfClear: [false, false, false, false, false, false, false, false, false, false],
  },
}