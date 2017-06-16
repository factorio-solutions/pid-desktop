import moment from 'moment'

import { request } from '../helpers/request'

import { GARAGE_TURNOVER } from '../queries/analytics.queries'

export const ANALYTICS_SET_RESERVATIONS = 'ANALYTICS_SET_RESERVATIONS'
export const ANALYTICS_SET_CONSTRACTS   = 'ANALYTICS_SET_CONSTRACTS'
export const ANALYTICS_SET_FROM         = 'ANALYTICS_SET_FROM'
export const ANALYTICS_SET_TO           = 'ANALYTICS_SET_TO'
export const ANALYTICS_SET_PERIOD       = 'ANALYTICS_SET_PERIOD'

const MOMENT_DATETIME_FORMAT = "DD.MM.YYYY HH:mm"


export function setReservations(value){
  return { type: ANALYTICS_SET_RESERVATIONS
         , value
         }
}

export function setContracts(value){
  return { type: ANALYTICS_SET_CONSTRACTS
         , value
         }
}

export function setFrom(value){
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_SET_FROM
             , value: formatDate(value)
             })
    dispatch(initGarageTurnover())
  }
}

export function setTo(value){
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_SET_TO
             , value: formatDate(value)
             })
    dispatch(initGarageTurnover())
  }
}

export function setPeriod(value){
  return { type: ANALYTICS_SET_PERIOD
         , value
         }
}

function formatDate(value){
  const split = value.split('/')
  if (split.length == 2 && split[0] !== "" && split[1] !== ""){
    let month = parseInt(split[0])
    let year = parseInt(split[1])

    if (isNaN(year)) year=parseInt(moment().format('YYYY'))
    if (isNaN(month)) month=1

    return `${month > 12 ? 12 : month}/${year > parseInt(moment().format('YYYY')) ? parseInt(moment().format('YYYY')) : year}`
  } else {
    return value
  }
}


export function weekClick (){
  return (dispatch, getState) => {
    dispatch(setPeriod('week'))
  }
}

export function monthClick (){
  return (dispatch, getState) => {
    dispatch(setPeriod('month'))
  }
}


export function initGarageTurnover (){
  return (dispatch, getState) => {
    const from = getState().analytics.from.split('/')
    const to = getState().analytics.to.split('/')

    // 31.05.2017 15:30
    let momentFrom = moment({ y: from[1], M: from[0]-1})
    let momentTo = moment({ y: to[1], M: to[0]-1})
    if (momentFrom.isValid() && momentTo.isValid()){
      if (momentFrom.isAfter(momentTo)) { // switch of order is wrong
        const temp = momentFrom
        momentFrom = momentTo
        momentTo = temp
      }
      momentTo = momentTo.add(1, 'month'); // also include this month

      const onSuccess = (response) => {
        console.log(response);
        dispatch(setReservations(response.data.reservation_analytics))
        dispatch(setContracts(response.data.contract_analytics))
      }

      getState().pageBase.garage && request(onSuccess, GARAGE_TURNOVER, { from: momentFrom.format(MOMENT_DATETIME_FORMAT)
                                                                        , to: momentTo.format(MOMENT_DATETIME_FORMAT)
                                                                        , id: getState().pageBase.garage
                                                                        }
      )
    }
  }
}
