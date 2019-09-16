<template>
  <div id="right-container">
    <TheInformation/>
    <TheControlPanel/>
  </div>
</template>

<script>
import TheInformation from './information/TheInformation'
import TheControlPanel from './control_panel/TheControlPanel'

export default {
  name: 'TheRightContainer',
  components: {
    TheInformation,
    TheControlPanel,
  },
}
</script>

<style scoped>
#right-container {
  display: inline-block;
  margin-left: 10px;
}
</style>