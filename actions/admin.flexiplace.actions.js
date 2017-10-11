import request from '../helpers/requestPromise'

import { INIT_GARAGE_PRICINGS } from '../queries/admin.flexiplace.queries'


export const ADMIN_FLEXIPLACE_SET_PRICINGS = 'ADMIN_FLEXIPLACE_SET_PRICINGS'
export const ADMIN_FLEXIPLACE_SET_CURRENCIES = 'ADMIN_FLEXIPLACE_SET_CURRENCIES'
export const ADMIN_FLEXIPLACE_SET_PRICING = 'ADMIN_FLEXIPLACE_SET_PRICING'


export function setPricings(value) {
  return {
    type: ADMIN_FLEXIPLACE_SET_PRICINGS,
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
      dispatch(setPricings(data.garage.pricings))
    })
  }
}

export function sumbitFlexi() {
  return (dipatch, getState) => {
    console.log('TODO: send method ')
  }
}
