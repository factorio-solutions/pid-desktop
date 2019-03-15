import requestPromise       from '../helpers/requestPromise'
import actionFactory        from '../helpers/actionFactory'
import { t }                from '../modules/localization/localization'
import * as ble             from '../modules/ble/ble'
import { setCustomModal }   from './pageBase.actions'
import { hideSplashscreen } from './mobile.header.actions'

import {
  MOBILE_GET_RESERVATIONS_QUERY,
  MOBILE_ACCESS_OPEN_GATE,
  MOBILE_ACCESS_LOG_ACCESS
} from '../queries/mobile.reservations.queries'


export const RESERVATIONS_PER_PAGE = 10
export const MOBILE_RESERVATIONS_SET_RESERVATIONS = 'MOBILE_RESERVATIONS_SET_RESERVATIONS'
export const MOBILE_RESERVATIONS_SET_BLE_DEVICES = 'MOBILE_RESERVATIONS_SET_BLE_DEVICES'
export const MOBILE_RESERVATIONS_SET_OPENED = 'MOBILE_RESERVATIONS_SET_OPENED'
export const MOBILE_RESERVATIONS_SET_FIND = 'MOBILE_RESERVATIONS_SET_FIND'
export const MOBILE_RESERVATIONS_SET_PAGINATION = 'MOBILE_RESERVATIONS_SET_PAGINATION'
export const MOBILE_RESERVATIONS_RESET_PAGINATION = 'MOBILE_RESERVATIONS_RESET_PAGINATION'

export const setReservations = actionFactory(MOBILE_RESERVATIONS_SET_RESERVATIONS)
export const setBleDevices = actionFactory(MOBILE_RESERVATIONS_SET_BLE_DEVICES)
export const resetPagination = actionFactory(MOBILE_RESERVATIONS_RESET_PAGINATION)

export function setPagination(page, canLoadMore) {
  return { type: MOBILE_RESERVATIONS_SET_PAGINATION, page, canLoadMore }
}

// export const setFind = actionFactory(MOBILE_RESERVATIONS_SET_FIND)
export function setFind(value) {
  return dispatch => {
    dispatch({ type: MOBILE_RESERVATIONS_SET_FIND, value })
    dispatch(initReservations())
  }
}


function createPaginationVariables(getState) {
  const header = getState().mobileHeader
  const { reservations } = getState()

  return {
    count:         RESERVATIONS_PER_PAGE,
    page:          reservations.currentPage,
    order_by:      'begins_at',
    search:        reservations.find ? reservations.find : null,
    garage_id:     header.garage_id,
    user_id:       header.personal && header.current_user ? header.current_user.id : null,
    secretary:     !header.personal,
    no_include_me: !header.personal
  }
}

export function initReservations() {
  return (dispatch, getState) => {
    dispatch(resetPagination())

    requestPromise(
      MOBILE_GET_RESERVATIONS_QUERY,
      createPaginationVariables(getState)
    )
      .then(response => {
        const metadata = response.mobile_reservations_meta
        dispatch(setReservations(response.mobile_reservations))
        dispatch(setPagination(metadata.page, metadata.page > 0 && metadata.page < metadata.count))
        dispatch(hideSplashscreen())
      }).catch(() => {
        dispatch(hideSplashscreen())
      })
  }
}

export function loadAnotherReservationsPage() {
  return (dispatch, getState) => {
    const paginationVars = createPaginationVariables(getState)
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))

    requestPromise(
      MOBILE_GET_RESERVATIONS_QUERY,
      {
        ...paginationVars,
        page: paginationVars.page + 1
      }
    )
      .then(response => {
        const metadata = response.mobile_reservations_meta
        dispatch(setReservations([
          ...getState().reservations.reservations,
          ...response.mobile_reservations
        ]))
        dispatch(setPagination(metadata.page, metadata.page > 0 && metadata.page < metadata.count))

        dispatch(setCustomModal())
      })
  }
}

