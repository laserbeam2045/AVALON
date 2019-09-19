import { mapState } from 'vuex'
import * as CONST from '../constants'

export default {
  computed: {
    ...mapState([
      'stateFlag',
      'gameApp',
      'bestNode',
      'boardSettings',
      'clearingSettings',
    ]),

    // 探索結果が危険性を伴うかどうか
    isDanger () {
      return this.$store.getters.isDanger
    },
    // 操作手順
    process () {
      return this.bestNode ? this.bestNode.process.slice(0, this.bestNode.movedCount + 1) : null
    },
    // ゲームインスタンスに渡すデータ
    gameData () {
      const { board, dropFall, startPosition, immovablePositions } = this.boardSettings
      const activeDrops = this.clearingSettings.activeDrops
      return {
        board: Array.from(board),
        process: this.process,
        dropFall,
        activeDrops: Array.from(activeDrops),
        startPosition,
        immovablePositions: new Set(immovablePositions),
      }
    },
  },

  methods: {
    // 画面をキャプチャーして盤面を取得する処理
    // 戻り値：Promise
    capture () {
      if (this.stateFlag === CONST.SEARCHING) {
        return new Promise((resolve, reject) => reject())
      }
      return this.$store.dispatch('capture').then(() => {
        this.$store.commit('resetSearchData')
        this.startNewGame()
      })
    },

    // サーバーに探索のリクエストを送る処理
    // 戻り値：Promise
    search () {
      if (this.stateFlag === CONST.SEARCHING) {
        return new Promise((resolve, reject) => reject())
      }
      this.$store.commit('setStateFlag', CONST.SEARCHING)

      return this.$store.dispatch('search').then(() => {
        this.startNewGame()
        this.moveOrAlert()
        this.displayLine()
        this.$store.commit('setStateFlag', CONST.SEARCH_END)
      })
    },

    // ゲームキャンバスをリセットするメソッド
    startNewGame () {
      this.gameApp.startNewGame(this.gameData)
    },

    // 手順線を表示させるメソッド
    displayLine (fadeTime = 100, duration = 0) {
      this.gameApp.displayLine(Array.from(this.process), fadeTime, duration)
    },

    // ドロップを自動で動かすメソッド
    moveDrops (moveTime = 100, duration = 0) {
      if (typeof(moveTime) != 'number') {
        moveTime = 100
      }
      this.gameApp.moveDrops(Array.from(this.process), moveTime, duration)
    },

    // 探索結果に応じて、ドロップを動かすか、警告音を発するメソッド
    moveOrAlert () {
      if (this.isDanger) {
        this.$playSound('sound-alert')
      } else {
        this.moveDrops()
      }
    },

    // ゲームインスタンスの落ちコンに関する設定を更新するメソッド
    setDropFall (newValue) {
      this.gameApp.dropFall = newValue
    },

    // ゲームインスタンスの落ちコンに関する設定を更新するメソッド
    setActiveDrops (newValue) {
      this.gameApp.activeDrops = Array.from(newValue)
    },
  },
}