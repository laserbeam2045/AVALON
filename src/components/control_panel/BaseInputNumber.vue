<template>
  <div>
    <input
      type="number"
      v-show="false"
      :min="setting.min"
      :max="setting.max"
      :step="setting.step"
      :value:number="setting.value"
    />
    <span
      :class="{ active }"
      :style="{ width }"
    >{{ numberToDisplay }}</span>
  </div>
</template>

<script>
import filters from '../../mixins/filters'
import { TweenLite } from 'gsap'

export default {
  name: 'BaseInputNumber',
  props: {
    setting: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  data () {
    return {
      tweenedNumber: this.setting.value,
    }
  },
  computed: {
    // 変化量が1以外のときはアニメーションをつける
    numberToDisplay () {
      return (this.setting.step === 1) ? this.setting.value : this.animatedNumber
    },
    animatedNumber () {
      return this.tweenedNumber.toFixed(0)
    },
    width () {
      return `${String(this.setting.max).length * 8 + 1}px`
    },
  },
  watch: {
    "setting.value": function(newValue) {
      TweenLite.to(this.$data, 0.25, {tweenedNumber: newValue})
    },
  },
}
</script>

<style lang="scss" scoped>
  div {
    display: inline-block;
  }
  span {
    display: inline-block;
    text-align: center;
    cursor: text;
  }
</style>