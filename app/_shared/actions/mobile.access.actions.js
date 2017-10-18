import * as ble from '../modules/ble/ble'
import moment from 'moment'
import { request } from '../helpers/request'

import { MOBILE_ACCESS_OPEN_GATE } from '../queries/mobile.access.queries'
import { setError } from './mobile.header.actions'


export const MOBILE_ACCESS_SET_EMPTY_GATES = 'MOBILE_ACCESS_SET_EMPTY_GATES'
export const MOBILE_ACCESS_SET_OPENED = 'MOBILE_ACCESS_SET_OPENED'
export const MOBILE_ACCESS_SET_MESSAGE = 'MOBILE_ACCESS_SET_MESSAGE'
export const MOBILE_ACCESS_SET_BLE_DEVICES = 'MOBILE_ACCESS_SET_BLE_DEVICES'
export const MOBILE_ACCESS_RESET_STORE = 'MOBILE_ACCESS_RESET_STORE'


export function setEmptyGates(value) {
  return { type: MOBILE_ACCESS_SET_EMPTY_GATES
         , value
         }
}

export function setOpened(opened, index) {
  return { type: MOBILE_ACCESS_SET_OPENED
         , value: opened
         , index
         }
}

export function setMessage(message, index) {
  return { type: MOBILE_ACCESS_SET_MESSAGE
         , value: message
         , index
         }
}

export function setBleDevice(device) {
  return { type: MOBILE_ACCESS_SET_BLE_DEVICES
         , value: device
         }
}

export function resetAccessStore() {
  return { type: MOBILE_ACCESS_RESET_STORE }
}


// will return ongoing reservations
export function getCurrentReservationsGates() {
  return (dispatch, getState) => {
    dispatch(resetAccessStore())

    const gates = getState().reservations.reservations
      .filter(reservation => {
        const header = getState().mobileHeader
        return (header.garage_id ? reservation.place.floor.garage.id === header.garage_id : true) // reservations of garage selected in header
        && reservation.user.id === header.current_user.id // only current users reservations
        && reservation.approved // only approved reservations
        && moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) // only current reservations
      })
      .reduce((acc, reservation) => { // create gates from available reservations
        return [ ...acc, ...reservation.place.gates.reduce((acc2, gate) => {
          return [ ...acc2, { ...gate, reservation } ]
        }, []) ]
      }, [])

    dispatch(setEmptyGates(gates))
    gates.length === 0 && dispatch(stopScanning()) // no need for scanning if no reservation
  }
}

export function filterGates(gate) {
  return gate.phone !== undefined
}

export function openGarageViaPhone(gateId, reservationId, index) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.open_gate != null) {
        dispatch(setMessage('Request sucessfully send', index))
        dispatch(setOpened(true, index))
      } else {
        dispatch(setMessage('No reservation found', index))
        dispatch(setOpened(false, index))
      }
    }

    request(onSuccess
           , MOBILE_ACCESS_OPEN_GATE
           , { user_id: getState().mobileHeader.current_user.id
             , reservation_id: reservationId
             , gate_id: gateId
             }
           )
  }
}

function logErrorFactory(index) {
  return dispatch => {
    return result => {
      console.log('error occured:', result, index)
      if (index !== undefined) {
        dispatch(setOpened(false, index))
        dispatch(setMessage(result.message || result, index))
      }
    }
  }
}


