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
  name: 'ComboDataTrDropsData',
  props: {
    index: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    criteria: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isMany () {
      return (this.criteria >= 10)
    },
    isMultiple () {
      return (this.number >= 2)
    },
    imgSrc () {
      return require(`../../assets/img/drop_${this.index}.png`)
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