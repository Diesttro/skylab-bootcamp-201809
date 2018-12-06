function validate(params) {
  params.forEach(({ key, value, type, optional }) => {
    switch (type) {
      case String:
        if (optional && value == null) break

        if (typeof value !== 'string') throw new TypeError(`${value} is not a string`)

        if (!value.trim().length) throw new Error(`${key} is empty or blank`)

        break
      case Boolean:
        if (optional && value == null) break

        if (typeof value !== 'boolean') throw new TypeError(`${value} is not a boolean`)

        break
      case Number:
        if (optional && value == null) break

        if (typeof value !== 'number') throw new TypeError(`${value} is not a number`)
    }
  })
}

module.exports = validate