export function openGarageViaBluetooth(name, index) {
  return (dispatch, getState) => {
    // const name =                    name // change this according to reservations address
    const password = 'heslo'
    const service = '68F60000-FE41-D5EC-5BED-CD853CA1FDBC' // services[2].uuid
    const passwordCharacteristics = '68F60100-FE41-D5EC-5BED-CD853CA1FDBC'
    const openGateCharacteristics = '68F6000B-FE41-D5EC-5BED-CD853CA1FDBC'
    let repeater = false // if repeater was found instead of unit
    let address = undefined // will be filled in afther scan
    let services = []

    const logError = dispatch(logErrorFactory(index))

    const closeSuccessfull = result => {
      console.log('close successfull', result, 'sequence finished')
    }

    const writeSuccess = result => {
      console.log('write was successfull', result)
      dispatch(setMessage('Request sucessfully send' + (repeater ? ' (repeater)' : ' (gate unit)'), index))
      dispatch(setOpened(true, index))
      setTimeout(() => {
        ble.close(address, closeSuccessfull, logError) // 6. disconect and 7. close
      }, repeater ? 10000 : 0) // give repeater time to send data
    }

    const writeOpen = () => { // 5. read/subscribe/write and read/write descriptors
      console.log('write open garage, address: ', address, 'servicies: ', services)
      const values = [ '0xFE', '0xFF', '0x20' ] // open gate
      // const values = [ '0xFF' ] // blink
      ble.write(address, service, openGateCharacteristics, ble.PacketToEncodedString(values), writeSuccess, logError)
    }

    const writePassword = () => {
      console.log('send in password')
      ble.write(address, service, passwordCharacteristics, ble.stringToEncodedString(password), writeOpen, logError)
    }

    const discoverSuccess = result => {
      console.log('discovered :', result)
      services = result.services
      dispatch(setMessage('Sending request to open' + (repeater ? ' (repeater)' : ' (gate unit)'), index))

      const serviceObject = services.find(serv => serv.uuid === service)
      if (serviceObject) {
        const passwordCharacteristicsObject = serviceObject.characteristics.find(char => char.uuid === passwordCharacteristics)
        if (passwordCharacteristicsObject) { // password characteristics found
          writePassword()
        } else { // no password characteristics - skip it
          writeOpen()
        }
      } else { // expected service not found, disconect
        console.log('this device does not have expected service - disconecting (probably not gate unit?)')
        dispatch(setMessage('Expected service missing', index))
        dispatch(setOpened(false, index))
        // 6. disconect, 7. close
        ble.close(address, closeSuccessfull, logError)
      }
    }

    const connecionEstablished = result => {
      console.log('connection established')
      dispatch(setMessage('Connection established' + (repeater ? ' (repeater)' : ' (gate unit)'), index))
      if (result.status === 'connected') {
        console.log(result)
        // 4. discover device (or services/characteristics/descriptors in iOS)
        dispatch(setMessage('Discovering services' + (repeater ? ' (repeater)' : ' (gate unit)'), index))
        console.log('discovering servicess: ', address)
        ble.discover(address, discoverSuccess, logError)
      } else {
        logError('Device unexpectedly disconnected')
      }
    }

    const connectionFailed = result => {
      console.log('connection unsuccessfull, trying to recconect', result)
      ble.reconnect(address, connecionEstablished, logError)
    }

    const scanSuccessfull = garageBle => {
      // 3. connect to device
      console.log('trying to connect to ', garageBle)
      dispatch(setMessage('Connecting to garage' + (repeater ? ' (repeater)' : ' (gate unit)'), index))
      address = garageBle.address
      ble.connect(garageBle.address, connecionEstablished, connectionFailed)
    }

    const onStopScanSuccess = result => scanSuccessfull(result)
    const onStopScanFail = message => console.log('garage found, but scan stop unsucessfull', message)

    const scanStarted = result => {
      console.log('scan successfull', result)
      // if (result.name && ( result.name === 'r'+name)){
      if (result.name && (result.name === name || result.name === 'r' + name)) {
        if (result.name === 'r' + name) repeater = true // Found repeater, add waits
        console.log('stop scanning found garage:', result)
        dispatch(setMessage('Garage found' + (repeater ? ' (repeater)' : ' (gate unit)'), index))
        ble.stopScan(onStopScanSuccess(result), onStopScanFail)
      } else {
        console.log('but i am looking for ', name)
      }
    }

    const initCallback = result => {
      if (result.status === 'enabled') {
        console.log('bluetooth enabled, scaning devices')
        dispatch(setMessage('Looking for gate unit', index))
        ble.scan(scanStarted, logError) // 2. scan devices
      } else {
        console.log('bluetooth initialization failed', result) // init failed
        // dispatch(logError('Bluetooth initialization failed'))
        logError('Bluetooth initialization failed')
      }
    }

    const setDeviceVariablesAndConnect = device => {
      repeater = device.name === 'r' + name
      address = device.address
      ble.connect(device.address, connecionEstablished, connectionFailed)
    }

    // START HERE
    const gateUnit = getState().mobileAccess.bleDevices[name]
    const gateUnitRepeater = getState().mobileAccess.bleDevices['r' + name]

    if (gateUnit === undefined && gateUnitRepeater === undefined) { // no device found, start sequence from beginning
      console.log('starting sequence from scratch, stoping previsous scan, initializing bluetooth')
      ble.init(initCallback) // 1. init bluetooth
    } else if (gateUnit !== undefined && gateUnitRepeater !== undefined) { // both devices found, select stronger signal
      setDeviceVariablesAndConnect(gateUnit.rssi > gateUnitRepeater.rssi ? gateUnit : gateUnitRepeater)
    } else { // only one device found
      setDeviceVariablesAndConnect(gateUnit || gateUnitRepeater)
    }
  }
}

export function stopScanning() {
  return (dispatch, getState) => {
    const onStopScanSuccess = message => console.log('scanning stoped', message, getState().mobileAccess.bleDevices)
    const onStopScanFail = message => console.log('scan stop unsucessfull', message)

    window.bluetoothle && ble.stopScan(onStopScanSuccess, onStopScanFail)
  }
}

export function startScanning(back) {
  return dispatch => {
    const logError = dispatch(logErrorFactory())

    const scanStarted = result => { // for each found device
      console.log('found device', result)
      result.name && dispatch(setBleDevice(result)) // only add device if has name
    }

    const initCallback = result => {
      if (result.status === 'enabled') {
        console.log('bluetooth enabled, scaning devices')
        ble.scan(scanStarted, logError, true) // 2. scan devices
      } else {
        console.log('bluetooth initialization failed', result) // init failed
        back()
        dispatch(setError(result.message))
      }
    }

    console.log('initializing bluetooth')
    window.bluetoothle && ble.init(initCallback) // 1. init bluetooth (if has plugin)
  }
}

export function openGarage(gate, index) {
  return dispatch => {
    console.log('opening gate');
    dispatch(stopScanning()) // stop previous scanning
    if (gate.phone.match(/[A-Z]/i)) {
      dispatch(openGarageViaBluetooth(gate.phone, index))
    } else {
      dispatch(openGarageViaPhone(gate.id, gate.reservation.id, index))
    }
  }
}
