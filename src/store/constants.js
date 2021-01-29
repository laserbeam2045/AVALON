
// アプリケーションの状態を表す定数
export const STATE = {
  STANDBY   : 0,  // 待機中
  SEARCHING : 1,  // 探索中
  SEARCH_END: 2,  // 探索終了
}

// 扱うドロップの種類数を表す定数
export const DROP_TYPE_MAX = 10

// ドロップの種類を表す定数
export const DROP_TYPE = {
  FIRE          : 1,
  WATER         : 2,
  WOOD          : 3,
  LIGHT         : 4,
  DARK          : 5,
  HEART         : 6,
  BLOCK         : 7,
  POISON        : 8,
  DEADLY_POISON : 9,
  BOMB          : 10,
}

// 各リーダーの表示名と識別用の値
export const LEADER = {
  ANUBIS    : 0,
  METATRON  : 1,
  KOMASAN   : 2,
  AMEN      : 3,
  HYLEN     : 4,
  COCO      : 5,
  VEROAH    : 6,
  YASHAMARU : 7,
  SHIKI     : 8,
  TRAGON    : 9,
  APOLLON   : 10,
  AMAKOZUMI : 11,
  WRATH     : 12,
}

// Ajax通信を行う際のサーバーアドレス
export const SERVER_ADDRESS = {
  Python  : 'http://127.0.0.1:8000/api/capture/',
  Node    : 'http://127.0.0.1:1200/api/maxData/',
  //Node    : 'http://35.221.97.56:1200/api/maxData/',
  C       : 'http://127.0.0.1:12345/',
  //C       : 'http://35.221.97.56:12345/',
}