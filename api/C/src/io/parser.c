#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "parser.h"


// プライベート関数
static bool parseLeaderSettings(char *body, LeaderSettings *lsp);
static bool parseBoardSettings(char *body, BoardSettings *bsp);
static bool parseSearchSettings(char *body, SearchSettings *ssp);
static bool parseClearingSettings(char *body, ClearingSettings *csp);
static char* getBody(char requestBuffer[]);
static bool getValue(char *body, const char property[], char value[]);
static int getValueIndex(char *body, const char property[]);
static int getArrayFrom(char string[], char array[]);


// HTTPリクエストをパースする関数
bool parse(char requestBuffer[], SearchConditions *scp)
{
  LeaderSettings *lsp = SearchConditions_getLeaderSettings(scp);
  BoardSettings *bsp = SearchConditions_getBoardSettings(scp);
  SearchSettings *ssp = SearchConditions_getSearchSettings(scp);
  ClearingSettings *csp = SearchConditions_getClearingSettings(scp);

  // POSTリクエストかどうかを確認する
  char method[] = "POST";
  for (char i = 0; i < 4; i++) {
    if (requestBuffer[i] != method[i]) return false;
  }
  // BODYが始まる位置を特定する
  char *body = getBody(requestBuffer);

  if (!parseLeaderSettings(body, lsp))   return false;
  if (!parseBoardSettings(body, bsp))    return false;
  if (!parseSearchSettings(body, ssp))   return false;
  if (!parseClearingSettings(body, csp)) return false;

  return true;
}


// リーダーに関する設定をパースする関数
static bool parseLeaderSettings(char *body, LeaderSettings *lsp)
{
  static const char format[] = "\"%s\"";
  char property[32], value[256];
  char leader1, leader2, maxCombo;
  double maxMagnification;

  // leader1を取得
  sprintf(property, format, "leader1");
  if (getValue(body, property, value)) {
    leader1 = atoi(value);
  } else {
    return false;
  }
  // leader2を取得
  sprintf(property, format, "leader2");
  if (getValue(body, property, value)) {
    leader2 = atoi(value);
  } else {
    return false;
  }
  // maxComboを取得
  sprintf(property, format, "maxCombo");
  if (getValue(body, property, value)) {
    maxCombo = atoi(value);
  } else {
    return false;
  }
  // maxMagnificationを取得
  sprintf(property, format, "maxMagnification");
  if (getValue(body, property, value)) {
    maxMagnification = atof(value);
  } else {
    return false;
  }
  // リーダー設定オブジェクトを初期化
  LeaderSettings_init(lsp, leader1, leader2, maxCombo, maxMagnification);

  return true;
}


// 盤面に関する設定をパースする関数
static bool parseBoardSettings(char *body, BoardSettings *bsp)
{
  static const char format[] = "\"%s\"";
  char property[32], value[256];

  // boardSizeを取得
  sprintf(property, format, "boardSize");
  if (getValue(body, property, value)) {
    char height = value[1] - '0';
    char width = value[3] - '0';
    BoardSettings_init(bsp, height, width);
  } else {
    return false;
  }

  // boardを取得
  char board[BOARD_LEN_MAX];
  sprintf(property, format, "board");
  if (getValue(body, property, value)) {
    getArrayFrom(value, board);
    BoardSettings_initBoard(bsp, board);
  } else {
    return false;
  }

  // dropFallを取得
  sprintf(property, format, "dropFall");
  if (getValue(body, property, value)) {
    BoardSettings_setDropFall(bsp, atoi(value));
  } else {
    return false;
  }
  // greedyを取得
  sprintf(property, format, "greedy");
  if (getValue(body, property, value)) {
    BoardSettings_setGreedy(bsp, atoi(value));
  } else {
    return false;
  }
  // activeDropsを取得
  sprintf(property, format, "activeDrops");
  if (getValue(body, property, value)) {
    BoardSettings_setActiveDrops(bsp, atoi(value));
  } else {
    return false;
  }
  // startPositionを取得
  sprintf(property, format, "startPosition");
  if (getValue(body, property, value)) {
    BoardSettings_setStartPosition(bsp, atoi(value));
  } else {
    return false;
  }
  // noEntryPositionsを取得
  char positions[BOARD_LEN_MAX];
  sprintf(property, format, "noEntryPositions");
  if (getValue(body, property, value)) {
    char count = getArrayFrom(value, positions);
    BoardSettings_setNoEntryPositions(bsp, positions, count);
  } else {
    return false;
  }

  return true;
}