function createGateAccessLog(reservationId, gateId, currentUser) {
  return new Promise(resolve => {
    requestPromise(
      MOBILE_ACCESS_LOG_ACCESS,
      {
        gate_access_log: {
          user_id:        currentUser.id,
          reservation_id: reservationId,
          gate_id:        gateId,
          access_type:    'Bluetooth'
        }
      }
    )
      .then(data => {
        console.log(data)
        resolve(data)
      })
      .catch(resolve)
  })
}


export function setOpened(opened, message, reservationId, gateId) {
  return dispatch => {
    dispatch({
      type: MOBILE_RESERVATIONS_SET_OPENED, opened, message, reservationId, gateId
    })

    setTimeout(() => {
      dispatch({
        type:    MOBILE_RESERVATIONS_SET_OPENED,
        opened:  undefined,
        message: undefined,
        reservationId,
        gateId
      })
    }, 1000)
  }
}

export function openGarageViaPhone(reservationId, gateId) {
  return (dispatch, getState) => {
    requestPromise(
      MOBILE_ACCESS_OPEN_GATE,
      {
        user_id:        getState().mobileHeader.current_user.id,
        reservation_id: reservationId,
        gate_id:        gateId
      }
    )
      .then(data => {
        if (data.open_gate != null) {
          dispatch(setOpened(true, undefined, reservationId, gateId))
        } else {
          dispatch(setOpened(false, 'No reservation found', reservationId, gateId))
        }
      })
      .catch(() => {
        dispatch(setOpened(false, 'No connection', reservationId, gateId))
      })
  }
}

function logErrorFactory(reservationId, gateId) {
  return dispatch => {
    return result => {
      console.log('error occured:', result, reservationId, gateId)
      if (reservationId !== undefined && gateId !== undefined) {
        const message = result && result.message

        dispatch(setOpened(false, message || result, reservationId, gateId))
      }
    }
  }
}

export function openGarageViaBluetooth(name, pwd, reservationId, gateId) {
  return (dispatch, getState) => {
    const logError = dispatch(logErrorFactory(reservationId, gateId))

    const IS_ANDROID = window.cordova && cordova.platformId === 'android'

    if (window.bluetoothle) {
      const unit = getState().reservations.bleDevices[name]
      const repeater = getState().reservations.bleDevices['r' + name]
      let device = unit && repeater ? unit.rssi > repeater.rssi ? unit : repeater : unit || repeater
      let isRepeater = device && device.name[0] === 'r'

      const onDeviceFound = dev => {
        console.log('Scan successful, found device:', dev)
        device = dev
        isRepeater = dev.name[0] === 'r'
        return ble.connect(device.address)
      }

      const onOpen = () => {
        console.log('Opening successful')
        dispatch(setOpened(true, undefined, reservationId, gateId))
      }

      ble.setPassword(pwd)

      let connectionAction

      if (device) {
        connectionAction = ble.connect(device.address)
      } else {
        connectionAction = ble
          .initialize()
          .catch(() => logError('Bluetooth not enabled'))
          .then(() => ble.scan(name))
          .then(onDeviceFound)
      }

      connectionAction
        .then(() => ble.write(device.address, isRepeater, onOpen))
        .then(() => ble.close(device.address))
        .catch(error => {
          logError(error)
          if (device) {
            ble.close(device.address)
              .catch(e => console.log('Disconnecting cannot be performed:', IS_ANDROID ? e : e.message))
          } else {
            ble.isScanning()
              .catch(() => { console.log('Open gate catch.'); ble.stopScan() })
              .catch(e => console.log('Scanning cannot be stopped because:', IS_ANDROID ? e : e.message))
          }
        })
    } else {
      logError('Cannot see bluetoothLE library')
    }
  }
}

export function openGarage(reservation, gateId) {
  return async (dispatch, getState) => {
    const gate = reservation.place.gates.findById(gateId)
    console.log('opening gate')
    // dispatch(stopScanning()) // stop previous scanning
    if (gate.phone.match(/[A-Z]/i)) {
      await createGateAccessLog(reservation.id, gateId, getState().mobileHeader.current_user)
      dispatch(openGarageViaBluetooth(gate.phone, gate.password, reservation.id, gateId))
    } else {
      dispatch(openGarageViaPhone(reservation.id, gateId))
    }
  }
}
