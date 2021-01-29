<template>
  <tr>
    <td>
      <span>
        <slot></slot>
      </span>
    </td>
    <td class="combo" :class="maxCombo">
      <span>
        <slot name="combo"></slot>&nbsp;combo
      </span>
    </td>
    <td class="magni" :class="maxMagni">
      <span>
        ×<slot name="magni"></slot>
      </span>
    </td>
    <td class="drops" v-on="$listeners">
      <slot name="drops"></slot>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ComboDataTr',
  props: {
    maxCombo: {
      type: Object,
      required: false,
    },
    maxMagni: {
      type: Object,
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
td {
  padding: 0;
  height: 25px;
  line-height: 25px;
  text-align: right;
  vertical-align: middle;

  span {
    position: relative;
    top: 2px;
  }
}
td.combo,
td.magni {
  padding-left: 7px;
}
td.drops {
  padding-left: 15px;
  cursor: pointer;
}
</style>