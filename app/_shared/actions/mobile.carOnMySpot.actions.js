import React from 'react'

import actionFactory  from '../helpers/actionFactory'
import requestPromise from '../helpers/requestPromise'
import { t }          from '../modules/localization/localization'

import { setReservations }            from './mobile.reservations.actions'
import { setError as mobileSetModal } from './mobile.header.actions'

import { SHIFT_RESERVATION_PLACE } from '../queries/mobile.carOnMySpot.queries'


export const SET_CAR_ON_MY_SPOT_SHOW_LICENCE_PLATE_MODAL = 'SET_CAR_ON_MY_SPOT_SHOW_LICENCE_PLATE_MODAL'
export const SET_CAR_ON_MY_SPOT_LICENCE_PLATE = 'SET_CAR_ON_MY_SPOT_LICENCE_PLATE'
export const CLEAR_CAR_ON_MY_SPOT_STATE = 'CLEAR_CAR_ON_MY_SPOT_STATE'


export const setShowModal = actionFactory(SET_CAR_ON_MY_SPOT_SHOW_LICENCE_PLATE_MODAL)
export const setLicencePlate = actionFactory(SET_CAR_ON_MY_SPOT_LICENCE_PLATE)
export const clearState = actionFactory(CLEAR_CAR_ON_MY_SPOT_STATE)


export const showModal = () => dispatch => dispatch(setShowModal(true))
export const hideModal = () => dispatch => dispatch(setShowModal(false))


export function carOnMySpot(reservation) { // for mobiles
  return async function (dispatch, getState) {
    const { shift_reservation_place } = await requestPromise(SHIFT_RESERVATION_PLACE, { id: reservation.id, licence_plate: getState().carOnMySpot.licencePlate })
    const state = getState().reservations
    const index = state.reservations.findIndexById(reservation.id)

    dispatch(clearState())
    if (shift_reservation_place.place.id === state.reservations[index].place.id) {
      const userPrint = user => <div>
        {[ user.full_name, user.email, user.phone ]
          .filter(o => o)
          .join(', ')
        }
      </div>

      dispatch(mobileSetModal(<div style={{ overflowY: 'auto', maxHeight: '250px' }}>
        <h3>{t([ 'mobileApp', 'reservation', 'noFreePlaces' ])}</h3>

        <h5 style={{ textAlign: 'left' }}>{t([ 'mobileApp', 'reservation', 'clientContactPerson' ])}</h5>
        {shift_reservation_place.client &&
          shift_reservation_place.client.contact_persons.map(userPrint)
        }

        <h5 style={{ textAlign: 'left' }}>{t([ 'mobileApp', 'reservation', 'garageSecurity' ])}</h5>
        {shift_reservation_place.place.floor.garage.security.map(userPrint)}
      </div>))
    } else {
      dispatch(setReservations(
        [ ...state.reservations.slice(0, index),
          { ...state.reservations[index],
            begins_at: shift_reservation_place.begins_at,
            place:     shift_reservation_place.place
          },
          ...state.reservations.slice(index + 1)
        ]
      ))

      dispatch(mobileSetModal([
        <h3 key="reservationMoved">{t([ 'mobileApp', 'reservation', 'reservationMoved' ])}</h3>,
        <h1 key="floorPlace">{shift_reservation_place.place.floor.label} / {shift_reservation_place.place.label}</h1>
      ]))
    }
  }
}
