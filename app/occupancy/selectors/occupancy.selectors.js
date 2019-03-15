import  { createSelector } from 'reselect'
import moment from 'moment'

import {
  getGarage,
  getClientsIds,
  getNewReservation
} from './basicSelectors'

const defaultEmptyArray = []

export const getPlaces = createSelector(
  [ getGarage, getClientsIds ],
  (garage, clientIds) => {
    if (!garage || !garage.floors) {
      return defaultEmptyArray
    }

    return garage.floors.reduce((places, floor) => {
      return places.concat(
        floor.occupancy_places
          .filter(place => !clientIds.length || place.contracts_in_interval.length)
          .map(place => ({
            ...place,
            floor:        floor.label,
            reservations: (
              clientIds.length
                ? place.reservations_in_interval
                  .filter(reservation => (
                    reservation.client
                    && clientIds.includes(reservation.client.id)
                  ))
                : place.reservations_in_interval
            )
              .map(reservation => ({
                ...reservation,
                begins_at: new Date(reservation.begins_at),
                ends_at:   new Date(reservation.ends_at)
              }))
          }))
      )
    }, [])
  }
)

const getPlaceId = createSelector(
  getNewReservation,
  newReservation => {
    if (!newReservation) {
      return undefined
    }

    return newReservation.placeId
  }
)

export const getSelectedPlace = createSelector(
  (getPlaces, getPlaceId),
  (places, placeId) => {
    if (places === defaultEmptyArray || !placeId) {
      return undefined
    }

    return places.findById(placeId)
  }
)
