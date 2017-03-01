import moment      from 'moment'
import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'
import * as nav    from '../helpers/navigation'

<<<<<<< HEAD
import { GET_AVAILABLE_USERS, GET_AVAILABLE_GARAGES, GET_AVAILABLE_FLOORS, GET_AVAILABLE_PLACES, CREATE_RESERVATION } from '../queries/newReservation.queries'

export const SET_USER               = 'SET_USER'
export const SET_AVAILABLE_USERS    = 'SET_AVAILABLE_USERS'
export const SET_FROM               = 'SET_FROM'
export const SET_TO                 = 'SET_TO'
export const SET_ACCOUNT            = 'SET_ACCOUNT'
export const SET_AVAILABLE_ACCOUNTS = 'SET_AVAILABLE_ACCOUNTS'
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
    dispatch( setAccount(-1) )
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

export function setAccount (account){
  return  { type: SET_ACCOUNT
          , value: account
          }
}
export function setAvailableAccounts (accounts){
  return  { type: SET_AVAILABLE_ACCOUNTS
          , value: accounts
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
      dispatch( setAccount(-1) )
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
=======
import {
  GET_AVAILABLE_USERS,
  GET_AVAILABLE_GARAGES,
  GET_AVAILABLE_CLIENTS,
  GET_AVAILABLE_CARS,
  GET_GARAGE_DETAILS,
  CREATE_RESERVATION,
  GET_BRAINTREE_TOKEN
} from '../queries/newReservation.queries'

const MIN_RESERVATION_DURATION = 30 // minutes
const MOMENT_DATETIME_FORMAT = "DD.MM.YYYY HH:mm"

export const NEW_RESERVATION_SET_USER_ID            = "NEW_RESERVATION_SET_USER_ID"
export const NEW_RESERVATION_SET_AVAILABLE_USERS    = "NEW_RESERVATION_SET_AVAILABLE_USERS"
export const NEW_RESERVATION_SET_CLIENT_ID          = "NEW_RESERVATION_SET_CLIENT_ID"
export const NEW_RESERVATION_SET_AVAILABLE_CLIENTS  = "NEW_RESERVATION_SET_AVAILABLE_CLIENTS"
export const NEW_RESERVATION_AVAILABLE_CARS         = "NEW_RESERVATION_AVAILABLE_CARS"
export const NEW_RESERVATION_CAR_ID                 = "NEW_RESERVATION_CAR_ID"
export const NEW_RESERVATION_CAR_LICENCE_PLATE      = "NEW_RESERVATION_CAR_LICENCE_PLATE"
export const NEW_RESERVATION_SET_GARAGE_INDEX       = "NEW_RESERVATION_SET_GARAGE_INDEX"
export const NEW_RESERVATION_SET_AVAILABLE_GARAGES  = "NEW_RESERVATION_SET_AVAILABLE_GARAGES"
export const NEW_RESERVATION_SET_GARAGE             = "NEW_RESERVATION_SET_GARAGE"
export const NEW_RESERVATION_SET_FROM               = "NEW_RESERVATION_SET_FROM"
export const NEW_RESERVATION_SET_TO                 = "NEW_RESERVATION_SET_TO"
export const NEW_RESERVATION_SET_PLACE_ID           = "NEW_RESERVATION_SET_PLACE_ID"
export const NEW_RESERVATION_SET_DURATION_DATE      = "NEW_RESERVATION_SET_DURATION_DATE"
export const NEW_RESERVATION_SET_ERROR              = "NEW_RESERVATION_SET_ERROR"
export const NEW_RESERVATION_SET_PRICE              = "NEW_RESERVATION_SET_PRICE"
export const NEW_RESERVATION_SET_BRAINTREE_TOKEN    = "NEW_RESERVATION_SET_BRAINTREE_TOKEN"
export const NEW_RESERVATION_CLEAR_FORM             = "NEW_RESERVATION_CLEAR_FORM"


export function setUserId (value){
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_USER_ID
             , value
             })

    dispatch(getAvailableGarages()) // reload garages
    dispatch(setGarageIndex(undefined))
    dispatch(setGarage(undefined))
    dispatch(getAvailableClients()) // reload clients
    dispatch(setClientId(undefined))
    dispatch(getAvailableCars()) // reload car informations
    dispatch(setCarId(undefined))
  }
}

