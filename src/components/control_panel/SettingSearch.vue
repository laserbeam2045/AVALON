<template>
  <label v-on:wheel="updateNumber">
    <span>{{ label | space | upperCase }}</span>
    <BaseInputNumber
      :setting="setting"
      :active="true"
    />
    </label>
</template>

<script>
import filters from '../../mixins/filters'
import BaseInputNumber from './BaseInputNumber'

export default {
  name: 'SettingSearch',
  mixins: [
    filters,
  ],
  components: {
    BaseInputNumber,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
  methods: {
    // ホイール時の処理
    updateNumber () {
      this.$store.commit({
        type: 'updateSearchSettings',
        propName: this.label,
        event,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  span {
    margin-right: 4px;
  }
</style>