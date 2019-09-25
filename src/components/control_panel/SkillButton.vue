<template>
  <button
    :class="{ active: isActive }"
    @click="click"
    @click.right="click"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'SkillButton',
  props: {
    skill: Object,
  },
  data () {
    return {
      isActive: false,
    }
  },
  methods: {
    // クリック時の処理
    click (event) {
      if (!this.isActive) {
        this.activate();
        this.$emit('click', {
          skill: this.skill,
          event: event,
        })
      }
    },
    // クリックエフェクト用のclassを付与する
    activate () {
      this.isActive = true
      this.$playSound('sound-button')
      setTimeout(this.deactivate, 500)
    },
    // クリックエフェクト用のclassを解除する
    deactivate () {
      this.isActive = false
    },
  },
}
</script>

<style scoped>
button {
  min-width: 70px;
  min-height: 30px;
  margin-left: 10px;
  font-size: 14px;
  color: rgb(23,210,207);
  background: rgb(10,19,28);
  border: 2px solid rgb(23,210,207);
  border-radius: 2px;
  cursor: pointer;
  transition: all 1s;
}
button.active {
  animation-name: active;
  animation-duration: 0.25s;
  animation-iteration-count: 2;
  animation-direction: alternate;
  animation-timing-function: linear;
}
@keyframes active {
  100% {
    background: rgb(141, 233, 222);
    color: rgb(25, 54, 72);
  }
}
</style>