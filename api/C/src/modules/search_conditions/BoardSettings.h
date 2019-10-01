#ifndef _BOARD_SETTINGS_H_
#define _BOARD_SETTINGS_H_

#include <stdbool.h>
#include "../../constants.h"
#include "../io/Parser.h"
#include "../Board.h"

// 盤面に関する設定
typedef struct {
  Board board;                          // 初期盤面
  bool dropFall;                        // 落ちコンの有無
  bool greedy;                          // 最後まで探索するかどうか
  int activeDrops;                      // 落ちてくるドロップ（ビットフラグ）
  char startPosition;                   // 開始位置指定
  char noEntryPositions[BOARD_LEN_MAX]; // 操作不可地点
  char noEntryPositionsCount;           // 操作不可地点の数
} BoardSettings;

// 初期化関数
extern void BoardSettings_init(BoardSettings* this, char *body);

// board属性の先頭ポインタを返す関数
extern Board* BoardSettings_getBoard(BoardSettings* this);

// dropFall属性を返す関数
extern bool BoardSettings_getDropFall(BoardSettings* this);

// greedy属性を返す関数
extern bool BoardSettings_getGreedy(BoardSettings* this);

// activeDrops属性を返す関数
extern int BoardSettings_getActiveDrops(BoardSettings* this);

// 与えられた引数の座標が、開始位置として選択可能かどうかを判定する関数
// position    判定対象となる座標
// 戻り値：0（ 選択可能）or 1（選択不可能）
extern char BoardSettings_isUnstartable(BoardSettings* this, const char position);

// 与えられた引数の座標が、操作不可地点に含まれるかどうかを判定する関数
// position    判定対象となる座標
// 戻り値：0（ 含まれていない）or 1（含まれている）
extern char BoardSettings_isNoEntryPosition(BoardSettings* this, const char position);

#endif  // _BOARD_SETTINGS_H_