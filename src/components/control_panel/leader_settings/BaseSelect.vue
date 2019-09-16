<template>
  <select
    class="active"
    :value="value"
    @change="$emit('change', $event.target.value)"
  >
    <option
      v-for="(optionValue, name) in options"
      :key="optionValue"
      :value="optionValue"
    >
      {{ name }}
    </option>
  </select>
</template>

<script>

export default {
  name: 'BaseSelect',
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