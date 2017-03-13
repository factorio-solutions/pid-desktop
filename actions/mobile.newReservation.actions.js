import moment      from 'moment'
import { request } from '../helpers/request'

import { GET_AVAILABLE_FLOORS }                                                               from '../queries/mobile.newReservation.queries'
import { CREATE_RESERVATION, GET_AVAILABLE_CLIENTS, GET_AVAILABLE_CARS, GET_BRAINTREE_TOKEN } from '../queries/newReservation.queries'
import { AVAILABLE_DURATIONS }                                                                from '../../reservations/newReservation.page'

export const MOBILE_NEW_RESERVATION_SET_FROM              = 'MOBILE_NEW_RESERVATION_SET_FROM'
export const MOBILE_NEW_RESERVATION_SET_TO                = 'MOBILE_NEW_RESERVATION_SET_TO'
export const MOBILE_NEW_RESERVATION_SET_FROM_NOW          = 'MOBILE_NEW_RESERVATION_SET_FROM_NOW'
export const MOBILE_NEW_RESERVATION_SET_DURATION          = 'MOBILE_NEW_RESERVATION_SET_DURATION'
export const MOBILE_NEW_RESERVATION_SET_CLIENT_ID         = "MOBILE_NEW_RESERVATION_SET_CLIENT_ID"
export const MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS = "MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS"
export const MOBILE_NEW_RESERVATION_AVAILABLE_CARS        = "MOBILE_NEW_RESERVATION_AVAILABLE_CARS"
export const MOBILE_NEW_RESERVATION_CAR_ID                = "MOBILE_NEW_RESERVATION_CAR_ID"
export const MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE     = "MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE"
export const MOBILE_NEW_RESERVATION_SET_PLACE_ID          = 'MOBILE_NEW_RESERVATION_SET_PLACE_ID'
export const MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS  = 'MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS'
export const MOBILE_NEW_RESERVATION_SET_AUTOSELECT        = 'MOBILE_NEW_RESERVATION_SET_AUTOSELECT'
export const MOBILE_NEW_RESERVATION_BRAINTREE_TOKEN       = 'MOBILE_NEW_RESERVATION_BRAINTREE_TOKEN'
export const MOBILE_NEW_RESERVATION_CLEAR_FORM            = 'MOBILE_NEW_RESERVATION_CLEAR_FORM'


export function setFrom (from){ // if time changed,
  return (dispatch, getState) => {
    if (getState().mobileNewReservation.from != from) {
      dispatch({ type: MOBILE_NEW_RESERVATION_SET_FROM
               , value: roundTime(from)
               })

      const state = getState().mobileNewReservation
      if (state.duration == undefined && !fromBeforeTo(from, state.to)){
        dispatch(setDuration(AVAILABLE_DURATIONS[0]))
        dispatch(setTo(undefined))
      }

      dispatch(pickPlaces())
    }
  }
}

export function setTo (to){
  return (dispatch, getState) => {
    if (getState().mobileNewReservation.to != to){
      dispatch({ type: MOBILE_NEW_RESERVATION_SET_TO
               , value: roundTime(to)
               })
      dispatch(pickPlaces())
    }
  }
}

export function setFromNow (bool){
  return  { type: MOBILE_NEW_RESERVATION_SET_FROM_NOW
          , value: bool
          }
}

export function setDuration (duration){
  return (dispatch, getState) => {
    if (getState().mobileNewReservation.duration != duration){
      dispatch({ type: MOBILE_NEW_RESERVATION_SET_DURATION
              , value: duration
              })
      if (duration != undefined){ // if set to undefined, then setTo is going to take care of pickPlaces
        dispatch(pickPlaces())
      }
    }
  }
}

export function setClientId (value){
  return (dispatch, getState) => {
    dispatch ({ type: MOBILE_NEW_RESERVATION_SET_CLIENT_ID
              , value
              })

    dispatch(pickPlaces())
  }
}

export function setAvailableClients (value){
  value.unshift({name: 'Select client', id: undefined})
  return { type: MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS
         , value
         }
}

export function setAvailableCars (value){
  return { type: MOBILE_NEW_RESERVATION_AVAILABLE_CARS
         , value
         }
}

export function setCarId (value){
  return { type: MOBILE_NEW_RESERVATION_CAR_ID
         , value
         }
}

export function setCarLicencePlate (value){
  return { type: MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE
         , value
         }
}


export function setFloors (floors){
  return  { type: MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS
          , value: floors
          }
}

export function setPlace (id){
  return (dispatch, getState) => {
    dispatch({ type: MOBILE_NEW_RESERVATION_SET_PLACE_ID
             , value: id
             })
    dispatch(setAutoselect(false))
  }
}

export function setAutoselect (bool){
  return  { type: MOBILE_NEW_RESERVATION_SET_AUTOSELECT
          , value: bool
          }
}

