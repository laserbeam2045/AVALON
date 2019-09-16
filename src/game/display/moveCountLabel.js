import * as phina from "phina.js"

phina.globalize();

// 移動回数ラベルクラス
export default phina.define('MoveCountLabel', {
  superClass: 'phina.display.Label',
  init: function() {
    this.superInit({
      text: '',
      fontSize: 70,
      fontFamily: "'ＭＳ 明朝', 'ＭＳ ゴシック', 'Times New Roman', serif, sans-serif",
      fontStyle: 'italic',
      fill: 'white',
      stroke: 'white',
      strokeWidth: 0,
      shadow: 'gold',
      shadowBlur: 5,
    });
    this.movedCount = 0;
  },

  increment: function() {
    this.movedCount++;
    this.text = this.movedCount;
  },

  reset: function() {
    this.movedCount = 0;
    this.text = '';
  }
});
