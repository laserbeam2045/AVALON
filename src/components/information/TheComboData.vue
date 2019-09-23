<template>
  <fieldset id="combo-data">
    <table>
      <BaseTr @click="switchDisplayFlag">
        <template #default>Max</template>
        <template #combo>{{ maximum.combo }}</template>
        <template #magni>{{ maxMagnification }}</template>
        <template #drops>
          <DropData v-if="displayFlag" :drops="dropTypes1"/>
          <DropData v-else             :drops="dropTypes2"/>
        </template>
      </BaseTr>
      <BaseTr
        v-if="bestNode"
        v-bind="maxClass"
        @click="switchDisplayFlag"
      >
        <template #combo>{{ combo }}</template>
        <template #magni>{{ magnification }}</template>
        <template #drops>
          <DropData v-if="displayFlag" :drops="dropTypes3"/>
          <DropData v-else             :drops="dropTypes4"/>
        </template>
      </BaseTr>
      <tr v-else></tr>
    </table>
  </fieldset>
</template>

<script>
import BaseTr from './BaseTr'
import DropData from './DropData'
import { mapState } from 'vuex'
import { DROP_TYPE_MAX } from '../../constants'

export default {
  name: 'TheComboData',
  components: {
    BaseTr,
    DropData,
  },
  data () {
    return {
      displayFlag: true,  // 表示する情報（true:コンボ数 false:ドロップ数）        
    }
  },
  computed: {
    ...mapState({
      maximum: 'maximum',
      bestNode: 'bestNode',
      board: state => state.boardSettings.board,
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
    // ドロップ別の、存在するドロップ数
    dropTypes2 () {
      return this.getZeroArray().map((e, i) => {
        const index = i + 1
        const number = this.dropCountArray[index]
        const criteria = number
        return { index, number, criteria }
      })
      .filter(drop => drop.criteria)
    },
    // ドロップ別の、探索結果のコンボ数
    dropTypes3 () {
      return this.getZeroArray().map((e, i) => {
        const index = i + 1
        const number = this.comboCountAsResult[index]
        const criteria = this.comboCountArray[index]
        return { index, number, criteria }
      })
      .filter(drop => drop.criteria)
    },
    // ドロップ別の、探索結果の消えるドロップ数
    dropTypes4 () {
      return this.getZeroArray().map((e, i) => {
        const index = i + 1
        const number = this.clearCountAsResult[index]
        const criteria = this.dropCountArray[index]
        return { index, number, criteria }
      })
      .filter(drop => drop.criteria)
    },
    // 可能な最大倍率（表示用に四捨五入して３桁区切り）
    maxMagnification () {
      return this.adjust(this.maximum.magnification)
    },
    // 探索結果の倍率（表示用に四捨五入して3桁区切り）
    magnification () {
      return this.adjust(this.comboData.magnification)
    },
    // 探索結果のコンボ数（表示用に四捨五入）
    combo () {
      return this.adjust(this.comboData.combo[0][0], 10)
    },
    // コンボ数や倍率が最大値の場合に、それぞれ「maximum」classが付与される
    maxClass () {
      return {
        'combo': {'maximum': (this.maximum.combo <= this.comboData.combo)},
        'magni': {'maximum': (this.maximum.magnification <= this.comboData.magnification)},
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
    // displayFlagの値を反転させるメソッド
    switchDisplayFlag () {
      this.displayFlag = !this.displayFlag
    },
  }
}
</script>

<style lang="scss" scoped>
#combo-data {
  margin-top: 7px;
  padding-top: 5px;

  table {
    height: 60px;
  }
}
</style>