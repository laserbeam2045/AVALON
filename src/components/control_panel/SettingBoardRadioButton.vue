<template>
  <label :class="{ checked: checked }">
    <input
      type="radio"
      v-show="false"
      :value="value"
      :checked="checked"
      @change="$emit('change', value)"
    />
    {{ label }}
  </label>
</template>

<script>
export default {
  name: 'SettingBoardRadioButton',
  props: {
    label: {
      type: String,
      required: true,
    },
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