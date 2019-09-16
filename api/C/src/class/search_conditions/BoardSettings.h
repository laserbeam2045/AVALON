#ifndef _BOARD_SETTINGS_H_
#define _BOARD_SETTINGS_H_

#include <stdbool.h>
#include "../../constants.h"
#include "../Board.h"

// 盤面に関する設定
typedef struct {
  Board board;                            // 初期盤面
  bool dropFall;                          // 落ちコンの有無
  bool greedy;                            // 最後まで探索するかどうか
  int activeDrops;                        // 落ちてくるドロップ（ビットフラグ）
  char startPosition;                     // 開始位置指定
  char immovablePositions[BOARD_LEN_MAX]; // 操作不可地点
  char immovablePositionsCount;           // 操作不可地点の数
} BoardSettings;

// 初期化関数
extern void BoardSettings_init(BoardSettings* this, const char height, const char width);

// board属性を初期化する関数
extern void BoardSettings_initBoard(BoardSettings* this, const char state[]);

// board属性の先頭ポインタを返す関数
extern Board* BoardSettings_getBoard(BoardSettings* this);

// dropFall属性に値をセットする関数
extern void BoardSettings_setDropFall(BoardSettings* this, bool dropFall);

// dropFall属性を返す関数
extern bool BoardSettings_getDropFall(BoardSettings* this);

// greedy属性に値をセットする関数
extern void BoardSettings_setGreedy(BoardSettings* this, bool greedy);

// greedy属性を返す関数
extern bool BoardSettings_getGreedy(BoardSettings* this);

// activeDrops属性に値をセットする関数
extern void BoardSettings_setActiveDrops(BoardSettings* this, const int activeDrops);

// activeDrops属性を返す関数
extern int BoardSettings_getActiveDrops(BoardSettings* this);

// startPosition属性に値をセットする関数
extern void BoardSettings_setStartPosition(BoardSettings* this, const char startPosition);

// immovablePositions属性に値をセットする関数
extern void BoardSettings_setImmovablePositions(BoardSettings* this, const char positions[], const char positionsCount);

// 与えられた引数の座標が、開始位置として選択可能かどうかを判定する関数
// position    判定対象となる座標
// 戻り値：0（ 選択可能）or 1（選択不可能）
extern char BoardSettings_isUnstartable(BoardSettings* this, const char position);

// 与えられた引数の座標が、操作不可地点に含まれるかどうかを判定する関数
// position    判定対象となる座標
// 戻り値：0（ 含まれていない）or 1（含まれている）
extern char BoardSettings_isImmovablePosition(BoardSettings* this, const char position);

#endif  // _BOARD_SETTINGS_H_