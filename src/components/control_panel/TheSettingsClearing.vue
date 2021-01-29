<template>
  <fieldset id="clearing-settings">
    <legend>CLEARING SETTINGS</legend>
    <table>
      <SettingClearing
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
import SettingClearing from './SettingClearing'

export default {
  name: 'TheSettingsClearing',
  components: {
    SettingClearing,
  },
  computed: {
    clearingSettings () {
      return this.$store.state.clearingSettings
    },
  },
  methods: {
    updateClearingSettings ($event) {
      this.$store.commit('updateClearingSettings', $event)

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