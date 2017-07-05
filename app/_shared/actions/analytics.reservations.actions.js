import moment from 'moment'

// import { t }       from '../modules/localization/localization'
import { request } from '../helpers/request'

import { INIT_RESERVATIONS } from '../queries/analytics.reservations.queries'


export const ANALYTICS_RESERVATIONS_SET_RESERVATIONS  = 'ANALYTICS_RESERVATIONS_SET_RESERVATIONS'
export const ANALYTICS_RESERVATIONS_SET_FROM          = 'ANALYTICS_RESERVATIONS_SET_FROM'
export const ANALYTICS_RESERVATIONS_SET_TO            = 'ANALYTICS_RESERVATIONS_SET_TO'

const MOMENT_DATETIME_FORMAT = "DD.MM.YYYY HH:mm"


export function setReservations(value){
  return { type: ANALYTICS_RESERVATIONS_SET_RESERVATIONS
         , value
         }
}

export function setFrom(value){
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_RESERVATIONS_SET_FROM
             , value: value
             })
    dispatch(initReservationsAnalytics())
  }
}

export function setTo(value){
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_RESERVATIONS_SET_TO
             , value: value
             })
    dispatch(initReservationsAnalytics())
  }
}


export function initReservationsAnalytics () {
  return (dispatch, getState) => {
    let from = moment(getState().analyticsReservations.from, 'DD. MM. YYYY')
    let to   = moment(getState().analyticsReservations.to, 'DD. MM. YYYY')

    if (from.isValid() && to.isValid()){
      if (from.isAfter(to)) { // switch of order is wrong
        const temp = from
        from = to
        to = temp
      }
      to = to.endOf('day'); // also include this day

      const onSuccess = (response) => {
        dispatch(setReservations(response.data.reservation_analytics))
      }

      getState().pageBase.garage && request(onSuccess, INIT_RESERVATIONS, { from: from.format(MOMENT_DATETIME_FORMAT)
                                                                        , to: to.format(MOMENT_DATETIME_FORMAT)
                                                                        , id: getState().pageBase.garage
                                                                        }
      )
    }
  }
}

export function currency () {
  return (dispatch, getState) => {
    const state = getState().analyticsReservations
    return state.reservations.length ? state.reservations[0].currency.symbol : ''
  }
}

export function reservationsToData () {
  return (dispatch, getState) => {
    const state = getState().analyticsReservations
    let data = []
    let currentDate = moment(state.from, 'DD. MM. YYYY');
    while (currentDate.isSameOrBefore(moment(state.to, 'DD. MM. YYYY'))) {
      const reservations = state.reservations.filter(reservation => moment(reservation.created_at).isBetween(currentDate.clone().startOf('day'), currentDate.clone().endOf('day')))
      data.push({date:currentDate.format('DD. MM. YYYY'), reservations, count: reservations.length, price: reservations.reduce((sum, reservation) => {return sum+reservation.price}, 0) })
      currentDate = currentDate.add(1, 'day')
    }

    return data
  }
}
