<template>
  <fieldset id="state">
    <div>
      <p v-html="message" :class="{ 'text-danger': hasError }" />
    </div>
  </fieldset>
</template>

<script>
import { STATE } from '../../constants'

export default {
  name: 'TheStateData',
  computed: {
    stateFlag () {
      return this.$store.state.stateFlag
    },
    hasError () {
      return this.$store.getters.hasApiError
    },
    errorMessage () {
      return this.$store.state.errorMessage
    },
    normalMessage () {
      switch (this.stateFlag) {
        case STATE.STANDBY    : return 'STANDBY'
        case STATE.SEARCHING  : return 'SEARCHING...'
        case STATE.SEARCH_END : return 'SEARCH END'
        default               : return ''
      }
    },
    message () {
      if (this.hasError) {
        return this.errorMessage
      } else {
        return this.normalMessage
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#state {
  height: 75px;
 
  // MEMO: fieldsetはflexboxが効かないためwrapperが必要
  div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      flex-shrink: 0;
    }
    .text-danger {
      color: red;
    }
  }
}
</style>