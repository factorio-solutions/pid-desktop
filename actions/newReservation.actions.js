import moment               from 'moment'
import { request }          from '../helpers/request'
import { calculatePrice }   from '../helpers/calculatePrice'
import { t }                from '../modules/localization/localization'
import * as nav             from '../helpers/navigation'
import * as pageBaseActions from './pageBase.actions'

import {
  GET_AVAILABLE_USERS,
  GET_AVAILABLE_GARAGES,
  GET_AVAILABLE_CLIENTS,
  GET_USER,
  GET_GARAGE_DETAILS,
  CREATE_RESERVATION,
  UPDATE_RESERVATION,
  PAY_RESREVATION,
  GET_RESERVATION
} from '../queries/newReservation.queries'

const MIN_RESERVATION_DURATION = 30 // minutes
const MOMENT_DATETIME_FORMAT   = "DD.MM.YYYY HH:mm"

export const NEW_RESERVATION_SET_USER             = 'NEW_RESERVATION_SET_USER'
export const NEW_RESERVATION_SET_AVAILABLE_USERS  = 'NEW_RESERVATION_SET_AVAILABLE_USERS'
export const NEW_RESERVATION_SET_RESERVATION      = 'NEW_RESERVATION_SET_RESERVATION'
export const NEW_RESERVATION_SET_CLIENT_ID        = 'NEW_RESERVATION_SET_CLIENT_ID'
export const NEW_RESERVATION_CAR_ID               = 'NEW_RESERVATION_CAR_ID'
export const NEW_RESERVATION_CAR_LICENCE_PLATE    = 'NEW_RESERVATION_CAR_LICENCE_PLATE'
export const NEW_RESERVATION_SET_GARAGE           = 'NEW_RESERVATION_SET_GARAGE'
export const NEW_RESERVATION_SET_FROM             = 'NEW_RESERVATION_SET_FROM'
export const NEW_RESERVATION_SET_TO               = 'NEW_RESERVATION_SET_TO'
export const NEW_RESERVATION_SET_PLACE_ID         = 'NEW_RESERVATION_SET_PLACE_ID'
export const NEW_RESERVATION_SET_PRICE            = 'NEW_RESERVATION_SET_PRICE'
export const NEW_RESERVATION_SET_DURATION_DATE    = 'NEW_RESERVATION_SET_DURATION_DATE'
export const NEW_RESERVATION_SET_LOADING          = 'NEW_RESERVATION_SET_LOADING'
export const NEW_RESERVATION_SET_HIGHLIGHT        = 'NEW_RESERVATION_SET_HIGHLIGHT'
export const NEW_RESERVATION_SET_ERROR            = 'NEW_RESERVATION_SET_ERROR'
export const NEW_RESERVATION_CLEAR_FORM           = 'NEW_RESERVATION_CLEAR_FORM'



export function setUser (value){
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_USER
             , value
             })
    if (value.availableClients.find(client => client.id === getState().newReservation.client_id) === undefined){ // preselected client no longer available
      dispatch(setClientId(undefined))
    }
  }
}

export function setAvailableUsers(value){
  return { type: NEW_RESERVATION_SET_AVAILABLE_USERS
         , value
         }
}

export function setReservation(value){
  return { type: NEW_RESERVATION_SET_RESERVATION
         , value
         }
}

export function setClientId(value){
  return (dispatch, getState) => {
    dispatch ({ type: NEW_RESERVATION_SET_CLIENT_ID
              , value
              })
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
  }
}

export function setCarId(value){
  return { type: NEW_RESERVATION_CAR_ID
         , value
         }
}

export function setCarLicencePlate(value){
  return { type: NEW_RESERVATION_CAR_LICENCE_PLATE
         , value
         }
}

export function setGarage(value){
  return (dispatch, getState) => {
    dispatch ({ type: NEW_RESERVATION_SET_GARAGE
              , value
              })

    const state = getState().newReservation
    const availableClientsPromise = clientsPromise(state.user && state.user.id, state.garage && state.garage.id)
    availableClientsPromise.then(value => {
      value.reservable_clients.unshift({name: t(['newReservation', 'selectClient']), id: undefined})
      state.user && dispatch(setUser({...state.user, availableClients: value.reservable_clients}))
    }).catch(error => {
      throw(error)
    })
  }
}

