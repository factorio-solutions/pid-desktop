import moment        from 'moment'
import request   from '../helpers/request'
import { timeToUTC } from '../helpers/time'
import actionFactory from '../helpers/actionFactory'

import {
  GARAGE_DETAILS_QUERY,
  GARAGE_RESERVATIONS
} from '../queries/garage.queries.js'


export const GARAGE_SET_SELECTED = 'GARAGE_SET_SELECTED'
export const GARAGE_SET_GARAGE = 'GARAGE_SET_GARAGE'
export const GARAGE_SET_NOW = 'GARAGE_SET_NOW'
export const GARAGE_SET_SHOW_SELECTOR = 'GARAGE_SET_SHOW_SELECTOR'
export const GARAGE_SET_TIME = 'GARAGE_SET_TIME'
export const GARAGE_SET_LOADING = 'GARAGE_SET_LOADING'


export const setSelected = actionFactory(GARAGE_SET_SELECTED)
export const setGarage = actionFactory(GARAGE_SET_GARAGE)
export const setSelector = actionFactory(GARAGE_SET_SHOW_SELECTOR)
export const setLoading = actionFactory(GARAGE_SET_LOADING)


function updateGaragesPlaces(garage, data) {
  return { ...garage,
    floors: garage.floors.map(floor => {
      return { ...floor,
        places: floor.places.map(place => {
          const reservations = data.reservations_in_time.filter(r => r.place.id === place.id)
          const contracts = data.contracts_in_time.filter(con => con.contract_places.find(p => p.place_id === place.id))
          return { ...place,
            reservations,
            contracts
          }
        })
      }
    })
  }
}

function onPromiseSuccess(resolve, reject) {
  return response => {
    response.data ? resolve(response.data) : reject(response)
  }
}

function createPromise(getState, perform) {
  return new Promise((resolve, reject) => {
    if (getState().pageBase.garage) {
      perform(onPromiseSuccess(resolve, reject))
    } else {
      reject('no garage in pageBase')
    }
  })
}

export function updateReservations() {
  return (dispatch, getState) => {
    createPromise(getState, onSuccess => {
      request(
        onSuccess,
        GARAGE_RESERVATIONS,
        { id:       getState().pageBase.garage,
          datetime: timeToUTC(getState().garage.time)
        }
      )
    }).then(data => {
      dispatch(setGarage(updateGaragesPlaces(getState().garage.garage, { reservations_in_time: data.garage.reservations_in_time, contracts_in_time: data.garage.contracts_in_time })))
    }).catch(error => {
      console.error(error)
    })
  }
}

export function setNow() {
  return dispatch => {
    dispatch({ type: GARAGE_SET_NOW })
    dispatch(updateReservations())
  }
}

export function setTime(time) {
  return dispatch => {
    dispatch({
      type:  GARAGE_SET_TIME,
      value: moment(time)
    })
    dispatch(updateReservations())
  }
}

export function initGarage() {
  return (dispatch, getState) => {
    dispatch(setLoading(true))
    const garagePromise = createPromise(getState, onSuccess => {
      request(onSuccess, GARAGE_DETAILS_QUERY, { id: getState().pageBase.garage, datetime: timeToUTC(getState().garage.time) })
    })

    Promise.all([ garagePromise ]).then(data => {
      dispatch(setGarage(updateGaragesPlaces(data[0].garage, { reservations_in_time: data[0].garage.reservations_in_time, contracts_in_time: data[0].garage.contracts_in_time })))
      dispatch(setLoading(false))
    }).catch(error => {
      console.error(error)
    })
  }
}
