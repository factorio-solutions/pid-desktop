import { toFifteenMinuteStep } from './time'

function nullOrRound(number) {
  if (number === null) return null
  const roundedNumber = toFifteenMinuteStep(number)
  if (roundedNumber === 0) return 15
  return roundedNumber
}

export default function minMaxDurationCheck(min, max, changeMin) {
  let newMin = nullOrRound(min)
  let newMax = nullOrRound(max)

  if (min === null || max === null) {
    return { newMin, newMax }
  }

  if (newMin > newMax) {
    if (changeMin) {
      newMin = newMax
    } else {
      newMax = newMin
    }
  }

  return { newMin, newMax }
}
