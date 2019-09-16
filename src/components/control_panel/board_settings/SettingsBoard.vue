<template>
  <div>
    <label>{{ upperCaseLabel }}</label>
    <BaseRadioButton
      v-for="(setting, index) of settings"
      :key="index"
      :value="setting.value"
      :checked="setting.value === value"
      @change="$emit(`change`, {propName: label, newValue: $event})"
    >
      {{ setting.label }}
    </BaseRadioButton>
  </div>
</template>

<script>
import BaseRadioButton from './BaseRadioButton'
import UpperCaseLabel from '../../../mixins/UpperCaseLabel'

export default {
  name: 'SettingsBoard',
  components: {
    BaseRadioButton,
  },
  mixins: [
    UpperCaseLabel
  ],
  props: {
    label: String,
    settings: Array,
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