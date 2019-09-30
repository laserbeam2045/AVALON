#ifndef _PARSER_H_
#define _PARSER_H_

#include "../search_conditions/SearchConditions.h"

// HTTPリクエストをパースする関数
// requestBuffer[]     パース対象の文字列
// *searchConditions   パース結果を格納する構造体のポインタ
// 戻り値：パースに成功したらtrue, 失敗ならfalseを返す
extern bool parse(char requestBuffer[], SearchConditions *searchConditions);

#endif  // _PARSER_H_