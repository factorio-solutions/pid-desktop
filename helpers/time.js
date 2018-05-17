import moment from 'moment'

export const MOMENT_DATE_FORMAT = 'DD.MM.YYYY'
export const MOMENT_TIME_FORMAT = 'HH:mm'
export const MOMENT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm'
export const MOMENT_DATETIME_FORMAT_MOBILE = 'YYYY-MM-DDTHH:mm'
export const MOMENT_UTC_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm ZZ'


export function timeToUTC(value) {
  return moment(value, MOMENT_DATETIME_FORMAT).format(MOMENT_UTC_DATETIME_FORMAT)
}

export function dateToUTC(value) {
  return moment(value, MOMENT_DATE_FORMAT).format(MOMENT_UTC_DATETIME_FORMAT)
}

export function timeToUTCmobile(value) {
  return moment(value, MOMENT_DATETIME_FORMAT_MOBILE).format(MOMENT_UTC_DATETIME_FORMAT)
}

export function formatTime(time) {
  return moment(time).format(MOMENT_DATETIME_FORMAT)
}

export function formatDate(date) {
  return moment(date).format(MOMENT_DATE_FORMAT)
}

function roundTime(roundMethod, minutes) {
  return roundMethod(minutes / 15) * 15
}

export function toFifteenMinuteStep(minutes) {
  return roundTime(Math.floor, parseInt(minutes, 10))
}

function ceilFifteenMinuteStep(minutes) {
  return roundTime(Math.ceil, parseInt(minutes, 10))
}

export function floorTime(time) {
  return moment(time).set('minute', toFifteenMinuteStep(moment(time).minutes()))
}

export function ceilTime(time) {
  return moment(time).set('minute', ceilFifteenMinuteStep(moment(time).minutes()))
}

export function readFormatedTime(time) {
  return moment(time, MOMENT_DATETIME_FORMAT)
}

export function isBeforeFormated(before, after) {
  return readFormatedTime(before).isBefore(readFormatedTime(after))
}
