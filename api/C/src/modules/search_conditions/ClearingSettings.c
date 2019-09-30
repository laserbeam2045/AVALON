#include "ClearingSettings.h"

// 初期化関数（active以外はセット済みの前提）
void ClearingSettings_init(ClearingSettings* this)
{
  if (
    this->twoWay == 0 &&
    this->breakThrough == 0 &&
    this->line == 0 &&
    this->cross == 0 &&
    this->L == 0 &&
    this->required == 0 &&
    this->clearAll == 0 &&
    this->clearZero == 0
  ) {
    this->active = false;
  } else {
    this->active = true;
  }
}

// 各設定項目に値（ビットフラグ）をセットする関数
void ClearingSettings_setFlag(ClearingSettings* this, const char type, const int value)
{
  switch (type) {
  case (CS_TYPE)TWO_WAY       : this->twoWay = value; break;
  case (CS_TYPE)BREAK_THROUGH : this->breakThrough = value; break;
  case (CS_TYPE)LINE          : this->line = value; break;
  case (CS_TYPE)CROSS         : this->cross = value; break;
  case (CS_TYPE)L             : this->L = value; break;
  case (CS_TYPE)REQUIRED      : this->required = value; break;
  case (CS_TYPE)CLEAR_ALL     : this->clearAll = value; break;
  case (CS_TYPE)CLEAR_ZERO    : this->clearZero = value; break;
  }
}

// 1つでも設定された項目があるかどうかを返す関数
bool ClearingSettings_isActive(ClearingSettings* this)
{
  return this->active;
}

// type属性のcolor番目のビットについて、フラグが立っている（設定されている）かどうかを返す関数
bool ClearingSettings_isActiveOf(ClearingSettings* this, const char type, const char color)
{
  switch (type) {
  case (CS_TYPE)TWO_WAY       : return (1 << color) & this->twoWay;
  case (CS_TYPE)BREAK_THROUGH : return (1 << color) & this->breakThrough;
  case (CS_TYPE)LINE          : return (1 << color) & this->line;
  case (CS_TYPE)CROSS         : return (1 << color) & this->cross;
  case (CS_TYPE)L             : return (1 << color) & this->L;
  case (CS_TYPE)REQUIRED      : return (1 << color) & this->required;
  case (CS_TYPE)CLEAR_ALL     : return (1 << color) & this->clearAll;
  case (CS_TYPE)CLEAR_ZERO    : return (1 << color) & this->clearZero;
  }
}