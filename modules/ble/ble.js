const MAX_SCANNING_DURATION = 15000 // ms

export function init(callback) {
  const params = {
    "request": true,
    "restoreKey" : "park-it-direct-bluetoothLE"
  }

  bluetoothle.initialize(callback, params)
}

export function scan(successCallback, errorCallback) {
  var params = {
    // "services": ["180D", "180F"],
    "allowDuplicates": true, // iOS
    "scanMode": bluetoothle.SCAN_MODE_BALANCED,
    "matchMode": bluetoothle.MATCH_MODE_STICKY,
    "matchNum": bluetoothle.MATCH_NUM_ONE_ADVERTISEMENT,
    "callbackType": bluetoothle.CALLBACK_TYPE_ALL_MATCHES
  }

  const onScanTimeout = () =>{
    stopScan((result) => {
      // scan stoped
      console.log('scan stoped', result);
      errorCallback({message: 'bluetooth of garage was not found'})
    }, (result) => {
      console.log('scan stop was not successfull, probably was stoped earlier');
      console.log(result);
    });
  }

  const requestPermissionSuccess = (result) =>{
    console.log('now has permision');
    bluetoothle.startScan(successCallback, errorCallback, params)
    setTimeout(onScanTimeout, MAX_SCANNING_DURATION)
  }

  const requestPermissionError = (result) => {
    console.log('permision rejected');
    errorCallback(result)
  }

  const hasPermissionSuccess = (result) => {
    if (result.hasPermission){
      console.log('has permision');
      bluetoothle.startScan(successCallback, errorCallback, params)
      setTimeout(onScanTimeout, MAX_SCANNING_DURATION)
    } else {
      console.log('doesnt have permision, asking for it');
      bluetoothle.requestPermission(requestPermissionSuccess, requestPermissionError);
    }
  }

  // has to have this permision, or no new devices will be found
  bluetoothle.hasPermission(hasPermissionSuccess)
}

export function stopScan (successCallback, errorCallback) {
  bluetoothle.stopScan(successCallback, errorCallback);
}

export function connect(address, successCallback, errorCallback) {
  var connected = false
  const params = {
    "address": address
  }

  bluetoothle.connect((result) => {
    connected = true
    successCallback(result)
  }, errorCallback, params);

  setTimeout(() => {
    console.log('connected: ', connected);
    if (!connected){
      // bluetoothle.close(()=>{console.log('closing connection for now.');}, closeError, params);
      errorCallback({message: 'connection with garage was not established', "function": 'ble.connect'})
    }
  }, MAX_SCANNING_DURATION)
}

export function reconnect(address, reconnectSuccess, reconnectError) {
  const params = {
    "address": address
  }
  console.log('recconecting to device: ', address);
  bluetoothle.reconnect(reconnectSuccess, (err) => {
    if (err.error === 'isNotDisconnected'){
      console.log('err device is not disconected, disconecting and trying again');
      close(address, (response)=>{
        console.log('closed sucessfully, trying to reconect.');
        reconnect(address, reconnectSuccess, reconnectError)
      }, reconnectError)
    } else if (err.error === 'neverConnected') {
      connect(address, reconnectSuccess, reconnectError)
    } else {
      reconnectError(err)
    }
  }, params);
}

export function discover(address, discoverSuccess, discoverError){
  var params = {
    address,
    // clearCache: true // not clearing cache causes problems
  }

  console.log('discover called with params: ', params);
  bluetoothle.discover((result)=>{
    console.log('discover successfull', result);
    discoverSuccess(result)
  }, (result) => {
    console.log('discover did not succeed', result);
    discoverError(result)
    close(address, (succ)=>{ // device will stay discovecerd until close => close
      console.log('closing afther discover error', succ);
    }, (err)=>{
      console.log('error while closing afther discover error', err);
    })
  }, params);
}

export function write (address, service, characteristic, values, writeSuccess, writeError) {
  const params = {
    address: address,
    service,
    characteristic,
    value: values
  }
  console.log('writing ', params);
  bluetoothle.write(writeSuccess, writeError, params);
}

export function PacketToEncodedString (input){
  return bluetoothle.bytesToEncodedString(input.map((value) => {return parseInt(value, 16)}))
}

export function stringToEncodedString(input){
  return bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(input))
}

export function close(address, success, error){
  var params = {
    address: address
  }
  bluetoothle.disconnect(()=>{
    bluetoothle.close((result)=>{
      success(result)
    }, (result)=>{
      console.log("not closed", result)
      error(result)
    }, params);
  }, (result)=>{
    console.log('disconnect not successfull ', result);
    error(result)
  }, params);
}
