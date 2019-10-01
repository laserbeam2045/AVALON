#ifndef _PARSER_H_
#define _PARSER_H_

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>

// HTTPのBODYが始まる位置のアドレスを返す関数
// char requestBuffer[]  パース対象の文字列
// 戻り値：BODY部分の開始位置のアドレス（失敗なら0が返る）
char* Parser_getBody(char requestBuffer[]);

// 引数の全体文字列からint型の値を取得する関数
int Parser_getInt(char *buffer, char *property);

// 引数の全体文字列からdouble型の値を取得する関数
double Parser_getDouble(char *buffer, char *property);

// 引数の全体文字列から文字列を探してarrayに格納する関数
void Parser_getString(char *buffer, char *property, char array[]);

// 引数の全体文字列から数値配列を探してarrayに格納する関数
int Parser_getIntArray(char *buffer, char *property, char array[]);

#endif  // _PARSER_H_