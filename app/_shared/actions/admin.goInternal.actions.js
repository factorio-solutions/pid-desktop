import request       from '../helpers/requestPromise'
import actionFactory from '../helpers/actionFactory'
import { t }         from '../modules/localization/localization'
// import * as nav      from '../helpers/navigation'

import { setCustomModal } from './pageBase.actions'
import { initModules } from './admin.modules.actions'
import { GET_GARAGE, UPDATE_ALL_PLACES } from '../queries/admin.goInternal.queries.js'


export const ADMIN_GO_INTERNAL_SET_GARAGE = 'ADMIN_GO_INTERNAL_SET_GARAGE'
export const ADMIN_GO_INTERNAL_SET_PLACES = 'ADMIN_GO_INTERNAL_SET_PLACES'
export const ADMIN_GO_INTERNAL_SET_CURRENCIES = 'ADMIN_GO_INTERNAL_SET_CURRENCIES'
export const ADMIN_GO_INTERNAL_SET_CURRENCY_ID = 'ADMIN_GO_INTERNAL_SET_CURRENCY_ID'
export const ADMIN_GO_INTERNAL_SET_FLAT_PRICE = 'ADMIN_GO_INTERNAL_SET_FLAT_PRICE'
export const ADMIN_GO_INTERNAL_SET_EXPONENTIAL_12H_PRICE = 'ADMIN_GO_INTERNAL_SET_EXPONENTIAL_12H_PRICE'
export const ADMIN_GO_INTERNAL_SET_EXPONENTIAL_DAY_PRICE = 'ADMIN_GO_INTERNAL_SET_EXPONENTIAL_DAY_PRICE'
export const ADMIN_GO_INTERNAL_SET_EXPONENTIAL_WEEK_PRICE = 'ADMIN_GO_INTERNAL_SET_EXPONENTIAL_WEEK_PRICE'
export const ADMIN_GO_INTERNAL_SET_EXPONENTIAL_MONTH_PRICE = 'ADMIN_GO_INTERNAL_SET_EXPONENTIAL_MONTH_PRICE'
export const ADMIN_GO_INTERNAL_SET_WEEKEND_PRICE = 'ADMIN_GO_INTERNAL_SET_WEEKEND_PRICE'


const patternInputActionFactory = type => (value, valid) => ({ type, valid, value: parseInt(value, 10) })

export const setGarage = actionFactory(ADMIN_GO_INTERNAL_SET_GARAGE)
export const togglePlace = actionFactory(ADMIN_GO_INTERNAL_SET_PLACES)
export const setCurrencies = actionFactory(ADMIN_GO_INTERNAL_SET_CURRENCIES)
export const setCurrencyId = actionFactory(ADMIN_GO_INTERNAL_SET_CURRENCY_ID)
export const setFlatPrice = patternInputActionFactory(ADMIN_GO_INTERNAL_SET_FLAT_PRICE)
export const setExponential12hPrice = patternInputActionFactory(ADMIN_GO_INTERNAL_SET_EXPONENTIAL_12H_PRICE)
export const setExponentialDayPrice = patternInputActionFactory(ADMIN_GO_INTERNAL_SET_EXPONENTIAL_DAY_PRICE)
export const setExponentialWeekPrice = patternInputActionFactory(ADMIN_GO_INTERNAL_SET_EXPONENTIAL_WEEK_PRICE)
export const setExponentialMonthPrice = patternInputActionFactory(ADMIN_GO_INTERNAL_SET_EXPONENTIAL_MONTH_PRICE)
export const setWeekendPricing = patternInputActionFactory(ADMIN_GO_INTERNAL_SET_WEEKEND_PRICE)


export function initGoInternal() {
  return (dispatch, getState) => {
    getState().pageBase.garage && request(GET_GARAGE, { id: getState().pageBase.garage })
    .then(data => {
      dispatch(setGarage(data.garage))
      dispatch(setCurrencies(data.currencies))

      const state = getState().adminGoInternal
      data.garage.floors
      .map(floor => floor.places) // take places
      .reduce((acc, places) => [ ...acc, ...places ], []) // flatten
      .forEach(place => {
        if ((state.places.includes(place.id) && !place.go_internal) || (!state.places.includes(place.id) && place.go_internal)) {
          dispatch(togglePlace(place.id))
        }
      })
    })
  }
}

function getPlaces(garage) {
  return garage.floors.reduce((acc, floor) => [ ...acc, ...(floor.places || []) ], [])
}

export function disableGoInternal() {
  return (dispatch, getState) => {
    request(UPDATE_ALL_PLACES, { places: getPlaces(getState().adminGoInternal.garage).map(place => ({ id: place.id, go_internal: false })) })
    .then(() => {
      dispatch(initModules())
      dispatch(initGoInternal())
    })
  }
}

export function submitGoInternal() {
  return (dispatch, getState) => {
    dispatch(setCustomModal(t([ 'newPricing', 'saving' ])))
    const state = getState().adminGoInternal

    request(UPDATE_ALL_PLACES, {
      places: getPlaces(state.garage).map(place => ({
        id:          place.id,
        go_internal: state.places.includes(place.id),
        pricing:     !state.places.includes(place.id) ? null : {
          place_id:                place.id,
          currency_id:             state.currency_id,
          user_id:                 getState().pageBase.current_user.id,
          flat_price:              state.flat_price.value || undefined,
          exponential_12h_price:   state.exponential_12h_price.value || undefined,
          exponential_day_price:   state.exponential_day_price.value || undefined,
          exponential_month_price: state.exponential_month_price.value || undefined,
          exponential_week_price:  state.exponential_week_price.value || undefined,
          weekend_price:           state.weekend_price.value || undefined
        }
      }))
    })
    .then(() => {
      dispatch(setCustomModal())
      // nav.to(`/${getState().pageBase.garage}/admin/modules`)
      dispatch(initModules())
    })
  }
}


function getPlaces(garage) {
  return garage.floors.reduce((acc, floor) => [ ...acc, ...(floor.places || []) ], [])
}


export function submitIntegration(key) {
  return (dispatch, getState) => {
    const state = getState().adminThirdPartyIntegration

    requestPromise(UPDATE_ALL_PLACES, { places: getPlaces(getState).map(place => ({
      id:    place.id,
      [key]: state.places.includes(place.id)
    })) }) // .then(() => nav.to(`/${getState().pageBase.garage}/admin/modules`))
  }
}
