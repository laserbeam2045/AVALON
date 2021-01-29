<template>
  <div>
    <img
      :src="imgSrc"
      :class="{ active: isActive }"
    >
    <transition name="fade">
      <span v-if="isMultiple">{{ number }}</span>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseDrop',
  props: {
    index: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: false,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isMultiple () {
      return (2 <= this.number)
    },
    imgSrc () {
      if (this.index === 62) {
        return require(`../assets/img/drop_6_2.png`)
      } else {
        return require(`../assets/img/drop_${this.index}.png`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  align-items: flex-end;
  transition: 0.5s all;

  img {
    width: 23px;
  }
  img:not(.active) {
    opacity: 0.15;
  }
  span {
    font-size: 0.9em;
    line-height: 0.9em;
  }

  .fade-enter-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>