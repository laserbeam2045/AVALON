<template>
  <label>
    <input
      type="checkbox"
      v-show="false"
      :checked="checked"
      @change="change"
    >
    <BaseDrop
      :index="index"
      :number="0"
      :is-active="checked"
    />
  </label>
</template>

<script>
import BaseDrop from '../BaseDrop'

export default {
  name: 'SettingClearingCheckBox',
  components: {
    BaseDrop,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    change ($event) {
      this.$emit('change', {
        index: this.index,
        value: $event.target.checked,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  padding: 1px 4px;
  display: inline-block;
  vertical-align: middle;
  font-size: 0 !important;
  cursor: pointer;
}
</style>