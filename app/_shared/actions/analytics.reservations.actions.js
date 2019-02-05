import moment from 'moment'

import { t }                                 from '../modules/localization/localization'
import request                           from '../helpers/request'
import { MOMENT_DATETIME_FORMAT, timeToUTC } from '../helpers/time'

import { INIT_RESERVATIONS, INIT_CONTRACTS } from '../queries/analytics.reservations.queries'


export const ANALYTICS_RESERVATIONS_SET_RESERVATIONS = 'ANALYTICS_RESERVATIONS_SET_RESERVATIONS'
export const ANALYTICS_RESERVATIONS_SET_CONTRACTS = 'ANALYTICS_RESERVATIONS_SET_CONTRACTS'
export const ANALYTICS_RESERVATIONS_SET_FROM = 'ANALYTICS_RESERVATIONS_SET_FROM'
export const ANALYTICS_RESERVATIONS_SET_TO = 'ANALYTICS_RESERVATIONS_SET_TO'
export const ANALYTICS_RESERVATIONS_SET_FILTER = 'ANALYTICS_RESERVATIONS_SET_FILTER'
export const ANALYTICS_RESERVATIONS_SET_LOADING = 'ANALYTICS_RESERVATIONS_SET_LOADING'


export function setReservations(value) {
  return { type: ANALYTICS_RESERVATIONS_SET_RESERVATIONS,
    value
  }
}

export function setContracts(value) {
  return { type: ANALYTICS_RESERVATIONS_SET_CONTRACTS,
    value
  }
}

export function setFrom(value) {
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_RESERVATIONS_SET_FROM,
      value
    })
    dispatch(initReservationsAnalytics())
  }
}

export function setTo(value) {
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_RESERVATIONS_SET_TO,
      value
    })
    dispatch(initReservationsAnalytics())
  }
}

export function setFilter(value) {
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_RESERVATIONS_SET_FILTER,
      value
    })
    dispatch(initReservationsAnalytics())
  }
}

export function setLoading(value) {
  return { type: ANALYTICS_RESERVATIONS_SET_LOADING,
    value
  }
}


export function initReservationsAnalytics() {
  return (dispatch, getState) => {
    dispatch(setLoading(true))
    const state = getState().analyticsReservations
    let from = moment(state.from, 'DD. MM. YYYY')
    let to = moment(state.to, 'DD. MM. YYYY')

    if (from.isValid() && to.isValid()) {
      if (from.isAfter(to)) { // switch of order is wrong
        const temp = from
        from = to
        to = temp
      }
      to = to.endOf('day') // also include this day

      if (state.filter === 'shortterm') {
        const onSuccess = response => {
          dispatch(setReservations(response.data.reservation_analytics))
          dispatch(setLoading(false))
        }

        getState().pageBase.garage && request(onSuccess, INIT_RESERVATIONS, { from: timeToUTC(from.format(MOMENT_DATETIME_FORMAT)),
          to:   timeToUTC(to.format(MOMENT_DATETIME_FORMAT)),
          id:   getState().pageBase.garage
        }
        )
      } else { // longterm reservations (contracts) init
        const onSuccess = response => {
          dispatch(setContracts(response.data.contract_analytics))
          dispatch(setLoading(false))
        }

        getState().pageBase.garage && request(onSuccess, INIT_CONTRACTS, { from: timeToUTC(from.startOf('month').format(MOMENT_DATETIME_FORMAT)),
          to:   timeToUTC(to.endOf('month').format(MOMENT_DATETIME_FORMAT)),
          id:   getState().pageBase.garage
        }
        )
      }
    }
  }
}

export function shortTermClick() {
  return (dispatch, getState) => {
    dispatch(setFilter('shortterm'))
  }
}

export function longTermClick() {
  return (dispatch, getState) => {
    dispatch(setFilter('longterm'))
  }
}


// METHODS FOR PAGE ////////////////////////////////////////////////////////////

export function currency() {
  return (dispatch, getState) => {
    const state = getState().analyticsReservations
    return state.reservations.length ? state.reservations[0].currency.symbol : state.contracts.length ? state.contracts[0].rent.currency.symbol : ''
  }
}

export function dateRemoveYear(date) {
  return (dispatch, getState) => {
    return moment(date, 'DD. MM. YYYY').format('D. M.')
    // return date.split('.').slice(0,2).join('.')+'.'
  }
}

export function reservationsToData() {
  return (dispatch, getState) => {
    const state = getState().analyticsReservations
    const data = []
    let currentDate = moment(state.from, 'DD. MM. YYYY')
    while (currentDate.isSameOrBefore(moment(state.to, 'DD. MM. YYYY'))) {
      const reservations = state.reservations.filter(reservation => moment(reservation.created_at).isBetween(currentDate.clone().startOf('day'), currentDate.clone().endOf('day')))
      data.push({ date: currentDate.format('DD. MM. YYYY'), reservations, count: reservations.length, price: reservations.reduce((sum, reservation) => { return sum + reservation.price }, 0) })
      currentDate = currentDate.add(1, 'day')
    }

    return data
  }
}

export function dataToArray(data) {
  return (dispatch, getState) => {
    const state = getState().analyticsReservations
    return data.reduce((acc, object) => {
      return [ ...acc, [
        dispatch(dateRemoveYear(object.date)),
        object.price,
        state.filter === 'shortterm' ? object.reservations.length : object.contracts.length
      ] ]
    }, [ [ t([ 'analytics', 'date' ]), t([ 'analytics', 'turnover' ]), t([ 'analytics', state.filter === 'shortterm' ? 'reservationCount' : 'contractCount' ]) ] ])
  }
}


export function contractsToData() {
  return (dispatch, getState) => {
    const state = getState().analyticsReservations
    const data = []
    let currentDate = moment(state.from, 'DD. MM. YYYY').startOf('month')
    while (currentDate.isSameOrBefore(moment(state.to, 'DD. MM. YYYY'))) {
      const endOfMonth = currentDate.clone().endOf('month')
      const contracts = state.contracts.filter(contract => currentDate.isBetween(moment(contract.from), moment(contract.to)) || endOfMonth.isBetween(moment(contract.from), moment(contract.to)))
      data.push({ date:  currentDate.format('DD. MM. YYYY'),
        contracts,
        count: contracts.length,
        price: Math.round(contracts.reduce((sum, contract) => {
          const contractFrom = moment(contract.from).isBefore(currentDate) ? currentDate : moment(contract.from)
          const contractTo = moment(contract.to).isAfter(endOfMonth) ? endOfMonth : moment(contract.to)
          return sum + contract.rent.price * contract.places.length * (contractTo.diff(contractFrom) / endOfMonth.diff(currentDate))
        }, 0))
      })
      currentDate = currentDate.add(1, 'month')
    }

    return data
  }
}
