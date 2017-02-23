var Big = require('big.js')
var max = require('../ta-lib.max')
var sum = require('../ta-lib.sum')

var plus_di = function (high, low, close, timePeriod) {
  if (!(timePeriod instanceof Big || typeof timePeriod === 'string'))
    throw new Error('Timeperiod should be an instance of Big or string!')

  var tp = Big(timePeriod)
  var timePeriodNum = parseInt(timePeriod.toString())

  var skip = 0
  var dm1 = []
  var trs = []
  for (i = 0; i < high.length; i++) {
    if (high[i] instanceof Big) {
      skip = i
      dm1.push(NaN)
      trs.push(NaN)
      break
    } else {
      dm1.push(NaN)
      trs.push(NaN)
    }
  }


  var zero = Big('0')
  for (var i = skip + 1; i < high.length; i++) {9
    var deltaHigh = high[i].minus(high[i - 1])
    var deltaLow = low[i - 1].minus(low[i])
    let dm = deltaHigh.gt(deltaLow) ? max([deltaHigh, zero]) : zero

    let tr1 = high[i].minus(low[i]).abs()
    let tr2 = high[i].minus(close[i - 1]).abs()
    let tr3 = low[i].minus(close[i - 1]).abs()
    let tr = max([tr1, tr2, tr3, Big(1)])

    dm1.push(dm)
    trs.push(tr)
  }

  if (tp.eq('1')) return dm1

  skip = 0
  var window = []
  var previous
  var rDM = dm1.map((d, i) => {
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
      previous = previous.minus(previous.div(tp)).plus(d)
      return previous
    }
  })

  skip = 0
  var windowTR = []
  var previousTR
  var rTR = trs.map((d, i) => {
    if (isNaN(d)) {
      skip += 1
      return NaN
    } else if (i < timePeriodNum + skip - 1) {
      windowTR.push(d)
      return NaN
    } else if (i === timePeriodNum + skip - 1) {
      windowTR.push(d)
      previousTR = sum(windowTR)
      return previousTR
    } else {
      previousTR = previousTR.minus(previousTR.div(tp)).plus(d)
      return previousTR
    }
  })

  return rDM.map((d, i) => {
    if (isNaN(d)) {
      return NaN
    } else {
      return d.div(rTR[i]).mul(100)
    }
  })
}


module.exports = plus_di
