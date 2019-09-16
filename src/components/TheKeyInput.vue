<template>
  <input
    v-focus
    ref="input"
    @keydown.left="capture"
    @keydown.up="moveDrops"
    @keydown.down="search"
    @keydown.right="capture().then(search)"
  />
</template>

<script>
import controll from '../mixins/Controll'

export default {
  name: 'TheKeyInput',
  mixins: [
    controll,
  ],
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
  methods: {
    focus: function() {
      this.$refs.input.focus();
    },
  },
}
</script>

<style scoped>
input {
  width: 0;
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0;
}
</style>