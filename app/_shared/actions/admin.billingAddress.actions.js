import requestPromise from '../helpers/requestPromise'
import actionFactory  from '../helpers/actionFactory'

import { ic2Info } from './newClient.actions'

import { GET_BILLING_ADDRESS } from '../queries/admin.billingAddress.queries'
import { UPDATE_GARAGE }          from '../queries/garageSetup.queries'


export const SET_BILLING_ADDRESS_IC = 'SET_BILLING_ADDRESS_IC'
export const SET_BILLING_ADDRESS_DIC = 'SET_BILLING_ADDRESS_DIC'
export const SET_BILLING_ADDRESS_NAME = 'SET_BILLING_ADDRESS_NAME'
export const SET_BILLING_ADDRESS_LINE1 = 'SET_BILLING_ADDRESS_LINE1'
export const SET_BILLING_ADDRESS_LINE2 = 'SET_BILLING_ADDRESS_LINE2'
export const SET_BILLING_ADDRESS_CITY = 'SET_BILLING_ADDRESS_CITY'
export const SET_BILLING_ADDRESS_POSTAL_CODE = 'SET_BILLING_ADDRESS_POSTAL_CODE'
export const SET_BILLING_ADDRESS_STATE = 'SET_BILLING_ADDRESS_STATE'
export const SET_BILLING_ADDRESS_COUNTRY = 'SET_BILLING_ADDRESS_COUNTRY'
export const TOGGLE_BILLING_ADDRESS_HIGHLIGHT = 'TOGGLE_BILLING_ADDRESS_HIGHLIGHT'
export const CLEAR_BILLING_ADDRESS_FORM = 'CLEAR_BILLING_ADDRESS_FORM'


export const setIC = actionFactory(SET_BILLING_ADDRESS_IC)
export const setDIC = actionFactory(SET_BILLING_ADDRESS_DIC)
export const setName = actionFactory(SET_BILLING_ADDRESS_NAME)
export const setLine1 = actionFactory(SET_BILLING_ADDRESS_LINE1)
export const setLine2 = actionFactory(SET_BILLING_ADDRESS_LINE2)
export const setCity = actionFactory(SET_BILLING_ADDRESS_CITY)
export const setPostalCode = actionFactory(SET_BILLING_ADDRESS_POSTAL_CODE)
export const setState = actionFactory(SET_BILLING_ADDRESS_STATE)
export const setCountry = actionFactory(SET_BILLING_ADDRESS_COUNTRY)
export const toggleHighlight = actionFactory(TOGGLE_BILLING_ADDRESS_HIGHLIGHT)
export const clearForm = actionFactory(CLEAR_BILLING_ADDRESS_FORM)


export function initialize() {
  return (dispatch, getState) => {
    const garageId = getState().pageBase.garage

    requestPromise(GET_BILLING_ADDRESS, { id: garageId })
    .then(({ garage }) => {
      const { account } = garage
      dispatch(setName(account.name))
      dispatch(setIC(account.ic))
      dispatch(setDIC(account.dic))
      dispatch(setLine1(account.address.line_1))
      dispatch(setLine2(account.address.line_2))
      dispatch(setCity(account.address.city))
      dispatch(setPostalCode(account.address.postal_code))
      dispatch(setState(account.address.state))
      dispatch(setCountry(account.address.country))
    })
  }
}

export function loadInfoFromIc() {
  return (dispatch, getState) => {
    const onSuccess = res => {
      dispatch(setName(res.OF))
      dispatch(setLine1(res.AD.UC))
      dispatch(setCity(res.AA.N))
      dispatch(setPostalCode(res.AA.PSC))
      dispatch(setCountry(res.AA.NS))
      dispatch(setDIC(res.DIC))
    }

    ic2Info(getState().adminBillingAddress.ic, onSuccess)
  }
}

export function submitBillingAddress() {
  return (dispatch, getState) => {
    const garageId = getState().pageBase.garage
    const state = getState().adminBillingAddress

    requestPromise(
      UPDATE_GARAGE,
      { id:     garageId,
        garage: {
          company:         state.name,
          ic:              state.ic,
          dic:             state.dic,
          billing_address: {
            line_1:      state.line_1,
            line_2:      state.line_2,
            city:        state.city,
            postal_code: state.postal_code,
            state:       state.state,
            country:     state.country,
            lat:         parseFloat(state.lat),
            lng:         parseFloat(state.lng)
          }
        }
      }
    ).then(() => dispatch(initialize()))
  }
}
