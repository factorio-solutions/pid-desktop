import {
  MOBILE_ACCESS_SET_OPENED,
  MOBILE_ACCESS_SET_MESSAGE,
  MOBILE_ACCESS_SET_RESERVATIONS,
  MOBILE_ACCESS_SET_BLE_DEVICES,
  MOBILE_ACCESS_RESET_STORE
} from '../actions/mobile.access.actions'


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

const defaultState = {
  reservations: undefined,
  bleDevices:   {} // {name: { address, name, rssi, advertisement }, ... }
}


export default function mobileAccess(state = defaultState, action) {
  switch (action.type) {

    case MOBILE_ACCESS_SET_RESERVATIONS:
      return {
        ...state,
        reservations: action.value.map(reservation => ({
          ...reservation,
          place: {
            ...reservation.place,
            gates: reservation.place.gates.map(gate => ({ ...gate, message: 'Loading ...', opened: undefined }))
          }
        }))
      }

    case MOBILE_ACCESS_SET_OPENED:
      return {
        ...state,
        reservations: updateReservationGate(state.reservations, action.reservationId, action.gateId, 'opened', action.value)
      }

    case MOBILE_ACCESS_SET_MESSAGE:
      return {
        ...state,
        reservations: updateReservationGate(state.reservations, action.reservationId, action.gateId, 'message', action.value)
      }

    case MOBILE_ACCESS_SET_BLE_DEVICES:
      return {
        ...state,
        bleDevices: {
          ...state.bleDevices,
          [action.value.name]: action.value
        }
      }

    case MOBILE_ACCESS_RESET_STORE:
      return defaultState

    default:
      return state
  }
}