export function setAvailableUsers (value){
  return { type: NEW_RESERVATION_SET_AVAILABLE_USERS
         , value
         }
}

export function setClientId (value){
  return (dispatch, getState) => {
    dispatch ({ type: NEW_RESERVATION_SET_CLIENT_ID
              , value
              })

    dispatch(getGarageDetails())
  }
}

export function setAvailableClients (value){
  value.unshift({name: t(['newReservation', 'selectClient']), id: undefined})
  return { type: NEW_RESERVATION_SET_AVAILABLE_CLIENTS
         , value
         }
}

export function setAvailableCars (value){
  return { type: NEW_RESERVATION_AVAILABLE_CARS
         , value
         }
}

export function setCarId (value){
  return { type: NEW_RESERVATION_CAR_ID
         , value
         }
}

export function setCarLicencePlate (value){
  return { type: NEW_RESERVATION_CAR_LICENCE_PLATE
         , value
         }
}


export function setGarageIndex (value){
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_GARAGE_INDEX
             , value
             })

    dispatch(getAvailableClients())
    dispatch(getGarageDetails())
  }
}

export function setAvailableGarages (value){
  return { type: NEW_RESERVATION_SET_AVAILABLE_GARAGES
         , value
         }
}

export function setGarage (value){
  return { type: NEW_RESERVATION_SET_GARAGE
         , value
         }
}

export function setFrom (value){
  return (dispatch, getState) => {
    moment(value, MOMENT_DATETIME_FORMAT).isBefore(moment()) ? dispatch(beginsToNow())
                                                             : dispatch({ type: NEW_RESERVATION_SET_FROM
                                                                        , value: roundTime(value).format(MOMENT_DATETIME_FORMAT)
                                                                        })

    dispatch(checkMinDuration())
  }
}

export function setTo (value){
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_TO
             , value: roundTime(value).format(MOMENT_DATETIME_FORMAT)
             })

    dispatch(checkMinDuration())
  }
}

export function setPlace (place){
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_PLACE_ID
             , value: place ? place.id : undefined
             })

    place && place.pricings[0] ? dispatch(setPrice(place.pricings[0])) : dispatch(setPriceValue(undefined))
  }
}

export function setDurationDate (value){
  return { type: NEW_RESERVATION_SET_DURATION_DATE
         , value
         }
}

export function setPrice (price){
  return (dispatch, getState) => {
    const state = getState().newReservation
    const duration = dispatch(getDuration()) / 60 // in hours

    const from = moment(state.from, MOMENT_DATETIME_FORMAT).unix()
    const to = moment(state.to, MOMENT_DATETIME_FORMAT).unix()

    let times = [from]
    while (times[times.length-1] + 900 < to) { // 900 is 15 mins
      times = times.concat(times[times.length-1] + 900)
    }
    times = times.concat(to)
    times.shift()

    // console.log(price);
    let ammount = times.reduce((sum, timestamp) => {
      const date = moment(timestamp*1000)
      switch (true) {
        case price.weekend_price !== null && (date.isoWeekday() == 6 || date.isoWeekday() == 7):
          // console.log('weekend price detected');
          sum += price.weekend_price*0.25
          break
        case price.flat_price !== null:
          // console.log('flat price detected');
          sum += price.flat_price*0.25
          break
        case price.exponential_12h_price !== null && duration<12:
          // console.log('12h price detected');
          sum += price.exponential_12h_price*0.25
          break
        case price.exponential_day_price !== null && duration<24:
          // console.log('day price detected');
          sum += price.exponential_day_price*0.25
          break
        case price.exponential_week_price !== null && duration<168:
          // console.log('week price detected');
          sum += price.exponential_week_price*0.25
          break
        case price.exponential_month_price !== null:
          // console.log('month price detected');
          sum += price.exponential_month_price*0.25
          break
      }
      return sum
    }, 0)

    dispatch(setPriceValue(`${Math.round(ammount * 100) / 100} ${price.currency.symbol}`))
  }
}

