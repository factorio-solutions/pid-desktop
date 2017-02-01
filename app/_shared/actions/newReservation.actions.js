import moment      from 'moment'
import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'
import * as nav    from '../helpers/navigation'

import { GET_AVAILABLE_USERS, GET_AVAILABLE_GARAGES, GET_AVAILABLE_FLOORS, GET_AVAILABLE_PLACES, CREATE_RESERVATION } from '../queries/newReservation.queries'

export const SET_USER               = 'SET_USER'
export const SET_AVAILABLE_USERS    = 'SET_AVAILABLE_USERS'
export const SET_FROM               = 'SET_FROM'
export const SET_TO                 = 'SET_TO'
export const SET_CLIENT             = 'SET_CLIENT'
export const SET_AVAILABLE_CLIENTS  = 'SET_AVAILABLE_CLIENTS'
export const SET_PLACE              = 'SET_PLACE'
export const SET_AVAILABLE_PLACES   = 'SET_AVAILABLE_PLACES'
export const SET_FLOOR              = 'SET_FLOOR'
export const SET_AVAILABLE_FLOORS   = 'SET_AVAILABLE_FLOORS'
export const SET_GARAGE             = 'SET_GARAGE'
export const SET_AVAILABLE_GARAGES  = 'SET_AVAILABLE_GARAGES'
export const SET_DURATIONDATE       = 'SET_DURATIONDATE'
export const SET_AUTOSELECT         = 'SET_AUTOSELECT'
export const SET_ERROR              = 'SET_ERROR'
export const CLEAR_RESERVATION_FORM = 'CLEAR_RESERVATION_FORM'


const MIN_RESERVATION_DURATION = 30 // minutes


export function setUser (user){
  return (dispatch, getState) => {
    dispatch({ type: SET_USER
             , value: user
             })
    dispatch( setPlace(-1) )
    dispatch( setClient(-1) )
    dispatch( getAvalilableFloors() )
  }
}

export function setAvailableUsers (users){
  return  { type: SET_AVAILABLE_USERS
          , value: users
          }
}


export function setFrom (fromDate){
  return (dispatch, getState) => {
    dispatch({ type: SET_FROM
            , value: fromDate
            })

    const state = getState().newReservation
    if (dateDifference(fromDate, state.to) < MIN_RESERVATION_DURATION){
      dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(30, 'minutes').format('DD.MM.YYYY HH:mm')))
    }

    dispatch(getAvalilableFloors())
  }
}

export function setTo (toDate){
  return (dispatch, getState) => {
    const state = getState().newReservation
    if (dateDifference(state.from, toDate) < MIN_RESERVATION_DURATION){
      dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(30, 'minutes').format('DD.MM.YYYY HH:mm')))
    } else {
      dispatch({ type: SET_TO
              , value: toDate
              })
    }

    dispatch(getAvalilableFloors())
  }
}

export function setClient (client){
  return  { type: SET_CLIENT
          , value: client
          }
}
export function setAvailableClients (clients){
  return  { type: SET_AVAILABLE_CLIENTS
          , value: clients
          }
}

export function setPlace (place){
  return  { type: SET_PLACE
          , value: place
          }
}

export function setAvailablePlaces (places){
  return  { type: SET_AVAILABLE_PLACES
          , value: places
          }
}

export function setFloor (floor){
  return { type: SET_FLOOR
         , value: floor
         }
}

export function setAvailableFloors (floors){
  return  { type: SET_AVAILABLE_FLOORS
          , value: floors
          }
}

export function setGarage (garage){
  return  { type: SET_GARAGE
          , value: garage
          }
}

export function setAvailableGarages (garages){
  return  { type: SET_AVAILABLE_GARAGES
          , value: garages
          }
}

export function setDruationDate (value){
  return  { type: SET_DURATIONDATE
          , value: value
          }
}

export function setAutoselect (value){
  return  { type: SET_AUTOSELECT
          , value: value
          }
}

export function setError (value){
  return  { type: SET_ERROR
          , value: value
          }
}

export function clearForm (){
  return  { type: CLEAR_RESERVATION_FORM }
}


export function handleGarageChange(index) {
    return (dispatch, getState) => {
      dispatch( setFloor(-1) )
      dispatch( setPlace(-1) )
      dispatch( setClient(-1) )
      dispatch( setGarage(getState().newReservation.availableGarages[index].id) )
      dispatch( getAvalilableFloors() )
    }
}

export function handleFloorChange(index) {
  return (dispatch, getState) => {
    dispatch(changeFloor(index))
  }
}

