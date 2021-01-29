<template>
  <fieldset id="combo-data">
      <table>
        <ComboDataTr>
          <template #default>Max.</template>
          <template #combo>{{ maxCombo }}</template>
          <template #magni>{{ maxMagni }}</template>
          <template #drops>
            <ComboDataTrDrops :drops="dropTypes1"/>
          </template>
        </ComboDataTr>

    <transition name="fade" appear>
        <ComboDataTr v-if="bestNode" v-bind="maxClass" key="foo">
          <template #combo>{{ combo }}</template>
          <template #magni>{{ magni }}</template>
          <template #drops>
            <ComboDataTrDrops :drops="dropTypes2"/>
          </template>
        </ComboDataTr>
        <tr v-else></tr>
    </transition>
      </table>
  </fieldset>
</template>

<script>
import ComboDataTr from './ComboDataTr'
import ComboDataTrDrops from './ComboDataTrDrops'
import { DROP_TYPE_MAX } from '../../store/constants'
import { mapState } from 'vuex'

export default {
  name: 'TheComboData',
  components: {
    ComboDataTr,
    ComboDataTrDrops,
  },
  computed: {
    ...mapState({
      bestNode: 'bestNode',
      leaderSettings: 'leaderSettings',
      board: state => state.boardSettings['typeC']['board'],
    }),
    // 盤面に存在するドロップの数（種類別）
    dropCountArray () {
      const array = (new Array(DROP_TYPE_MAX + 1)).fill(0)
      this.board.forEach(color => array[color]++)
      return array
    },
    // 現在の盤面で可能なコンボ数（種類別）
    comboCountArray () {
      return this.dropCountArray.map(num => Math.floor(num / 3))
    },
    // 探索結果の最終盤面のコンボ情報
    comboData () {
      return this.bestNode ? this.bestNode.comboData : null
    },
    // 探索結果の動かし方により、消えるドロップの数(配列)
    clearCountAsResult () {
      return this.comboData.combo.map(array => 
        array.length ? array.reduce((a, b) => a + b) : 0
      )
    },
    // 探索結果の動かし方により、消えるコンボ数(配列)
    comboCountAsResult () {
      return this.comboData.combo[0]
    },
    // ドロップ別の、可能な最大コンボ数
    dropTypes1 () {
      return this.getZeroArray().map((e, i) => {
        const index = i + 1
        const number = this.comboCountArray[index]
        const criteria = number
        return { index, number, criteria }
      })
      .filter(drop => drop.criteria)
    },
    // ドロップ別の、探索結果のコンボ数
    dropTypes2 () {
      return this.getZeroArray().map((e, i) => {
        const index = i + 1
        const number = this.comboCountAsResult[index]
        const criteria = this.comboCountArray[index]
        return { index, number, criteria }
      })
      .filter(drop => drop.criteria)
    },
    // 可能な最大コンボ数
    maxCombo () {
      return this.leaderSettings.maxCombo
    },
    // 可能な最大倍率（表示用に四捨五入して３桁区切り）
    maxMagni () {
      return this.adjust(this.leaderSettings.maxMagni)
    },
    // 探索結果のコンボ数（表示用に四捨五入）
    combo () {
      return this.adjust(this.comboData.combo[0][0], 10)
    },
    // 探索結果の倍率（表示用に四捨五入して3桁区切り）
    magni () {
      return this.adjust(this.comboData.magnification)
    },
    // コンボ数や倍率が最大値の場合に、それぞれ「maximum」classが付与される
    maxClass () {
      const { maxCombo, maxMagni } = this.leaderSettings
      return {
        'maxCombo': {'maximum': (maxCombo <= this.comboData.combo[0][0])},
        'maxMagni': {'maximum': (maxMagni <= this.comboData.magnification)},
      }
    },
  },
  methods: {
    // ドロップの種類数分の０埋め配列を得るメソッド
    getZeroArray () {
      return (new Array(DROP_TYPE_MAX)).fill(0)
    },
    // 数値を表示用に四捨五入して3桁区切りにするメソッド
    adjust (number, decimalDigit = 1) {
      number = Math.round(number * decimalDigit) / decimalDigit
      return number.toLocaleString()
    },
  }
}
</script>

<style lang="scss" scoped>
#combo-data {
  margin: 7px 0 0;

  table {
    height: 50px;
  }

  .fade-enter-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-leave-to {
    opacity: 0;
  }
}
</style>