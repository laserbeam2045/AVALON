#include "SearchConditions.h"

// 初期化関数
bool SearchConditions_init(SearchConditions* this, char requestBuffer[])
{
  char *body = Parser_getBody(requestBuffer);

  LeaderSettings_init(&this->leaderSettings, body);
  BoardSettings_init(&this->boardSettings, body);
  SearchSettings_init(&this->searchSettings, body);
  ClearingSettings_init(&this->clearingSettings, body);
  return true;
}

// leaderSettingsのポインタを返す関数
LeaderSettings* SearchConditions_getLeaderSettings(SearchConditions* this)
{
  return &this->leaderSettings;
}

// boardSettingsのポインタを返す関数
BoardSettings* SearchConditions_getBoardSettings(SearchConditions* this)
{
  return &this->boardSettings;
}

// leaderSettingsのポインタを返す関数
SearchSettings* SearchConditions_getSearchSettings(SearchConditions* this)
{
  return &this->searchSettings;
}

// clearingSettingsのポインタを返す関数
ClearingSettings* SearchConditions_getClearingSettings(SearchConditions* this)
{
  return &this->clearingSettings;
}

// 探索を打ち切る条件を満たしているかどうかを判定する関数
// 戻り値：0（条件を満たしていない）or 1（条件を満たしている）
bool SearchConditions_isEnoughAchievement(SearchConditions* this, ComboData* comboData)
{
  char combo = ComboData_getCombo(comboData);
  double magnification = ComboData_getMagnification(comboData);

  return (
    !BoardSettings_getGreedy(&this->boardSettings) &&
    ComboData_getFulfillConditions(comboData) &&
    (
      (
        LeaderSettings_isComboLeader(&this->leaderSettings) &&
        LeaderSettings_isMaxCombo(&this->leaderSettings, combo)
      ) ||
      (
        LeaderSettings_isMagniLeader(&this->leaderSettings) &&
        LeaderSettings_isMaxMagnification(&this->leaderSettings, magnification)
      )
    )
  );
}