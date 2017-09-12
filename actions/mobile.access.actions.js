import * as ble from '../modules/ble/ble'
import moment from 'moment'
import { request } from '../helpers/request'

import { MOBILE_ACCESS_OPEN_GATE } from '../queries/mobile.access.queries'


export const MOBILE_ACCESS_SET_EMPTY_GATES = 'MOBILE_ACCESS_SET_EMPTY_GATES'
export const MOBILE_ACCESS_SET_OPENED = 'MOBILE_ACCESS_SET_OPENED'
export const MOBILE_ACCESS_SET_MESSAGE = 'MOBILE_ACCESS_SET_MESSAGE'


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


// will return ongoing reservations
export function getCurrentReservationsGates() {
  return (dispatch, getState) => {
    dispatch(setEmptyGates(
      getState().reservations.reservations
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
        }, acc) ]
      }, [])
    ))
  }
}

export function filterGates(gate) {
  return gate.phone !== undefined
}

export function openGarageViaPhone(id) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.open_gate != null) {
        dispatch(setMessage('Request sucessfully send'))
        dispatch(setOpened(true))
      } else {
        dispatch(setMessage('No reservation found'))
        dispatch(setOpened(false))
      }
    }

    request(onSuccess
           , MOBILE_ACCESS_OPEN_GATE
           , { user_id: getState().mobileHeader.current_user.id
             , reservation_id: dispatch(getCurrentReservations())[getState().mobileAccess.selectedReservation].id
             , gate_id: id
             }
           )
  }
}

// name = serial number of BLE unit (not repeater)
export function openGarageViaBluetooth(name){
  return (dispatch, getState) => {
    // const name =                    name // change this according to reservations address
    const password =                'heslo'
    const service =                 '68F60000-FE41-D5EC-5BED-CD853CA1FDBC' //services[2].uuid
    const passwordCharacteristics = '68F60100-FE41-D5EC-5BED-CD853CA1FDBC'
    const openGateCharacteristics = '68F6000B-FE41-D5EC-5BED-CD853CA1FDBC'
    let repeater = false // if repeater was found instead of unit
    var address = undefined // will be filled in afther scan
    var services = []

    const closeSuccessfull = (result) => {
      console.log('close successfull', result);
      console.log('sequence finished');
    }

    const writeSuccess = (result) => {
      console.log('write was successfull', result);
      dispatch(setMessage('Request sucessfully send' + (repeater?' (repeater)':' (gate unit)')))
      dispatch(setOpened(true))
      // 6. disconect
      // 7. close
      setTimeout(()=> {
        ble.close(address, closeSuccessfull, logError)
      }, repeater ? 10000 : 0); //give repeater time to send data
    }

    const writeOpen = () =>{
      // 5. read/subscribe/write and read/write descriptors
      console.log("write open garage, address: ", address,"servicies: ", services);
      const values = ['0xFE', '0xFF', '0x20'] // packet is send like ['0xFE', '0xFF', '0x20']
      ble.write(address, service, openGateCharacteristics, ble.PacketToEncodedString(values), writeSuccess, logError)
    }

    const writePassword = () => {
      console.log('send in password');
      ble.write(address, service, passwordCharacteristics, ble.stringToEncodedString(password), writeOpen, logError)
    }

    const discoverSuccess = (result) => {
      console.log("discovered :", result);
      services = result.services
      dispatch(setMessage('Sending request to open' + (repeater?' (repeater)':' (gate unit)')))

      const serviceObject = services.find(serv => serv.uuid === service)
      if (serviceObject) {
        const passwordCharacteristicsObject = serviceObject.characteristics.find(char => char.uuid === passwordCharacteristics)
        if (passwordCharacteristicsObject){ // password characteristics found
          writePassword()
        } else { // no password characteristics - skip it
          writeOpen()
        }
      } else { // expected service not found, disconect
        console.log('this device does not have expected service - disconecting (probably not gate unit?)')
        dispatch(setMessage('Expected service missing'))
        dispatch(setOpened(false))
        // 6. disconect, 7. close
        ble.close(address, closeSuccessfull, logError)
      }
    }

    const connecionEstablished = (result) =>{
      console.log('connection established');
      dispatch(setMessage('Connection established' + (repeater?' (repeater)':' (gate unit)')))
      if (result.status == "connected"){
        console.log(result);
        // 4. discover device (or services/characteristics/descriptors in iOS)
        dispatch(setMessage('Discovering services' + (repeater?' (repeater)':' (gate unit)')))
        console.log('discovering servicess: ', address);
        ble.discover(address, discoverSuccess, logError)
      } else {
        logError({message: 'device unexpectedly disconnected', 'function': "connecionEstablished"})
      }
    }

    const connectionFailed = (result) => {
      console.log('connection unsuccessfull, trying to recconect', result);
      ble.reconnect(address, connecionEstablished, logError)
    }

    const scanSuccessfull = (garageBle) => {
      // 3. connect to device
      console.log('trying to connect to ', garageBle);
      dispatch(setMessage('Connecting to garage' + (repeater?' (repeater)':' (gate unit)')))
      address = garageBle.address
      ble.connect(garageBle.address, connecionEstablished, connectionFailed)
    }

    const scanStarted = (result) => {
      console.log('scan successfull');
      console.log(result);
      // if (result.name && ( result.name === 'r'+name)){
      if (result.name && (result.name === name || result.name === 'r'+name)){
        if (result.name === 'r'+name) repeater = true // Found repeater, add waits
        console.log('grage found, stop scanning');
        console.log('found garage:', result);
        dispatch(setMessage('Garage found' + (repeater?' (repeater)':' (gate unit)')))
        ble.stopScan((message)=>{
          scanSuccessfull(result)
        }, (message)=>{
          console.log('garage found, but scan stop unsucessfull', message);
        })
      } else {
        console.log('but i am looking for ', name);
      }
    }

    const logError = (result) => {
      console.log('error occured');
      console.log(result);
      dispatch(setOpened(false))
      dispatch(setMessage(result.message))
    }

    const initCallback = (result) => {
      if (result.status == 'enabled' ){
        console.log('bluetooth enabled');
        dispatch(setMessage('Bluetooth enabled.'))
        // 2. scan devices
        console.log('scan devices');
        ble.scan(scanStarted, logError)
      } else {
        // init failed
        console.log('bluetooth init failed');
        console.log(result);
        // dispatch(setOpened(false))
        dispatch(setMessage(result.message))
      }
    }

    // 1. init bluetooth
    console.log('init called');
    ble.init(initCallback)
  }
}

export function openGarage(gate, index) {
  return (dispatch, getState) => {
    if (gate.phone.match(/[A-Z]/i)) {
      dispatch(openGarageViaBluetooth(gate.phone))
    } else {
      dispatch(openGarageViaPhone(gate.id))
    }
  }
}
