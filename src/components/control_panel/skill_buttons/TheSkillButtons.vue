<template>
  <transition-group id="button-wrapper" name="skill" tag="div">
    <SkillButton
      v-for="(skill, name, index) in filteredSkillSettings"
      :key="name"
      :skill="skill"
      :index="index"
      @click="useSkill"
    >
      {{ name }}
    </SkillButton>
  </transition-group>
</template>

<script>
import SkillButton from './SkillButton'
import { mapMutations } from 'vuex'
import * as CONST from '../../../constants'
import controll from '../../../mixins/Controll'

export default {
  name: 'TheSkillButtons',
  components: {
    SkillButton,
  },
  mixins: [
    controll,
  ],
  data () {
    return {
      // スキルに関する設定
      skillSettings: {
        'CAPTURE': {
          belongsTo: ['ALL'],
          left: () => {
            this.capture()
          },
          right: () => {
            this.capture().then(this.search)
          },
        },
        'COCO': {
          belongsTo: ['COCO', 'VEROAH'],
          common: () => {
          },
        },
        'SARASVATI': {
          belongsTo: ['COCO', 'VEROAH'],
          common: () => {
            this.changeBoardRight(CONST.DROP_TYPE_WATER)
          },
        },
        'MUT': {
          belongsTo: ['COCO', 'VEROAH'],
          common: () => {
            this.changeBoardColor([
              [CONST.DROP_TYPE_WOOD, CONST.DROP_TYPE_WATER]
            ])
          },
        },
        'VEROAH': {
          belongsTo: ['COCO', 'VEROAH'],
          common: () => {
            this.changeBoardColor([
              [CONST.DROP_TYPE_WOOD, CONST.DROP_TYPE_WATER],
              [CONST.DROP_TYPE_LIGHT, CONST.DROP_TYPE_WATER]
            ])
          },
        },
        'KOMASAN': {
          belongsTo: ['KOMASAN'],
          common: () => {
            this.changeBoardLeft(CONST.DROP_TYPE_WOOD)
          },
        },
        'EIR': {
          belongsTo: ['METATRON', 'KOMASAN'],
          common: () => {
            this.changeBoardTop(CONST.DROP_TYPE_HEART)
          },
        },
        'LUCIFER': {
          belongsTo: ['METATRON'],
          common: () => {
            this.changeBoardLeft(CONST.DROP_TYPE_DARK)
            this.changeBoardRight(CONST.DROP_TYPE_HEART)
            this.updateClearingSettings({
              propName: 'line',
              index: 7,
              newValue: true,
            })
          },
        },
      },
    }
  },
  computed: {
    // 現在のリーダーが引数のものであるかどうかを判定するメソッド
    leaderIs () {
      return this.$store.getters.leaderIs
    },
    // 現在のリーダーに属するスキル名（文字列の配列）
    activeSkillNames () {
      return Object.keys(this.skillSettings).filter(key => {
        return this.skillSettings[key].belongsTo.some(name => {
          return (this.leaderIs(name) || name === 'ALL')
        })
      })
    },
    // 現在のリーダーに属するものだけに絞ったスキル設定（元と同じデータ構造）
    filteredSkillSettings () {
      return this.activeSkillNames.reduce((result, key) => {
        return {...result, [key]: this.skillSettings[key]}
      }, {})
    },
  },
  methods: {
    // スキル内で使用するミューテーションをマッピング
    ...mapMutations([
      'changeBoardColor',
      'changeBoardTop',
      'changeBoardLeft',
      'changeBoardRight',
      'changeBoardBottom',
      'updateClearingSettings',
    ]),
    // スキルを発動するメソッド
    useSkill ({ skill, event }) {
      if ('common' in skill) {
        skill.common()
      }
      switch (event.type) {
      case 'click':
        if ('left' in skill) {
          skill.left()
        } else {
          this.startNewGame()
        }
        break
      case 'contextmenu':
        if ('right' in skill) {
          skill.right()
        } else {
          this.search()
        }
        break
      }
    },
  },
}
</script>

<style scoped>
#button-wrapper {
  overflow: hidden;
}
.skill-enter {
  opacity: 0;
  transform: translateX(100px);
}
.skill-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.skill-leave-active {
  position: absolute;
}
.skill-move {
  transition: transform 1s;
}
</style>