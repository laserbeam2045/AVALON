<template>
  <div :class="{ many: isMany }">
    <template v-if="number">
      <img :src="imgSrc">
      <span v-if="isMultiple">{{ number }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BaseDrop',
  props: {
    index: Number,
    number: Number,
    criteria: Number,
  },
  computed: {
    isMany: function() {
      return (this.criteria >= 10);
    },
    isMultiple: function() {
      return (this.number >= 2);
    },
    imgSrc: function() {
      return require(`../../assets/img/drop_${this.index}.png`);
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  position: relative;
  width: 35px;
  height: 25px;
  margin-left: 5px;
  transition: 0.5s all;

  img {
    width: 25px;
  }
  span {
    position: absolute;
    bottom: 0;
    font-size: 0.9em;
    line-height: 0.9em;
  }
}
div.many {
  width: 45px;
}
</style>