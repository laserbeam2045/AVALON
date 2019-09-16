import { SERVER_ADDRESS } from '../constants'

export default {
  // Ajax通信を行うアクション
  // 戻り値：Promise
  Ajax (context, { address, options }) {
    return fetch(address, options)
          .then(response => response.json())
  },

  // 盤面で可能な最大コンボ数と、最大倍率を取得するアクション
  async updateMaxData ({ commit, state }) {
    const { leader1, leader2 } = state.leaderSettings
    const board = JSON.stringify(state.boardSettings.board)
    const address = SERVER_ADDRESS['Node'] + `${leader1}-${leader2}-${board}`

    const response = await this.dispatch('Ajax', {address})
                                .catch(err => {
                                  err
                                })
    if (response) {
      commit('setMaximum', {
        combo: Number(response.maxComboCount),
        magnification: Number(response.maxMagnification),
      })
    }
  },

  // 画面をキャプチャーして盤面を取得する処理
  // 戻り値：Promise
  capture ({ commit, state }) {
    const address = SERVER_ADDRESS['python'] + state.boardSettings.boardSize

    return this.dispatch('Ajax', {address}).then(data => {
      commit('updateBoardSettings', {
        propName: 'board',
        newValue: data.board,
      })
    })
  },

  // サーバーに探索のリクエストを送る処理
  // 戻り値：Promise
  search ({ commit, getters }) {
    return this.dispatch('Ajax', {
      address: SERVER_ADDRESS['C'],
      options: {
        method: 'POST',
        body: getters.searchConditions,
      },
    })
    .then(responseData => {
      commit('setBestNode', responseData)
    })
  },
}