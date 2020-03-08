<template>
  <fieldset id="board-settings">
    <legend>BOARD SETTINGS</legend>
    <div>
      <SettingBoard
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
import SettingBoard from './SettingBoard'

export default {
  name: 'TheSettingsBoard',
  components: {
    SettingBoard,
  },
  computed: {
    settings () {
      return {
        boardSize: [
          {
            label: '5x6',
            value: '5x6',
          },
          {
            label: '6x7',
            value: '6x7',
          },
        ],
        dropFall: [
          {
            label: 'ON',
            value: true,
          },
          {
            label: 'OFF',
            value: false,
          },
        ],
        greedy: [
          {
            label: 'ON',
            value: true,
          },
          {
            label: 'OFF',
            value: false,
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