export function setFrom(value){
  return (dispatch, getState) => {
    let fromValue = moment(roundTime(value), MOMENT_DATETIME_FORMAT)
    const now = moment(roundTime(moment()), MOMENT_DATETIME_FORMAT)

    if (fromValue.diff(now, 'minutes') < 0){ // cannot create reservations in the past
      fromValue = now
    }

    if (moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      dispatch(setTo(fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes').format(MOMENT_DATETIME_FORMAT)))
    }

    dispatch({ type: NEW_RESERVATION_SET_FROM
             , value: fromValue.format(MOMENT_DATETIME_FORMAT)
             })
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
    dispatch(setPrice())
  }
}

export function setTo(value){
  return (dispatch, getState) => {
    let toValue = moment(roundTime(value), MOMENT_DATETIME_FORMAT)
    let fromValue = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)

    if (toValue.diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.add(MIN_RESERVATION_DURATION, 'minutes')
    }

    dispatch ({ type: NEW_RESERVATION_SET_TO
              , value: toValue.format(MOMENT_DATETIME_FORMAT)
              })
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
    dispatch(setPrice())
  }
}

export function setPlace (place){
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_PLACE_ID
             , value: place ? place.id : undefined
             })

    dispatch(setPrice())
  }
}

export function setPrice(){
  return (dispatch, getState) => {
    const state = getState().newReservation
    const from = moment(state.from, MOMENT_DATETIME_FORMAT)
    const to = moment(state.to, MOMENT_DATETIME_FORMAT)
    const selectedPlace = state.garage && state.garage.floors.reduce((acc, floor)=> {
      return floor.places.reduce((acc, place) => {
        return place.id === state.place_id ? place : acc
      }, acc)
    }, undefined)

    dispatch({ type: NEW_RESERVATION_SET_PRICE
             , value: selectedPlace && selectedPlace.pricing ? `${calculatePrice(selectedPlace.pricing, from ,to)} ${selectedPlace.pricing.currency.symbol}` : undefined
             })
  }
}

export function setDurationDate(value){
  return { type: NEW_RESERVATION_SET_DURATION_DATE
         , value
         }
}

export function setLoading(value){
  return { type: NEW_RESERVATION_SET_LOADING
         , value
         }
}

export function setHighlight(value){
  return { type: NEW_RESERVATION_SET_HIGHLIGHT
         , value
         }
}

export function setError(value){
  return { type: NEW_RESERVATION_SET_ERROR
         , value
         }
}

export function clearForm(value){
  return { type: NEW_RESERVATION_CLEAR_FORM
         , value
         }
}



export function toggleHighlight (){
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newReservation.highlight))
  }
}

export function beginsToNow (){
    return (dispatch, getState) => {
      dispatch(setFrom( roundTime(moment()) ))
    }
}

export function durationChange(value){
  return (dispatch, getState) => {
    dispatch(setTo(moment(getState().newReservation.from, 'DD.MM.YYYY HH:mm').add(value, 'hours').format('DD.MM.YYYY HH:mm')))
  }
}

export function roundTime(time){
  return moment(time, MOMENT_DATETIME_FORMAT).set('minute', Math.floor(moment(time, MOMENT_DATETIME_FORMAT).minutes()/15)*15).format(MOMENT_DATETIME_FORMAT)
}


