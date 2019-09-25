/*
  MyGameAppで使用する定数・パラメーター
*/

export const SCREEN_HEIGHT = 1334  // ゲームキャンバス全体の高さ
export const SCREEN_WIDTH = 750    // ゲームキャンバス全体の幅
export const BASE_DROP_SIZE = 53   // ドロップ画像のサイズ

// ドロップに適用するサイズの比率
export const DROP_SCALE = {
  '5x6': 2.32,
  '6x7': 1.92,
}
// 盤面の余白（上部）
export const TOP_MARGIN = {
  '5x6': 718,
  '6x7': 719,
}
// 盤面の余白（左側）
export const LEFT_MARGIN = {
  '5x6': 5,
  '6x7': 17,
}
// 盤面の余白（右側）
export const RIGHT_MARGIN = {
  '5x6': 6,
  '6x7': 19,
}

// ゲームが使用する画像・音声データへのPATH
export const ASSETS = {
  image: {
    drops: require('../../assets/img/drops.png'),
    tile_5x6: require('../../assets/img/tile_5x6.png'),
    tile_6x7: require('../../assets/img/tile_6x7.png'),
    space_5x6: require('../../assets/img/space_5x6.png'),
    space_6x7: require('../../assets/img/space_6x7.png'),
    immovable: require('../../assets/img/immovable.png'),
    dragon_head: require('../../assets/img/dragon_head_.png'),
    dragon_tail: require('../../assets/img/dragon_tail_.png'),
  },
  sound: {
    move: require('../../assets/sound/move.mp3'),
    button: require('../../assets/sound/button.mp3'),
    select: require('../../assets/sound/Cyber17-1.mp3'),
  },
}

// コンボ時のサウンド（数が多いのでfor文で入れる）
for (let i = 1; i <= 18; i++) {
  ASSETS.sound[`combo_${i}`] = require(`../../assets/sound/combo_${i}.mp3`)
}

// ゲームを構成するシーン
export const SCENES = [
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