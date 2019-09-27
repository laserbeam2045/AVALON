#include <string.h>
#include "output.h"

static void writeComboDataStr(char buf[], size_t bufSize, size_t n, ComboData *data);


// ビームサーチノードの中身を出力する関数
void printNodeData(SearchNode *node)
{
    char buf[2048];

    memset(buf, 0, sizeof(buf));    
    writeNodeDataStr(buf, sizeof(buf), node, 0);
    printf(buf);
}


// ノード構造体の中身をJSON形式の文字列として書き込む関数
void writeNodeDataStr(char buf[], size_t bufSize, SearchNode *node, double elapsedTime)
{
    size_t n = strlen(buf);     // 書き込みを始める位置として使う
    int i;

    n += _snprintf(buf + n, bufSize, "{\n\"board\"\t\t\t: [");
    for (i = 0; i < Board_length; i++) {
        n += _snprintf(buf + n, bufSize, "%d", node->board.state[i]);
        if (i != (Board_length - 1)) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    int processLen = sizeof(node->process) / sizeof(node->process[0]);
    n += _snprintf(buf + n, bufSize, "\"process\"\t\t: [");
    for (i = 0; i < processLen; i++) {
        n += _snprintf(buf + n, bufSize, "%d", node->process[i]);
        if (i != (processLen - 1)) n += _snprintf(buf + n, bufSize, ", ");
        if (i == 29) n += _snprintf(buf + n, bufSize, "\n\t\t\t   ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize,
            "\"movedCount\"\t\t: %d,\n"
            "\"movedCountDiagonally\"\t: %d,\n"
            "\"hashValue\"\t\t: \"%08x%08x\",\n",
            node->movedCount, node->movedCountDiagonally,
            (int)(node->hashValue >> 32), (int)node->hashValue);

    n += _snprintf(buf + n, bufSize,
            "\"elapsedTime\"\t\t: %3.2lf,\n", elapsedTime);
   
    writeComboDataStr(buf, bufSize, n, &node->comboData);
    _snprintf(buf + strlen(buf), bufSize, "}\n");
}


// コンボ情報構造体の中身をJSON形式の文字列として書き込む関数
static void writeComboDataStr(char buf[], size_t bufSize, size_t n, ComboData *data)
{
    int i, j;

    n += _snprintf(buf + n, bufSize,
            "\"comboData\": {\n"
            "\t\"step\"\t\t: %d,\n",
            data->step);

    n += _snprintf(buf + n, bufSize, "\t\"twoWay\"\t: [");
    for (i = 0; i < 7; i++) {
        n += _snprintf(buf + n, bufSize, "%d", data->twoWay[i]);
        if (i != 6) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize, "\t\"breakThrough\"\t: [");
    for (i = 0; i < 7; i++) {
        n += _snprintf(buf + n, bufSize, "%d", data->breakThrough[i]);
        if (i != 6) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize, "\t\"line\"\t\t: [");
    for (i = 0; i < 8; i++) {
        n += _snprintf(buf + n, bufSize, "%d", data->line[i]);
        if (i != 7) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize, "\t\"cross\"\t\t: [");
    for (i = 0; i < 7; i++) {
        n += _snprintf(buf + n, bufSize, "%d", data->cross[i]);
        if (i != 6) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize, "\t\"L\"\t\t: [");
    for (i = 0; i < 7; i++) {
        n += _snprintf(buf + n, bufSize, "%d", data->L[i]);
        if (i != 6) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize, "\t\"combo\"\t: [\n");
    for (i = 0; i < DROP_TYPE_MAX + 1; i++) {
        n += _snprintf(buf + n, bufSize, "\t\t\t\t[");
        for (j = 0; j < 10; j++) {
            n += _snprintf(buf + n, bufSize, "%d", data->combo[i][j]);
            if (j != 9) n += _snprintf(buf + n, bufSize, ", ");
        }
        if (i != DROP_TYPE_MAX) n += _snprintf(buf + n, bufSize, "],\n");
        else                    n += _snprintf(buf + n, bufSize, "]\n");
    }
    n += _snprintf(buf + n, bufSize, "\t\t\t  ],\n");

    n += _snprintf(buf + n, bufSize, "\t\"leftovers\"\t: [");
    for (i = 0; i < DROP_TYPE_MAX + 1; i++) {
        n += _snprintf(buf + n, bufSize, "%d", data->leftovers[i]);
        if (i != DROP_TYPE_MAX) n += _snprintf(buf + n, bufSize, ", ");
    }
    n += _snprintf(buf + n, bufSize, "],\n");

    n += _snprintf(buf + n, bufSize,
            "\t\"maxConnection\"\t: %d,\n"
            "\t\"magnification\"\t: %f,\n"
            "\t\"evaluation\"\t: %f,\n"
            "\t\"fulfillConditions\"\t: %d\n}\n",
            data->maxConnection, data->magnification, data->evaluation, data->fulfillConditions);
}