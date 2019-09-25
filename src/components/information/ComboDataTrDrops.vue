<template>
  <div class="drop-wrapper">
    <ComboDataTrDropsData
      v-for="drop in drops"
      :key="drop.index"
      v-bind="drop"
    />
  </div>
</template>

<script>
import ComboDataTrDropsData from "./ComboDataTrDropsData"

export default {
  name: 'ComboDataTrDrops',
  props: {
    drops: {
      type: Array,
      required: true,
    },
  },
  components: {
    ComboDataTrDropsData,
  },
}
</script>

<style lang="scss" scoped>
.drop-wrapper {
  display: flex;
  width: auto;
  text-align: left;
}
</style>