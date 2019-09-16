<template>
  <tr>
    <th :class="{ active: data[0] }">
      <span @click="$emit('change', {propName: label, index: 0, newValue: !data[0]})">
        {{ upperCaseLabel }}
      </span>
    </th>
    <td>
      <BaseCheckbox
        v-for="(bool, index) in filteredData"
        :key="index"
        :checked="bool"
        :label="label"
        :index="index + 1"
        @change="$emit('change', $event)"
      />
    </td>
  </tr>
</template>

<script>
import BaseCheckbox from './BaseCheckbox'
import UpperCaseLabel from '../../mixins/UpperCaseLabel'

export default {
  name: 'SettingsClearing',
  components: {
    BaseCheckbox,
  },
  mixins: [
    UpperCaseLabel
  ],
  props: {
    data: Array,
    label: String,
  },
  computed: {
    filteredData () {
      return this.data.slice(1)
    },
  },
}
</script>

<style lang="scss" scoped>
th {
  padding: 0;
  span {
    padding: 2px 5px 2px 5px;
    cursor: pointer;
  }
}
td {
  padding: 0 0 0 8px;
}
</style>