// 探索方法に関する設定をパースする関数
static bool parseSearchSettings(char *body, SearchSettings *ssp)
{
  static const char format[] = "\"%s\"";
  char property[32], value[256];

  // beamWidthを取得
  sprintf(property, format, "beamWidth");
  if (getValue(body, property, value)) {
    SearchSettings_setBeamWidth(ssp, atoi(value));
  } else {
    return false;
  }
  // beamDepthを取得
  sprintf(property, format, "beamDepth");
  if (getValue(body, property, value)) {
    SearchSettings_setBeamDepth(ssp, atoi(value));
  } else {
    return false;
  }
  // diagonalLimitを取得
  sprintf(property, format, "diagonalLimit");
  if (getValue(body, property, value)) {
    SearchSettings_setDiagonalLimit(ssp, atoi(value));
  } else {
    return false;
  }
  // comboLimitを取得
  sprintf(property, format, "comboLimit");
  if (getValue(body, property, value)) {
    SearchSettings_setComboLimit(ssp, atoi(value));
  } else {
    return false;
  }

  return true;
}


// 消し方に関する設定をパースする関数
static bool parseClearingSettings(char *body, ClearingSettings *csp)
{
  static const char format[] = "\"%s\"";
  static const char props[][2][13] = {
    { "twoWay",       (CS_TYPE)TWO_WAY },
    { "breakThrough", (CS_TYPE)BREAK_THROUGH },
    { "line",         (CS_TYPE)LINE },
    { "cross",        (CS_TYPE)CROSS },
    { "L",            (CS_TYPE)L },
    { "required",     (CS_TYPE)REQUIRED },
    { "clearAll",     (CS_TYPE)CLEAR_ALL },
    { "clearZero",    (CS_TYPE)CLEAR_ZERO },
  };
  char property[32], value[256];

  for (char i = 0; i < 8; i++) {
    sprintf(property, format, props[i][0]);
    if (getValue(body, property, value)) {
      char typeFlag = props[i][1][0];
      ClearingSettings_setFlag(csp, typeFlag, atoi(value));
    } else {
      return false;
    }
  }

  return true;
}


// HTTPのBODYが始まる位置のアドレスを返す関数
// char requestBuffer[]  パース対象の文字列
// 戻り値：BODY部分の開始位置のアドレス（失敗なら0が返る）
static char* getBody(char requestBuffer[])
{
  int returnCount = 0;

  for (int i = 0, len = strlen(requestBuffer); i < len; i++) {
    if ('\n' == requestBuffer[i] || '\r' == requestBuffer[i]) {
      if (returnCount == 3) {
        return (requestBuffer + i + 1); // 空行の次がBODY部という解釈
      } else {
        returnCount += 1;
      }
    } else {
      returnCount = 0;
    }
  }
  return 0;
}


// body文字列から、propertyを探してvalueを書き込む関数
// char body[]       全体の文字列
// char property[]   propertyが書き込まれた配列
// char value[]      valueを書き込む配列
// 戻り値：true(成功) or false(失敗)
static bool getValue(char *body, const char property[], char value[])
{
  int valueIndex = getValueIndex(body, property);

  if (valueIndex == 0) {
    return false;
  }

  int index = 0;
  char objectCount = 0;
  char arrayCount = 0;
  bool endFlag = false;

  for (int j = valueIndex, len = strlen(body); j < len; j++) {
    switch (body[j]) {
    case '{':
      objectCount++;
      break;
    case '}':
      if (objectCount) {
        objectCount--;
      } else if (0 == arrayCount) {
        endFlag = true;
      }
      break;
    case '[':
      arrayCount++;
      break;
    case ']':
      if (arrayCount) {
        arrayCount--;
      } else if (0 == objectCount) {
        endFlag = true;
      }
      break;
    case ',':
      if (0 == objectCount && 0 == arrayCount) {
        endFlag = true;
      }
      break;
    }
    value[index++] = body[j];
    if (endFlag) break;
  }
  value[index] = '\0';

  return true;
}


// body文字列から、property文字列を探して、valueの開始位置を返す関数
// char body[]       全体の文字列
// char property[]   探すproperty
// 戻り値 int（0:失敗, 0以外:成功）
static int getValueIndex(char *body, const char property[])
{
  int matchCount = 0;
  int propertyLen = strlen(property);

  for (int i = 0, len = strlen(body); i < len; i++) {
    if (body[i] == property[matchCount]) {
      matchCount++;
      if (matchCount == propertyLen) {
        return i + 2;
      }
    } else {
      matchCount = 0;
    }
  }
  return 0;
}


// 配列形式の文字列から、数値を取り出して配列に格納する関数
// string[]   パースする文字列
// array[]    データを格納する配列
// 戻り値：配列の要素数
static int getArrayFrom(char string[], char array[])
{
  int count = 0;
  char tmpBuf[3] = {0};
  char tmpCnt = 0;
  for (int i = 0, len = strlen(string); i < len; i++) {
    if (isdigit(string[i])) {
      tmpBuf[tmpCnt] = string[i];
      tmpCnt++;
    } else if (tmpCnt) {
      array[count] = atoi(tmpBuf);
      count++;
      tmpBuf[0] = 0;
      tmpBuf[1] = 0;
      tmpCnt = 0;
    }
  }
  return count;
}