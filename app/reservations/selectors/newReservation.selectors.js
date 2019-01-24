import  { createSelector } from 'reselect'

import { ACCENT_REGEX } from '../newReservation.page'

import {
  getUser,
  getEmail,
  getPhone,
  getName,
  getClientId,
  getFrom,
  getTo,
  getPaidByHost,
  getTemplateText,
  getGarage,
  getTimeCreditPrice,
  getSendSMS,
  getPlaceId
} from './newReservationDefaultSelectors'

const defaultEmptyArray = []

const getSelectedPlace = createSelector(
  [ getGarage, getPlaceId ],
  (garage, placeId) => {
    const places = garage ? garage.floors.reduce((acc, f) => [ ...acc, ...f.places ], []) : defaultEmptyArray
    return places.findById(placeId)
  }
)

export const getFloors = createSelector(
  [ getGarage, getPlaceId ],
  (garage, placeId) => {
    const highlightSelected = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        selected: place.id === placeId
      }))
    })

    return garage ? garage.floors.map(highlightSelected) : defaultEmptyArray
  }
)

export const getSelectedClient = createSelector(
  [ getUser, getClientId ],
  (user, clientId) => {
    return user &&
      clientId &&
      user.availableClients &&
      user.availableClients.findById(clientId)
  }
)

export const getFreePlaces = createSelector(
  getGarage,
  garage => {
    return garage ? garage.floors.reduce((acc, f) => [ ...acc, ...f.free_places ], []) : defaultEmptyArray
  }
)

export const getOutOfTimeCredit = createSelector(
  [ getSelectedClient, getTimeCreditPrice, getPaidByHost ],
  (selectedClient, timeCreditPrice, paidByHost) => {
    return selectedClient && timeCreditPrice > selectedClient[
      paidByHost ?
        'current_time_credit' :
        'current_users_current_time_credit'
    ]
  }
)

const getIsSelectedPlaceGoInternal = createSelector(
  [ getSelectedPlace, getSelectedClient, getGarage ],
  (selectedPlace, selectedClient, garage) => {
    return garage && garage.has_payment_gate && selectedClient && selectedPlace && selectedPlace.go_internal
  }
)

// TODO: Separate to smaller methods
export const getIsSubmittable = createSelector(
  [ getUser, getEmail, getPhone, getName, getClientId, getPaidByHost, getFrom, getTo, getTemplateText, getSendSMS,
    getSelectedClient, getGarage, getIsSelectedPlaceGoInternal, getPlaceId, getFreePlaces, getOutOfTimeCredit ],
  (
    user, email, phone, name, clientId, paidByHost, from, to, templateText, sendSMS, selectedClient, garage,
    isSelectedPlaceGoInternal, placeId, freePlaces, outOfTimeCredit
  ) => {
    if ((user && user.id === -1) && (!email.valid || !phone.valid || !name.valid)) return false
    if ((user && user.id === -2) && (!clientId || !name.valid)) return false
    if (from === '' || to === '') return false
    // if onetime visitor and he has to pay by himself, then the email is mandatory
    if (user && user.id === -2 && paidByHost && (!email.value || !email.valid)) return false
    if (ACCENT_REGEX.test(templateText) ? templateText.length > 140 : templateText.length > 320) return false
    // if onetime visitor and we want to send him sms, then the phone is mandatory
    if (user && user.id === -2 && sendSMS && (!phone.value || !phone.valid)) return false
    // user has enought time credit?
    if (selectedClient && selectedClient.is_time_credit_active && !isSelectedPlaceGoInternal && outOfTimeCredit) {
      return false
    }

    return user && (placeId || (garage && garage.flexiplace && freePlaces.length))
  }
)
