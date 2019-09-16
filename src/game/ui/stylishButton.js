import * as phina from 'phina.js'

// ボタンクラス
export default phina.define('StylishButton', {
  superClass: 'Button',

  init (options) {
    this.color1 = 'rgba(0, 0, 0, 0.1)'
    this.color2 = 'rgb(0,227,255)'
    this.color3 = 'rgb(0,0,0)'

    let text = ''
    if (typeof options === 'string') {
      text = options
      options = { text }
    }
    options = (options || {}).$safe({
      text: text,
      width: 117,
      height: 117,
      fontSize: 22,
      fill: this.color1,
      stroke: this.color2,
      fontColor: this.color2,
    })
    this.superInit(options)
  },

  onpointstart () {
    phina.asset.SoundManager.setVolume(0.2)
    phina.asset.SoundManager.play('button')
  },

  onpointstay () {
    this.fill = this.color2
    this.fontColor = this.color3
  },

  onpointend () {
    this.fill = this.color1
    this.fontColor = this.color2
  },
})