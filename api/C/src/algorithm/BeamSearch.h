#ifndef _BEAM_SEARCH_H_
#define _BEAM_SEARCH_H_

#include <string.h>
#include <math.h>
#include <omp.h>
#include "../class/Adjacent.h"
#include "../class/HashNode.h"
#include "../class/SearchNode.h"
#include "../class/ExcellentNodes.h"
#include "../class/search_conditions/SearchConditions.h"
#include "count_combo.h"
#include "evaluation_functions.h"

// ビームサーチクラス
typedef struct {
  bool endFlag;                   // 探索を途中で終了するフラグ
  bool dropFall;                  // 落ちコンをシミュレートするかどうか
  int beamWidth;                  // 探索のビーム幅
  int beamDepth;                  // 探索の深さ
  int maxThreads;                 // 使用可能なスレッド数
  int dividedQueueLength;         // １つのスレッドが保持できるノード数
  int *childrenCounts;            // スレッドごとの、展開した子ノード数
  HashNode *rootHashNode;         // ハッシュ値の２分探索木のルートノード
  SearchNode *parents;            // 親ノードの実データを入れるキュー
  SearchNode *children;           // 子ノードの実データを入れるキュー
  SearchNode **parentsP;          // 親ノードのポインタを保持するポインタ
  SearchNode **childrenP;         // 子ノードのポインタを保持するポインタ
  ExcellentNodes excellentNodes;  // 良質ノード集積オブジェクト
  int parentsCount;               // 親となるノードの数
  int childrenCount;              // 展開したノード数の総和
} BeamSearch;

// 初期化関数
extern void BeamSearch_init(BeamSearch* this, SearchConditions *searchConditions);

// 後始末関数
extern void BeamSearch_finish(BeamSearch* this);

// ビームサーチを実行する関数
// *searchConditions  探索条件オブジェクトのアドレス
// 戻り値：最良ノード
extern SearchNode BeamSearch_run(BeamSearch* this, SearchConditions *searchConditions);

#endif  // _BEAM_SEARCH_H_