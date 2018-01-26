import { request } from '../helpers/request'
import actionFactory from '../helpers/actionFactory'

import { GET_RESERVATIONS_PAGINATION_QUERY } from '../queries/reservations.queries'


import { RESERVATIONS_PER_PAGE } from './reservations.actions'


export const SET_GUEST_RESERVATIONS = 'SET_GUEST_RESERVATIONS'
export const ADD_GUEST_RESERVATIONS = 'ADD_GUEST_RESERVATIONS'
export const GUEST_RESERVATIONS_SET_PAGE = 'GUEST_RESERVATIONS_SET_PAGE'


export const setGuestReservations = actionFactory(SET_GUEST_RESERVATIONS)
export const addGuestReservations = actionFactory(ADD_GUEST_RESERVATIONS)
export const setPage = actionFactory(GUEST_RESERVATIONS_SET_PAGE)


export function initReservations() { // callback used by mobile access page
  return (dispatch, getState) => {
    const onSuccess = respoonse => {
      dispatch(setGuestReservations(respoonse.data.reservations))
    }
    request(onSuccess, GET_RESERVATIONS_PAGINATION_QUERY, {
      past:      false,
      secretary: true,
      count:     RESERVATIONS_PER_PAGE,
      page:      1,
      order_by:  'begins_at',
      garage_id: getState().mobileHeader.garage_id
    })
  }
}

export function loadReservations() { // callback used by mobile access page
  return (dispatch, getState) => {
    const state = getState().guestReservations
    const onSuccess = respoonse => {
      dispatch(addGuestReservations(respoonse.data.reservations))
    }
    request(onSuccess, GET_RESERVATIONS_PAGINATION_QUERY, {
      past:      false,
      secretary: true,
      count:     RESERVATIONS_PER_PAGE,
      page:      state.page + 1,
      order_by:  'begins_at',
      garage_id: getState().mobileHeader.garage_id
    })
  }
}
