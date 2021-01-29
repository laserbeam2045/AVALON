<template>
  <tr>
    <th>
      <span @click="change">{{ name | space | upperCase }}</span>
    </th>
    <td>
      <SettingsBoardTypeBCheckBox
        v-for="(bool, index) in filteredSetting"
        :key="index"
        :index="index + 1"
        :checked="bool"
        @change="change"
      />
    </td>
  </tr>
</template>

<script>
import SettingsBoardTypeBCheckBox from './SettingsBoardTypeBCheckBox'
import filters from '../../mixins/filters'

export default {
  name: 'SettingsBoardTypeB',
  components: {
    SettingsBoardTypeBCheckBox,
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
          'clearable',
          'fallDrop',
        ].indexOf(value) !== -1
      },
    },
    setting: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isActive () {
      return this.setting[0]
    },
    filteredSetting () {
      return this.setting.slice(1)
    },
    thEventProps () {
      return {
        property: this.name,
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
        this.$emit('change', Object.assign($event, {property: this.name}))
      }
    },
  },
}
</script>