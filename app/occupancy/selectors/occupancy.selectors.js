import  { createSelector } from 'reselect'

import {
  getGarage,
  getClientsIds,
  getNewReservation,
  getFrom,
  getDuration
} from './basicSelectors'

const defaultEmptyArray = []
const defaultEmptyObject = {}

export const getInterval = createSelector(
  [ getGarage, getFrom, getDuration ],
  (garage, from, duration) => {
    if (!garage || !garage.intervals) {
      return defaultEmptyObject
    }

    let to
    if (duration === 'month') {
      to = from.clone().add(31, 'day')
    } else {
      to = from.clone().add(1, duration)
    }
    const interval = garage.intervals.find(intr => intr.from.isSame(from) && intr.to.isSame(to))

    if (!interval) {
      return defaultEmptyObject
    }

    return interval
  }
)

export const getPlaces = createSelector(
  [ getGarage, getClientsIds, getInterval ],
  (garage, clientIds, interval) => {
    if (!interval || !interval.reservations || interval.reservations.length === 0) {
      return defaultEmptyArray
    }

    return garage.floors.reduce((places, floor) => {
      return places.concat(
        floor.occupancy_places
          .map(place => {
            const contracts = interval.contracts.filter(con => con.places.some(p => p.id === place.id))
            const reservations = interval.reservations.filter(r => r.place.id === place.id)

            return {
              ...place,
              contracts,
              floor:        floor.label,
              reservations: (
                clientIds.length
                  ? reservations
                    .filter(reservation => (
                      reservation.client
                      && clientIds.includes(reservation.client.id)
                    ))
                  : reservations
              )
                .map(reservation => ({
                  ...reservation,
                  begins_at: new Date(reservation.begins_at),
                  ends_at:   new Date(reservation.ends_at)
                }))
            }
          })
          .filter(place => !clientIds.length || place.contracts.length)
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
