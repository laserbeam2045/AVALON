import Vue from 'vue'

export function switchArray(array, index, value, def) {

  Vue.set(array, index, value)
  if (index) {
    // 先頭以外を変更した場合、データの先頭を、
    // 先頭以外にtrueがあれば、trueにし、１つもなければfalseにする
    Vue.set(array, 0, (array.slice(1).find(bool => bool)))
  } else {
    // 先頭を変更した場合、残りのデータを先頭に合わせる
    if (value && def) {
      array.forEach((elm, idx) => Vue.set(array, idx, def[idx]))
    } else {
      array.forEach((elm, idx) => Vue.set(array, idx, false))
    }
  }
}


// 真偽値の配列を、バイナリデータに変換した値を返す関数
export function array2binary(array) {
  let binary = 0

  array.forEach((bool, index) => {
    binary |= Number(bool) << index
  })
  return binary
}