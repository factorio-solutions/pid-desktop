import moment from 'moment'
import { batchActions } from 'redux-batched-actions'

import requestPromise from '../helpers/requestPromise'
import actionFactory  from '../helpers/actionFactory'
import { t }          from '../modules/localization/localization'
import * as pageBase  from './pageBase.actions'

import {
  roundTime,
  MIN_RESERVATION_DURATION
}  from './newReservation.actions'

import {
  timeToUTC,
  MOMENT_DATETIME_FORMAT
}  from '../helpers/time'

import {
  OCCUPANCY_GARAGES_QUERY,
  GARAGE_DETAILS_QUERY,
  GET_AVAILABLE_CLIENTS,
  CHECK_PLACE_AVAILABLE,
  UPDATE_USERS_SETTINGS
} from '../queries/occupancy.queries'

export const OCCUPANCY_SET_GARAGES = 'OCCUPANCY_SET_GARAGES'
export const OCCUPANCY_SET_GARAGE = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_RESET_CLIENTS = 'OCCUPANCY_RESET_CLIENTS'
export const OCCUPANCY_SET_ALL_CLIENT_IDS = 'OCCUPANCY_SET_ALL_CLIENT_IDS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM = 'OCCUPANCY_SET_FROM'
export const OCCUPANCY_SET_LOADING = 'OCCUPANCY_SET_LOADING'
export const OCCUPANCY_SET_USER = 'OCCUPANCY_SET_USER'
export const OCCUPANCY_SET_NEW_RESERVATION = 'OCCUPANCY_SET_NEW_RESERVATION'
export const OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE = 'OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE'
export const OCCUPANCY_SET_REFETCHING = 'OCCUPANCY_SET_REFETCHING'


export const setGarages = actionFactory(OCCUPANCY_SET_GARAGES)
export const setGarage = actionFactory(OCCUPANCY_SET_GARAGE)
export const setClients = actionFactory(OCCUPANCY_SET_CLIENTS)
export const setAllClientIds = actionFactory(OCCUPANCY_SET_ALL_CLIENT_IDS)
export const resetClients = actionFactory(OCCUPANCY_RESET_CLIENTS)
export const setLoading = actionFactory(OCCUPANCY_SET_LOADING)
export const setUser = actionFactory(OCCUPANCY_SET_USER)
export const setReservationNotPossible = actionFactory(OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE)
export const setRefetching = actionFactory(OCCUPANCY_SET_REFETCHING)

export function setNewReservation(fromMoment, toMoment, placeId) {
  return async (dispatch, getState) => {
    const state = getState().occupancy
    const { pageBase: pageBaseState } = getState()
    let fromValue = moment(roundTime(fromMoment), MOMENT_DATETIME_FORMAT)
    let toValue = moment(roundTime(toMoment), MOMENT_DATETIME_FORMAT)
    const now = moment(roundTime(moment()), MOMENT_DATETIME_FORMAT)

    if (fromValue.diff(now, 'minutes') < 0) { // cannot create reservations in the past
      fromValue = now
    }

    if (toValue.diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes')
    }


    const data = await requestPromise(
      GET_AVAILABLE_CLIENTS,
      {
        garage_id: (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage,
        user_id:   pageBaseState.current_user.id
      }
    )
    const clientIds = [
      ...data.reservable_clients.map(client => client.id),
      ...data.current_user.secretary_clients.map(client => client.id)
    ]

    const { garage: { floors } } = await requestPromise(
      CHECK_PLACE_AVAILABLE,
      {
        id:         (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage,
        begins_at:  timeToUTC(fromValue),
        ends_at:    timeToUTC(toValue),
        client_ids: clientIds
      }
    )

    const places = floors
      .reduce((acc, floor) => [ ...acc, ...floor.free_places ], [])
      .map(place => place.id)

    if (places.includes(placeId)) {
      dispatch({
        type:  OCCUPANCY_SET_NEW_RESERVATION,
        value: {
          placeId,
          from: fromValue.format(MOMENT_DATETIME_FORMAT),
          to:   toValue.format(MOMENT_DATETIME_FORMAT)
        }
      })
    } else {
      dispatch(setReservationNotPossible(true))
    }
  }
}

export function unsetNewReservation() {
  return { type: OCCUPANCY_SET_NEW_RESERVATION }
}

export function setClientId(id) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_CLIENT_ID,
      value: id
    })
    dispatch(loadGarage())
    dispatch(updateUsersSettings())
  }
}

export function setDuration(duration) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_DURATION,
      value: duration
    })
    dispatch(loadGarage())
    dispatch(updateUsersSettings())
  }
}

export function setFrom(from) {
  return async dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_FROM,
      value: from
    })
    dispatch(loadGarage(undefined, from))
  }
}

