import { STATE, SERVER_ADDRESS } from './constants'

export default {
  // 盤面で可能な最大コンボ数と、最大倍率を取得するアクション
  updateMaxData ({ commit, state }) {
    const { leader1, leader2 } = state.leaderSettings
    const board = JSON.stringify(state.boardSettings['typeC']['board'])
    const address = SERVER_ADDRESS['Node'] + `${leader1}-${leader2}-${board}`

    return fetch(address)
      .then(response => response.json())
      .then(jsonData => {
        commit('setMaxCombo', Number(jsonData.maxComboCount))
        commit('setMaxMagnification', Number(jsonData.maxMagnification))
        commit('setMaximumApiFlag', true)
        return true
      })
      .catch(error => {
        commit('setErrorMessage', error)
        commit('setMaximumApiFlag', false)
        return false
      })
  },

  // 画面をキャプチャーして盤面を取得するアクション
  capture ({ commit, state }) {
    const boardSize = state.boardSettings['typeA']['boardSize'].value
    const address = SERVER_ADDRESS['Python'] + boardSize

    return fetch(address)
      .then(response => response.json())
      .then(jsonData => {
        commit('updateBoardSettings', {
          property: 'board',
          value: jsonData.board,
        })
        commit('resetSearchData')
        commit('setCaptureApiFlag', true)
        return true
      })
      .catch(error => {
        commit('setErrorMessage', error)
        commit('setCaptureApiFlag', false)
        return false
      })
  },

  // サーバーに探索のリクエストを送るアクション
  search ({ commit, getters }) {
    const address = SERVER_ADDRESS['C']
    const options = {
      method: 'POST',
      body: getters.searchConditions,
    }
    //console.log(getters.searchConditions)

    commit('setBestNode', null)
    commit('setStateFlag', STATE.SEARCHING)

    return fetch(address, options)
      .then(response => response.json())
      .then(jsonData => {
        commit('setBestNode', jsonData)
        commit('setStateFlag', STATE.SEARCH_END)
        commit('setSearchApiFlag', true)
        return true
      })
      .catch(error => {
        commit('setErrorMessage', error)
        commit('setStateFlag', STATE.STANDBY)
        commit('setSearchApiFlag', false)
        return false
      })
  },
}