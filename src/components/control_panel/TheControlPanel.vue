<template>
  <fieldset id=control-panel>
    <TheSkillButtons/>
    <TheSettingsLeader/>
    <TheSettingsBoard/>
    <TheSettingsSearch/>
    <TheSettingsClearing/>
  </fieldset>
</template>

<script>
import TheSkillButtons from './skill_buttons/TheSkillButtons'
import TheSettingsLeader from './leader_settings/TheSettingsLeader'
import TheSettingsBoard from './board_settings/TheSettingsBoard'
import TheSettingsSearch from './search_settings/TheSettingsSearch'
import TheSettingsClearing from './TheSettingsClearing'

export default {
  name: 'TheControlPanel',
  components: {
    TheSkillButtons,
    TheSettingsLeader,
    TheSettingsBoard,
    TheSettingsSearch,
    TheSettingsClearing,
  },
}
</script>

<style lang="scss">
#control-panel {
  margin-top: 10px;
  padding: 15px;
  border: 5px solid silver;
  border-radius: 10px;
  box-shadow: 0px 3px 3px gray;

  background: rgb(7,11,23);
  color: rgb(23,210,207);
  box-sizing: border-box;

  label, th, td, span {
    font-size: 13px;
  }
  .checked, .active {
    color: orange;
  }
  fieldset {
    padding: 5px 10px 10px;
    border: 1px solid rgb(23,210,207);
    border-radius: 5px;

    legend {
      padding: 0 7px 0 5px;
    }
    th:not(.checked),
    label:not(.checked),
    label:not(.checked) img {
      transition: 0.2s all;
    }
  }
}
</style>