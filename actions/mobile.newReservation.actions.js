import moment                       from 'moment'
import { request }                  from '../helpers/request'
import { parseParameters }          from '../helpers/parseUrlParameters'
import { setError, setCustomModal } from './mobile.header.actions'

import { GET_AVAILABLE_FLOORS }                                                           from '../queries/mobile.newReservation.queries'
import { CREATE_RESERVATION, GET_AVAILABLE_CLIENTS, GET_AVAILABLE_CARS, PAY_RESREVATION } from '../queries/newReservation.queries'
import { CHECK_VALIDITY, CREATE_CSOB_PAYMENT }                                            from '../queries/reservations.queries'
import { AVAILABLE_DURATIONS }                                                            from '../../reservations/newReservation.page'
import { entryPoint }                                                                     from '../../index'

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
            return place.pricing != undefined
          } else {
            return true
          }
        }))
      }, [])

      dispatch(setPlace(freePlaces.length == 0 ? undefined : freePlaces[0].id))
      dispatch(setAutoselect(true))
    }
}

export function submitReservation(callback){
    return (dispatch, getState) => {
      const onSuccess = (response) => {
        console.log(response);
        if (response.data.create_reservation.payment_url){
          dispatch(payReservation(response.data.create_reservation.payment_url, callback))
        } else {
          dispatch(setCustomModal())
          callback()
        }
      }

      var reservation = stateToVariables(getState)
      delete reservation["garage_id"]

      dispatch(setCustomModal(reservation.client_id ? 'Creating reservation' : 'Creating payment ...'))
      request( onSuccess
             , CREATE_RESERVATION
             , { reservation: { user_id:       getState().mobileHeader.current_user.id
                              , place_id:      reservation.place_id
                              , client_id:     reservation.client_id
                              , car_id:        reservation.car_id
                              , licence_plate: reservation.licence_plate=='' ? undefined :  reservation.licence_plate
                              , url:           window.cordova === undefined ? window.location.href.split('?')[0] // development purposes - browser debuging
                                                                            : (entryPoint.includes('alpha') ? "https://pid-alpha.herokuapp.com/#/en/reservations/newReservation/overview/"
                                                                                                            : "https://pid-beta.herokuapp.com/#/en/reservations/newReservation/overview/")
                              , begins_at:     reservation.begins_at
                              , ends_at:       reservation.ends_at
                              }
               }
             , "reservationMutation"
             )
    }
}

export function checkReservation (reservation, callback = ()=>{}) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setCustomModal(undefined))
      if (response.data.paypal_check_validity){
        dispatch(payReservation (reservation.payment_url, callback))
      } else {
        dispatch(setError('Token of payment is no longer valid, reservation will be deleted.'))
        callback()
      }
    }

    const onCSOBSuccess = (response) => {
      dispatch(setCustomModal(undefined))
      dispatch(payReservation(response.data.csob_pay_reservation, callback))
    }

    if (reservation.payment_url.includes('csob.cz')) {
      dispatch(setCustomModal('Creating payment'))
      request(onCSOBSuccess, CREATE_CSOB_PAYMENT, { id: reservation.id, url: window.location.href.split('?')[0] })
    } else {
      dispatch(setCustomModal('Checking token validity'))
      request(onSuccess, CHECK_VALIDITY, { token: parseParameters(url).token })
    }
  }
}

export function payReservation (url, callback = ()=>{}) {
  return (dispatch, getState) => {
    dispatch(setCustomModal('Redirecting ...'))
    if (window.cordova === undefined){ // development purposes - browser debuging
      window.location.replace(url)
    } else { // in mobile open InAppBrowser, when redirected back continue
      let inAppBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no,zoom=no,toolbar=no')
      inAppBrowser.addEventListener('loadstart', (event)=>{
        if (!event.url.includes('paypal') && !event.url.includes('csob.cz') && !event.url.includes('park-it-direct')) { // no paypal in name means redirected back
          inAppBrowser.close()
          const parameters = parseParameters(event.url)
          if (parameters['csob'] === 'true') {
            parameters['success'] === 'true' ? dispatch(paymentSucessfull(callback)) : dispatch(paymentUnsucessfull(callback)) // todo: here
          }else {
            parameters['success'] === 'true' ? dispatch(finishReservation(parameters['token'], callback)) : dispatch(paymentUnsucessfull(callback))
          }
        }
      })
    }
  }
}

export function paymentUnsucessfull(callback){
  return (dispatch, getState) => {
    dispatch(setCustomModal(undefined))
    dispatch(setError('Payment was unsucessfull.'))
    dispatch(clearForm())
    callback()
  }
}
export function paymentSucessfull(callback){
  return (dispatch, getState) => {
    dispatch(setCustomModal(undefined))
    dispatch(clearForm())
    callback()
  }
}

export function finishReservation(token, callback){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(paymentSucessfull(callback))
    }

    dispatch(setCustomModal('Processing payment ...'))
    request( onSuccess
           , PAY_RESREVATION
           , { token: token }
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
