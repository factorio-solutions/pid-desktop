import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import { t }         from '../modules/localization/localization'

import { setCustomModal } from './pageBase.actions'
import {
  GET_GARAGE,
  CREATE_PRICING,
  UPDATE_PRICING
} from '../queries/admin.goPublic.queries.js'


export const ADMIN_GO_PUBLIC_SET_GARAGE = 'ADMIN_GO_PUBLIC_SET_GARAGE'
export const ADMIN_GO_PUBLIC_SET_PLACES = 'ADMIN_GO_PUBLIC_SET_PLACES'
export const ADMIN_GO_PUBLIC_SET_CURRENCIES = 'ADMIN_GO_PUBLIC_SET_CURRENCIES'
export const ADMIN_GO_PUBLIC_SET_CURRENCY_ID = 'ADMIN_GO_PUBLIC_SET_CURRENCY_ID'
export const ADMIN_GO_PUBLIC_SET_FLAT_PRICE = 'ADMIN_GO_PUBLIC_SET_FLAT_PRICE'
export const ADMIN_GO_PUBLIC_SET_EXPONENTIAL_12H_PRICE = 'ADMIN_GO_PUBLIC_SET_EXPONENTIAL_12H_PRICE'
export const ADMIN_GO_PUBLIC_SET_EXPONENTIAL_DAY_PRICE = 'ADMIN_GO_PUBLIC_SET_EXPONENTIAL_DAY_PRICE'
export const ADMIN_GO_PUBLIC_SET_EXPONENTIAL_WEEK_PRICE = 'ADMIN_GO_PUBLIC_SET_EXPONENTIAL_WEEK_PRICE'
export const ADMIN_GO_PUBLIC_SET_EXPONENTIAL_MONTH_PRICE = 'ADMIN_GO_PUBLIC_SET_EXPONENTIAL_MONTH_PRICE'
export const ADMIN_GO_PUBLIC_SET_WEEKEND_PRICE = 'ADMIN_GO_PUBLIC_SET_WEEKEND_PRICE'
export const ADMIN_GO_PUBLIC_TOGGLE_HIGHLIGHT = 'ADMIN_GO_PUBLIC_TOGGLE_HIGHLIGHT'


const patternInputActionFactory = type => (value, valid) => ({ type, valid, value: parseInt(value, 10) })

export const setGarage = actionFactory(ADMIN_GO_PUBLIC_SET_GARAGE)
export const togglePlace = actionFactory(ADMIN_GO_PUBLIC_SET_PLACES)
export const setCurrencies = actionFactory(ADMIN_GO_PUBLIC_SET_CURRENCIES)
export const setCurrencyId = actionFactory(ADMIN_GO_PUBLIC_SET_CURRENCY_ID)
export const setFlatPrice = patternInputActionFactory(ADMIN_GO_PUBLIC_SET_FLAT_PRICE)
export const setExponential12hPrice = patternInputActionFactory(ADMIN_GO_PUBLIC_SET_EXPONENTIAL_12H_PRICE)
export const setExponentialDayPrice = patternInputActionFactory(ADMIN_GO_PUBLIC_SET_EXPONENTIAL_DAY_PRICE)
export const setExponentialWeekPrice = patternInputActionFactory(ADMIN_GO_PUBLIC_SET_EXPONENTIAL_WEEK_PRICE)
export const setExponentialMonthPrice = patternInputActionFactory(ADMIN_GO_PUBLIC_SET_EXPONENTIAL_MONTH_PRICE)
export const setWeekendPricing = patternInputActionFactory(ADMIN_GO_PUBLIC_SET_WEEKEND_PRICE)
export const toggleHighlight = actionFactory(ADMIN_GO_PUBLIC_TOGGLE_HIGHLIGHT)


export function initGoPublic() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setGarage(response.data.garage))
      dispatch(setCurrencies(response.data.currencies))
    }

    getState().pageBase.garage && request(onSuccess, GET_GARAGE, { id: getState().pageBase.garage })
  }
}


export function submitPricings() {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    const places = state.garage.floors.reduce((acc, floor) => [ ...acc, ...floor.places ], [])

    const promises = state.places.map(placeId => new Promise(resolve => {
      dispatch(setCustomModal(t([ 'newPricing', 'saving' ])))
      const place = places.findById(placeId)
      const onSuccess = response => resolve(response)

      const pricing = {
        place_id:                placeId,
        currency_id:             state.currency_id,
        flat_price:              state.flat_price.value || undefined,
        exponential_12h_price:   state.exponential_12h_price.value || undefined,
        exponential_day_price:   state.exponential_day_price.value || undefined,
        exponential_month_price: state.exponential_month_price.value || undefined,
        exponential_week_price:  state.exponential_week_price.value || undefined,
        weekend_price:           state.weekend_price.value || undefined
      }

      if (place.pricing) {
        request(onSuccess, UPDATE_PRICING, { id: place.pricing.id, pricing })
      } else {
        request(onSuccess, CREATE_PRICING, { pricing })
      }
    }))

    Promise.all(promises).then(() => { // resolved
      dispatch(setCustomModal())
      // nav.to(`/${getState().pageBase.garage}/admin/modules`)
    })
  }
}
