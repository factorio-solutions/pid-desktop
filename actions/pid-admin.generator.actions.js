import request from '../helpers/requestAdmin'
import * as nav from '../helpers/navigation'

import {
  GET_PID_ADMIN_GARAGES,
  GET_PID_ADMIN_GARAGE_CLIENTS,
  GET_PID_ADMIN_GARAGE_CLIENTS_USERS,
  PID_ADMIN_GENERATE_RESERVATION,
  PID_ADMIN_REMOVE_RESERVATION
} from '../queries/pid-admin.generator.queries'

export const SET_PID_ADMIN_GENERATOR_GARAGES = 'SET_PID_ADMIN_GENERATOR_GARAGES'
export const SET_PID_ADMIN_GENERATOR_CLIENTS = 'SET_PID_ADMIN_GENERATOR_CLIENTS'
export const SET_PID_ADMIN_GENERATOR_USERS = 'SET_PID_ADMIN_GENERATOR_USERS'
export const SET_PID_ADMIN_GENERATOR_RESERVATIONS = 'SET_PID_ADMIN_GENERATOR_RESERVATIONS'
export const TOGGLE_PID_ADMIN_GENERATOR_GARAGE = 'TOGGLE_PID_ADMIN_GENERATOR_GARAGE'
export const TOGGLE_PID_ADMIN_GENERATOR_CLIENT = 'TOGGLE_PID_ADMIN_GENERATOR_CLIENT'
export const TOGGLE_PID_ADMIN_GENERATOR_USER = 'TOGGLE_PID_ADMIN_GENERATOR_USER'
export const SELECT_ALL_PID_ADMIN_GENERATOR_USERS = 'SELECT_ALL_PID_ADMIN_GENERATOR_USERS'
export const DESELECT_ALL_PID_ADMIN_GENERATOR_USERS = 'DESELECT_ALL_PID_ADMIN_GENERATOR_USERS'
export const SET_PID_ADMIN_GENERATOR_COUNT = 'SET_PID_ADMIN_GENERATOR_COUNT'
export const SET_PID_ADMIN_GENERATOR_DATE_FROM = 'SET_PID_ADMIN_GENERATOR_DATE_FROM'
export const SET_PID_ADMIN_GENERATOR_DATE_TO = 'SET_PID_ADMIN_GENERATOR_DATE_TO'
export const SET_PID_ADMIN_GENERATOR_DAYS = 'SET_PID_ADMIN_GENERATOR_DAYS'
export const SET_PID_ADMIN_GENERATOR_DAY_FROM = 'SET_PID_ADMIN_GENERATOR_DAY_FROM'
export const SET_PID_ADMIN_GENERATOR_DAY_TO = 'SET_PID_ADMIN_GENERATOR_DAY_TO'
export const SET_PID_ADMIN_GENERATOR_DURATION_FROM = 'SET_PID_ADMIN_GENERATOR_DURATION_FROM'
export const SET_PID_ADMIN_GENERATOR_DURATION_TO = 'SET_PID_ADMIN_GENERATOR_DURATION_TO'
export const TOGGLE_PID_ADMIN_GENERATOR_INTERNAL = 'TOGGLE_PID_ADMIN_GENERATOR_INTERNAL'
export const TOGGLE_PID_ADMIN_GENERATOR_CREATE_USERS = 'TOGGLE_PID_ADMIN_GENERATOR_CREATE_USERS'
export const SET_PID_ADMIN_GENERATOR_USERS_COUNT = 'SET_PID_ADMIN_GENERATOR_USERS_COUNT'


export function setGarages(value) {
  return (dispatch, getState) => {
    const garages = getState().pidAdminGenerator.garages
    dispatch({
      type:  SET_PID_ADMIN_GENERATOR_GARAGES,
      value: value.map(garage => { // add selected key
        const oldGarage = garages.findById(garage.id)
        return { ...garage, selected: !!oldGarage && oldGarage.selected }
      })
    })
  }
}

export function setClients(value) {
  return (dispatch, getState) => {
    const clients = getState().pidAdminGenerator.clients
    dispatch({
      type:  SET_PID_ADMIN_GENERATOR_CLIENTS,
      value: value.map(client => { // add selected key
        const oldCient = clients.findById(client.id)
        return { ...client, selected: !!oldCient && oldCient.selected }
      })
    })
  }
}

export function setUsers(value) {
  return (dispatch, getState) => {
    const users = getState().pidAdminGenerator.users
    dispatch({
      type:  SET_PID_ADMIN_GENERATOR_USERS,
      value: value.map(user => { // add selected key
        const oldUser = users.findById(user.id)
        return { ...user, selected: !!oldUser && oldUser.selected }
      })
    })
  }
}

export function setReservations(value) {
  return {
    type: SET_PID_ADMIN_GENERATOR_RESERVATIONS,
    value
  }
}

export function toggleGarage(id) {
  return {
    type:  TOGGLE_PID_ADMIN_GENERATOR_GARAGE,
    value: id
  }
}

