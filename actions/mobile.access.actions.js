import * as ble    from '../modules/ble/ble'
import { request } from '../helpers/request'

export const MOBILE_ACCESS_SET_OPENED  = "MOBILE_ACCESS_SET_OPENED"
export const MOBILE_ACCESS_SET_MESSAGE = "MOBILE_ACCESS_SET_MESSAGE"


export function setOpened (opened){
  return  { type: MOBILE_ACCESS_SET_OPENED
          , value: opened
          }
}

export function setMessage (message){
  return  { type: MOBILE_ACCESS_SET_MESSAGE
          , value: message
          }
}


export function openGarage() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
       if (response.data.open_gate != undefined) {
         dispatch(setMessage('Request sucessfully send'))
         dispatch(setOpened(true))
       }
    }
    request(onSuccess, 'mutation OpenGate ($user_id:Id!) { open_gate(user_id: $user_id) }', {user_id: getState().mobileHeader.current_user.id})
  }
}

export function openGarageBluetooth(){
  return (dispatch, getState) => {
    const name = "S721A08583" // change this according to reservations address
    const password = 'heslo'
    var address = undefined
    var services = []

    const closeSuccessfull = (result) => {
      console.log('close successfull', result);
      console.log('sequence finished');
    }

    const writeSuccess = (result) => {
      console.log('write was successfull', result);
      dispatch(setMessage('Request sucessfully send'))
      dispatch(setOpened(true))
      // 6. disconect
      // 7. close
      ble.close(address, closeSuccessfull, logError)
    }

    const writeOpen = () =>{
      // 5. read/subscribe/write and read/write descriptors
      console.log("write open garage, address: ", address,"servicies: ", services);
      const values = ['0xFE', '0xFF', '0x20'] // packet is send like ['0xFE', '0xFF', '0x20']
      const service = '68F60000-FE41-D5EC-5BED-CD853CA1FDBC' //services[2].uuid
      const characteristics = '68F6000B-FE41-D5EC-5BED-CD853CA1FDBC' //services[2].characteristics[services[2].characteristics.length - 1].uuid

      ble.write(address, service, characteristics, ble.PacketToEncodedString(values), writeSuccess, logError)
    }

    const writeBlinking = () =>{
      // 5. read/subscribe/write and read/write descriptors
      console.log("write blinking garage, address: ", address,"servicies: ", services);
      const values = ['0xFF'] // packet is send like ['0xFE', '0xFF', '0x20']
      const service = '68F60000-FE41-D5EC-5BED-CD853CA1FDBC' //services[2].uuid
      const characteristics = '68F6000B-FE41-D5EC-5BED-CD853CA1FDBC' //services[2].characteristics[services[2].characteristics.length - 1].uuid

      ble.write(address, service, characteristics, ble.PacketToEncodedString(values), writeOpen, logError)
    }

    const writePassword = () => {
      console.log('send in password');
      const service = '68F60000-FE41-D5EC-5BED-CD853CA1FDBC'
      const characteristics = '68F60100-FE41-D5EC-5BED-CD853CA1FDBC'

      ble.write(address, service, characteristics, ble.stringToEncodedString(password), writeBlinking, logError)
    }

    const discoverSuccess = (result) => {
      console.log("discovered :", result);
      services = result.services
      dispatch(setMessage('Sending request to open'))
      writePassword()
    }

    const connecionEstablished = (result) =>{
      console.log('connection established');
      dispatch(setMessage('Connection established'))
      console.log(result);
      if (result.status == "connected"){
        // 4. discover device (or services/characteristics/descriptors in iOS)
        dispatch(setMessage('Discovering services'))
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
      dispatch(setMessage('Connecting to garage'))
      address = garageBle.address
      ble.connect(garageBle.address, connecionEstablished, connectionFailed)
    }

    const scanStarted = (result) => {
      console.log('scan successfull');
      console.log(result);
      if (result.name && result.name == name){ // result.name.indexOf(name) != -1
        console.log('grage found, stop scanning');
        console.log('found garage:', result);
        dispatch(setMessage('Garage found'))
        ble.stopScan((message)=>{
          scanSuccessfull(result)
        }, (message)=>{
          console.log('garage found, but scan stop unsucessfull', message);
        })
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
