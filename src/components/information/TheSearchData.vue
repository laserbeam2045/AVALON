<template>
  <fieldset id="search-data">
    <table v-if="isSearchEnd">
      <tr><th>TIME</th><td>{{ elapsedTime }} sec</td></tr>
      <tr><th>MOVE</th><td>{{ movedCount }}</td></tr>
      <tr><th>STATUS</th><td :class="statusClass">{{ searchStatus }}</td></tr>
    </table>
  </fieldset>
</template>

<script>
import { mapState } from 'vuex'
import { STATE } from '../../constants'

export default {
  name: 'TheSearchData',
  computed: {
    // 探索が終了した状態かどうか
    isSearchEnd () {
      return (this.stateFlag === STATE.SEARCH_END)
    },
    // 探索に要した時間
    elapsedTime () {
      return this.bestNode ? this.bestNode.elapsedTime : 0
    },
    // 移動手数
    movedCount () {
      return this.bestNode ? this.bestNode.movedCount : 0
    },
    // 探索結果のステータス
    searchStatus () {
      if (this.isDanger) return 'DANGER'
      else               return 'OK'
    },
    // STATUSに付与するclass
    statusClass () {
      return {
        ok    : !this.isDanger,
        danger: this.isDanger,
      }
    },
    isDanger () {
      return this.$store.getters.isDanger
    },
    ...mapState(['stateFlag', 'bestNode']),
  }
}
</script>

<style scoped lang="scss">
#search-data {
  height: 92px;
  margin-left: 7px;

  table {
    height: 70px;
    margin: 0 auto;

    th, td {
      font-size: 0.95em;
      line-height: 1.2em;
      vertical-align: bottom;
    }
    th {
      font-weight: normal;
      text-align: left;
    }
    td {
      padding-left: 10px;
    }
    td.ok {
      color: white;
      text-shadow: 0 0 2px #07f7e7;
    }
    td.danger {
      color: white;
      font-weight: bold;
      text-shadow: 0 0 3px red;
      animation-name: danger;
      animation-duration: 0.25s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-direction: alternate;
    }
  }
}

@keyframes danger {
  100% {
    color: red;
  }
}
</style>
