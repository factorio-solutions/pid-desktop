
export function dateAdd(date, interval, unit) {
  let ret = new Date(date) // don't change original date
  const checkRollover = () => {
    if (ret.getDate() != date.getDate()) {
      ret.setDate(0)
    }
  }
  switch (unit.toLowerCase()) {
    case 'year':
      ret.setFullYear(ret.getFullYear() + interval)
      checkRollover()
      break
    case 'quarter':
      ret.setMonth(ret.getMonth() + 3 * interval)
      checkRollover()
      break
    case 'month':
      ret.setMonth(ret.getMonth() + interval)
      checkRollover()
      break
    case 'week':
      ret.setDate(ret.getDate() + 7 * interval)
      break
    case 'day':
      ret.setDate(ret.getDate() + interval)
      break
    case 'hour':
    case 'hours':
      ret.setTime(ret.getTime() + interval * 3600000)
      break
    case 'minute':
      ret.setTime(ret.getTime() + interval * 60000)
      break
    case 'second':
      ret.setTime(ret.getTime() + interval * 1000)
      break
    default:
      ret = undefined
      break
  }
  return ret
}

export function firstDateIsBefore(dateA, dateB) {
  return dateA < dateB
}

export function firstDateIsBeforeOrEqual(dateA, dateB) {
  return dateA <= dateB
}

export function firstDateIsAfter(dateA, dateB) {
  return dateA > dateB
}

export function dateIsInRange(date, rangeBegin, rangeEnd, inclusionExclusion = '()') {
  let ret

  switch (inclusionExclusion) {
    case '[)':
      ret = rangeBegin <= date && date < rangeEnd
      break
    case '(]':
      ret = rangeBegin < date && date <= rangeEnd
      break
    case '[]':
      ret = rangeBegin <= date && date <= rangeEnd
      break
    case '()':
    default:
      ret = rangeBegin < date && date < rangeEnd
  }

  return ret
}

export function diff(dateA, dateB, unit = 'milliseconds', float = false) {
  let difference = dateB.getTime() - dateA.getTime()

  switch (unit.toLowerCase()) {
    case 'week':
    case 'weeks':
      difference /= 604800000
      break
    case 'day':
    case 'days':
      difference /= 86400000
      break
    case 'hour':
    case 'hours':
      difference /= 3600000
      break
    case 'minute':
    case 'minutes':
      difference /= 60000
      break
    case 'second':
    case 'seconds':
      difference /= 1000
      break
    default:
      break
  }

  if (!float) {
    difference = Math.floor(difference)
  }

  return difference
}
