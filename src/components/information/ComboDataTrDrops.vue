<template>
  <transition-group
    tag="div"
    name="drop"
    class="drop-wrapper"
    appear
  >
    <baseDrop
      v-for="drop in drops"
      :key="drop.index"
      :index="drop.index"
      :number="drop.number"
      :isActive="!!drop.number"
      :style="{ width: (10 > drop.criteria) ? '35px' : '45px' }"
    />
  </transition-group>
</template>

<script>
import BaseDrop from '../BaseDrop'

export default {
  name: 'ComboDataTrDrops',
  components: {
    BaseDrop,
  },
  props: {
    drops: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.drop-wrapper {
  display: flex;
  width: auto;
}
.drop-enter {
  opacity: 0;
  transform: translateX(100px);
}
.drop-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.drop-leave-active {
  position: absolute;
}
.drop-move {
  transition: transform 1s;
}
</style>