import { STATE, DROP_TYPE_MAX } from './constants'
import { switchArray } from '../mixins/dataProcessor'
import Vue from 'vue'

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

  // ゲームインスタンスのメソッドをセットする
  setGameMethods (state, payload) {
    state.gameMethods = payload
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
    /*const maxCombo = */state.leaderSettings.maxCombo = payload
    //const comboLimit = state.searchSettings.comboLimit

    /*
    comboLimit.max = maxCombo
    if (comboLimit.value > maxCombo) {
      comboLimit.value = maxCombo
    }
    */
  },

  // 盤面で可能な最大倍率を更新するミューテーション
  setMaxMagnification (state, payload) {
    state.leaderSettings.maxMagni = payload
  },

  // 嫌がらせギミックの設定を初期化するミューテーション
  resetHarassments (state) {
    state.boardSettings['typeC']['startPosition'] = -1
    state.boardSettings['typeC']['noEntryPositions'].clear()
  },

  // 探索データを初期化するミューテーション
  resetSearchData (state) {
    state.bestNode = null
    state.stateFlag = STATE.STANDBY
  },

  // boardSettingsに変更を加えるミューテーション
  updateBoardSettings (state, payload) {
    const { property, index, value } = payload
    let settings

    switch (property) {
    case 'boardSize':
    case 'greedy':
      settings = state.boardSettings['typeA']
      settings[property].value = value
      break
    case 'clearable':
    case 'fallDrop':
      settings = state.boardSettings['typeB']
      switchArray(settings[property], index, value, settings['default'][property])
      break
    case 'board':
    case 'startPosition':
    case 'noEntryPositions':
      settings = state.boardSettings['typeC']
      settings[property] = value
      break
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
    const { name, index, value } = payload
    const setting = state.clearingSettings[name]

    switchArray(setting, index, value)
  },

  // 盤面をシャッフルする
  shuffleBoard (state) {
    const fallDrop = state.boardSettings['typeB']['fallDrop']
    const board = state.boardSettings['typeC']['board']
    const newBoard = []
    for (let i = board.length; i--;) {
      let color
      do {
        color = Math.floor(Math.random() * DROP_TYPE_MAX) + 1
      } while (!fallDrop[color])
      newBoard[i] = color
    }
    state.boardSettings['typeC']['board'] = newBoard
  },

  // 暗闇を消すミューテーション
  clearDarkness (state) {
    const board = Array.from(state.boardSettings['typeC']['board'])
    const first = board[0]

    for (let Y = 0; Y < 5; Y++) {
      for (let X = 0; X < 6; X++) {
        if (Y % 2) {
          X = 5 - X
        }
        const Z = 6 * Y + X
        if (Z == 29) {
          board[Z] = first
        }
        else if (
          (X == 0 && (Y % 2)) ||
          (X == 5 && !(Y % 2))
        ) {
          board[Z] = board[Z + 6]
        }
        else if (Y % 2) {
          board[Z] = board[Z - 1]
        }
        else {
          board[Z] = board[Z + 1]
        }
        if (Y % 2) {
          X = 5 - X
        }
      }
    }
    state.boardSettings['typeC']['board'] = board
  },

  // 特定の属性を特定の属性に変えるミューテーション
  changeBoardByColor (state, colors) {
    const board = state.boardSettings['typeC']['board']
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
    const board = state.boardSettings['typeC']['board']

    coordinates.forEach(index => {
      Vue.set(board, index, color)
    })
  },

  // 最上段横一列を引数の属性に変えるミューテーション
  changeBoardTop (state, color) {
    for (let X = 0; X < this.getters.width; X++)
      Vue.set(state.boardSettings['typeC']['board'], X, color)
  },

  // 左端縦一列を引数の属性に変えるミューテーション
  changeBoardLeft (state, color) {
    for (let Y = 0; Y < this.getters.height; Y++)
      Vue.set(state.boardSettings['typeC']['board'], this.getters.width * Y, color)
  },

  // 右端縦一列を引数の属性に変えるミューテーション
  changeBoardRight (state, color) {
    for (let Y = 1; Y <= this.getters.height; Y++)
      Vue.set(state.boardSettings['typeC']['board'], this.getters.width * Y - 1, color)
  },

  // 最下段横一列を引数の属性に変えるミューテーション
  changeBoardBottom (state, color) {
    for (let X = 1; X <= this.getters.width; X++)
      Vue.set(state.boardSettings['typeC']['board'], this.getters.boardLength - X, color)
  },
}