export function setInitialStore(id) {
  return (dispatch, getState) => {
    dispatch(setLoading(true))
    dispatch(setFrom(moment().format(MOMENT_DATETIME_FORMAT)))
    dispatch(setTo(moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT).add(MIN_RESERVATION_DURATION, 'minutes').format(MOMENT_DATETIME_FORMAT)))


    const availableUsersPromise = new Promise((resolve, reject)=> {
      const onSuccess = (response) => {
        if (response.data !== undefined){
          resolve(response.data)
        } else{
          reject('Response has no data - available users')
        }
      }

      request( onSuccess, GET_AVAILABLE_USERS )
    })

    const editReservationPromise = new Promise((resolve, reject)=> {
      if (id){
        const onSuccess = (response) => {
          if (response.hasOwnProperty('data')){
            resolve(response.data)
          } else{
            reject('Response has no data - editReservation')
          }
        }

        request( onSuccess, GET_RESERVATION, {id: +id} )
      } else {
        resolve(undefined)
      }
    })

    Promise.all([availableUsersPromise, editReservationPromise]).then( (values) => { // resolve
      const users = values[0].reservable_users
      dispatch(setAvailableUsers(users))
      dispatch(setLoading(false))

      if (values[1] !== undefined) { // if reservation edit set details
        values[1].reservation.ongoing = moment(values[1].reservation.begins_at).isBefore(moment()) // editing ongoing reservation
        dispatch(setReservation(values[1].reservation))
        dispatch(downloadUser(values[1].reservation.user_id))
        dispatch(setClientId(values[1].reservation.client_id))
        values[1].reservation.car.temporary ? dispatch(setCarLicencePlate(values[1].reservation.car.licence_plate)) : dispatch(setCarId(values[1].reservation.car.id))
        dispatch(setFrom(moment(values[1].reservation.begins_at).format(MOMENT_DATETIME_FORMAT)))
        dispatch(setTo(moment(values[1].reservation.ends_at).format(MOMENT_DATETIME_FORMAT)))
        dispatch(setPlace(values[1].reservation.place))
      } else {
        dispatch(setReservation(undefined))
        if (users.length === 1){
          dispatch(downloadUser(users[0].id))
        }
      }
    }).catch( (error) => { // error
      dispatch(setLoading(false))
      throw(error)
    })
  }
}

export function downloadUser(id){
  return (dispatch, getState) => {
    const state = getState().newReservation
    dispatch(setLoading(true))
    dispatch(setGarage(undefined)) // have to reset values set from previous user
    dispatch(setClientId(undefined))
    dispatch(setCarId(undefined))

    const userPromise = new Promise((resolve, reject)=> {
      const onSuccess = (response) => {
        if (response.data !== undefined){
          resolve(response.data)
        } else{
          reject('Response has no data - available users')
        }
      }

      request( onSuccess, GET_USER, {id: id} )
    })

    const availableGaragesPromise = new Promise((resolve, reject)=> {
      const onSuccess = (response) => {
        if (response.data !== undefined){
          resolve(response.data)
        } else{
          reject('Response has no data - available users')
        }
      }

      request( onSuccess, GET_AVAILABLE_GARAGES, {user_id: id})
    })

    const availableClientsPromise = clientsPromise(id, state.garage && state.garage.id)

    Promise.all([userPromise, availableGaragesPromise, availableClientsPromise]).then(values => {
      values[2].reservable_clients.unshift({name: t(['newReservation', 'selectClient']), id: undefined})
      dispatch(setUser({ ...values[0].user
                       , availableGarages: values[1].reservable_garages
                       , availableClients: values[2].reservable_clients
                       }))
      if (getState().newReservation.reservation){ // download garage
        dispatch(downloadGarage(getState().newReservation.reservation.place.floor.garage.id))
      }
      if (values[1].reservable_garages.length === 1) { // if only one garage, download the garage
        dispatch(downloadGarage(values[1].reservable_garages[0].id))
      }
      if (values[0].user.reservable_cars.length === 1) { // if only one car available
        dispatch(setCarId(values[0].user.reservable_cars[0].id))
      }

      dispatch(setLoading(false))
    }).catch(error => {
      dispatch(setLoading(false))
      throw(error)
    })
  }
}

function clientsPromise (user_id, garage_id) {
  return new Promise((resolve, reject)=> {
    const onSuccess = (response) => {
      if (response.data !== undefined){
        resolve(response.data)
      } else{
        reject('Response has no data - available users')
      }
    }

    request( onSuccess, GET_AVAILABLE_CLIENTS, { user_id, garage_id } )
  })
}

