import { LEADER } from './constants'

export default {
  // API通信でエラーが発生している状態かどうか
  hasApiError (state) {
    return (
      !state.apiConnectionFlag['maximum'] ||
      !state.apiConnectionFlag['capture'] ||
      !state.apiConnectionFlag['search']
    )
  },

  // 盤面の高さ
  height (state) {
    return Number(state.boardSettings.boardSize.split('x')[0])
  },

  // 盤面の横幅
  width (state) {
    return Number(state.boardSettings.boardSize.split('x')[1])
  },

  // 盤面のドロップ数
  boardLength (state, getters) {
    return getters.height * getters.width
  },

  // 探索結果が危険性を伴うかどうか
  isDanger (state, getters) {
    if (!state.bestNode) {
      return false
    }
    const { fulfillConditions, magnification } = state.bestNode.comboData
    return (
      !fulfillConditions || (magnification === 1) ||
      (getters.leaderIs('AMEN') && magnification !== 10000) ||
      (getters.leaderIs('KOMASAN') && magnification % 3)
    )
  },

  // 探索結果の操作手順
  process (state) {
    const bestNode = state.bestNode
    return bestNode ? bestNode.process.slice(0, bestNode.movedCount + 1) : null
  },

  // 現在のリーダーが引数のものであるかどうか
  leaderIs: (state) => (name) => {
    const { leader1, leader2 } = state.leaderSettings
    return (
      leader1 === LEADER[name] ||
      leader2 === LEADER[name]
    )
  },

  // 盤面に関する設定を、ブール値を数値(0,1)に、Setオブジェクトを配列に変換したもの
  boardSettingsForSearch (state) {
    const settings = Object.assign({}, state.boardSettings)

    settings.dropFall = Number(settings.dropFall)
    settings.greedy = Number(settings.greedy)
    settings.noEntryPositions = [...settings.noEntryPositions]
    return settings
  },

  // 探索に関する設定からvalueだけを取り出し、プロパティ名を一部変更したもの
  searchSettingsForSearch (state) {
    const { width, depth, diagonalLimit, comboLimit } = state.searchSettings
    return {
      beamWidth     : width.value,
      beamDepth     : depth.value,
      diagonalLimit : diagonalLimit.value,
      comboLimit    : comboLimit.value,
    }
  },

  // 消し方に関する設定を、ブール配列からビット値に変換したもの
  clearingSettingsForSearch (state) {
    const settings = state.clearingSettings
    const bitSettings = {}

    for (let key of Object.keys(settings)) {
      let bit = 0
      settings[key].forEach((bool, index) => {
        bit |= Number(bool) << index
      })
      bitSettings[key] = bit
    }
    return bitSettings
  },

  // サーバーに渡す、探索の設定とデータ
  searchConditions (state, getters) {
    return JSON.stringify({
      ...state.leaderSettings,
      ...getters.boardSettingsForSearch,
      ...getters.searchSettingsForSearch,
      ...getters.clearingSettingsForSearch,
    })
  },
}