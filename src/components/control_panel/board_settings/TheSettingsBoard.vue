<template>
  <fieldset id="board-settings">
    <legend>BOARD SETTINGS</legend>
    <div>
      <SettingsBoard
        v-for="(setting, name, index) in settings"
        :key="index"
        :label="name"
        :settings="setting"
        @change="updateBoardSettings"
      />
    </div>
  </fieldset>
</template>

<script>
import SettingsBoard from './SettingsBoard'

export default {
  name: 'TheSettingsBoard',
  components: {
    SettingsBoard,
  },
  computed: {
    settings () {
      return {
        boardSize: [
          {
            value: '5x6',
            label: '5x6',
          },
          {
            value: '6x7',
            label: '6x7',
          },
        ],
        dropFall: [
          {
            value: true,
            label: 'ON',
          },
          {
            value: false,
            label: 'OFF',
          },
        ],
        greedy: [
          {
            value: true,
            label: 'ON',
          },
          {
            value: false,
            label: 'OFF',
          },
        ],
      }
    },
  },
  methods: {
    updateBoardSettings ($event) {
      this.$store.commit('updateBoardSettings', $event)
      if ($event.newValue)
        this.$playSound('sound-on')
      else
        this.$playSound('sound-off')
    },
  },
}
</script>

<style lang="scss" scoped>
#board-settings {
  > div {
    display: flex;
    justify-content: space-between;
  }
  > div:last-child {
    margin-right: 5px;
  }
}
</style>