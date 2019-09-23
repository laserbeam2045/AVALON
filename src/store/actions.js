import { SERVER_ADDRESS } from '../constants'

export default {
  // 盤面で可能な最大コンボ数と、最大倍率を取得するアクション
  updateMaxData ({ commit, state }) {
    const { leader1, leader2 } = state.leaderSettings
    const board = JSON.stringify(state.boardSettings.board)
    const address = SERVER_ADDRESS['Node'] + `${leader1}-${leader2}-${board}`

    return fetch(address)
      .then(response => response.json())
      .then(jsonData => {
        commit('setMaximum', {
          combo: Number(jsonData.maxComboCount),
          magnification: Number(jsonData.maxMagnification),
        })
      })
      .catch(err => {
        commit('setErrorMessage', err)
      })
  },

  // 画面をキャプチャーして盤面を取得するアクション
  // 戻り値：Promise
  capture ({ commit, state }) {
    const address = SERVER_ADDRESS['python'] + state.boardSettings.boardSize

    return fetch(address)
      .then(response => response.json())
      .then(jsonData => {
        commit('updateBoardSettings', {
          propName: 'board',
          newValue: jsonData.board,
        })
      })
      .catch(err => {
        commit('setErrorMessage', err)
      })
  },

  // サーバーに探索のリクエストを送るアクション
  // 戻り値：Promise
  search ({ commit, getters }) {
    const address = SERVER_ADDRESS['C']
    const options = {
      method: 'POST',
      body: getters.searchConditions,
    }

    return fetch(address, options)
      .then(response => response.json())
      .then(jsonData => {
        commit('setBestNode', jsonData)
      })
      .catch(err => {
        commit('setErrorMessage', err)
      })
  },
}