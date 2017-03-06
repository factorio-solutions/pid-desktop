import moment      from 'moment'
import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'
import * as nav    from '../helpers/navigation'

import {
  GET_AVAILABLE_USERS,
  GET_AVAILABLE_GARAGES,
  GET_AVAILABLE_CLIENTS,
  GET_AVAILABLE_CARS,
  GET_GARAGE_PRICINGS,
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
export const NEW_RESERVATION_SET_LOADING            = "NEW_RESERVATION_SET_LOADING"
export const NEW_RESERVATION_SET_PRICINGS           = "NEW_RESERVATION_SET_PRICINGS"
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

export function setLoading (value){
  return { type: NEW_RESERVATION_SET_LOADING
         , value
         }
}

export function setPricings (value){
  return { type: NEW_RESERVATION_SET_PRICINGS
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
    moment(value, MOMENT_DATETIME_FORMAT).isBefore(moment().subtract(1, 'minute')) ? dispatch(beginsToNow())
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
    }
  }
}

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
      const placePricings = getState().newReservation.pricings.floors.reduce((arr, floor) => { return arr.concat(floor.places) }, [])
      response.data.garage.floors.forEach((floor)=>{
        floor.places.map((place) => {
          place.available = floor.free_places.find(p=>p.id==place.id)!=undefined
          place.pricings = placePricings.find((placePricing)=>{ return placePricing.id == place.id}).pricings
          if (place.available && place.pricings[0]) { // add tooltip to available places
            const pricing = place.pricings[0]
            // const pricing = placePricings.find((placePricing)=>{ return placePricing.id == place.id}).pricings[0]
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
      dispatch(setLoading(false))
      dispatch(autoSelectPlace())
    }

    const onPricings = (response) => {
      dispatch(setPricings(response.data.garage))
      callGarageDetails()
    }

    const callGarageDetails = () => {
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

    if (state.availableGarages[state.garageIndex]){
      if (state.pricings==undefined || state.pricings.id !== state.availableGarages[state.garageIndex].id){
        dispatch(setLoading(true))
        request( onPricings, GET_GARAGE_PRICINGS, { id: state.availableGarages[state.garageIndex].id } )
      } else {
        callGarageDetails()
      }
    }
  }
}


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
  return (dispatch, getState) => {
      const state = getState().newReservation

      const onSuccess = (response) => {
        nav.to('/reservations')
        dispatch(clearForm())
      }

      request( onSuccess
             , CREATE_RESERVATION
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
