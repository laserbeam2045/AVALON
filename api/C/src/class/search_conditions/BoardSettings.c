#include "BoardSettings.h"


// 初期化関数
void BoardSettings_init(BoardSettings* this, const char height, const char width)
{
  Board_initClass(&this->board, height, width);
}

// board属性を初期化する関数
void BoardSettings_initBoard(BoardSettings* this, const char state[])
{
  Board_init(&this->board, state);
}

// board属性の先頭ポインタを返す関数
Board* BoardSettings_getBoard(BoardSettings* this)
{
  return &this->board;
}

// dropFall属性に値をセットする関数
void BoardSettings_setDropFall(BoardSettings* this, bool dropFall)
{
  this->dropFall = dropFall;
}

// dropFall属性を返す関数
bool BoardSettings_getDropFall(BoardSettings* this)
{
  return this->dropFall;
}

// greedy属性に値をセットする関数
void BoardSettings_setGreedy(BoardSettings* this, bool greedy)
{
  this->greedy = greedy;
}

// greedy属性を返す関数
bool BoardSettings_getGreedy(BoardSettings* this)
{
  return this->greedy;
}

// activeDrops属性に値をセットする関数
void BoardSettings_setActiveDrops(BoardSettings* this, const int activeDrops)
{
  this->activeDrops = activeDrops;
}

// activeDrops属性を返す関数
int BoardSettings_getActiveDrops(BoardSettings* this)
{
  return this->activeDrops;
}

// startPosition属性に値をセットする関数
void BoardSettings_setStartPosition(BoardSettings* this, const char startPosition)
{
  this->startPosition = startPosition;
}

// noEntryPositions属性に値をセットする関数
void BoardSettings_setNoEntryPositions(BoardSettings* this, const char positions[], const char positionsCount)
{
  for (char i = 0; i < positionsCount; i++) {
    this->noEntryPositions[i] = positions[i];
  }
  this->noEntryPositionsCount = positionsCount;
}

// 与えられた引数の座標が、開始位置として選択可能かどうかを判定する関数
char BoardSettings_isUnstartable(BoardSettings* this, const char position)
{
  if (this->startPosition != -1 &&
      this->startPosition != position)
  {
    return 1;
  } else {
    return 0;
  }
}

// 与えられた引数の座標が、操作不可地点に含まれるかどうかを判定する関数
char BoardSettings_isNoEntryPosition(BoardSettings* this, const char position)
{
  char flag = 0;

  for (char i = 0, len = this->noEntryPositionsCount; i < len; i++) {
    if (this->noEntryPositions[i] == position) {
      flag = 1;
      break;
    }
  }
  return flag;
}