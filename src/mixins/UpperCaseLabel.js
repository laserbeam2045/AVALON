export default {
  computed: {
    // CamelCalseのlabelを、スペース区切りのUpperCaseにしたもの
    upperCaseLabel: function() {
      const match = this.label.match(/[A-Z]/);

      if (match && match.index != 0) {
        let array = this.label.split('');
        array.splice(match.index, 0, ' ');
        return array.join('').toUpperCase();
      } else {
        return this.label.toUpperCase();
      }
    },
  },
}