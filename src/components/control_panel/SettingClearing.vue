<template>
  <tr>
    <th :class="{ active: data[0] }">
      <span @click="$emit('change', {propName: label, index: 0, newValue: !data[0]})">
        {{ label | space | upperCase }}
      </span>
    </th>
    <td>
      <SettingClearingCheckBox
        v-for="(bool, index) in filteredData"
        :key="index"
        :label="label"
        :index="index + 1"
        :checked="bool"
        @change="$emit('change', $event)"
      />
    </td>
  </tr>
</template>

<script>
import SettingClearingCheckBox from './SettingClearingCheckBox'
import filters from '../../mixins/filters'

export default {
  name: 'SettingClearing',
  components: {
    SettingClearingCheckBox,
  },
  mixins: [
    filters,
  ],
  props: {
    label: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
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