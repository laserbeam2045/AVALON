<template>
  <fieldset id="state">
    <div>
      <p>{{ message }}</p>
    </div>
  </fieldset>
</template>

<script>
import * as CONST from '../../constants'

export default {
  name: 'TheStateData',
  computed: {
    stateFlag () {
      return this.$store.state.stateFlag
    },
    message () {
      switch (this.stateFlag) {
        case CONST.STANDBY    : return 'STANDBY'
        case CONST.SEARCHING  : return 'SEARCHING...'
        case CONST.SEARCH_END : return 'SEARCH END'
        default               : return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#state {
  height: 75px;
 
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>