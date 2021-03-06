import { mapState, mapGetters, mapActions } from 'vuex'
import { STATE } from '../store/constants'

export default {
  computed: {
    ...mapState([
      'stateFlag',
      'gameMethods',
      'boardSettings',
      'clearingSettings',
    ]),
    ...mapGetters([
      'isDanger',
      'process',
    ]),
    // ゲームインスタンスに渡すデータ
    gameData () {
      const { fallDrop } = this.boardSettings['typeB']
      const { board, startPosition, noEntryPositions } = this.boardSettings['typeC']
      return {
        fallDrop: Array.from(fallDrop),
        board: Array.from(board),
        startPosition,
        noEntryPositions: new Set(noEntryPositions),
      }
    },
  },

  methods: {
    ...mapActions({
      captureAPI: 'capture',
      searchAPI: 'search',
    }),

    // 画面をキャプチャーして盤面を取得する非同期処理
    // MEMO: Vueが利用する
    // 戻り値：Promise
    capture () {
      return new Promise((resolve, reject) => {
        if (this.stateFlag === STATE.SEARCHING) {
          return reject()
        }
        this.captureAPI().then(success => {
          if (success) {
            this.startNewGame()
            resolve()
          } else {
            reject()
          }
        })
      })
    },

    // サーバーに探索のリクエストを送る非同期処理
    // MEMO: VueとgameAppのどちらも利用する
    // 戻り値：Promise
    search () {
      return new Promise((resolve, reject) => {
        if (this.stateFlag === STATE.SEARCHING) {
          return reject()
        }
        this.startNewGame()
        this.searchAPI().then(success => {
          if (success) {
            this.moveOrAlert()
            this.displayLine()
            resolve()
          } else {
            reject()
          }
        })
      })
    },

    // 盤面をシャッフルするメソッド(ついでに設定も初期化する）
    // MEMO: gameAppが利用する
    shuffleBoard () {
      if (!this.boardSettings['typeB']['fallDrop'][0]) return
      this.$store.commit('shuffleBoard')
      this.$store.commit('resetHarassments')
      this.$store.commit('resetSearchData')
      this.startNewGame()
    },

    // 盤面の状態を更新するメソッド
    // MEMO: gameAppが利用する
    updateBoardSettings (boardData) {
      this.$store.commit('updateBoardSettings', {
        property: 'board',
        value: boardData.board,
      })
      this.$store.commit('updateBoardSettings', {
        property: 'startPosition',
        value: boardData.startPosition,
      })
      this.$store.commit('updateBoardSettings', {
        property: 'noEntryPositions',
        value: boardData.noEntryPositions,
      })
    },

    // ゲームキャンバスをリセットするメソッド
    // MEMO: gameAppに対する命令
    startNewGame () {
      this.gameMethods.startNewGame(this.gameData)
    },

    // 手順線を表示させるメソッド
    // MEMO: gameAppに対する命令
    displayLine (fadeTime = 100, duration = 0) {
      this.gameMethods.displayLine(Array.from(this.process), fadeTime, duration)
    },

    // ドロップを自動で動かすメソッド
    // MEMO: gameAppに対する命令
    moveDrops (moveTime = 100, duration = 0) {
      if (typeof(moveTime) != 'number') {
        moveTime = 80
      }
      this.gameMethods.moveDrops(Array.from(this.process), moveTime, duration)
    },

    // 探索結果に応じて、ドロップを動かすか、警告音を発するメソッド
    // MEMO: gameAppに対する命令
    moveOrAlert () {
      if (this.isDanger) {
        this.$playSound('sound-alert')
      } else {
        this.moveDrops()
      }
    },
  },
}