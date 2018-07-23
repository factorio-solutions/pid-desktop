import {
  MOBILE_RESERVATIONS_SET_RESERVATIONS,
  MOBILE_RESERVATIONS_SET_BLE_DEVICES,
  MOBILE_RESERVATIONS_SET_OPENED,
  MOBILE_RESERVATIONS_SET_FIND,
  MOBILE_RESERVATIONS_RESET_PAGINATION,
  MOBILE_RESERVATIONS_SET_PAGINATION
} from '../actions/mobile.reservations.actions'


function setKeyOnIndex(object, index, key, value) {
  if (index === undefined || key === undefined) return object
  const newObject = { ...object[index] }
  newObject[key] = value
  return [
    ...object.slice(0, index),
    newObject,
    ...object.slice(index + 1)
  ]
}

function updateReservationGate(reservations, reservationId, gateId, key, value) {
  const reservationIndex = reservations.findIndexById(reservationId)
  const gates = reservations[reservationIndex].place.gates
  return setKeyOnIndex(reservations, reservationIndex, 'place', {
    ...reservations[reservationIndex].place,
    gates: setKeyOnIndex(gates, gates.findIndexById(gateId), key, value)
  })
}

function updateReservations(reservations, action) {
  const updatedReservations = updateReservationGate(reservations, action.reservationId, action.gateId, 'success', action.opened)
  return updateReservationGate(updatedReservations, action.reservationId, action.gateId, 'error', action.message)
}


const defaultState = {
  reservations: [],
  bleDevices:   {}, // {name: { address, name, rssi, advertisement }, ... }
  find:         '', // by text
  currentPage:  1,
  canLoadMore:  true
}

export default function mobileReservations(state = defaultState, action) {
  switch (action.type) {

    case MOBILE_RESERVATIONS_SET_RESERVATIONS:
      return {
        ...state,
        reservations: action.value
      }

    case MOBILE_RESERVATIONS_SET_BLE_DEVICES:
      return {
        ...state,
        reservations: action.value
      }

    case MOBILE_RESERVATIONS_SET_OPENED:
      return {
        ...state,
        reservations: updateReservations(state.reservations, action)
      }

    case MOBILE_RESERVATIONS_SET_FIND:
      return {
        ...state,
        find: action.value
      }

    case MOBILE_RESERVATIONS_SET_PAGINATION:
      return {
        ...state,
        currentPage: action.page,
        canLoadMore: action.canLoadMore
      }

    case MOBILE_RESERVATIONS_RESET_PAGINATION:
      return {
        ...state,
        currentPage: 1,
        canLoadMore: true
      }

    default:
      return state
  }
}
