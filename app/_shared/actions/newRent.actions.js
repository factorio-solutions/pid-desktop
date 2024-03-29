import request                                                    from '../helpers/request'
import { CREATE_RENT, UPDATE_RENT, GET_RENT_DETAILS, GET_CURRENCIES } from '../queries/newRent.queries'

import * as nav from '../helpers/navigation'

export const NEW_RENT_SET_NAME              = "NEW_RENT_SET_NAME"
export const NEW_RENT_SET_PRICE             = "NEW_RENT_SET_PRICE"
export const NEW_RENT_SET_CURRENCIES        = "NEW_RENT_SET_CURRENCIES"
export const NEW_RENT_SET_SELECTED_CURRENCY = "NEW_RENT_SET_SELECTED_CURRENCY"
export const NEW_RENT_SET_HIGHLIGHT         = "NEW_RENT_SET_HIGHLIGHT"
export const NEW_RENT_CLEAR_CLIENT_FORM     = "NEW_RENT_CLEAR_CLIENT_FORM"


export function setName (name, valid) {
  return { type: NEW_RENT_SET_NAME
         , value: {value: name, valid}
         }
}

export function setPrice (price, valid) {
  return { type: NEW_RENT_SET_PRICE
         , value: {value: price, valid}
         }
}

export function setCurrencies (currencies) {
  return { type: NEW_RENT_SET_CURRENCIES
         , value: currencies
         }
}

export function setCurrency (currency) {
  return { type: NEW_RENT_SET_SELECTED_CURRENCY
         , value: currency
         }
}

export function setHighlight (value){
  return { type: NEW_RENT_SET_HIGHLIGHT
         , value
         }
}

export function toggleHighlight (){
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newRent.highlight))
  }
}

export function clearForm () {
  return { type: NEW_RENT_CLEAR_CLIENT_FORM }
}


export function initRent(id){
  return (dispatch, getState) => {

    const onDetails = (response) => {
      dispatch(setName(response.data.rents[0].name, true))
      dispatch(setPrice(response.data.rents[0].price, true))
      dispatch(setCurrency(getState().newRent.currencies.findIndex((curr)=>{return curr.id == response.data.rents[0].currency_id})))
    }

    const onSuccess = (response) => {
      dispatch(setCurrencies(response.data.currencies))
      // if id, then download details
      if (id){ request(onDetails, GET_RENT_DETAILS, {rent_id: parseInt(id)}) }
    }

    // download currencies
    dispatch(clearForm())
    request(onSuccess, GET_CURRENCIES)
  }
}

export function submitNewRent(id) {
  return (dispatch, getState) => {
    const state = getState().newRent

    const onSuccess = (response) => {
      nav.to(`/${getState().pageBase.garage}/admin/finance`)
      dispatch(clearForm)
    }

    if (id){
      request(onSuccess, UPDATE_RENT, {
        id: parseInt(id),
        rent: { currency_id: state.currencies[state.selectedCurrency].id
              , name: state.name.value
              , price: parseFloat(state.price.value)
              }
      })
    } else {
      request(onSuccess, CREATE_RENT, {
        rent: { name: state.name.value
              , currency_id: state.currencies[state.selectedCurrency].id
              , price: parseFloat(state.price.value)
              }
      })
    }

  }
}
