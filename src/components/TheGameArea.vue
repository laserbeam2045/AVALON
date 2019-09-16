<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import createGame from '../game/CreateGame.js'
import controll from '../mixins/Controll'

export default {
  name: 'TheGameArea',
  mixins: [
    controll,
  ],
  computed: {
    board () {
      return Array.from(this.$store.state.boardSettings.board)
    },
    activeDrops () {
      return this.$store.state.clearingSettings.activeDrops
    },
    // ゲームコンストラクタに渡す引数（イベントハンドラとして自身のメソッドを含めている）
    initialData () {
      return {
        query: '#canvas',
        vueMethods: {
          shuffle: this.shuffle,
          search: this.search,
          updateBoard: this.updateBoard,
        },
        ...this.gameData,
      }
    },
  },
  created () {
    // ゲームを初期化し、インスタンスをstoreに送る
    createGame(this.initialData)
    .then(app => this.$store.commit('setGameApp', app))  // eslint-disable-next-line
    .catch(err => console.error(err))
  },
  methods: {
    // 盤面をシャッフルするメソッド(ついでに設定も初期化する）
    shuffle () {
      if (!this.activeDrops[0]) {
        return
      }
      const newBoard = []
      for (let i = 0, len = this.board.length; i < len; i++) {
        let color
        do {
          color = Math.floor(Math.random() * 9) + 1
        } while (!this.activeDrops[color])
        newBoard[i] = color
      }
      this.$store.commit('updateBoardSettings', {
        propName: 'board',
        newValue: newBoard,
      })
      this.$store.commit('resetHarassments')
      this.$store.commit('resetSearchData')
      this.startNewGame()
    },
    // 盤面の状態を更新するメソッド
    updateBoard (boardData) {
      this.$store.commit('updateBoardSettings', {
        propName: 'board',
        newValue: boardData.board,
      })
      this.$store.commit('updateBoardSettings', {
        propName: 'startPosition',
        newValue: boardData.startPosition,
      })
      this.$store.commit('updateBoardSettings', {
        propName: 'immovablePositions',
        newValue: boardData.immovablePositions,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#canvas {
  width: 400px;   // 375pxで元サイズの半分
  height: 712px;  // 667pxで元サイズの半分
  margin: 0;
  display: inline-block;
  vertical-align: bottom;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0 -1px 8px #193648;
  border-radius: 25px 25px 5px 5px;
}
</style>