<template>
  <div>
    <label>LEADER</label>
    <SettingLeader
      class="active"
      :value="leader1"
      :options="leaders"
      @change="setLeader(1, $event)"
    />
    <span>x</span>
    <SettingLeader
      class="active"
      :value="leader2"
      :options="leaders"
      @change="setLeader(2, $event)"
    />
  </div>
</template>

<script>
import SettingLeader from './SettingLeader'
import controller from '../../mixins/controller'
import { LEADER } from '../../store/constants'
import { mapState } from 'vuex'

export default {
  name: 'TheSettingsLeader',
  components: {
    SettingLeader,
  },
  mixins: [
    controller,
  ],
  data () {
    return {
      leaders: LEADER,
    }
  },
  computed: mapState({
    leader1: state => state.leaderSettings.leader1,
    leader2: state => state.leaderSettings.leader2,
  }),
  methods: {
    setLeader (leaderNum, newLeader) {
      newLeader = Number(newLeader)
      this.$store.commit('setLeader', { leaderNum, newLeader })
      this.$store.commit('resetSearchData')
      this.$store.dispatch('updateMaxData')
      this.$playSound('sound-on')
      this.startNewGame()
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 10px 55px -5px 0;

  select {
    padding: 5px;
    font-size: 12px;
    background: rgb(7,11,23);
    cursor: pointer;
    border: none;
    text-align-last: center;
    outline: none;
    appearance: none;         /* 標準のスタイルを無効にする */ 
    -moz-appearance: none;    /* ベンダープレフィックス(Firefox用) */
    -webkit-appearance: none; /* ベンダープレフィックス(Google Chrome、Safari用) */
  }
  ::-ms-expand {  /* select要素のデザインを無効にする（IE用） */
    display: none;
  }
}
</style>