export function loadGarages() {
  return async (dispatch, getState) => {
    dispatch(setRefetching(true))
    const data = await requestPromise(OCCUPANCY_GARAGES_QUERY)

    dispatch(setGarages(data.occupancy_garages))

    try {
      dispatch(setUser({
        ...data.current_user,
        occupancy_client_filter: JSON.parse(data.current_user.occupancy_client_filter)
      }))
    } catch (error) {
      dispatch(setUser({
        ...data.current_user,
        occupancy_client_filter: {}
      }))
    }
    dispatch({
      type:  OCCUPANCY_SET_DURATION,
      value: data.current_user.occupancy_duration
    })
    dispatch(setAllClientIds(
      JSON.parse(data.current_user.occupancy_client_filter)[getState().pageBase.garage]
      || []
    ))

    await dispatch(loadGarage(getState().pageBase.garage))
  }
}

export function resetClientsLoadGarage(id) {
  return async (dispatch, getState) => {
    const state = getState().occupancy
    dispatch(setLoading(true))
    if (getState().pageBase.garages.find(garage => garage.garage.id === id)) dispatch(pageBase.setGarage(id))
    dispatch(setAllClientIds(state.user.occupancy_client_filter[id] || []))
    await dispatch(loadGarage(id))
    dispatch(setLoading(false))
  }
}

function updateGarage(garage, from, to, garIntervals) {
  let intervals
  if (!garIntervals) {
    intervals = []
  } else {
    intervals = garIntervals
  }

  let interval = intervals.find(intr => intr.from.isSame(from) && intr.to.isSame(to))

  if (!interval) {
    interval = {
      from:         from.clone(),
      to:           to.clone(),
      reservations: garage.reservations_in_interval,
      contracts:    garage.contracts_in_interval
    }
  } else {
    interval = {
      ...interval,
      reservations: garage.reservations_in_interval,
      contracts:    garage.contracts_in_interval
    }
  }

  intervals = [
    ...intervals.filter(intr => !intr.from.isSame(from) || !intr.to.isSame(to)),
    interval
  ]

  return {
    ...garage,
    intervals
  }
}

export function loadGarage(id, argumentFrom) {
  return async (dispatch, getState) => {
    dispatch(setRefetching(true))
    const state = getState().occupancy
    const from = argumentFrom || state.from
    const garageId = id || (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage
    if (garageId) {
      let to
      if (state.duration === 'month') {
        to = from.clone().add(31, 'day')
      } else {
        to = from.clone().add(1, state.duration)
      }

      const data = await requestPromise(GARAGE_DETAILS_QUERY, {
        id:         garageId,
        from:       timeToUTC(from),
        to:         timeToUTC(to),
        client_ids: state.client_ids
      })

      const clients = [
        { name: t([ 'occupancy', 'allReservations' ]), id: undefined },
        ...data.garage.clients
      ]

      dispatch(batchActions([
        setClients(clients),
        setGarage(updateGarage(data.garage, from, to, state.garage && state.garage.intervals)),
        setRefetching(false)
      ], 'OCCUPANCY_LOAD_GARAGE'))
    }
  }
}

export function loadClients(clients) {
  return dispatch => {
    clients.unshift({ name: t([ 'occupancy', 'allReservations' ]), id: undefined })
    dispatch(setClients(clients))
  }
}

export function initOccupancy() {
  return async dispatch => {
    dispatch(setLoading(true))
    await dispatch(loadGarages())
    dispatch(setLoading(false))
  }
}

function updateUsersSettings() {
  return (dispatch, getState) => {
    const state = getState().occupancy
    requestPromise(
      UPDATE_USERS_SETTINGS,
      {
        id:   state.user.id,
        user: {
          occupancy_client_filter: JSON.stringify(state.user.occupancy_client_filter),
          occupancy_duration:      state.user.occupancy_duration
        }
      }
    )
  }
}

// =============================================================================
// occupancy actions
export function subtract() {
  return async (dispatch, getState) => {
    const { duration, from } = getState().occupancy
    dispatch(setFrom(from.clone().subtract(1, duration)))
  }
}

export function add() {
  return async (dispatch, getState) => {
    const { duration, from } = getState().occupancy
    dispatch(setFrom(from.clone().add(1, duration)))
  }
}

export function dayClick() {
  return dispatch => {
    dispatch(setDuration('day'))
  }
}

export function weekClick() {
  return dispatch => {
    dispatch(setDuration('week'))
  }
}

export function monthClick() {
  return dispatch => {
    dispatch(setDuration('month'))
  }
}

export function resetClientClick() {
  return dispatch => {
    dispatch(setClientId()) // to undefined
  }
}
