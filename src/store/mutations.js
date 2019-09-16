import Vue from 'vue'
import * as CONST from '../constants'

export default {
  // 状態フラグを変更するミューテーション
  setStateFlag (state, payload) {
    state.stateFlag = payload
  },

  // ゲームインスタンスを変更するミューテーション
  setGameApp (state, payload) {
    state.gameApp = payload
  },

  // 最良ノードを変更するミューテーション
  setBestNode (state, payload) {
    state.bestNode = payload
  },

  // 最大コンボ数と最大倍率を更新するミューテーション
  setMaximum (state, payload) {
    state.maximum.combo = payload.combo
    state.maximum.magnification = payload.magnification
  },

  // リーダーを変更するミューテーション
  setLeader (state, payload) {
    const { leaderNum, newLeader } = payload
    switch (leaderNum) {
    case 1:
      state.leaderSettings.leader1 = newLeader
      state.leaderSettings.leader2 = newLeader
      break
    case 2:
      state.leaderSettings.leader2 = newLeader
      break
    }
  },

  // boardSettingsの、嫌がらせギミックの設定を初期化するミューテーション
  resetHarassments (state) {
    state.boardSettings.startPosition = -1
    state.boardSettings.immovablePositions.clear()
  },

  // 探索データを初期化するミューテーション
  resetSearchData (state) {
    state.bestNode = null
    state.stateFlag = CONST.STANDBY
  },

  // boardSettingsに変更を加えるミューテーション
  updateBoardSettings (state, payload) {
    const { propName, newValue } = payload
    state.boardSettings[propName] = newValue
    if (propName === 'dropFall' && newValue) {
      state.boardSettings.greedy = true
    } else if (propName === 'greedy' && !newValue) {
      state.boardSettings.dropFall = false
    }
  },

  // コンボ数の上限を、盤面で可能な最大コンボ数に合わせるミューテーション
  updateComboLimit (state) {
    const maxCombo = state.maximum.combo
    const comboLimit = state.searchSettings.comboLimit
    comboLimit.max = maxCombo
    if (comboLimit.value > maxCombo) {
      comboLimit.value = maxCombo
    }
  },

  // searchSettingsに変更を加えるミューテーション
  updateSearchSettings (state, payload) {
    const setting = state.searchSettings[payload.propName]
    const { step, min, max } = setting

    if (payload.event.deltaY < 0) {
      if (setting.value + step <= max) setting.value += step
    } else {
      if (setting.value - step >= min) setting.value -= step
    }
  },

  // clearingSettingsに変更を加えるミューテーション
  updateClearingSettings (state, payload) {
    const { propName, index, newValue } = payload
    const setting = state.clearingSettings[propName]

    Vue.set(setting, index, newValue)
    if (index) {
      // 先頭以外をクリックした場合、データの先頭を、
      // 先頭以外にtrueがあればtrue、１つもなければfalseにする
      Vue.set(setting, 0, (setting.slice(1).find(bool => bool)))
    } else {
      // 先頭をクリックした場合、残りのデータを先頭に合わせる
      setting.forEach((elm, idx) => Vue.set(setting, idx, setting[0]))
    }
  },

  // 特定の属性を特定の属性に変えるミューテーション
  changeBoardColor (state, colors) {
    const board = state.boardSettings.board
    for (let Z = this.getters.boardLength; Z--;) {
      for (let i = colors.length; i--;) {
        const [color1, color2] = colors[i]
        if (board[Z] === color1) {
          Vue.set(board, Z, color2)
          break
        }
      }
    }
  },

  // 最上段横一列を引数の属性に変えるミューテーション
  changeBoardTop (state, color) {
    for (let X = 0; X < this.getters.width; X++)
      Vue.set(state.boardSettings.board, X, color)
  },

  // 左端縦一列を引数の属性に変えるミューテーション
  changeBoardLeft (state, color) {
    for (let Y = 0; Y < this.getters.height; Y++)
      Vue.set(state.boardSettings.board, this.getters.width * Y, color)
  },

  // 右端縦一列を引数の属性に変えるミューテーション
  changeBoardRight (state, color) {
    for (let Y = 1; Y <= this.getters.height; Y++)
      Vue.set(state.boardSettings.board, this.getters.width * Y - 1, color)
  },

  // 最下段横一列を引数の属性に変えるミューテーション
  changeBoardBottom (state, color) {
    for (let X = 1; X <= this.getters.width; X++)
      Vue.set(state.boardSettings.board, this.getters.boardLength - X, color)
  },
}