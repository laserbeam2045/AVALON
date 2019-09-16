<template>
  <div class="drop-wrapper">
    <BaseDrop
      v-for="drop in drops"
      :key="drop.index"
      v-bind="drop"
    />
  </div>
</template>

<script>
import BaseDrop from "./BaseDrop"

export default {
  name: 'DropData',
  props: {
    drops: Array,
  },
  components: {
    BaseDrop,
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