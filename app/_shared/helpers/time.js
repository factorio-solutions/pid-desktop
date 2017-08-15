import moment from 'moment'

export const MOMENT_DATETIME_FORMAT        = "DD.MM.YYYY HH:mm"
export const MOMENT_DATETIME_FORMAT_MOBILE = "YYYY-MM-DDTHH:mm"
export const MOMENT_UTC_DATETIME_FORMAT    = "DD.MM.YYYY HH:mm ZZ"


export function timeToUTC (value){
  return moment(value, MOMENT_DATETIME_FORMAT).format(MOMENT_UTC_DATETIME_FORMAT)
}

export function timeToUTCmobile (value){
  return moment(value, MOMENT_DATETIME_FORMAT_MOBILE).format(MOMENT_UTC_DATETIME_FORMAT)
}
