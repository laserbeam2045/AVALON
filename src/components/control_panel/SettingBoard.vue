<template>
  <div>
    <label>{{ label | space | upperCase }}</label>
    <SettingBoardRadioButton
      v-for="(setting, index) of settings"
      :key="index"
      :label="setting.label"
      :value="setting.value"
      :checked="setting.value === value"
      @change="$emit(`change`, {propName: label, newValue: $event})"
    />
  </div>
</template>

<script>
import SettingBoardRadioButton from './SettingBoardRadioButton'
import filters from '../../mixins/filters'

export default {
  name: 'SettingBoard',
  components: {
    SettingBoardRadioButton,
  },
  mixins: [
    filters,
  ],
  props: {
    label: {
      type: String,
      required: true,
    },
    settings: {
      type: Array,
      required: true,
    },
  },
  computed: {
    boardSettings () {
      return this.$store.state.boardSettings
    },
    value () {
      return this.boardSettings[this.label]
    },
  },
}
</script>

<style scoped>
label:first-child {
  margin: 3px 1px 3px 5px;
}
label:not(:first-child) {
  padding: 3px 1px;
}
label:not(:first-child):not(.checked) {
  cursor: pointer;
  color: darkcyan;
}
</style>