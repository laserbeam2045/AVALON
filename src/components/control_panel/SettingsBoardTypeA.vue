<template>
  <tr>
    <th>
      <label>{{ name | space | upperCase }}</label>
    </th>
    <td>
      <BaseRadioButton
        v-for="(label, index) of setting.labels"
        :key="index"
        :value="label2value(label)"
        :checked="isChecked(label)"
        @change="change"
      >
        {{ label }}
      </BaseRadioButton>
    </td>
  </tr>
</template>

<script>
import BaseRadioButton from '../BaseRadioButton'
import filters from '../../mixins/filters'

export default {
  name: 'SettingsBoardTypeA',
  components: {
    BaseRadioButton,
  },
  mixins: [
    filters,
  ],
  props: {
    name: {
      type: String,
      required: true,
      validator (value) {
        return [
          'boardSize',
          'greedy',
        ].indexOf(value) !== -1
      },
    },
    setting: {
      type: Object,
      required: true,
      validator (value) {
        return (
          'value' in value &&
          'values' in value &&
          'labels' in value
        )
      },
    },
  },
  methods: {
    label2value (label) {
      const index = this.setting.labels.indexOf(label)
      return this.setting.values[index]
    },
    isChecked (label) {
      return this.setting.value === this.label2value(label)
    },
    change (value) {
      this.$emit('change', {
        property: this.name,
        value: value,
      })
    }
  },
}
</script>