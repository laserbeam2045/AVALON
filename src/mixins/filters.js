export default {
  filters: {
    // 「camelCase」をスペース区切りの「lower case」にするフィルター
    space (value) {
      if (!value) return ''
      value = value.toString()

      return value.split('').map((c, index) => {
        if (index && /[A-Z]/.test(c))
          return ' ' + c.toLowerCase()
        else
          return c
      })
      .join('')
    },
    // 「lower case」を「UPPER CASE」にするフィルター
    upperCase (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    },
  },
}