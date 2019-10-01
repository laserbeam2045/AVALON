#include "SearchSettings.h"

// 初期化関数
void SearchSettings_init(SearchSettings* this, char *body)
{
  this->beamWidth = Parser_getInt(body, "beamWidth");
  this->beamDepth = Parser_getInt(body, "beamDepth");
  this->diagonalLimit = Parser_getInt(body, "diagonalLimit");
  this->comboLimit = Parser_getInt(body, "comboLimit");
}

// beamWidth属性を取得する関数
int SearchSettings_getBeamWidth(SearchSettings* this)
{
  return this->beamWidth;
}

// beamDepth属性を取得する関数
int SearchSettings_getBeamDepth(SearchSettings* this)
{
  return this->beamDepth;
}

// diagonalLimit属性を取得する関数
char SearchSettings_getDiagonalLimit(SearchSettings* this)
{
  return this->diagonalLimit;
}

// comboLimit属性を取得する関数
char SearchSettings_getComboLimit(SearchSettings* this)
{
  return this->comboLimit;
}