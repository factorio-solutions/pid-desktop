const MAX_SCANNING_DURATION = 15000 // ms

export function init(callback) {
  const params = {
    request:        true,
    statusReceiver: true
  }

  console.log('Initializing ble')
  bluetoothle.initialize(callback, params)
}


export function stopScan(successCallback, errorCallback) {
  bluetoothle.stopScan(successCallback, errorCallback)
}

export function scan(successCallback, errorCallback, unlimited) {
  const params = {
    allowDuplicates: true, // iOS
    scanMode:        bluetoothle.SCAN_MODE_BALANCED,
    matchMode:       bluetoothle.MATCH_MODE_STICKY,
    matchNum:        bluetoothle.MATCH_NUM_ONE_ADVERTISEMENT,
    callbackType:    bluetoothle.CALLBACK_TYPE_ALL_MATCHES
    // , services: ['180D', '180F']
  }

  const onScanTimeout = () => {
    const scanStopFailed = result => console.log('cannot stop scan if no scan is active', result)
    const stopScanSuccessfull = result => {
      console.log('scan stoped', result)
      errorCallback('Bluetooth of garage was not found')
    }

    stopScan(stopScanSuccessfull, scanStopFailed)
  }

  const requestPermissionSuccess = result => {
    console.log('now has permision', result)
    bluetoothle.startScan(successCallback, errorCallback, params)
    !unlimited && setTimeout(onScanTimeout, MAX_SCANNING_DURATION)
  }

  const requestPermissionError = result => {
    console.log('permision rejected')
    errorCallback(result)
  }

  const hasPermissionSuccess = result => {
    if (result.hasPermission) {
      requestPermissionSuccess()
    } else {
      console.log('doesnt have permision, asking for it')
      bluetoothle.requestPermission(requestPermissionSuccess, requestPermissionError)
    }
  }

  if (cordova.platformId === 'android') { // has to have this permision, or no new devices will be found
    console.log('android')
    bluetoothle.hasPermission(hasPermissionSuccess)
  } else {
    console.log('ios')
    requestPermissionSuccess() // ios doesn't need permission, so skip it
  }
}

export function connect(address, successCallback, errorCallback) {
  let connected = false
  const params = { address }

  const connectSuccessfull = result => {
    connected = true
    successCallback(result)
  }

  bluetoothle.connect(connectSuccessfull, errorCallback, params)

  setTimeout(() => {
    console.log('Connection timeout: is device connected: ', connected)
    // if (!connected) errorCallback('Connection with garage was not established')
    if (!connected) {
      const onSuccess = res => console.log('Close successfull afther connection not established', res)
      const onError = res => console.log('Close UNsuccessfull afther connection not established', res)
      bluetoothle.close(onSuccess, onError, params)
    }
  }, MAX_SCANNING_DURATION)
}

export function close(address, success, error) {
  const params = { address }
  const onDisconnectSuccessfull = () => {
    console.log('Closing currenct connection')
    bluetoothle.close(success, error, params)
  }
  const onDisconnectUnsuccessfull = result => {
    console.log('disconnect not successfull ', result)
    error(result)
  }

  bluetoothle.disconnect(onDisconnectSuccessfull, onDisconnectUnsuccessfull, params)
}


export function reconnect(address, reconnectSuccess, reconnectError) {
  console.log('recconecting to device: ', address)
  const params = { address }
  const recconectErrorHandle = err => {
    if (err.error === 'isNotDisconnected') {
      console.log('err device is not disconected, disconecting and trying again')
      const onCloseSuccessFull = response => {
        console.log('closed sucessfully, trying to reconect.', response)
        reconnect(address, reconnectSuccess, reconnectError)
      }
      close(address, onCloseSuccessFull, reconnectError)
    } else if (err.error === 'neverConnected') {
      connect(address, reconnectSuccess, reconnectError)
    } else {
      reconnectError(err)
    }
  }

  bluetoothle.reconnect(reconnectSuccess, recconectErrorHandle, params)
}

export function discover(address, discoverSuccess, discoverError) {
  console.log('discover called with address: ', address)
  const params = { address }
  const onDiscoverSuccessfull = result => {
    console.log('discover successfull', result)

    discoverSuccess(result)
  }
  const onDiscoverUnsuccessfull = result => {
    console.log('discover did not succeed', result)
    const closeSuccessfull = res => console.log('Close successfull afther Failed discover', res)

    discoverError(result)
    close(address, closeSuccessfull, discoverError)// device will stay discovecerd until close => close
  }

  bluetoothle.discover(onDiscoverSuccessfull, onDiscoverUnsuccessfull, params)
}

export function write(address, service, characteristic, value, writeSuccess, writeError) {
  const params = {
    address,
    service,
    characteristic,
    value
  }
  console.log('writing to BLE device', params)
  bluetoothle.write(writeSuccess, writeError, params)
}

export function PacketToEncodedString(input) {
  return bluetoothle.bytesToEncodedString(input.map(value => parseInt(value, 16)))
}

export function stringToEncodedString(input) {
  return bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(input))
}
