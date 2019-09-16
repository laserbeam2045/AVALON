
// アプリケーションの状態を表す定数
export const STANDBY = 0        // 待機中
export const SEARCHING = 1      // 探索中
export const SEARCH_END = 2     // 探索終了

// 扱うドロップの種類数を表す定数
export const DROP_TYPE_MAX = 9

// ドロップの種類を表す定数
export const DROP_TYPE_FIRE = 1
export const DROP_TYPE_WATER = 2
export const DROP_TYPE_WOOD = 3
export const DROP_TYPE_LIGHT = 4
export const DROP_TYPE_DARK = 5
export const DROP_TYPE_HEART = 6
export const DROP_TYPE_BLOCK = 7
export const DROP_TYPE_POISON = 8
export const DROP_TYPE_DEADLY_POISON = 9
export const DROP_TYPE_BOMB = 10

// 各リーダーの表示名と識別用の値
export const LEADER = {
  ANUBIS    : 0,
  METATRON  : 1,
  KOMASAN   : 2,
  AMEN      : 3,
  HYLEN     : 4,
  COCO      : 5,
  VEROAH    : 6,
}

// Ajax通信を行う際のサーバーアドレス
export const SERVER_ADDRESS = {
  python  : 'http://127.0.0.1:8000/api/capture/',
  Node    : 'http://127.0.0.1:1000/api/maxData/',
  C       : 'http://127.0.0.1:12345/',
}