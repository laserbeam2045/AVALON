import Vue from 'vue'
import { STATE, DROP_TYPE_MAX } from '../constants'

export default {
  // 状態フラグを変更するミューテーション
  setStateFlag (state, payload) {
    state.stateFlag = payload
  },

  // エラーメッセージを変更する
  setErrorMessage (state, payload) {
    state.errorMessage = payload
  },

  // API通信エラーフラグ(maximum)を変更する
  setMaximumApiFlag (state, payload) {
    state.apiConnectionFlag['maximum'] = payload
  },

  // API通信エラーフラグ(capture)を変更する
  setCaptureApiFlag (state, payload) {
    state.apiConnectionFlag['capture'] = payload
  },

  // API通信エラーフラグ(search)を変更する
  setSearchApiFlag (state, payload) {
    state.apiConnectionFlag['search'] = payload
  },

  // ゲームインスタンスを変更するミューテーション
  setGameApp (state, payload) {
    state.gameApp = payload
  },

  // 最良ノードを変更するミューテーション
  setBestNode (state, payload) {
    state.bestNode = payload
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

  // 盤面で可能な最大コンボ数を更新するミューテーション
  setMaxCombo (state, payload) {
    const maxCombo = state.leaderSettings.maxCombo = payload
    const comboLimit = state.searchSettings.comboLimit

    comboLimit.max = maxCombo
    if (comboLimit.value > maxCombo) {
      comboLimit.value = maxCombo
    }
  },

  // 盤面で可能な最大倍率を更新するミューテーション
  setMaxMagnification (state, payload) {
    state.leaderSettings.maxMagnification = payload
  },

  // 嫌がらせギミックの設定を初期化するミューテーション
  resetHarassments (state) {
    state.boardSettings.startPosition = -1
    state.boardSettings.immovablePositions.clear()
  },

  // 探索データを初期化するミューテーション
  resetSearchData (state) {
    state.bestNode = null
    state.stateFlag = STATE.STANDBY
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

  // 盤面をシャッフルする
  shuffleBoard (state) {
    const activeDrops = state.clearingSettings.activeDrops
    const board = state.boardSettings.board
    const newBoard = []
    for (let i = board.length; i--;) {
      let color
      do {
        color = Math.floor(Math.random() * DROP_TYPE_MAX) + 1
      } while (!activeDrops[color])
      newBoard[i] = color
    }
    state.boardSettings.board = newBoard
  },

  // 特定の属性を特定の属性に変えるミューテーション
  changeBoardByColor (state, colors) {
    const board = state.boardSettings.board
    if (!Array.isArray(colors[0])) {
      colors = [colors]
    }
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

  // 特定の座標を特定の色に変えるミューテーション
  changeBoardByCoordinates (state, payload) {
    const { color, coordinates } = payload
    const board = state.boardSettings.board

    coordinates.forEach(index => {
      Vue.set(board, index, color)
    })
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