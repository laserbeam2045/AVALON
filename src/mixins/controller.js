import { mapState, mapActions } from 'vuex'
import { STATE } from '../constants'

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
        dropFall,
        activeDrops: Array.from(activeDrops),
        startPosition,
        immovablePositions: new Set(immovablePositions),
      }
    },
  },

  methods: {
    ...mapActions({
      captureAPI: 'capture',
      searchAPI: 'search',
    }),

    // 画面をキャプチャーして盤面を取得する処理
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

    // サーバーに探索のリクエストを送る処理
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
        moveTime = 80
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