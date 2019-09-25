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
import controller from '../mixins/controller'

export default {
  name: 'TheKeyInput',
  mixins: [
    controller,
  ],
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      },
    },
  },
  methods: {
    focus () {
      this.$refs.input.focus()
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