<template>
  <tr>
    <td>
      <slot></slot>
    </td>
    <td class="combo" :class="combo">
      <slot name="combo"></slot>combo
    </td>
    <td class="magni" :class="magni">
      ×<slot name="magni"></slot>
    </td>
    <td v-on="$listeners">
      <slot name="drops"></slot>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ComboDataTr',
  props: {
    combo: {
      type: Object,
      required: false,
    },
    magni: {
      type: Object,
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
td {
  height: 30px;
  padding: 0;
  line-height: 1em;
  text-align: right;
  vertical-align: bottom;
}
tr:first-child {
  td.combo,
  td.magni {
    padding-left: 7px;
  }
}
td.maximum {
  color: white;
  text-shadow: 0 0 2px #07f7e7;
}
td:last-child {
  padding-left: 7px;
  cursor: pointer;
}
</style>