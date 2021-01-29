<template>
  <transition-group
    tag="div"
    name="skill"
    id="button-wrapper"
  >
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
import { mapGetters, mapMutations } from 'vuex'
import { DROP_TYPE } from '../../store/constants'
import controller from '../../mixins/controller'
import SkillButton from './SkillButton'

export default {
  name: 'TheSkillButtons',
  components: {
    SkillButton,
  },
  mixins: [
    controller,
  ],
  
  data () {
    return {
      // スキルに関する設定
      skillSettings: {
        CAPTURE: {
          belongsTo: ['ALL'],
          left: () => this.capture(),
          right: () => this.capture().then(this.search),
        },
        DARK: {
          belongsTo: ['ALL'],
          common: () => {
            this.clearDarkness()
            this.updateBoardSettings({property: 'startPosition', value: 29})
          },
        },
        LUCIFER: {
          belongsTo: ['METATRON'],
          common: () => {
            this.changeBoardLeft(DROP_TYPE.DARK)
            this.changeBoardRight(DROP_TYPE.HEART)
            this.updateClearingSettings({
              propName: 'line',
              index: 7,
              newValue: true,
            })
          },
        },
        EIR: {
          belongsTo: ['METATRON', 'KOMASAN'],
          common: () => this.changeBoardTop(DROP_TYPE.HEART),
        },
        KOMASAN: {
          belongsTo: ['KOMASAN'],
          common: () => this.changeBoardLeft(DROP_TYPE.WOOD),
        },
        COCO: {
          belongsTo: ['COCO', 'VEROAH'],
          common: () => {
            const color = DROP_TYPE.WATER
            const coordinates = this.cocoCoordinates
            this.changeBoardByCoordinates({ color, coordinates })
          },
        },
        MUT: {
          belongsTo: [],
          common: () => this.changeBoardByColor([DROP_TYPE.WOOD, DROP_TYPE.WATER]),
        },
        LIMLULU: {
          belongsTo: ['YASHAMARU', 'COCO'],
          common: () => {
            this.changeBoardByColor([
              [DROP_TYPE.POISON, DROP_TYPE.WATER],
              [DROP_TYPE.DEADLY_POISON, DROP_TYPE.WATER],
            ])
          },
        },
        VEROAH: {
          belongsTo: ['COCO', 'VEROAH'],
          common: () => {
            this.changeBoardByColor([
              [DROP_TYPE.WOOD, DROP_TYPE.WATER],
              [DROP_TYPE.LIGHT, DROP_TYPE.WATER],
            ])
          },
        },
        PARVATI: {
          belongsTo: ['YASHAMARU'],
          common: () => {
            this.changeBoardByColor([DROP_TYPE.WATER, DROP_TYPE.HEART])
          },
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      'boardLength',
      'leaderIs',
    ]),
    // ココ・フェルケナのスキルの変換対象座標
    cocoCoordinates () {
      let coordinates = []
      switch (this.boardLength) {
        case 30: coordinates = [0, 1, 2, 6, 7, 8, 12, 13, 14]; break
        case 42: coordinates = [0, 1, 2, 7, 8, 9, 14, 15, 16, 21, 22, 23]; break
      }
      return coordinates
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
      'clearDarkness',
      'changeBoardByColor',
      'changeBoardByCoordinates',
      'changeBoardTop',
      'changeBoardLeft',
      'changeBoardRight',
      'changeBoardBottom',
      'updateBoardSettings',
      'updateClearingSettings',
    ]),
    // スキルを発動するメソッド
    useSkill ({ skill, event }) {
      if ('common' in skill) skill.common()
      switch (event.type) {
      case 'click':
        if ('left' in skill) skill.left()
        else this.startNewGame()
        break
      case 'contextmenu':
        if ('right' in skill) skill.right()
        else this.search()
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