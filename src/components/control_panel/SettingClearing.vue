<template>
  <tr>
    <th :class="{ active: isActive }">
      <span @click="change">{{ label | space | upperCase }}</span>
    </th>
    <td>
      <SettingClearingCheckBox
        v-for="(bool, index) in filteredData"
        :key="index"
        :index="index + 1"
        :checked="bool"
        @change="change"
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
    isActive () {
      return this.data[0]
    },
    filteredData () {
      return this.data.slice(1)
    },
    thEventProps () {
      return {
        name: this.label,
        index: 0,
        value: !this.isActive,
      }
    },
  },
  methods: {
    change ($event) {
      if ($event.type === 'click') {
        this.$emit('change', this.thEventProps)
      } else {
        this.$emit('change', Object.assign($event, {name: this.label}))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
th {
  padding: 0;
  span {
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
td {
  padding: 0 0 0 8px;
}
</style>