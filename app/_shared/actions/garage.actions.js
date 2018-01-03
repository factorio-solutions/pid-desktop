import moment      from 'moment'
import { request } from '../helpers/request'
import { timeToUTC } from '../helpers/time'
import { t }       from '../modules/localization/localization'

import { GARAGE_DETAILS_QUERY, GARAGE_RESERVATIONS } from '../queries/garage.queries.js'


export const GARAGE_SET_SELECTED      = 'GARAGE_SET_SELECTED'
export const GARAGE_SET_GARAGE        = 'GARAGE_SET_GARAGE'
export const GARAGE_SET_NOW           = 'GARAGE_SET_NOW'
export const GARAGE_SET_SHOW_SELECTOR = 'GARAGE_SET_SHOW_SELECTOR'
export const GARAGE_SET_TIME          = 'GARAGE_SET_TIME'


export function setSelected (value){
  return { type: GARAGE_SET_SELECTED
         , value
         }
}

export function setGarage (value){
  return { type: GARAGE_SET_GARAGE
         , value
         }
}

export function setNow (){
  return(dispatch, getState) => {
    dispatch({ type: GARAGE_SET_NOW })
    dispatch(updateReservations())
  }
  // return { type: GARAGE_SET_NOW }
}

export function setSelector (value){
  return { type: GARAGE_SET_SHOW_SELECTOR
         , value
         }
}

export function setTime (time){
  return(dispatch, getState) => {
    dispatch({ type: GARAGE_SET_TIME
             , value: moment(time)
             })
    dispatch(updateReservations())
  }
  // return { type: GARAGE_SET_TIME
  //        , value: moment(time)
  //        }
}

export function initGarage () {
  return (dispatch, getState) => {
    const garagePromise = createPromise(getState, (onSuccess)=>{
      request(onSuccess, GARAGE_DETAILS_QUERY, {id: getState().pageBase.garage})
    })

    const reservationsPromise = createPromise(getState, (onSuccess)=>{
      request(onSuccess, GARAGE_RESERVATIONS, {id: getState().pageBase.garage, datetime: timeToUTC(getState().garage.time)})
    })

    Promise.all([garagePromise, reservationsPromise]).then((data)=>{
      data[1].garage.floors.reduce((acc, floor) => [ ...acc, ...floor.places ], [])
      dispatch(setGarage(updateGaragesPlaces(data[0].garage, { garage: { places: data[1].garage.floors.reduce((acc, floor) => [ ...acc, ...floor.places ], []) } })))
    }).catch((error) => {
      console.error(error)
    })
  }
}

export function updateReservations() {
  return (dispatch, getState) => {
    createPromise(getState, (onSuccess)=>{
      request(onSuccess, GARAGE_RESERVATIONS, {id: getState().pageBase.garage, datetime: timeToUTC(getState().garage.time)})
    }).then((data) => {
      dispatch(setGarage(updateGaragesPlaces(getState().garage.garage, { garage: { places: data.garage.floors.reduce((acc, floor) => [ ...acc, ...floor.places ], []) } })))
    }).catch((error) => {
      console.error(error)
    })
  }
}

function updateGaragesPlaces(garage, data) {
  return { ...garage
    , floors: garage.floors.map(floor => {
      return { ...floor
             , places: floor.places.map( place => {
                 const reservationContractPlace = data.garage.places.find(p => p.id === place.id)
                 return { ...place
                        , reservations: reservationContractPlace ? reservationContractPlace.reservations_in_time : []
                        , contracts: reservationContractPlace ? reservationContractPlace.contracts_in_time : []
                        }
               })
             }
    })
  }
}

function onPromiseSuccess(resolve, reject) {
  return (response) => {
    response.data ? resolve(response.data) : reject(response)
  }
}

function createPromise(getState, perform) {
  return new Promise(function(resolve, reject) {
    if (getState().pageBase.garage) {
      perform(onPromiseSuccess(resolve, reject))
    } else {
      reject('no garage in pageBase')
    }
  })
}
