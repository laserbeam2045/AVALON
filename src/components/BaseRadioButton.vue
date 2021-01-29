<template>
  <label :class="{ checked, unchecked: !checked }">
    <input
      type="radio"
      v-show="false"
      :checked="checked"
      @change="$emit('change', value)"
    />
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'BaseRadioButton',
  props: {
    value: {
      type: [String, Boolean],
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
  },
}
</script>