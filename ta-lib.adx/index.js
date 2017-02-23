var Big = require('big.js')
var max = require('../ta-lib.max')
var sum = require('../ta-lib.sum')
// var sma = require('../ta-lib.sma')
var plus_di = require('../ta-lib.plus_di')
var minus_di = require('../ta-lib.minus_di')

var adx = function (high, low, close, timePeriod) {
  if (!(timePeriod instanceof Big || typeof timePeriod === 'string'))
    throw new Error('Timeperiod should be an instance of Big or string!')

  var tp = Big(timePeriod)
  var timePeriodNum = parseInt(timePeriod.toString())

  let plusDI = plus_di(high, low, close, timePeriod)
  let minusDI = minus_di(high, low, close, timePeriod)

  let DX = plusDI.map((d, i) => {
    if (isNaN(d)) {
      return NaN
    } else {
      return d.minus(minusDI[i]).abs().div(d.plus(minusDI[i])).mul(100)
    }
  })

  var skip = 0
  var window = []
  var previous
  return DX.map((d, i) => {
    if (isNaN(d)) {
      skip += 1
      return NaN
    } else if (i < timePeriodNum + skip - 1) {
      window.push(d)
      return NaN
    } else if (i === timePeriodNum + skip - 1) {
      window.push(d)
      previous = sum(window)
      return previous
    } else {
      previous = previous.mul(tp.minus(1)).plus(d).div(tp)
      return previous
    }
  })
}

module.exports = adx
