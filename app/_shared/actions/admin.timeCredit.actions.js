import requestPromise from '../helpers/requestPromise'
import actionFactory  from '../helpers/actionFactory'
import { parsePrice } from './admin.goInternal.actions'

import {
  CLIENT_TIME_CREDIT,
  UPDATE_TIME_CREDIT
} from '../queries/admin.timeCredit.queries'


export const TIME_CREDIT_SET_ACTIVE = 'TIME_CREDIT_SET_ACTIVE'
export const TIME_CREDIT_SET_CURRENCY_NAME = 'TIME_CREDIT_SET_CURRENCY_NAME'
export const TIME_CREDIT_SET_PRICE_PER_HOUR = 'TIME_CREDIT_SET_PRICE_PER_HOUR'
export const TIME_CREDIT_SET_MONTHLY_AMOUNT = 'TIME_CREDIT_SET_MONTHLY_AMOUNT'
export const TIME_CREDIT_TOGGLE_HIGHLIGHT = 'TIME_CREDIT_TOGGLE_HIGHLIGHT'
export const TIME_CREDIT_SET_SHOW_MODAL = 'TIME_CREDIT_SET_SHOW_MODAL'
export const TIME_CREDIT_SET_ADD = 'TIME_CREDIT_SET_ADD'
export const TIME_CREDIT_SET_AMOUNT_TO_ADD = 'TIME_CREDIT_SET_AMOUNT_TO_ADD'
export const TIME_CREDIT_SET_USERS_TO_ADD = 'TIME_CREDIT_SET_USERS_TO_ADD'
export const TIME_CREDIT_ERASE_USERS_TO_ADD = 'TIME_CREDIT_ERASE_USERS_TO_ADD'

export const setActive = actionFactory(TIME_CREDIT_SET_ACTIVE)
export const setCurrencyName = actionFactory(TIME_CREDIT_SET_CURRENCY_NAME)
export const setPricePerHour = actionFactory(TIME_CREDIT_SET_PRICE_PER_HOUR)
export const setMonthlyAmount = actionFactory(TIME_CREDIT_SET_MONTHLY_AMOUNT)
export const toggleHighlight = actionFactory(TIME_CREDIT_TOGGLE_HIGHLIGHT)
export const setShowModal = actionFactory(TIME_CREDIT_SET_SHOW_MODAL)
export const setAdd = actionFactory(TIME_CREDIT_SET_ADD)
export const setAmmountToAdd = actionFactory(TIME_CREDIT_SET_AMOUNT_TO_ADD)
export const toggleUser = actionFactory(TIME_CREDIT_SET_USERS_TO_ADD)
export const eraseUsers = actionFactory(TIME_CREDIT_ERASE_USERS_TO_ADD)


export function showAddRemoveModal(add) {
  return dispatch => {
    dispatch(setAdd(add))
    dispatch(setAmmountToAdd(0))
    dispatch(setShowModal(true))
  }
}

export function initTimeCredit(id) {
  return dispatch => {
    requestPromise(CLIENT_TIME_CREDIT, { id })
    .then(response => {
      dispatch(setActive(response.client.is_time_credit_active))
      dispatch(setCurrencyName(response.client.time_credit_currency))
      dispatch(setPricePerHour(response.client.time_credit_price))
      dispatch(setMonthlyAmount(response.client.time_credit_amount_per_month))
    })
  }
}

export function updateTimeCredit(id, client) {
  return dispatch => {
    requestPromise(UPDATE_TIME_CREDIT, { id, client })
    .then(() => dispatch(initTimeCredit(id)))
  }
}

export function toggleTimeCredit(id) {
  return (dispatch, getState) => {
    const state = getState().timeCredit
    dispatch(updateTimeCredit(
      id,
      { is_time_credit_active: !state.active }
    ))
  }
}

export function submitTimeCredit(id) {
  return (dispatch, getState) => {
    const state = getState().timeCredit
    dispatch(updateTimeCredit(
      id,
      { time_credit_currency:         state.currencyName,
        time_credit_price:            parsePrice(state.pricePerHour),
        time_credit_amount_per_month: parsePrice(state.monthlyAmount)
      }
    ))
  }
}

export function submitOnetimeAddition(id) {
  return (dispatch, getState) => {
    const state = getState().timeCredit

    dispatch(updateTimeCredit(
      id,
      { time_credit_add_amount:   state.amountToAdd,
        time_credit_add_to_users: state.usersToAdd.length ? state.usersToAdd : null
      }
    ))
    dispatch(setShowModal(false))
  }
}
