<template>
  <div
    id="root"
    @click="focus"
    @click.right.prevent="searchAndFocus"
  >
    <div>
      <TheGameArea/>
      <TheRightContainer/>
    </div>
    <TheSoundsData/>
    <TheKeyInput ref="keyInput"/>
  </div>
</template>

<script>
import TheGameArea from './components/TheGameArea'
import TheRightContainer from './components/TheRightContainer'
import TheSoundsData from './components/TheSoundsData'
import TheKeyInput from './components/TheKeyInput'
import controller from './mixins/controller'
import { mapState } from 'vuex'

export default {
  name: 'app',  
  components: {
    TheGameArea,
    TheRightContainer,
    TheSoundsData,
    TheKeyInput,
  },
  mixins: [
    controller,
  ],
  data () {
    return {
      initialBoards: {  // 盤面の初期配置
        '5x6': [
          5, 2, 5, 1, 5, 5,
          2, 5, 5, 1, 1, 5,
          3, 5, 3, 5, 5, 5,
          5, 2, 2, 5, 1, 5,
          5, 3, 5, 3, 5, 5
        ],
        '6x7': [
          3, 1, 3, 1, 1, 3, 3,
          1, 3, 1, 1, 3, 1, 1,
          3, 1, 3, 1, 3, 3, 3,
          1, 3, 1, 1, 1, 3, 1,
          3, 3, 3, 3, 3, 3, 1,
          1, 1, 3, 1, 1, 1, 3
        ],
      },
    }
  },
  computed: {
    ...mapState([
      'maximum',
      'leaderSettings',
      'boardSettings',
      'clearingSettings'
    ]),
    // 盤面の初期配置
    initialBoard () {
      const boardSize = this.boardSettings.boardSize
      const initialBoard = this.initialBoards[boardSize]
      return Array.from(initialBoard)
    },
  },
  watch: {
    'leaderSettings.leader1' () {
      this.focus()
    },
    'leaderSettings.leader2' () {
      this.focus()
    },
    'boardSettings.boardSize' () {
      this.$store.commit('resetHarassments')
      this.$store.commit('resetSearchData')
      this.initializeBoard()
      this.startNewGame()
    },
    'boardSettings.board' () {
      this.$store.dispatch('updateMaxData')
    },
    'maximum.combo' () {
      this.$store.commit('updateComboLimit')
    },
    'boardSettings.dropFall' (newValue) {
      this.setDropFall(newValue)
    },
    'clearingSettings.activeDrops' (newValue) {
      this.setActiveDrops(newValue)
    }
  },
  created () {
    this.initializeBoard()
  },
  methods: {
    // 盤面を初期化するメソッド
    initializeBoard () {
      this.$store.commit({
        type: 'updateBoardSettings',
        propName: 'board',
        newValue: this.initialBoard,
      })
    },
    // INPUT要素にフォーカスし、キー入力受付状態にするメソッド
    focus () {
      if (!event || event.target.tagName !== "SELECT") {
        this.$refs.keyInput.focus()
      }
    },
    // 発火元がボタンでなければ探索するメソッド
    searchAndFocus () {
      if (event.target.tagName !== 'BUTTON') {
        this.search()
      }
      this.focus()
    },
  },
}
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
  padding: 0;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
#root {
  width: 100%;
  height: 100%;
  min-width: 930px;
  min-height: 712px;
  display: flex;
  align-items: center;
  justify-content: center;
}
table {
  border-collapse: collapse;
}
</style>