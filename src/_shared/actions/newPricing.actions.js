import { request }                        from '../helpers/request'
import { GET_CURRENCIES, CREATE_PRICING, GET_DETAILS, UPDATE_PRICING } from '../queries/newPricing.queries'

import * as nav from '../helpers/navigation'


export const NEW_PRICING_SET_NAME                    = "NEW_PRICING_SET_NAME"
export const NEW_PRICING_SET_FLAT_PRICE              = "NEW_PRICING_SET_FLAT_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_12H_PRICE   = "NEW_PRICING_SET_EXPONENTIAL_12H_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_DAY_PRICE   = "NEW_PRICING_SET_EXPONENTIAL_DAY_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_WEEK_PRICE  = "NEW_PRICING_SET_EXPONENTIAL_WEEK_PRICE"
export const NEW_PRICING_SET_EXPONENTIAL_MONTH_PRICE = "NEW_PRICING_SET_EXPONENTIAL_MONTH_PRICE"
export const NEW_PRICING_SET_WEEKEND_PRICE           = "NEW_PRICING_SET_WEEKEND_PRICE"
export const NEW_PRICING_SET_CURRENCIES              = "NEW_PRICING_SET_CURRENCIES"
export const NEW_PRICING_SET_SELECTED_CURRENCY       = "NEW_PRICING_SET_SELECTED_CURRENCY"
export const NEW_PRICING_CLEAR_CLIENT_FORM           = "NEW_PRICING_CLEAR_CLIENT_FORM"


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

export function setExponential12hPrice (value, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_12H_PRICE
          , value: {value: value, valid}
          }
}
export function setExponentialDayPrice (dayPrice, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_DAY_PRICE
          , value: {value: dayPrice, valid}
          }
}
export function setExponentialWeekPrice (weekPrice, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_WEEK_PRICE
          , value: {value: weekPrice, valid}
          }
}
export function setExponentialMonthPrice (monthPrice, valid){
  return  { type: NEW_PRICING_SET_EXPONENTIAL_MONTH_PRICE
          , value: {value: monthPrice, valid}
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
      if (response.data.pricings[0].exponential_12h_price != null) dispatch(setExponential12hPrice( response.data.pricings[0].exponential_12h_price, true))
      if (response.data.pricings[0].exponential_day_price != null) dispatch(setExponentialDayPrice( response.data.pricings[0].exponential_day_price, true))
      if (response.data.pricings[0].exponential_week_price != null) dispatch(setExponentialWeekPrice( response.data.pricings[0].exponential_week_price, true))
      if (response.data.pricings[0].exponential_month_price != null) dispatch(setExponentialMonthPrice( response.data.pricings[0].exponential_month_price, true))
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
         , exponential_12h_price: state.exponential_12h_price.value == '' ? undefined : parseFloat(state.exponential_12h_price.value)
         , exponential_day_price: state.exponential_day_price == '' ? undefined : parseFloat(state.exponential_day_price.value)
         , exponential_week_price: state.exponential_week_price.value == '' ? undefined : parseFloat(state.exponential_week_price.value)
         , exponential_month_price: state.exponential_month_price.value == '' ? undefined : parseFloat(state.exponential_month_price.value)
         , weekend_price: state.weekend_price.value == '' ? undefined : parseFloat(state.weekend_price.value)
         }
}
