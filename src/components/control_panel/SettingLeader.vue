<template>
  <select
    :value="value"
    @change="$emit('change', $event.target.value)"
  >
    <option
      v-for="(value, name) in options"
      :key="value"
      :value="value"
    >
      {{ name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'SettingLeader',
  props: {
    value: {
      type: Number,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    }
  },
}
</script>