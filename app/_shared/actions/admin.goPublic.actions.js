import update        from 'immutability-helper'

import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import * as nav      from '../helpers/navigation'
import { t }         from '../modules/localization/localization'

import { setCustomModal } from './pageBase.actions'
import { GET_GARAGE, CREATE_PRICING, UPDATE_PRICING } from '../queries/admin.goPublic.queries.js'


export const ADMIN_GO_PUBLIC_SET_GARAGE = 'ADMIN_GO_PUBLIC_SET_GARAGE'
export const ADMIN_GO_PUBLIC_SET_PLACES = 'ADMIN_GO_PUBLIC_SET_PLACES'
export const ADMIN_GO_PUBLIC_SET_CURRENCIES = 'ADMIN_GO_PUBLIC_SET_CURRENCIES'


export const setGarage = actionFactory(ADMIN_GO_PUBLIC_SET_GARAGE)
export const setPlaces = actionFactory(ADMIN_GO_PUBLIC_SET_PLACES)
export const setCurrencies = actionFactory(ADMIN_GO_PUBLIC_SET_CURRENCIES)


export function togglePlace(id) {
  return (dispatch, getState) => {
    const places = getState().adminGoPublic.places
    const index = places.findIndex(place => place === id)
    if (index >= 0) {
      dispatch(setPlaces(places.slice(0, index).concat(places.slice(index + 1))))
    } else {
      dispatch(setPlaces(update(places, { $push: [ id ] })))
    }
  }
}

export function initGoPublic() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setGarage(response.data.garage))
      dispatch(setCurrencies(response.data.currencies))
    }

    getState().pageBase.garage && request(onSuccess, GET_GARAGE, { id: getState().pageBase.garage })
  }
}

export function setSelectedCurrency(currency) { // set currencies to all places
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.garage.floors.forEach(floor =>
      floor.places.forEach(place => {
        dispatch(setGarage(dispatch(updatePlacePricing(place.id, 'currency_id', currency.id))))
      })
    )
  }
}

export function setFlatPrice(value, valid) {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.places.forEach(id => {
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'flat_price', parseFloat(value)))))

      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_12h_price'))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_day_price'))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_week_price'))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_month_price'))))
    })
  }
}
export function setExponential12hPrice(value, valid) {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.places.forEach(id => {
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_12h_price', parseFloat(value)))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'flat_price'))))
    })
  }
}
export function setExponentialDayPrice(value, valid) {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.places.forEach(id => {
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_day_price', parseFloat(value)))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'flat_price'))))
    })
  }
}
export function setExponentialWeekPrice(value, valid) {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.places.forEach(id => {
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_week_price', parseFloat(value)))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'flat_price'))))
    })
  }
}
export function setExponentialMonthPrice(value, valid) {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.places.forEach(id => {
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'exponential_month_price', parseFloat(value)))))
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'flat_price'))))
    })
  }
}
export function setWeekendPricing(value, valid) {
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    state.places.forEach(id => {
      dispatch(setGarage(dispatch(updatePlacePricing(id, 'weekend_price', parseFloat(value)))))
    })
  }
}

export function changeFloorFrom(value, index) {
  return (dispatch, getState) => {
    dispatch(setFloors(dispatch(updateValue(index, 'from', value))))
  }
}

function updatePlacePricing(id, key, value) { // if value = undefined, then remove key
  return (dispatch, getState) => {
    const state = getState().adminGoPublic
    const floorIndex = state.garage.floors.findIndex(floor => { return floor.places.find(place => place.id === id) !== undefined })
    const placeIndex = state.garage.floors[floorIndex].places.findIndex(place => place.id === id)

    const arr = getState().adminGoPublic.garage.floors
    const newObject = updateFloor(arr[floorIndex], placeIndex, key, value)
    const newFloors = update(arr, { $splice: [ [ floorIndex, 1, newObject ] ] })

    return update(state.garage, { floors: { $set: newFloors } })
  }
}

function updateFloor(floor, placeIndex, key, value) {
  const place = floor.places[placeIndex]
  const newPricing = value ? updateKey(place.pricing, key, value) : removeKey(place.pricing, key)
  const newPlace = update(place, { pricing: { $set: newPricing } })
  const newPlaces = update(floor.places, { $splice: [ [ placeIndex, 1, newPlace ] ] })

  return update(floor, { places: { $set: newPlaces } })
}

function updateKey(object, key, value) {
  return update(object || {}, { [key]: { $set: value } })
}

function removeKey(object, key) {
  return Object.keys(object)
               .filter(currentKey => currentKey !== key)
               .reduce((newObj, key) => ({ ...newObj, [key]: object[key] }), {})
}

export function submitPricings() {
  return (dispatch, getState) => {
    Promise.all(getState().adminGoPublic.garage.floors.reduce((acc, floor) => { // find only valid pricings
      return [ ...acc, ...floor.places.filter(place => {
        if (place.pricing === null) return false
        if (place.pricing.currency_id === undefined) return false
        if ((place.pricing.flat_price === undefined || place.pricing.flat_price === '') &&
          (place.pricing.exponential_12h_price === undefined || place.pricing.exponential_12h_price === '' ||
          place.pricing.exponential_day_price === undefined || place.pricing.exponential_day_price === '' ||
          place.pricing.exponential_week_price === undefined || place.pricing.exponential_week_price === '' ||
          place.pricing.exponential_month_price === undefined || place.pricing.exponential_month_price === '')) return false

        return true
      }) ]
    }, []).map(place => { // create or update all the pricings
      return new Promise(resolve => {
        const onSuccess = response => { resolve(response) }
        dispatch(setCustomModal(t([ 'newPricing', 'saving' ])))

        if (place.pricing.id) {
          request(onSuccess, UPDATE_PRICING, { id: place.pricing.id, pricing: removeKey(place.pricing, 'id') })
        } else {
          request(onSuccess, CREATE_PRICING, { pricing: { ...place.pricing, place_id: place.id } })
        }
      })
    })).then(values => { // resolved
      dispatch(setCustomModal())
      nav.to(`/${getState().pageBase.garage}/admin/modules`)
    })
  }
}