export function setPriceValue (value){
  return { type: NEW_RESERVATION_SET_PRICE
         , value
         }
}

export function setError (value){
  return { type: NEW_RESERVATION_SET_ERROR
         , value
         }
}

export function setBraintreeToken (value){
  return { type: NEW_RESERVATION_SET_BRAINTREE_TOKEN
         , value
         }
}

export function clearForm (){
  return { type: NEW_RESERVATION_CLEAR_FORM }
}

export function durationChange(value){
  return (dispatch, getState) => {
    const state = getState().newReservation
    dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(value, 'hours').format('DD.MM.YYYY HH:mm')))
  }
}

export function beginsToNow (){
    return (dispatch, getState) => {
      dispatch(setFrom( roundTime(moment()).format(MOMENT_DATETIME_FORMAT) ))
    }
}

export function roundTime(time){
  return moment(time, MOMENT_DATETIME_FORMAT).set('minute', Math.ceil(moment(time, MOMENT_DATETIME_FORMAT).minutes()/15)*15) //.format(MOMENT_DATETIME_FORMAT)
}

export function checkMinDuration(){
  return (dispatch, getState) => {
    const state = getState().newReservation
    const diff = dispatch(getDuration())

    if (diff < MIN_RESERVATION_DURATION){
      dispatch(setTo(moment(state.from, MOMENT_DATETIME_FORMAT).add(MIN_RESERVATION_DURATION, 'minutes').format(MOMENT_DATETIME_FORMAT)))
    } else { // if min duration is OK, then get garage details
      dispatch(getGarageDetails())
>>>>>>> feature/new_api
    }
  }
}

<<<<<<< HEAD
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
    dispatch(setAccount(availablePlaces(getState().newReservation)[0].account_places[0].account_id) )
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
    dispatch(setAccount( place.account_places[0].account_id ) )
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
        dispatch( setAccount(freePlaces.length==0 ? -1 : freePlaces[0].account_places[0].account_id) )
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
=======
export function getDuration(){ // in minutes
    return (dispatch, getState) => {
      const { from, to } = getState().newReservation
      return moment.duration(moment(to, MOMENT_DATETIME_FORMAT).diff(moment(from, MOMENT_DATETIME_FORMAT))).asMinutes()
    }
}

export function autoSelectPlace (){
  return (dispatch, getState) => {
    const state = getState().newReservation
    const firstAvailablePlace = state.garage.floors.reduce((obj, floor)=>{
      if (obj == undefined) obj = floor.places.find((place) => {return place.available})
      return obj
    }, undefined)

    dispatch(setPlace(firstAvailablePlace))
  }
}


export function setInitialStore() {
  return (dispatch, getState) => {
    dispatch(getAvailableUsers())
    dispatch(getAvailableGarages())
    dispatch(getAvailableClients())
    dispatch(getAvailableCars())
  }
}

export function getAvailableUsers () {
  return (dispatch, getState) => {
    const onUsers = (response) => {
      dispatch(setAvailableUsers(response.data.reservable_users))
      if (response.data.reservable_users.length==1) dispatch(setUserId(response.data.reservable_users[0].id))
    }

    request(onUsers, GET_AVAILABLE_USERS)
  }
}

export function getAvailableGarages () {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const onGarages = (response) => {
      dispatch(setAvailableGarages(response.data.reservable_garages))
      if (response.data.reservable_garages.length==1) dispatch(setGarageIndex(0))
    }

    request(onGarages, GET_AVAILABLE_GARAGES, {user_id: state.user_id})
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
           , { user_id:   state.user_id
             , garage_id: state.availableGarages[state.garageIndex] && state.availableGarages[state.garageIndex].id
             }
           )
  }
}

export function getAvailableCars () {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const onCars = (response) => {
      dispatch(setAvailableCars(response.data.reservable_cars))
      response.data.reservable_cars.length==1 ? dispatch(setCarId(response.data.reservable_cars[0].id))
                                              : dispatch(setCarId(undefined))
    }

    request(onCars, GET_AVAILABLE_CARS, {user_id: state.user_id})
  }
}

