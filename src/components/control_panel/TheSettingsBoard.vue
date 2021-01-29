<template>
  <fieldset id="board-settings">
    <legend>BOARD SETTINGS</legend>
    <table>
      <SettingsBoardTypeA
        v-for="(setting, name) in settingsA"
        :key="name"
        :name="name"
        :setting="setting"
        @change="updateBoardSettings"
      />
      <SettingsBoardTypeB
        v-for="(setting, name) in settingsB"
        :key="name"
        :name="name"
        :setting="setting"
        @change="updateBoardSettings"
      />
    </table>
  </fieldset>
</template>

<script>
import SettingsBoardTypeA from './SettingsBoardTypeA'
import SettingsBoardTypeB from './SettingsBoardTypeB'

export default {
  name: 'TheSettingsBoard',
  components: {
    SettingsBoardTypeA,
    SettingsBoardTypeB,
  },
  computed: {
    settingsA () {
      return this.$store.state.boardSettings.typeA
    },
    settingsB () {
      const typeB = {
        ...this.$store.state.boardSettings.typeB
      }
      delete typeB.default
      return typeB
    },
  },
  methods: {
    updateBoardSettings ($event) {
      this.$store.commit('updateBoardSettings', $event)
      if ($event.value)
        this.$playSound('sound-on')
      else
        this.$playSound('sound-off')
    },
  },
}
</script>

<style lang="scss">
th {
  padding: 0;
  height: 25px;
  
  span {
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
td {
  padding: 0 0 0 10px;

  label {
    padding: 1px 2px;
    display: inline-block;
  }
}
</style>