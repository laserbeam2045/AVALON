import { LEADER } from './constants'
import { array2binary } from '../mixins/dataProcessor'

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
    return Number(state.boardSettings['typeA']['boardSize'].split('x')[0])
  },

  // 盤面の横幅
  width (state) {
    return Number(state.boardSettings['typeA']['boardSize'].split('x')[1])
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
    const typeA = state.boardSettings.typeA
    const boardSize = typeA.boardSize.value
    const greedy = typeA.greedy.value

    const settings = {
      ...state.boardSettings.typeB,
      ...state.boardSettings.typeC,
    }
    delete settings.default
    settings.boardSize = boardSize
    settings.greedy = Number(greedy)
    settings.clearable = array2binary(settings.clearable)
    settings.fallDrop = array2binary(settings.fallDrop)
    settings.noEntryPositions = [...settings.noEntryPositions]

    return settings
  },

  // 探索に関する設定からvalueだけを取り出し、プロパティ名を一部変更したもの
  searchSettingsForSearch (state) {
    const { width, depth, diagonalLimit, addCombo } = state.searchSettings
    return {
      beamWidth       : width.value,
      beamDepth       : depth.value,
      diagonalLimit   : diagonalLimit.value,
      additionalCombo : addCombo.value,
    }
  },

  // 消し方に関する設定を、ブール配列からビット値に変換したもの
  clearingSettingsForSearch (state) {
    const settings = state.clearingSettings
    const bitSettings = {}

    for (let key of Object.keys(settings)) {
      bitSettings[key] = array2binary(settings[key])
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