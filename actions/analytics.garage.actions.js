import moment        from 'moment'
import actionFactory from '../helpers/actionFactory'

import { t }                                 from '../modules/localization/localization'
import request                           from '../helpers/request'
import { MOMENT_DATETIME_FORMAT, timeToUTC } from '../helpers/time'

import { GARAGE_TURNOVER } from '../queries/analytics.garage.queries'


export const ANALYTICS_SET_RESERVATIONS = 'ANALYTICS_SET_RESERVATIONS'
export const ANALYTICS_SET_CONSTRACTS = 'ANALYTICS_SET_CONSTRACTS'
export const ANALYTICS_SET_FROM = 'ANALYTICS_SET_FROM'
export const ANALYTICS_SET_TO = 'ANALYTICS_SET_TO'
export const ANALYTICS_SET_PERIOD = 'ANALYTICS_SET_PERIOD'
export const ANALYTICS_SET_LOADING = 'ANALYTICS_SET_LOADING'


export const setReservations = actionFactory(ANALYTICS_SET_RESERVATIONS)
export const setContracts = actionFactory(ANALYTICS_SET_CONSTRACTS)
export const setPeriod = actionFactory(ANALYTICS_SET_PERIOD)
export const setLoading = actionFactory(ANALYTICS_SET_LOADING)

export function setFrom(value) {
  return dispatch => {
    dispatch({ type: ANALYTICS_SET_FROM,
      value
    })
    dispatch(initGarageTurnover())
  }
}

export function setTo(value) {
  return dispatch => {
    dispatch({ type: ANALYTICS_SET_TO,
      value
    })
    dispatch(initGarageTurnover())
  }
}


export function weekClick() {
  return dispatch => {
    dispatch(setPeriod('week'))
  }
}

export function monthClick() {
  return dispatch => {
    dispatch(setPeriod('month'))
  }
}

export function dateToMoment(value) {
  return moment(value, 'DD.MM.YYYY').startOf('month')
}

export function initGarageTurnover() {
  return (dispatch, getState) => {
    let momentFrom = dateToMoment(getState().analyticsGarage.from)
    let momentTo = dateToMoment(getState().analyticsGarage.to)
    if (momentFrom.isValid() && momentTo.isValid()) {
      dispatch(setLoading(true))
      if (momentFrom.isAfter(momentTo)) { // switch of order is wrong
        const temp = momentFrom
        momentFrom = momentTo
        momentTo = temp
      }
      momentTo = momentTo.add(1, 'month') // also include this month

      const onSuccess = response => {
        dispatch(setReservations(response.data.reservation_analytics))
        dispatch(setContracts(response.data.contract_analytics))
        dispatch(setLoading(false))
      }

      getState().pageBase.garage && request(onSuccess, GARAGE_TURNOVER, { from: timeToUTC(momentFrom.format(MOMENT_DATETIME_FORMAT)),
        to:   timeToUTC(momentTo.format(MOMENT_DATETIME_FORMAT)),
        id:   getState().pageBase.garage
      }
      )
    }
  }
}

// ///////////////////////////Actions for the view///////////////////////////////////////////////////////////////////////////////////////////////////
export function currency() {
  return (dispatch, getState) => {
    const state = getState().analyticsGarage
    return state.reservations.length > 0 ? state.reservations[0].currency.symbol : state.contracts.length > 0 ? state.contracts[0].rent.currency.symbol : ''
  }
}

function getProperty(created_at, period) {
  return `${period === 'month' ? moment(created_at).month() + 1 : moment(created_at).week()}/${moment(created_at).year()}`
}

function addProperty(acc, property) {
  if (!acc.hasOwnProperty(property)) {
    acc[property] = { reservations: [], contracts: [] }
  }
  return acc
}

