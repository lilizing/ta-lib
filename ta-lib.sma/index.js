var sum = require('ta-lib.sum')

var sma = (values, timeperiod = 30) => {
  if (!Number.isFinite(timeperiod)) throw new Error('Timeperiod should be a number!')
  var window = []
  var skip = 0

  return values.map((v, i) => {
    if (!Number.isFinite(v)) {
      if (isNaN(v)) {
        skip += 1
        return NaN
      } else {
        throw new Error('Input value should be a number!')
      }
    } else if (i < timeperiod + skip - 1) {
      window.push(v)
      return NaN
    } else if (i == timeperiod + skip - 1) {
      window.push(v)
      return sum(window) / timeperiod
    } else {
      window.push(v)
      window.splice(0, 1)
      return sum(window) / timeperiod
    }
  })
}

module.exports = sma
