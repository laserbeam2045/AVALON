<template>
  <label :class="{ checked }">
    <input
      type="checkbox"
      v-show="false"
      :checked="checked"
      @change="change"
    >
    <img :src="imgSrc" class="drop">
  </label>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  props: {
    checked: Boolean,
    label: String,
    index: Number,
  },
  computed: {
    isException () {
      return (this.label === 'line' && this.index === 7)
    },
    imgSrc () {
      if (this.isException) {
        return require(`../../assets/img/drop_6_2.png`)
      } else {
        return require(`../../assets/img/drop_${this.index}.png`)
      }
    },
  },
  methods: {
    change ($event) {
      this.$emit('change', {
        propName: this.label,
        index: this.index,
        newValue: $event.target.checked,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin: 0px 2px;
  padding: 1px 3px;
  display: inline-block;
  line-height: 21px;
  vertical-align: middle;
  cursor: pointer;

  .drop {
    width: 22px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
}
label:not(.checked) .drop {
  opacity: 0.2;
}
</style>