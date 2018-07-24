import moment from 'moment'

import { request }    from '../helpers/request'
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
  GARAGE_CLIENTS_QUERY,
  GET_AVAILABLE_CLIENTS,
  CHECK_PLACE_AVAILABLE
} from '../queries/occupancy.queries'

export const OCCUPANCY_SET_GARAGES = 'OCCUPANCY_SET_GARAGES'
export const OCCUPANCY_SET_GARAGE = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_RESET_CLIENTS = 'OCCUPANCY_RESET_CLIENTS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM = 'OCCUPANCY_SET_FROM'
export const OCCUPANCY_SET_LOADING = 'OCCUPANCY_SET_LOADING'
export const OCCUPANCY_SET_NEW_RESERVATION = 'OCCUPANCY_SET_NEW_RESERVATION'
export const OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE = 'OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE'


export const setGarages = actionFactory(OCCUPANCY_SET_GARAGES)
export const setGarage = actionFactory(OCCUPANCY_SET_GARAGE)
export const setClients = actionFactory(OCCUPANCY_SET_CLIENTS)
export const resetClients = actionFactory(OCCUPANCY_RESET_CLIENTS)
export const setLoading = actionFactory(OCCUPANCY_SET_LOADING)
export const setReservationNotPossible = actionFactory(OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE)

export function setNewReservation(fromMoment, toMoment, placeId) {
  return (dispatch, getState) => {
    const state = getState().occupancy
    const pageBase = getState().pageBase
    let fromValue = moment(roundTime(fromMoment), MOMENT_DATETIME_FORMAT)
    let toValue = moment(roundTime(toMoment), MOMENT_DATETIME_FORMAT)
    const now = moment(roundTime(moment()), MOMENT_DATETIME_FORMAT)

    if (fromValue.diff(now, 'minutes') < 0) { // cannot create reservations in the past
      fromValue = now
    }

    if (toValue.diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes')
    }


    requestPromise(GET_AVAILABLE_CLIENTS,
      { garage_id: (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage,
        user_id:   pageBase.current_user.id
      }
    )
    .then(data => {
      const clientIds = [
        ...data.reservable_clients.map(client => client.id),
        ...data.current_user.secretary_clients.map(client => client.id)
      ]

      requestPromise(
        CHECK_PLACE_AVAILABLE,
        { id:         (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage,
          begins_at:  timeToUTC(fromValue),
          ends_at:    timeToUTC(toValue),
          client_ids: clientIds
        }
      )
      .then(data => {
        const places = data.garage.floors
        .reduce((places, floor) => [ ...places, ...floor.free_places ], [])
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
      })
    })

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
  }
}

export function setDuration(duration) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_DURATION,
      value: duration
    })
    dispatch(loadGarage())
  }
}

export function setFrom(from) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_FROM,
      value: from
    })
    dispatch(loadGarage())
  }
}

export function loadGarages() {
  return (dispatch, getState) => {
    requestPromise(OCCUPANCY_GARAGES_QUERY)
    .then(data => {
      dispatch(setGarages(data.occupancy_garages))
      dispatch(loadGarage(getState().pageBase.garage))
    })
  }
}

export function resetClientsLoadGarage(id) {
  return (dispatch, getState) => {
    if (getState().pageBase.garages.find(garage => garage.garage.id === id)) dispatch(pageBase.setGarage(id))
    dispatch(resetClients())
    dispatch(loadGarage(id))
  }
}

export function loadGarage(id) {
  return (dispatch, getState) => {
    const state = getState().occupancy
    const garageId = id || (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage

    garageId && requestPromise(GARAGE_DETAILS_QUERY, {
      id:         garageId,
      from:       timeToUTC(state.from),
      to:         timeToUTC(state.from.clone().add(1, state.duration)),
      client_ids: state.client_ids
    }).then(data => dispatch(setGarage(data.garage)))

    dispatch(loadClients(garageId))
  }
}

export function loadClients(id) {
  return (dispatch, getState) => {
    const onClientsSuccess = response => {
      response.data.garage.clients.unshift({ name: t([ 'occupancy', 'allReservations' ]), id: undefined })
      dispatch(setClients(response.data.garage.clients))
    }

    const garageId = id || getState().pageBase.garage
    garageId && request(onClientsSuccess,
      GARAGE_CLIENTS_QUERY,
      { id: garageId }
    )
  }
}

export function initOccupancy() {
  return dispatch => {
    dispatch(loadGarages())
    dispatch(resetClientClick())
  }
}

// =============================================================================
// occupancy actions
export function subtract() {
  return (dispatch, getState) => {
    const duration = getState().occupancy.duration
    dispatch(setFrom(moment(getState().occupancy.from).subtract(1, duration)))
  }
}

export function add() {
  return (dispatch, getState) => {
    const duration = getState().occupancy.duration
    dispatch(setFrom(moment(getState().occupancy.from).add(1, duration)))
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
