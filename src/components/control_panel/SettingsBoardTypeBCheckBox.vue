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
      :is-active="checked"
    />
  </label>
</template>

<script>
import BaseDrop from '../BaseDrop'

export default {
  name: 'SettingsBoardTypeBCheckBox',
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
  vertical-align: middle;
  font-size: 0 !important;
  cursor: pointer;
}
</style>