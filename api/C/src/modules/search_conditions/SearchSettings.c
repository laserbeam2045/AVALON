#include "SearchSettings.h"


// beamWidth属性に値をセットする関数
void SearchSettings_setBeamWidth(SearchSettings* this, const int beamWidth)
{
  this->beamWidth = beamWidth;
}

// beamWidth属性を取得する関数
int SearchSettings_getBeamWidth(SearchSettings* this)
{
  return this->beamWidth;
}

// beamDepth属性に値をセットする関数
void SearchSettings_setBeamDepth(SearchSettings* this, const int beamDepth)
{
  this->beamDepth = beamDepth;
}

// beamDepth属性を取得する関数
int SearchSettings_getBeamDepth(SearchSettings* this)
{
  return this->beamDepth;
}

// diagonalLimit属性に値をセットする関数
void SearchSettings_setDiagonalLimit(SearchSettings* this, const char diagonalLimit)
{
  this->diagonalLimit = diagonalLimit;
}

// diagonalLimit属性を取得する関数
char SearchSettings_getDiagonalLimit(SearchSettings* this)
{
  return this->diagonalLimit;
}

// comboLimit属性に値をセットする関数
void SearchSettings_setComboLimit(SearchSettings* this, const char comboLimit)
{
  this->comboLimit = comboLimit;
}

// comboLimit属性を取得する関数
char SearchSettings_getComboLimit(SearchSettings* this)
{
  return this->comboLimit;
}