export function toggleClient(id) {
  return {
    type:  TOGGLE_PID_ADMIN_GENERATOR_CLIENT,
    value: id
  }
}

export function toggleUser(id) {
  return {
    type:  TOGGLE_PID_ADMIN_GENERATOR_USER,
    value: id
  }
}

export function selectAllUsers() {
  return { type: SELECT_ALL_PID_ADMIN_GENERATOR_USERS }
}

export function deselectAllUsers() {
  return { type: DESELECT_ALL_PID_ADMIN_GENERATOR_USERS }
}

export function setCount(value) {
  return {
    type: SET_PID_ADMIN_GENERATOR_COUNT,
    value
  }
}

export function setDateFrom(value) {
  return {
    type: SET_PID_ADMIN_GENERATOR_DATE_FROM,
    value
  }
}

export function setDateTo(value) {
  return {
    type: SET_PID_ADMIN_GENERATOR_DATE_TO,
    value
  }
}

export function toggleDay(value) {
  return {
    type: SET_PID_ADMIN_GENERATOR_DAYS,
    value
  }
}

export function setDayFrom(value) {
  return {
    type:  SET_PID_ADMIN_GENERATOR_DAY_FROM,
    value: parseInt(value, 10)
  }
}

export function setDayTo(value) {
  return {
    type:  SET_PID_ADMIN_GENERATOR_DAY_TO,
    value: parseInt(value, 10)
  }
}

export function setDurationFrom(value) {
  return {
    type:  SET_PID_ADMIN_GENERATOR_DURATION_FROM,
    value: parseInt(value, 10)
  }
}

export function setDurationTo(value) {
  return {
    type:  SET_PID_ADMIN_GENERATOR_DURATION_TO,
    value: parseInt(value, 10)
  }
}

export function toggleInternal() {
  return { type: TOGGLE_PID_ADMIN_GENERATOR_INTERNAL }
}

export function toggleCreateUsers() {
  return { type: TOGGLE_PID_ADMIN_GENERATOR_CREATE_USERS }
}

export function setUsersCount(value) {
  return {
    type:  SET_PID_ADMIN_GENERATOR_USERS_COUNT,
    value: parseInt(value, 10)
  }
}


export function initGarages() {
  return dispatch => {
    request(GET_PID_ADMIN_GARAGES)
    .then(data => dispatch(setGarages(data.garages)))
  }
}

export function initClients() {
  return (dispatch, getState) => {
    const garageIds = getState().pidAdminGenerator.garages.filter(g => g.selected).map(g => g.id)
    if (garageIds.length) {
      request(GET_PID_ADMIN_GARAGE_CLIENTS, { ids: garageIds })
      .then(data => dispatch(setClients(data.garages_clients)))
    } else {
      dispatch(setClients([]))
    }
  }
}

export function initUsers() {
  return (dispatch, getState) => {
    const clientIds = getState().pidAdminGenerator.clients.filter(c => c.selected).map(c => c.id)
    if (clientIds.length) {
      request(GET_PID_ADMIN_GARAGE_CLIENTS_USERS, { ids: clientIds, internal: getState().pidAdminGenerator.internal })
      .then(data => dispatch(setUsers(data.garages_clients_users.reduce((acc, user) => {
        return [
          ...acc,
          ...user.clients
            .filter(client => {
              const clientFromState = getState().pidAdminGenerator.clients.find(c => c.id === client.id)
              return clientFromState && clientFromState.selected
            })
            .map(client => ({ ...user, client_name: client.name, client_id: client.id }))
        ]
      }, []))))
    } else {
      dispatch(setUsers([]))
    }
  }
}

export function generateReservations() {
  return (dispatch, getState) => {
    const state = getState().pidAdminGenerator

    const variables = {
      garage_ids:    state.garages.filter(g => g.selected).map(g => g.id),
      count:         state.count,
      date_from:     state.dateFrom,
      date_to:       state.dateTo,
      days:          state.days,
      day_from:      state.dayFrom,
      day_to:        state.dayTo,
      duration_from: state.durationFrom,
      duration_to:   state.durationTo,
      client_users:  !state.createUsers && state.users.filter(u => u.selected).map(u => ({ user_id: u.id, client_id: u.client_id })),
      internal:      state.internal,
      client_ids:    state.clients.filter(c => c.selected).map(c => c.id),
      user_count:    state.createUsers ? state.userCount : null
    }

    request(PID_ADMIN_GENERATE_RESERVATION, variables).then(data => {
      dispatch(setReservations(data.generate_reservations.map(reservation => ({
        ...reservation,
        userName:   reservation.client.name,
        clientName: reservation.user.full_name
      }))))
      nav.to('/pid-admin/generator/overview')
    })
  }
}

export function removeReservations() {
  return (dispatch, getState) => {
    const state = getState().pidAdminGenerator

    request(PID_ADMIN_REMOVE_RESERVATION, {
      recurring_reservations_id: state.reservations[0].recurring_reservation.id,
      remove_users:              state.createUsers
    })
    .then(() => nav.to('/pid-admin/generator'))
  }
}
