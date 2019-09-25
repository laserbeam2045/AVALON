<template>
  <label v-on:wheel="updateNumber">
    {{ label | space | upperCase }}
    <input
      type="number"
      v-show="false"
      :step="setting.step"
      :min="setting.min"
      :max="setting.max"
      :value:number="setting.value"
    />
    <span class="active">{{ numberToDisplay }}</span>
  </label>
</template>

<script>
import filters from '../../mixins/filters'
import { TweenLite } from 'gsap'

export default {
  name: 'SettingSearch',
  mixins: [
    filters,
  ],
  props: {
    label: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      tweenedNumber: this.setting.value,
    }
  },
  computed: {
    // ビーム幅のみアニメーションをつける
    numberToDisplay () {
      return (this.setting.step === 1) ? this.setting.value : this.animatedNumber
    },
    animatedNumber () {
      return this.tweenedNumber.toFixed(0)
    },
  },
  watch: {
    "setting.value": function(newValue) {
      TweenLite.to(this.$data, 0.25, {tweenedNumber: newValue})
    },
  },
  methods: {
    // ホイール時の処理
    updateNumber () {
      this.$store.commit({
        type: 'updateSearchSettings',
        propName: this.label,
        event,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
label:nth-of-type(1) {
  span {
    width: 41px;
  }
}
label {
  padding: 3px 5px;

  span {
    width: 17px;
    display: inline-block;
    text-align: center;
    cursor: text;
  }
}
</style>