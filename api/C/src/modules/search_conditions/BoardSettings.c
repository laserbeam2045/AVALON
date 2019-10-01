#include "BoardSettings.h"


// 初期化関数
void BoardSettings_init(BoardSettings* this, char *body)
{
  char boardState[BOARD_LEN_MAX];
  char boardSize[6];
  char height, width;

  Parser_getIntArray(body, "board", boardState);
  Parser_getString(body, "boardSize", boardSize);
  height = boardSize[1] - '0';
  width = boardSize[3] - '0';
  
  Board_initClass(&this->board, height, width);
  Board_init(&this->board, boardState);
  this->dropFall = Parser_getInt(body, "dropFall");
  this->greedy = Parser_getInt(body, "greedy");
  this->activeDrops = Parser_getInt(body, "activeDrops");
  this->startPosition = Parser_getInt(body, "startPosition");
  this->noEntryPositionsCount = Parser_getIntArray(body, "noEntryPositions", this->noEntryPositions);
}

// board属性の先頭ポインタを返す関数
Board* BoardSettings_getBoard(BoardSettings* this)
{
  return &this->board;
}

// dropFall属性を返す関数
bool BoardSettings_getDropFall(BoardSettings* this)
{
  return this->dropFall;
}

// greedy属性を返す関数
bool BoardSettings_getGreedy(BoardSettings* this)
{
  return this->greedy;
}

// activeDrops属性を返す関数
int BoardSettings_getActiveDrops(BoardSettings* this)
{
  return this->activeDrops;
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