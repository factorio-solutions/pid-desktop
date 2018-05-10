import request from '../helpers/requestPromise'
// import * as nav from '../helpers/navigation'

import { INIT_GARAGE_PRICINGS, CREATE_UNIFORM_PRICING } from '../queries/admin.flexiplace.queries'
import { initModules } from './admin.modules.actions'


export const ADMIN_FLEXIPLACE_PRESET_PRICING = 'ADMIN_FLEXIPLACE_PRESET_PRICING'
export const ADMIN_FLEXIPLACE_SET_CURRENCIES = 'ADMIN_FLEXIPLACE_SET_CURRENCIES'
export const ADMIN_FLEXIPLACE_SET_PRICING = 'ADMIN_FLEXIPLACE_SET_PRICING'


export function presetPricings(value) {
  return {
    type: ADMIN_FLEXIPLACE_PRESET_PRICING,
    value
  }
}

export function setCurrencies(value) {
  return {
    type: ADMIN_FLEXIPLACE_SET_CURRENCIES,
    value
  }
}

function setPricing(key, value) {
  return {
    type: ADMIN_FLEXIPLACE_SET_PRICING,
    key,
    value
  }
}

const parse = value => parseInt(value, 10) || undefined

export function setSelectedCurrency(value) { return setPricing('currency_id', value) }
export function setFlatPrice(value) { return setPricing('flat_price', parse(value)) }
export function setExponential12hPrice(value) { return setPricing('exponential_12h_price', parse(value)) }
export function setExponentialDayPrice(value) { return setPricing('exponential_day_price', parse(value)) }
export function setExponentialWeekPrice(value) { return setPricing('exponential_week_price', parse(value)) }
export function setExponentialMonthPrice(value) { return setPricing('exponential_month_price', parse(value)) }
export function setWeekendPricing(value) { return setPricing('weekend_price', parse(value)) }


export function initPricings() {
  return (dispatch, getState) => {
    getState().pageBase.garage && request(INIT_GARAGE_PRICINGS, { id: getState().pageBase.garage }).then(data => {
      dispatch(setCurrencies(data.currencies))
      dispatch(presetPricings(data.garage.pricings[0]))
    })
  }
}

export function sumbitFlexi() {
  return (dispatch, getState) => {
    const state = getState().adminFlexiplace
    const garageId = getState().pageBase.garage

    getState().pageBase.garage && request(CREATE_UNIFORM_PRICING, { garage_id: garageId, pricing: state.pricing }).then(() => {
      dispatch(initModules())
    })
  }
}