export function stateToData() {
  return (dispatch, getState) => {
    const state = getState().analyticsGarage
    const from = moment(state.from, 'DD. MM. YYYY')
    const to = moment(state.to, 'DD. MM. YYYY')

    let currentDate = moment(state.from, 'DD. MM. YYYY')
    let initialState = {}
    while (currentDate.isBefore(moment(state.to, 'DD. MM. YYYY'))) {
      const property = getProperty(currentDate, state.period)
      initialState = addProperty(initialState, property)
      initialState[property].contracts = []
      initialState[property].reservations = []
      currentDate = currentDate.add(1, state.period === 'month' ? 'month' : 'week')
    }

    const chartData = state.reservations.reduce((acc, reservation) => {
      const property = getProperty(reservation.created_at, state.period)
      addProperty(acc, property)
      acc[property].reservations.push(reservation)

      return acc
    }, initialState)
    return state.contracts.reduce((acc, contract) => {
      const contractFrom = moment(contract.from)
      const contractTo = moment(contract.to)
      let currentDate = (from.isAfter(contractFrom) ? from : contractFrom).clone()

      while (currentDate.isBefore(contractTo) && currentDate.isBefore(to)) { // stop it as soon as possible
        if (currentDate.isAfter(contractFrom) && currentDate.isBefore(contractTo)) {
          const property = getProperty(currentDate, state.period)
          acc[property].contracts.push(contract)
        }
        currentDate = currentDate.add(1, state.period === 'month' ? 'month' : 'week')
      }

      return acc
    }, chartData)
  }
}

export function dataToArray(chartData, tableData, schema) {
  return (dispatch, getState) => {
    const state = getState().analyticsGarage
    let chartDataArray = []
    for (const key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        chartDataArray.push({ ...chartData[key], date: key }) // add date to chart data
        schema && schema.push({ key: schema.length, title: key, comparator: 'string' }) // add date to table
      }
    }

    const average = chartDataArray.reduce((sum, interval) => {
      const currentDate = moment(interval.date, `${state.period === 'month' ? 'M/YYYY' : 'W/GGGG'}`)
      const startOfMonth = currentDate.clone().startOf('month')
      const endOfMonth = currentDate.clone().endOf('month')
      const periodFrom = state.period === 'month' ? currentDate.clone().startOf('month') : currentDate.clone().startOf('week')
      const periodTo = state.period === 'month' ? currentDate.clone().endOf('month') : currentDate.clone().endOf('week')

      return sum +
             interval.reservations.reduce((sum, res) => sum + res.price, 0) +
             Math.round(interval.contracts.reduce((sum, contract) => {
               const contractFrom = moment(contract.from).isBefore(periodFrom) ? periodFrom : moment(contract.from)
               const contractTo = moment(contract.to).isAfter(periodTo) ? periodTo : moment(contract.to)
               return sum + contract.rent.price * contract.places.length * (contractTo.diff(contractFrom) / endOfMonth.diff(startOfMonth))
             }, 0))
    }, 0) / chartDataArray.length

    chartDataArray = chartDataArray.reduce((arr, interval) => {
      const currentDate = moment(interval.date, `${state.period === 'month' ? 'M/YYYY' : 'W/GGGG'}`)
      const startOfMonth = currentDate.clone().startOf('month')
      const endOfMonth = currentDate.clone().endOf('month')
      const periodFrom = state.period === 'month' ? currentDate.clone().startOf('month') : currentDate.clone().startOf('week')
      const periodTo = state.period === 'month' ? currentDate.clone().endOf('month') : currentDate.clone().endOf('week')
      const turnover = interval.reservations.reduce((sum, res) => sum + res.price, 0) +
                       Math.round(interval.contracts.reduce((sum, contract) => {
                         const contractFrom = moment(contract.from).isBefore(periodFrom) ? periodFrom : moment(contract.from)
                         const contractTo = moment(contract.to).isAfter(periodTo) ? periodTo : moment(contract.to)
                         return sum + contract.rent.price * contract.places.length * (contractTo.diff(contractFrom) / endOfMonth.diff(startOfMonth))
                       }, 0))

      arr.push([ interval.date,
        turnover,
        average
      ])

      if (tableData) {
        tableData[0].push(turnover + ' ' + dispatch(currency()))
        tableData[1].push(interval.reservations.length + '')
      }
      return arr
    }, [ [ state.period === 'month' ? t([ 'analytics', 'month' ]) : t([ 'analytics', 'week' ]), t([ 'analytics', 'reservations' ]), t([ 'analytics', 'average' ]) ] ])
    return { chartData: chartDataArray, tableData, schema }
  }
}