export function getGarageDetails(){
  return (dispatch, getState) => {
    const state = getState().newReservation
    const onSuccess = (response) => {
      response.data.garage.floors.forEach((floor)=>{
        floor.places.map((place) => {
          place.available = floor.free_places.find(p=>p.id==place.id)!=undefined
          if (place.available && place.pricings[0]) { // add tooltip to available places
            const pricing = place.pricings[0]
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
      dispatch(setGarage(response.data.garage))
      dispatch(autoSelectPlace())
    }

    if (state.availableGarages[state.garageIndex]){
      request( onSuccess
             , GET_GARAGE_DETAILS
             , { id:        state.availableGarages[state.garageIndex].id
               , user_id:   state.user_id
               , client_id: state.client_id
               , begins_at: state.from
               , ends_at:   state.to
               }
             )
    }
>>>>>>> feature/new_api
  }
}


<<<<<<< HEAD
function dateDifference (from, to) {
  return moment.duration(moment(to, 'DD.MM.YYYY HH:mm').diff(moment(from, 'DD.MM.YYYY HH:mm'))).asMinutes()
}

export function submitForm () {
=======
// Reservation overview ///////////////////////////////////////////////////////
export function overviewInit () {
  return (dispatch, getState) => {
    const state = getState().newReservation
    if (state.user_id != undefined && state.place_id != undefined && state.from != '' && state.to != ''){
      const onSuccess = (response) => {
        dispatch(setBraintreeToken(response.data.current_user.braintree_token))
      }

      request( onSuccess, GET_BRAINTREE_TOKEN )
    } else {
      nav.to('/reservations/newReservation')
    }
  }
}

export function submitReservation (payload) {
>>>>>>> feature/new_api
  return (dispatch, getState) => {
      const state = getState().newReservation

      const onSuccess = (response) => {
        nav.to('/reservations')
        dispatch(clearForm())
      }

      request( onSuccess
             , CREATE_RESERVATION
<<<<<<< HEAD
             , { reservation: { account_id: state.account_id
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
=======
             , { user_id: state.user_id
               , place_id: state.place_id
               , reservation: { client_id:     state.client_id
                              , car_id:        state.car_id
                              , licence_plate: state.carLicencePlate == '' ? undefined : state.carLicencePlate
                              , nonce:         payload && payload.nonce
                              , begins_at:     state.from
                              , ends_at:       state.to
                              }
               }
             , "reservationMutation"
             )
  }
}

// export const SET_USER               = 'SET_USER'
// export const SET_AVAILABLE_USERS    = 'SET_AVAILABLE_USERS'
// export const SET_FROM               = 'SET_FROM'
// export const SET_TO                 = 'SET_TO'
// export const SET_CLIENT             = 'SET_CLIENT'
// export const SET_AVAILABLE_CLIENTS  = 'SET_AVAILABLE_CLIENTS'
// export const SET_PLACE              = 'SET_PLACE'
// export const SET_AVAILABLE_PLACES   = 'SET_AVAILABLE_PLACES'
// export const SET_FLOOR              = 'SET_FLOOR'
// export const SET_AVAILABLE_FLOORS   = 'SET_AVAILABLE_FLOORS'
// export const SET_GARAGE             = 'SET_GARAGE'
// export const SET_AVAILABLE_GARAGES  = 'SET_AVAILABLE_GARAGES'
// export const SET_DURATIONDATE       = 'SET_DURATIONDATE'
// export const SET_AUTOSELECT         = 'SET_AUTOSELECT'
// export const SET_ERROR              = 'SET_ERROR'
// export const CLEAR_RESERVATION_FORM = 'CLEAR_RESERVATION_FORM'
//
//
// const MIN_RESERVATION_DURATION = 30 // minutes
//
//
// export function setUser (user){
//   return (dispatch, getState) => {
//     dispatch({ type: SET_USER
//              , value: user
//              })
//     dispatch( setPlace(-1) )
//     dispatch( setClient(-1) )
//     dispatch( getAvalilableFloors() )
//   }
// }
//
// export function setAvailableUsers (users){
//   return  { type: SET_AVAILABLE_USERS
//           , value: users
//           }
// }




//
//
// export function setFrom (fromDate){
//   return (dispatch, getState) => {
//     dispatch({ type: SET_FROM
//             , value: fromDate
//             })
//
//     const state = getState().newReservation
//     if (dateDifference(fromDate, state.to) < MIN_RESERVATION_DURATION){
//       dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(30, 'minutes').format('DD.MM.YYYY HH:mm')))
//     }
//
//     dispatch(getAvalilableFloors())
//   }
// }
//
// export function setTo (toDate){
//   return (dispatch, getState) => {
//     const state = getState().newReservation
//     if (dateDifference(state.from, toDate) < MIN_RESERVATION_DURATION){
//       dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(30, 'minutes').format('DD.MM.YYYY HH:mm')))
//     } else {
//       dispatch({ type: SET_TO
//               , value: toDate
//               })
//     }
//
//     dispatch(getAvalilableFloors())
//   }
// }
//
// export function setClient (client){
//   return  { type: SET_CLIENT
//           , value: client
//           }
// }
// export function setAvailableClients (clients){
//   return  { type: SET_AVAILABLE_CLIENTS
//           , value: clients
//           }
// }
//
// export function setPlace (place){
//   return  { type: SET_PLACE
//           , value: place
//           }
// }
//
// export function setAvailablePlaces (places){
//   return  { type: SET_AVAILABLE_PLACES
//           , value: places
//           }
// }
//
// export function setFloor (floor){
//   return { type: SET_FLOOR
//          , value: floor
//          }
// }
//
// export function setAvailableFloors (floors){
//   return  { type: SET_AVAILABLE_FLOORS
//           , value: floors
//           }
// }
//
// export function setGarage (garage){
//   return  { type: SET_GARAGE
//           , value: garage
//           }
// }
//
// export function setAvailableGarages (garages){
//   return  { type: SET_AVAILABLE_GARAGES
//           , value: garages
//           }
// }
//
// export function setDruationDate (value){
//   return  { type: SET_DURATIONDATE
//           , value: value
//           }
// }
//
// export function setAutoselect (value){
//   return  { type: SET_AUTOSELECT
//           , value: value
//           }
// }
//
// export function setError (value){
//   return  { type: SET_ERROR
//           , value: value
//           }
// }
//
// export function clearForm (){
//   return  { type: CLEAR_RESERVATION_FORM }
// }
//
//
// export function handleGarageChange(index) {
//     return (dispatch, getState) => {
//       dispatch( setFloor(-1) )
//       dispatch( setPlace(-1) )
//       dispatch( setClient(-1) )
//       dispatch( setGarage(getState().newReservation.availableGarages[index].id) )
//       dispatch( getAvalilableFloors() )
//     }
// }
//
// export function handleFloorChange(index) {
//   return (dispatch, getState) => {
//     dispatch(changeFloor(index))
//   }
// }
//

//
// export function durationChange (duration){
//   return (dispatch, getState) => {
//     var state = getState().newReservation
//     dispatch(setTo(moment(state.from, 'DD.MM.YYYY HH:mm').add(duration, 'hours').format('DD.MM.YYYY HH:mm')))
//   }
// }
// export function setTimeToNow () {
//   return setFrom(moment(moment()).format('DD.MM.YYYY HH:mm'))
// }
//
// export function autoSelectPlace () {
//   return (dispatch, getState) => {
//
//     dispatch(setPlace(availablePlaces(getState().newReservation)[0].id))
//     dispatch(setClient(availablePlaces(getState().newReservation)[0].client_places[0].client_id) )
//     dispatch(setAutoselect(true))
//   }
// }
//
// export function changeFloor (index) {
//   return (dispatch, getState) => {
//     dispatch(setFloor(getState().newReservation.availableFloors[index].id))
//   }
// }
//
// export function changePlace (place) {
//   return (dispatch, getState) => {
//     dispatch(setPlace(place.id))
//     dispatch(setClient( place.client_places[0].client_id ) )
//     dispatch(setAutoselect(false))
//   }
// }
//
// function getAvailableUsers () {
//   return (dispatch, getState) => {
//     const onSuccess = (response) => {
//       dispatch( setAvailableUsers(response.data.reservable_users) )
//       if (response.data.reservable_users.length == 1){
//         dispatch(setUser(response.data.reservable_users[0].id))
//       }
//     }
//     request(onSuccess, GET_AVAILABLE_USERS)
//   }
// }
//
// function getAvailableGarages() {
//   return (dispatch, getState) => {
//     const onSuccess = (response) => {
//       // switch (response.data.reservable_garages.length) {
//       //   case 0:
//       //     dispatch( setError( t(['newReservation', 'noAvailableGarages']) ) )
//       //     break
//       //   case 1:
//       //     handleGarageChange(0)
//       //     break
//       //   default:
//       //     dispatch( setAvailableGarages(response.data.reservable_garages) )
//       //     dispatch( setGarage(response.data.reservable_garages[0].id) )
//       //     dispatch( getAvalilableFloors() )
//       // }
//       if (response.data.reservable_garages.length == 0){
//         dispatch( setError( t(['newReservation', 'noAvailableGarages']) ) )
//       } else {
//         dispatch( setAvailableGarages(response.data.reservable_garages) )
//         dispatch( handleGarageChange(0) )
//         // dispatch( setGarage(response.data.reservable_garages[0].id) )
//         // dispatch( getAvalilableFloors() )
//       }
//     }
//     request(onSuccess, GET_AVAILABLE_GARAGES, {user_id: getState().newReservation.user_id})
//   }
// }
//
// function getAvalilableFloors() {
//   return (dispatch, getState) => {
//     const onSuccess = (response) => {
//       dispatch( setAvailableFloors(response.data.garage.floors) )
//       const state = getState().newReservation
//
//       if (state.place_id == -1 || [].concat.apply([], state.availableFloors.map(function(floor){return floor.free_places})).findIndex((place)=>{return place.id == state.place_id}) == -1){
//         dispatch( setFloor(response.data.garage.floors[0].id) )
//         const freePlaces = availablePlaces(getState().newReservation)
//         dispatch( setPlace( freePlaces.length==0 ? -1 : freePlaces[0].id ) )
//         dispatch( setClient(freePlaces.length==0 ? -1 : freePlaces[0].client_places[0].client_id) )
//         dispatch( setAutoselect(true) )
//       }
//       // if no available places, change floor (if such floor exists)
//       if (getState().newReservation.availableFloors.find(function (floor){return floor.id == getState().newReservation.floor_id}).free_places.length == 0){
//         const floorWithFreePlaces = getState().newReservation.availableFloors.find(function(floor){return floor.free_places.length>0})
//         floorWithFreePlaces && dispatch( setFloor(floorWithFreePlaces.id) )
//       }
//     }
//     const state = getState().newReservation
//     if (state.garage_id > 0) request(onSuccess, GET_AVAILABLE_FLOORS, {id: state.garage_id, begins_at: state.from, ends_at: state.to, user_id: state.user_id })
//   }
// }
//
//
// function dateDifference (from, to) {
//   return moment.duration(moment(to, 'DD.MM.YYYY HH:mm').diff(moment(from, 'DD.MM.YYYY HH:mm'))).asMinutes()
// }
//
// export function submitForm () {
//   return (dispatch, getState) => {
//       const state = getState().newReservation
//
//       const onSuccess = (response) => {
//         nav.to('/reservations')
//         dispatch(clearForm())
//       }
//
//       request( onSuccess
//              , CREATE_RESERVATION
//              , { reservation: { client_id: state.client_id
//                               , user_id:    state.user_id
//                               , place_id:   state.place_id
//                               , begins_at:  state.from
//                               , ends_at:    state.to
//                               }}
//              , "reservationMutation"
//              )
//
//   }
// }
//
//
// function availablePlaces(state){
//   return state.availableFloors[state.availableFloors.findIndex((floor)=>{return floor.id == state.floor_id})].free_places
// }
>>>>>>> feature/new_api
