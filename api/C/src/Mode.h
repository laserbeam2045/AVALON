#ifndef _MODE_H_
#define _MODE_H_

#include "io/WinSock.h"
#include "io/parser.h"
#include "io/output.h"
#include "class/Adjacent.h"
#include "class/ZobristHash.h"
#include "class/SearchNode.h"
#include "class/search_conditions/SearchConditions.h"
#include "algorithm/BeamSearch.h"

// アプリケーション・オブジェクト
// 実体はないが、Adjacent、ZobristHashモジュールも含む
typedef struct {
  WinSock winSock;                    // WinSockによる送受信を扱うモジュール
  SearchConditions searchConditions;  // 探索全般に関する設定を含むモジュール
  BeamSearch beamSearch;              // ビームサーチを扱うモジュール
} Mode;

// 初期化・後始末関数
void Mode_init(Mode* c);
void Mode_finish(Mode* c);

// モード関数
void Mode_run(Mode* c);

#endif  // _MODE_H_