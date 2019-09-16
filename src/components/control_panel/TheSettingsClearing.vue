<template>
  <fieldset id="clearing-settings">
    <legend>CLEARING SETTINGS</legend>
    <table>
      <SettingsClearing
        v-for="(value, name, index) in clearingSettings"
        :key="index"
        :data="value"
        :label="name"
        @change="updateClearingSettings"
      />
    </table>
  </fieldset>
</template>

<script>
import SettingsClearing from './SettingsClearing'

export default {
  name: 'TheSettingsClearing',
  components: {
    SettingsClearing,
  },
  computed: {
    clearingSettings () {
      return this.$store.state.clearingSettings
    },
  },
  methods: {
    updateClearingSettings (event) {
      this.$store.commit('updateClearingSettings', event)

      if (event.newValue) {
        this.$playSound('sound-on')
      } else {
        this.$playSound('sound-off')
      }
    },
  },
}
</script>

<style scoped>
#clearing-settings {
  margin-top: 10px;
}
</style>