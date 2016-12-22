import moment      from 'moment'
import { request } from '../helpers/request'

import { GET_AVAILABLE_FLOORS } from '../queries/mobile.newReservation.queries'
import { CREATE_RESERVATION }   from '../queries/newReservation.queries'
import { AVAILABLE_DURATIONS }  from '../../reservations/newReservation.page'

export const MOBILE_NEW_RESERVATION_SET_FROM             = 'MOBILE_NEW_RESERVATION_SET_FROM'
export const MOBILE_NEW_RESERVATION_SET_TO               = 'MOBILE_NEW_RESERVATION_SET_TO'
export const MOBILE_NEW_RESERVATION_SET_FROM_NOW         = 'MOBILE_NEW_RESERVATION_SET_FROM_NOW'
export const MOBILE_NEW_RESERVATION_SET_DURATION         = 'MOBILE_NEW_RESERVATION_SET_DURATION'
export const MOBILE_NEW_RESERVATION_SET_PLACE_ID         = 'MOBILE_NEW_RESERVATION_SET_PLACE_ID'
export const MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS = 'MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS'
export const MOBILE_NEW_RESERVATION_SET_AUTOSELECT       = 'MOBILE_NEW_RESERVATION_SET_AUTOSELECT'
export const MOBILE_NEW_RESERVATION_CLEAR_FORM           = 'MOBILE_NEW_RESERVATION_CLEAR_FORM'


export function setFrom (from){ // if time changed,
  return (dispatch, getState) => {
    if (getState().mobileNewReservation.from != from) {
      dispatch({ type: MOBILE_NEW_RESERVATION_SET_FROM
               , value: from
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
               , value: to
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


export function initReservation (){
    return (dispatch, getState) => {
      // if (getState().mobileNewReservation.availableFloors == undefined){
        dispatch(pickPlaces())
      // }
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
      request(onSuccess, GET_AVAILABLE_FLOORS, { id: variables.garage_id, begins_at: variables.begins_at, ends_at: variables.ends_at })
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
      const freePlaces = [].concat.apply([], getState().mobileNewReservation.availableFloors.map(function(floor){return floor.free_places}))
      dispatch(setPlace(freePlaces.length == 0 ? undefined : freePlaces[0].id))
      dispatch(setAutoselect(true))
    }
}

export function submitReservation(callback){
    return (dispatch, getState) => {
      const onSuccess = (response) => {
        callback()
        dispatch(clearForm())
      }

      var reservation = stateToVariables(getState)
      delete reservation["garage_id"]

      request( onSuccess, CREATE_RESERVATION, {reservation: reservation}, "reservationMutation")
    }
}

export function fromBeforeTo(from, to){
  return (moment(to).diff(moment(from)) > 0)
}


function stateToVariables(getState){
  const state = getState().mobileNewReservation

  const from = state.fromNow ? moment(moment()).format('YYYY-MM-DD HH:mm') : state.from.replace("T", " ")
  const to = state.duration ? moment(moment(from).add(state.duration, 'hours')).format('YYYY-MM-DD HH:mm') : state.to.replace("T", " ")
  const garage_id = getState().mobileHeader.garage_id

  return ({ place_id:  state.place_id
          , garage_id: garage_id
          , begins_at: from
          , ends_at:   to
          })
}