export function setInitialStore() {
  return (dispatch, getState) => {
    dispatch( clearForm() ) // TODO: For now always beign with fresh form

    const state = getState().newReservation
    if (state.garage_id == -1) { // Form opened for the first time
      const now = moment()
      dispatch(setFrom(moment(now).format('DD.MM.YYYY HH:mm')))
      dispatch(setTo(moment(now.add(MIN_RESERVATION_DURATION, 'minutes')).format('DD.MM.YYYY HH:mm')))

      dispatch( getAvailableUsers() )
      dispatch( getAvailableGarages() )

      // TODO: set selected user if editing
      // TODO: if editing set selected garage, set selected floor, set place
      // TODO: if editing set selected begins and ends

      // TODO: set creator to currently ged in user
      // TODO: set accout id ??? dont know how
    }
  }
}

export function durationChange (duration){
  return (dispatch, getState) => {
    var state = getState().newReservation
    dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(duration, 'hours').format('DD.MM.YYYY HH:mm')))
  }
}
export function setTimeToNow () {
  return setFrom(moment(moment()).format('DD.MM.YYYY HH:mm'))
}

export function autoSelectPlace () {
  return (dispatch, getState) => {

    dispatch(setPlace(availablePlaces(getState().newReservation)[0].id))
    dispatch(setClient(availablePlaces(getState().newReservation)[0].client_places[0].client_id) )
    dispatch(setAutoselect(true))
  }
}

export function changeFloor (index) {
  return (dispatch, getState) => {
    dispatch(setFloor(getState().newReservation.availableFloors[index].id))
  }
}

export function changePlace (place) {
  return (dispatch, getState) => {
    dispatch(setPlace(place.id))
    dispatch(setClient( place.client_places[0].client_id ) )
    dispatch(setAutoselect(false))
  }
}

function getAvailableUsers () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setAvailableUsers(response.data.reservable_users) )
      if (response.data.reservable_users.length == 1){
        dispatch(setUser(response.data.reservable_users[0].id))
      }
    }
    request(onSuccess, GET_AVAILABLE_USERS)
  }
}

function getAvailableGarages() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      // switch (response.data.reservable_garages.length) {
      //   case 0:
      //     dispatch( setError( t(['newReservation', 'noAvailableGarages']) ) )
      //     break
      //   case 1:
      //     handleGarageChange(0)
      //     break
      //   default:
      //     dispatch( setAvailableGarages(response.data.reservable_garages) )
      //     dispatch( setGarage(response.data.reservable_garages[0].id) )
      //     dispatch( getAvalilableFloors() )
      // }
      if (response.data.reservable_garages.length == 0){
        dispatch( setError( t(['newReservation', 'noAvailableGarages']) ) )
      } else {
        dispatch( setAvailableGarages(response.data.reservable_garages) )
        dispatch( handleGarageChange(0) )
        // dispatch( setGarage(response.data.reservable_garages[0].id) )
        // dispatch( getAvalilableFloors() )
      }
    }
    request(onSuccess, GET_AVAILABLE_GARAGES, {user_id: getState().newReservation.user_id})
  }
}

function getAvalilableFloors() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setAvailableFloors(response.data.garage.floors) )
      const state = getState().newReservation

      if (state.place_id == -1 || [].concat.apply([], state.availableFloors.map(function(floor){return floor.free_places})).findIndex((place)=>{return place.id == state.place_id}) == -1){
        dispatch( setFloor(response.data.garage.floors[0].id) )
        const freePlaces = availablePlaces(getState().newReservation)
        dispatch( setPlace( freePlaces.length==0 ? -1 : freePlaces[0].id ) )
        dispatch( setClient(freePlaces.length==0 ? -1 : freePlaces[0].client_places[0].client_id) )
        dispatch( setAutoselect(true) )
      }
      // if no available places, change floor (if such floor exists)
      if (getState().newReservation.availableFloors.find(function (floor){return floor.id == getState().newReservation.floor_id}).free_places.length == 0){
        const floorWithFreePlaces = getState().newReservation.availableFloors.find(function(floor){return floor.free_places.length>0})
        floorWithFreePlaces && dispatch( setFloor(floorWithFreePlaces.id) )
      }
    }
    const state = getState().newReservation
    if (state.garage_id > 0) request(onSuccess, GET_AVAILABLE_FLOORS, {id: state.garage_id, begins_at: state.from, ends_at: state.to, user_id: state.user_id })
  }
}


function dateDifference (from, to) {
  return moment.duration(moment(to, 'DD.MM.YYYY HH:mm').diff(moment(from, 'DD.MM.YYYY HH:mm'))).asMinutes()
}

export function submitForm () {
  return (dispatch, getState) => {
      const state = getState().newReservation

      const onSuccess = (response) => {
        nav.to('/reservations')
        dispatch(clearForm())
      }

      request( onSuccess
             , CREATE_RESERVATION
             , { reservation: { client_id: state.client_id
                              , user_id:    state.user_id
                              , place_id:   state.place_id
                              , begins_at:  state.from
                              , ends_at:    state.to
                              }}
             , "reservationMutation"
             )

  }
}


function availablePlaces(state){
  return state.availableFloors[state.availableFloors.findIndex((floor)=>{return floor.id == state.floor_id})].free_places
}
