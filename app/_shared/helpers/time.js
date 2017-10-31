import moment from 'moment'

export const MOMENT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm'
export const MOMENT_DATETIME_FORMAT_MOBILE = 'YYYY-MM-DDTHH:mm'
export const MOMENT_UTC_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm ZZ'


export function timeToUTC(value) {
  return moment(value, MOMENT_DATETIME_FORMAT).format(MOMENT_UTC_DATETIME_FORMAT)
}

export function timeToUTCmobile(value) {
  return moment(value, MOMENT_DATETIME_FORMAT_MOBILE).format(MOMENT_UTC_DATETIME_FORMAT)
}

export function formatTime(time) {
  return moment(time).format(MOMENT_DATETIME_FORMAT)
}


export function toFifteenMinuteStep(minutes) {
  return Math.floor(parseInt(minutes, 10) / 15) * 15
}

export function floorTime(time) {
  return moment(time).set('minute', toFifteenMinuteStep(moment(time).minutes()))
}

export function readFormatedTime(time) {
  return moment(time, MOMENT_DATETIME_FORMAT)
}

export function isBeforeFormated(before, after) {
  return readFormatedTime(before).isBefore(readFormatedTime(after))
}
