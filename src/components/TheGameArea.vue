<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import { mapState } from 'vuex'
import createGame from '../phina/CreateGame'
import controller from '../mixins/controller'

export default {
  name: 'TheGameArea',
  
  mixins: [
    controller,
  ],

  computed: {
    ...mapState([
      'gameApp',
      'boardSettings',
      'clearingSettings',
    ]),
    // ゲームコンストラクタに渡す引数（イベントハンドラとして自身のメソッドを含めている）
    initialData () {
      return {
        query: '#canvas',
        vueMethods: {
          search: this.search,
          shuffle: this.shuffleBoard,
          updateBoard: this.updateBoardSettings,
        },
        ...this.gameData,
      }
    },
  },

  // Vue側の更新と同時にGameApp側のデータも更新する
  watch: {
    'boardSettings.dropFall' (newValue) {
      this.gameApp.dropFall = newValue
    },
    'clearingSettings.activeDrops' (newValue) {
      this.gameApp.activeDrops = Array.from(newValue)
    },
  },

  created () {
    // ゲームを初期化し、インスタンスをstoreに送る
    createGame(this.initialData)
    .then(app => this.$store.commit('setGameApp', app))  // eslint-disable-next-line
    .catch(err => console.error(err))
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