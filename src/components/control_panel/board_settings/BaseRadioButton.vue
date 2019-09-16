<template>
  <label :class="{ checked: checked }">
    <input
      type="radio"
      v-show=false
      :value=value
      :checked=checked
      @change="$emit('change', value)"
    />
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'BaseRadioButton',
  props: {
    value: [String, Boolean],
    checked: Boolean,
  },
}
</script>