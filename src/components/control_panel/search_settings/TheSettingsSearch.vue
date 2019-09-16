<template>
  <fieldset>
    <legend>SEARCH SETTINGS</legend>
    <div>
      <BaseInput
        v-for="(setting, name, index) in searchSettings"
        :key=index
        :label=name
        :setting=setting
      />
    </div>
  </fieldset>
</template>

<script>
import BaseInput from "./BaseInput"

export default {
  name: 'TheSettingsSearch',
  components: {
    BaseInput,
  },
  computed: {
    searchSettings () {
      return this.$store.state.searchSettings
    },
  },
}
</script>

<style lang="scss" scoped>
fieldset {
  margin-top: 10px;

  > div {
    display: flex;
    justify-content: space-between;
  }
}
</style>