export function setBraintreeToken (token){
  return  { type: MOBILE_NEW_RESERVATION_BRAINTREE_TOKEN
          , value: token
          }
}


function clearForm(){
  return  { type: MOBILE_NEW_RESERVATION_CLEAR_FORM }
}

export function roundTime(time){
  return moment(time).set('minute', Math.floor(moment(time).minutes()/15)*15).format('YYYY-MM-DDTHH:mm') //.format(MOMENT_DATETIME_FORMAT)
}


export function initReservation (){
    return (dispatch, getState) => {
      dispatch(pickPlaces())
      dispatch(getAvailableCars())
      dispatch(getBraintreeToken())
    }
}

export function getBraintreeToken () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setBraintreeToken(response.data.current_user.braintree_token))
    }

    request( onSuccess, GET_BRAINTREE_TOKEN )
  }
}

export function getAvailableClients () {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const onClients = (response) => {
      dispatch(setAvailableClients(response.data.reservable_clients))
    }

    request(onClients
           , GET_AVAILABLE_CLIENTS
           , { garage_id: stateToVariables(getState).garage_id }
           )
  }
}

export function getAvailableCars () {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const onCars = (response) => {
      dispatch(setAvailableCars(response.data.reservable_cars))
      getState().mobileNewReservation.car_id==undefined && (response.data.reservable_cars.length==1 ? dispatch(setCarId(response.data.reservable_cars[0].id))
                                                                                                   : dispatch(setCarId(undefined)))
    }

    request(onCars, GET_AVAILABLE_CARS)
  }
}

export function pickPlaces() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      response.data.garage.floors.forEach((floor) => {
        floor.free_places.map((place) => {
          place.pricings = response.data.garage.pricings.reduce((arr, pricing)=>{
                pricing.groups.find((group)=>{return group.place_id === place.id}) != undefined && arr.push(pricing)
                return arr
              }, [])
          return place
        })
      })

      dispatch( setFloors(response.data.garage.floors) )

      if (response.data.garage.floors.find((floor)=> {return floor.free_places.find((place)=>{return place.id == getState().mobileNewReservation.place_id})}) == undefined){
        // autoselect place if selected place is not available anymore
        dispatch( autoselectPlace() )
      }
    }

    var variables = stateToVariables(getState)
    if ( variables.garage_id ){
      request(onSuccess, GET_AVAILABLE_FLOORS, { id: variables.garage_id, begins_at: variables.begins_at, ends_at: variables.ends_at, client_id:variables.client_id })
      dispatch(getAvailableClients())
    } else {
      dispatch( setFloors([]) )
      dispatch( autoselectPlace() )
    }
  }
}

export function checkGarageChange(garageId, nextGarageId){
    return (dispatch, getState) => {
      if (garageId != nextGarageId){
        dispatch(pickPlaces())
      }
    }
}

export function autoselectPlace(){
    return (dispatch, getState) => {
      const freePlaces = getState().mobileNewReservation.availableFloors.reduce((arr, floor)=> { // free places,
        return arr.concat(floor.free_places.filter((place)=>{
          if (getState().mobileNewReservation.client_id == undefined) {
            return place.pricings.length >= 1
          } else {
            return true
          }
        }))
      }, [])

      dispatch(setPlace(freePlaces.length == 0 ? undefined : freePlaces[0].id))
      dispatch(setAutoselect(true))
    }
}

export function submitReservation(payload, callback){
    return (dispatch, getState) => {
      const onSuccess = (response) => {
        console.log('success', response);
        callback()
        dispatch(clearForm())
      }

      console.log('here');

      var reservation = stateToVariables(getState)
      delete reservation["garage_id"]

      request( onSuccess
             , CREATE_RESERVATION
             , { place_id: reservation.place_id
               , user_id: getState().mobileHeader.current_user.id
               , reservation: { client_id:     reservation.client_id
                              , car_id:        reservation.car_id
                              , licence_plate: reservation.licence_plate
                              , nonce:         payload && payload.nonce
                              , begins_at:     reservation.begins_at
                              , ends_at:       reservation.ends_at
                              }
               }
             , "reservationMutation"
             )
    }
}

export function fromBeforeTo(from, to){
  return (moment(to).diff(moment(from)) > 0)
}


function stateToVariables(getState){
  const state = getState().mobileNewReservation

  const from = state.fromNow ? roundTime(moment()).replace("T", " ") : state.from.replace("T", " ")
  const to = state.duration ? moment(moment(from).add(state.duration, 'hours')).format('YYYY-MM-DD HH:mm') : state.to.replace("T", " ")
  const garage_id = getState().mobileHeader.garage_id

  return ({ place_id:  state.place_id
          , client_id: state.client_id
          , car_id:    state.car_id
          , licence_plate: state.carLicencePlate
          , garage_id: garage_id
          , begins_at: from
          , ends_at:   to
          })
}