export function downloadGarage (id) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    new Promise((resolve, reject)=> {
      const onSuccess = (response) => {
        if (response.data !== undefined){
          resolve(response.data)
        } else{
          reject('Response has no data - available users')
        }
      }

      request( onSuccess
        , GET_GARAGE_DETAILS
        , { id:             id || state.garage.id
          , user_id:        state.user.id
          , client_id:      state.client_id
          , begins_at:      state.from
          , ends_at:        state.to
          , reservation_id: state.reservation ? state.reservation.id : null
        }
      )
    }).then(value => {
      value.garage.floors.forEach((floor)=>{
        floor.places.map((place) => {
          if (state.reservation && state.reservation.ongoing){ // if ongoing reservation - only selected place might be available
            place.available = floor.free_places.find(p=>p.id === place.id && p.id === state.reservation.place.id) !== undefined // set avilability
          } else {
            place.available = floor.free_places.find(p=>p.id === place.id) !== undefined // set avilability
          }

          if (place.available && place.pricing) { // add tooltip to available places
            const pricing = place.pricing
            const symbol = pricing.currency.symbol
            place.tooltip = <div>
                              <div>
                                {pricing.flat_price ? <span><b>{t(['newPricing','flatPrice'])}:</b> {pricing.flat_price} {symbol}</span>
                                                    : <span><b>{t(['newPricing','exponentialPrice'])}:</b>{pricing.exponential_12h_price} - {pricing.exponential_day_price} - {pricing.exponential_week_price} - {pricing.exponential_month_price} {symbol}</span>}
                              </div>
                              {pricing.weekend_price && <div>
                                <span>
                                  <b>{t(['newPricing','weekendPrice'])}:</b> {pricing.weekend_price} {symbol}
                                </span>
                              </div>}
                            </div>
          }

          return place
        })
      })
      dispatch(setGarage(value.garage))
      dispatch(autoSelectPlace())
    })
  }
}

export function autoSelectPlace() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    if (!(state.place_id && state.garage.floors.find(floor => {
      return floor.places.find(place => place.available && place.id === state.place_id) !== undefined
    }) !== undefined)) { // if place not selected or selected place not found in this garage
      const selectedPlace = state.garage.floors.reduce((highestPriorityPlace, floor)=>{
        return floor.places.reduce((highestPriorityPlace, place) => {
          if (place.available && (highestPriorityPlace === undefined || highestPriorityPlace.priority < place.priority)){
            return place
          } else {
            return highestPriorityPlace
          }
        }, highestPriorityPlace)
      }, undefined)

      dispatch(setPlace(selectedPlace))
    }
  }
}


// Reservation overview ///////////////////////////////////////////////////////
export function overviewInit () {
  return (dispatch, getState) => {
    const state = getState().newReservation
    if (state.user == undefined || state.place_id == undefined || state.from == '' || state.to == ''){
      nav.to('/reservations/newReservation')
    }
  }
}

export function submitReservation (id) {
  return (dispatch, getState) => {
      const state = getState().newReservation
      const ongoing = state.reservation && state.reservation.ongoing

      const onSuccess = (response) => {
        if (response.data.create_reservation && response.data.create_reservation.payment_url){
          dispatch(pageBaseActions.setCustomModal(<div>{t(['newReservation', 'redirecting'])}</div>))
          window.location.replace(response.data.create_reservation.payment_url)
        } else {
          dispatch(pageBaseActions.setCustomModal(undefined))
          nav.to('/reservations')
          dispatch(clearForm())
        }
      }

      dispatch(pageBaseActions.setCustomModal(<div>{t(['newReservation', id?'updatingReservation':'creatingReservation'])}</div>))

      request( onSuccess
             , id ? UPDATE_RESERVATION : CREATE_RESERVATION
             , { reservation: { user_id:       ongoing ? undefined : state.user.id
                              , place_id:      ongoing ? undefined : state.place_id
                              , client_id:     ongoing ? undefined : state.client_id
                              , car_id:        ongoing ? undefined : state.car_id
                              , licence_plate: ongoing ? undefined : state.carLicencePlate == '' ? undefined : state.carLicencePlate
                              , url:           ongoing ? undefined : window.location.href.split('?')[0]
                              , begins_at:     ongoing ? undefined : state.from
                              , ends_at:       state.to
                              }
               , id: id
               }
             , "reservationMutation"
             )
  }
}

export function paymentUnsucessfull(){
  return (dispatch, getState) => {
    dispatch(pageBaseActions.setError(t(['newReservation', 'paymentUnsucessfull'])))
    nav.to('/reservations')
  }
}

export function paymentSucessfull(){
  return (dispatch, getState) => {
    nav.to('/reservations')
    dispatch(pageBaseActions.setCustomModal(undefined))
    dispatch(clearForm())
  }
}

export function payReservation (token){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(paymentSucessfull())
    }

    dispatch(pageBaseActions.setCustomModal(<div>{t(['newReservation', 'payingReservation'])}</div>))
    request( onSuccess
           , PAY_RESREVATION
           , { token: token }
           )
  }
}
