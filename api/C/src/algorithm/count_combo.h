#ifndef _COUNT_COMBO_H_
#define _COUNT_COMBO_H_

#include <stdbool.h>
#include "../class/Adjacent.h"
#include "../class/SearchNode.h"
#include "../class/search_conditions/SearchConditions.h"
#include "check_how_clear.h"

// コンボ数などを数える関数
extern void countCombo(SearchNode *node, SearchConditions *searchConditions, bool dropFallFlag);
extern void countCombo_6x7(SearchNode *node, SearchConditions *searchConditions, bool dropFallFlag);

#endif  // _COUNT_COMBO_H_