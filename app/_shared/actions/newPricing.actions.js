import { request }                        from '../helpers/request'
import { GET_CURRENCIES, CREATE_PRICING, GET_DETAILS, UPDATE_PRICING } from '../queries/newPricing.queries'

import * as nav from '../helpers/navigation'


export const NEW_PRICING_SET_NAME                   = "NEW_PRICING_SET_NAME"
export const NEW_PRICING_SET_FLAT_PRICE             = "NEW_PRICING_SET_FLAT_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_MAX_PRICE  = "NEW_PRICING_SET_EXPONENTIAL_MAX_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_MIN_PRICE  = "NEW_PRICING_SET_EXPONENTIAL_MIN_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_DECAY      = "NEW_PRICING_SET_EXPONENTIAL_DECAY"
export const NEW_PRICING_SET_WEEKEND_PRICE          = "NEW_PRICING_SET_WEEKEND_PRICE"
export const NEW_PRICING_SET_CURRENCIES             = "NEW_PRICING_SET_CURRENCIES"
export const NEW_PRICING_SET_SELECTED_CURRENCY      = "NEW_PRICING_SET_SELECTED_CURRENCY"
export const NEW_PRICING_CLEAR_CLIENT_FORM          = "NEW_PRICING_CLEAR_CLIENT_FORM"


export function setName (name, valid){
  return  { type: NEW_PRICING_SET_NAME
          , value: {value: name, valid}
          }
}

export function setFlatPrice (price, valid){
  return  { type: NEW_PRICING_SET_FLAT_PRICE
          , value: {value: price, valid}
          }
}

export function setExponentialMax (max, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_MAX_PRICE
          , value: {value: max, valid}
          }
}
export function setExponentialMin (min, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_MIN_PRICE
          , value: {value: min, valid}
          }
}
export function setExponentialDecay (decay, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_DECAY
          , value: {value: decay, valid}
          }
}
export function setWeekendPricing (pricing, valid){
  return  { type: NEW_PRICING_SET_WEEKEND_PRICE
          , value: {value: pricing, valid}
          }
}

export function setCurrencies (currencies){
  return  { type: NEW_PRICING_SET_CURRENCIES
          , value: currencies
          }
}

export function setSelectedCurrency (index){
  return  { type: NEW_PRICING_SET_SELECTED_CURRENCY
          , value: index
          }
}

export function clearForm (){
  return  { type: NEW_PRICING_CLEAR_CLIENT_FORM }
}


export function initPricing(id){
  return (dispatch, getState) => {

    const onDetails = (response) => {
      dispatch(setName(response.data.pricings[0].name, true))
      dispatch(setSelectedCurrency(getState().newPricing.currencies.findIndex((curr)=>{return curr.id == response.data.pricings[0].currency_id})))
      if (response.data.pricings[0].flat_price != null) dispatch(setFlatPrice(response.data.pricings[0].flat_price, true))
      if (response.data.pricings[0].exponential_decay != null) dispatch(setExponentialDecay( response.data.pricings[0].exponential_decay, true))
      if (response.data.pricings[0].exponential_min_price != null) dispatch(setExponentialMin( response.data.pricings[0].exponential_min_price, true))
      if (response.data.pricings[0].exponential_max_price != null) dispatch(setExponentialMax( response.data.pricings[0].exponential_max_price, true))
      if (response.data.pricings[0].weekend_price != null) dispatch(setWeekendPricing( response.data.pricings[0].weekend_price, true))
    }

    const onSuccess = (response) => {
      dispatch(setCurrencies(response.data.currencies))
      // if id, then download details
      if (id){ request(onDetails, GET_DETAILS, {pricing_id: parseInt(id)}) }
    }

    // download currencies
    dispatch(clearForm())
    request(onSuccess, GET_CURRENCIES)
  }
}

export function submitNewPricing(id) {
  return (dispatch, getState) => {
    const state = getState().newPricing

    const onSuccess = (response) => {
      nav.to('/garages')
      dispatch(clearForm)
    }

    if (id){
      request(onSuccess, UPDATE_PRICING, {
        id: parseInt(id),
        pricing: generatePricing(state)
      })
    } else {
      request(onSuccess, CREATE_PRICING, {
        pricing: generatePricing(state)
      })
    }
  }
}


function generatePricing(state){
  return { name: state.name.value
         , currency_id: state.currencies[state.selectedCurrency].id
         , flat_price: state.flat_price.value == '' ? undefined : parseFloat(state.flat_price.value)
         , exponential_min_price: state.exponential_min_price.value == '' ? undefined : parseFloat(state.exponential_min_price.value)
         , exponential_max_price: state.exponential_max_price == '' ? undefined : parseFloat(state.exponential_max_price.value)
         , exponential_decay: state.exponential_decay.value == '' ? undefined : parseFloat(state.exponential_decay.value)
         , weekend_price: state.weekend_price.value == '' ? undefined : parseFloat(state.weekend_price.value)
         }
}
