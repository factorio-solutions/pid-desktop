import * as ble from '../modules/ble/ble'
import moment from 'moment'
import { request } from '../helpers/request'

import { MOBILE_ACCESS_OPEN_GATE, MOBILE_ACCESS_LOG_ACCESS } from '../queries/mobile.access.queries'
import { setError } from './mobile.header.actions'


export const MOBILE_ACCESS_SET_RESERVATIONS = 'MOBILE_ACCESS_SET_RESERVATIONS'
export const MOBILE_ACCESS_SET_OPENED = 'MOBILE_ACCESS_SET_OPENED'
export const MOBILE_ACCESS_SET_MESSAGE = 'MOBILE_ACCESS_SET_MESSAGE'
export const MOBILE_ACCESS_SET_BLE_DEVICES = 'MOBILE_ACCESS_SET_BLE_DEVICES'
export const MOBILE_ACCESS_RESET_STORE = 'MOBILE_ACCESS_RESET_STORE'


export function setReservations(value) {
  return {
    type: MOBILE_ACCESS_SET_RESERVATIONS,
    value
  }
}

export function setOpened(opened, reservationId, gateId) {
  return {
    type:  MOBILE_ACCESS_SET_OPENED,
    value: opened,
    gateId,
    reservationId
  }
}

export function setMessage(message, reservationId, gateId) {
  return {
    type:  MOBILE_ACCESS_SET_MESSAGE,
    value: message,
    gateId,
    reservationId
  }
}

export function setBleDevice(device) {
  return {
    type:  MOBILE_ACCESS_SET_BLE_DEVICES,
    value: device
  }
}

export function resetAccessStore() {
  return { type: MOBILE_ACCESS_RESET_STORE }
}


// will return ongoing reservations
export function getCurrentReservationsGates() {
  return (dispatch, getState) => {
    dispatch(resetAccessStore())

    const reservations = getState().reservations.ongoingReservations
      .filter(reservation => {
        const header = getState().mobileHeader
        return (header.garage_id ? reservation.place.floor.garage.id === header.garage_id : true) // reservations of garage selected in header
        && reservation.user.id === header.current_user.id // only current users reservations
        && reservation.approved // only approved reservations
        && moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) // only current reservations
      })

    dispatch(setReservations(reservations))
    reservations.length === 0 && dispatch(stopScanning()) // no need for scanning if no reservation
  }
}

export function filterGates(gate) {
  return gate.phone !== undefined
}

export function openGarageViaPhone(reservationId, gateId) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.open_gate != null) {
        dispatch(setMessage('Request successfully sent', reservationId, gateId))
        dispatch(setOpened(true, reservationId, gateId))
      } else {
        dispatch(setMessage('No reservation found', reservationId, gateId))
        dispatch(setOpened(false, reservationId, gateId))
      }
    }

    request(
      onSuccess,
      MOBILE_ACCESS_OPEN_GATE,
      {
        user_id:        getState().mobileHeader.current_user.id,
        reservation_id: reservationId,
        gate_id:        gateId
      }
    )
  }
}

export function createGateAccessLog(reservationId, gateId) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      console.log(response)
    }

    request(
      onSuccess,
      MOBILE_ACCESS_LOG_ACCESS,
      {
        gate_access_log: {
          user_id:        getState().mobileHeader.current_user.id,
          reservation_id: reservationId,
          gate_id:        gateId,
          access_type:    'Bluetooth'
        }
      }
    )
  }
}

function logErrorFactory(reservationId, gateId) {
  return dispatch => {
    return result => {
      console.log('error occured:', result, reservationId, gateId)
      if (reservationId !== undefined && gateId !== undefined) {
        dispatch(setOpened(false, reservationId, gateId))
        dispatch(setMessage(result.message || result, reservationId, gateId))
      }
    }
  }
}


export function openGarageViaBluetooth(name, reservationId, gateId) {
  return (dispatch, getState) => {
    const message = mess => dispatch(setMessage(mess, reservationId, gateId))
    const opened = bool => dispatch(setOpened(bool, reservationId, gateId))
    const logError = dispatch(logErrorFactory(reservationId, gateId))

    if (window.bluetoothle) {
      const unit = getState().mobileAccess.bleDevices[name]
      const repeater = getState().mobileAccess.bleDevices['r' + name]
      let device = unit && repeater ? unit.rssi > repeater.rssi ? unit : repeater : unit || repeater
      let isRepeater = device && device.name[0] === 'r'

      const onDeviceFound = dev => {
        console.log('Scan sucessfull, found device: ', dev)
        device = dev
        isRepeater = dev.name[0] === 'r'
        return ble.connect(device.address)
      }

      const onOpen = () => {
        console.log('Opening successfull')
        message('Request sucessfully sent' + (repeater ? ' (repeater)' : ' (gate unit)'))
        opened(true)
      }

      (!device ?
      ble.intialize().then(() => ble.scan(name)).then(onDeviceFound) :
      ble.connect(device.address))
      .then(() => ble.write(device.address, isRepeater, onOpen))
      .then(() => ble.close(device.address))
      .catch(error => {
        logError(error)
        return device ? ble.close(device.address) : ble.stopScan()
      })
    } else {
      logError('Cannot see bluetoothLE library')
    }
  }
}

export function stopScanning() {
  return (dispatch, getState) => {
    window.bluetoothle && ble.stopScan()
    .then(message => console.log('scanning stoped', message, getState().mobileAccess.bleDevices))
    .catch(message => console.log('scan stop unsucessfull', message))
  }
}

export function startScanning(back) {
  return dispatch => {
    if (window.bluetoothle) {
      window.bluetoothle && ble.intialize() // 1. init bluetooth (if has plugin)
      .then(() => {
        const logError = dispatch(logErrorFactory())
        const onDeviceFound = result => {
          console.log('found device', result)
          result.name && dispatch(setBleDevice(result)) // only add device if has name
        }

        ble.scanUnlimited(onDeviceFound, logError)
      })
      .catch(() => {
        back()
        dispatch(setError('Bluetooth not enabled'))
      })
    } else {
      console.log('Cannot see bluetoothLE library')
    }
  }
}

export function openGarage(reservation, gateId) {
  return dispatch => {
    const gate = reservation.place.gates.findById(gateId)
    console.log('opening gate')
    dispatch(stopScanning()) // stop previous scanning
    if (gate.phone.match(/[A-Z]/i)) {
      dispatch(createGateAccessLog(reservation.id, gateId))
      dispatch(openGarageViaBluetooth(gate.phone, reservation.id, gateId))
    } else {
      dispatch(openGarageViaPhone(reservation.id, gateId))
    }
  }
}
