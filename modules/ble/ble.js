const MAX_SCANNING_DURATION = 15000 // ms
const MAX_SCANNING_BETWEEN_DEVICES_TIME = 5000 // ms
const IS_ANDROID = window.cordova && cordova.platformId === 'android'
let UNIT_PASSWORD = 'heslo'
const UNIT_OPEN_SEQUENCE = [ '0xFE', '0xFF', '0x20' ]
// const UNIT_BLINKING_SEQUENCE = [ '0xFF' ]
const UNIT_SERVICE = '68F60000-FE41-D5EC-5BED-CD853CA1FDBC'
const UNIT_CHARACTERISTICS_PASSWORD = '68F60100-FE41-D5EC-5BED-CD853CA1FDBC'
const UNIT_CHARACTERISTICS_OPEN_GATE = '68F6000B-FE41-D5EC-5BED-CD853CA1FDBC'


export function consoleLogWithTime(...arg) {
  console.log((new Date()).toISOString(), ...arg)
}

function isInitialized() {
  consoleLogWithTime('is initialized?')
  return new Promise((resolve, reject) => {
    const callback = result => result.isInitialized ? resolve(result) : reject(result)
    bluetoothle.isInitialized(callback)
  })
}

function initializeBLE() {
  consoleLogWithTime('Initializing bluetooth')
  return new Promise((resolve, reject) => {
    const callback = result => result.status === 'enabled' ? resolve(result) : reject(result)
    const params = {
      request:        true,
      statusReceiver: true
    }

    bluetoothle.initialize(callback, params)
  })
}

function isEnabled() {
  consoleLogWithTime('is enabled?')
  return new Promise((resolve, reject) => {
    const callback = result => result.isEnabled ? resolve() : reject()
    bluetoothle.isEnabled(callback)
  })
}

function enable() { // doesnt work well, resolve is not being called
  consoleLogWithTime('enabling bluetooth')
  return new Promise((resolve, reject) => IS_ANDROID ? bluetoothle.enable(resolve, reject) : reject())
}

function hasPermission() {
  consoleLogWithTime('checking has permission?')
  return new Promise((resolve, reject) => {
    if (IS_ANDROID) {
      const callback = result => result.hasPermission ? resolve(result) : reject(result)
      bluetoothle.hasPermission(callback)
    } else {
      resolve()
    }
  })
}

function requestPermission() {
  consoleLogWithTime('requesting for permission')
  return new Promise((resolve, reject) => bluetoothle.requestPermission(resolve, reject))
}

export function isScanning() {
  return new Promise(resolve => {
    const callback = result => resolve(result.isScanning)
    bluetoothle.isScanning(callback)
  })
}

function isConnected(address) {
  return new Promise((resolve, reject) => {
    const callback = result => resolve(result.isConnected)
    bluetoothle.isConnected(callback, reject, { address })
  })
}

function isDiscovered(address) {
  consoleLogWithTime('Checking if a device is discovered')
  return new Promise((resolve, reject) => {
    const callback = result => {
      consoleLogWithTime('isDiscovered on success:', result)
      resolve(result.isDiscovered)
    }
    const onError = error => {
      consoleLogWithTime('isDiscovered on error:', error)
      reject(error)
    }
    bluetoothle.isDiscovered(callback, onError, { address })
  })
}

function startScan(name, stopScanning = true) { // use when you know the device you are looking for
  consoleLogWithTime('scanning for name', name)
  return new Promise((resolve, reject) => {
    let scanTimeout
    let scanBetweenDevices
    let found = false
    let timeout = false

    const onTimeout = async () => {
      scanBetweenDevices && clearTimeout(scanBetweenDevices)
      if (found || timeout) return
      timeout = true

      try {
        if (await isScanning()) {
          await stopScan()
        }
      } catch (e) {
        consoleLogWithTime('[onTimeout] Scanning cannot be stopped because:', IS_ANDROID ? e : e.message)
      }
      reject('Device was not found')
    }

    const onBetweenDevicesTimeOut = async () => {
      scanTimeout && clearTimeout(scanTimeout)

      !found && !timeout && await onTimeout()
    }

    const onDeviceFound = async device => {
      scanBetweenDevices && clearTimeout(scanBetweenDevices)
      if (found || timeout) return

      if (device.name && (device.name === name || device.name === 'r' + name)) {
        scanTimeout && clearTimeout(scanTimeout)
        found = true
        consoleLogWithTime('device found')
        try {
          if (stopScanning) {
            await stopScan()
          }
          setTimeout(() => resolve(device), 200)
        } catch (e) {
          reject(e)
        }
      } else {
        consoleLogWithTime('found', device, 'but i am looking for', name)
        scanBetweenDevices = !found && !timeout && setTimeout(
          onBetweenDevicesTimeOut,
          MAX_SCANNING_BETWEEN_DEVICES_TIME
        )
      }
    }

    const params = {
      allowDuplicates: true, // iOS
      scanMode:        bluetoothle.SCAN_MODE_LOW_LATENCY, // hight power consumtion - set timeout
      matchMode:       bluetoothle.MATCH_MODE_STICKY, // needs strong signal to be seen
      matchNum:        bluetoothle.MATCH_NUM_FEW_ADVERTISEMENT,
      callbackType:    bluetoothle.CALLBACK_TYPE_ALL_MATCHES
    }

    scanTimeout = setTimeout(onTimeout, MAX_SCANNING_DURATION)

    bluetoothle.startScan(onDeviceFound, reject, params)
  })
}

export function stopScan() {
  consoleLogWithTime('scan stop')
  return new Promise((resolve, reject) => bluetoothle.stopScan(resolve, reject))
}

function wasConnected(address) {
  consoleLogWithTime('checking if was connected')
  return new Promise((resolve, reject) => {
    const callback = result => {
      consoleLogWithTime(result.wasConnected ? 'resolveing' : 'rejecting')
      result.wasConnected ? resolve(address) : reject(address)
    }

    bluetoothle.wasConnected(callback, reject, { address })
  })
}

function connectBLE(address) {
  consoleLogWithTime('connecting to device:', address)
  return new Promise((resolve, reject) => {
    let timeout

    const onSuccess = result => {
      timeout && clearTimeout(timeout)
      resolve(result)
    }

    const onError = error => {
      timeout && clearTimeout(timeout)
      reject(error)
    }

    bluetoothle.connect(onSuccess, onError, { address })
    // eslint-disable-next-line prefer-promise-reject-errors
    timeout = setTimeout(() => reject({
      error:   'connectionTimeout',
      message: `Cannot connect to device in ${MAX_SCANNING_DURATION}s`
    }), MAX_SCANNING_DURATION)
  })
}

function reconnect(address) {
  consoleLogWithTime('reconnecting to device: ', address)
  return new Promise((resolve, reject) => bluetoothle.reconnect(resolve, reject, { address }))
}

function discover(address) {
  consoleLogWithTime('discovering device', address)
  return new Promise((resolve, reject) => bluetoothle.discover(resolve, reject, { address }))
}

function writeBLE(address, service, characteristic, value) {
  consoleLogWithTime('writing', value)
  return new Promise((resolve, reject) => bluetoothle.write(resolve, reject, {
    address, service, characteristic, value
  }))
}

function packetToEncodedString(input) {
  return bluetoothle.bytesToEncodedString(input.map(value => parseInt(value, 16)))
}

function stringToEncodedString(input) {
  return bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(input))
}

function disconnect(address) {
  consoleLogWithTime('disconnecting from', address)
  return new Promise((resolve, reject) => bluetoothle.disconnect(resolve, reject, { address }))
}

function closeBLE(address) {
  consoleLogWithTime('closing connection')
  return new Promise((resolve, reject) => bluetoothle.close(resolve, reject, { address }))
}

function disconnectAndClose(address) {
  consoleLogWithTime('Disconnect and close BT connection.')
  return new Promise((resolve, reject) => {
    isConnected(address)
      .then(connected => {
        if (connected) {
          return disconnect(address)
        } else {
          consoleLogWithTime('Device already disconnected.')
          return Promise.resolve({ status: 'disconnected' })
        }
      })
      .then(result => {
        if (result.status === 'disconnected') {
          return closeBLE(address)
        } else {
          return Promise.reject(new Error('Device cannot be disconnected'))
        }
      })
      .then(resolve)
      .catch(error => {
        consoleLogWithTime('Cannot disconnected/close connection because of error:', error)
        reject(error)
      })
  })
}

function reconnectErrorHandler(address, error) {
  consoleLogWithTime('reconnect error handling', address, error, error && error.error)
  return new Promise((resolve, reject) => {
    if (error.error === 'isNotDisconnected' || error.error === 'isDisconnected') {
      disconnectAndClose(address)
        .then(() => connectBLE(address))
        .catch(err => reconnectErrorHandler(address, err))
        .catch(reject)
        .then(result => {
          consoleLogWithTime('[reconnectErrorHandler#1] Connection finished:', result)
          resolve(result)
        })
    } else if (error.error === 'neverConnected' || error.error === 'connectionTimeOut') {
      connectBLE(address)
        .then(result => {
          consoleLogWithTime('[reconnectErrorHandler#2] Connection finished:', result)
          resolve(result)
        })
        .catch(reject)
    } else {
      reject(error)
    }
  })
}


export function setPassword(pwd) {
  UNIT_PASSWORD = (pwd && pwd.substr(0, 12)) || 'heslo'
}

export function initialize() {
  consoleLogWithTime('STEP 1: INITIALIZE')
  return new Promise((resolve, reject) => {
    isInitialized()
      .catch(initializeBLE)
      .then(isEnabled)
      .catch(reject) // enable
      .then(hasPermission)
      .catch(requestPermission)
      .then(resolve)
      .catch(reject)
  })
}

export function scan(name, stopScanning = true) {
  consoleLogWithTime('STEP 2: SCAN')
  return new Promise((resolve, reject) => {
    startScan(name, stopScanning)
      .then(resolve)
      .catch(() => {
        consoleLogWithTime(`${(new Date()).toISOString()} Rescanning`)
        return startScan(name, stopScanning)
      })
      .catch(reject)
      .then(resolve)
  })
}

export function connect(address, continuousScanning = false) {
  consoleLogWithTime('STEP 3: CONNECT', address)
  return new Promise((resolve, reject) => {
    const stopScanning = async () => {
      try {
        const scanning = await isScanning()
        if (scanning) {
          consoleLogWithTime('Stopping scanning')
          return stopScan()
        } else {
          consoleLogWithTime('Device is not scanning.')
          return Promise.resolve()
        }
      } catch (error) {
        consoleLogWithTime('Cannot Stop scanning because of error:', error)
        return Promise.resolve()
      }
    }

    isScanning()
      .then(scanning => {
        if (continuousScanning && scanning) {
          consoleLogWithTime('Device will continue scanning through connecting.')
          return Promise.resolve()
        }
        if (scanning) {
          consoleLogWithTime('[Connect] Device still scanning.')
          return stopScan()
        } else {
          return Promise.resolve()
        }
      })
      .catch(error => {
        consoleLogWithTime('Cannot Stop scanning because of error:', error)
        return Promise.resolve()
      })
      .then(() => isConnected(address))
      .catch(() => Promise.resolve(false))
      .then(connected => {
        if (connected) {
          return Promise.resolve()
        } else {
          return connectBLE(address)
        }
      })
      .catch(async () => {
        // HACK: On some iPhones connectBLE timeout even if it was connected.
        try {
          if (await isConnected(address)) {
            return Promise.resolve({
              status:  'isConnected',
              message: 'Connection ends with error but device is connected.'
            })
          }
        } catch (e) {
          consoleLogWithTime('Error when isConnected:', e && e.message)
        }
        return reconnect(address)
      })
      .catch(error => reconnectErrorHandler(address, error))
      .then(result => {
        consoleLogWithTime('[connect] Connection finished:', result, 'Result is undefined:', !result, 'Message:', result && result.message)
        return isDiscovered(address)
      })
      .catch(error => {
        consoleLogWithTime('Cannot discover device because of error:', error)
        return Promise.resolve(false)
      })
      .then(async discovered => {
        if (discovered) {
          return Promise.resolve()
        } else {
          try {
            return discover(address)
          } catch (error) {
            consoleLogWithTime('Discover error:', IS_ANDROID ? error : error && `${error.message}. Error name: ${error.error}`)
            await reconnectErrorHandler(address, error)
            return discover(address)
          }
        }
      })
      .then(resolve)
      .catch(reject)
      .finally(() => {
        if (continuousScanning) {
          consoleLogWithTime('Finally stop scanning.')
          stopScanning()
        }
      })
  })
}

export function write(address, repeater, success) {
  consoleLogWithTime('STEP 4: WRITE', address)
  return new Promise((resolve, reject) => {
    const delayedResolve = () => {
      success()
      setTimeout(resolve, repeater ? 5000 : 1000)
    }

    consoleLogWithTime('writing password: ', UNIT_PASSWORD)
    writeBLE(address, UNIT_SERVICE, UNIT_CHARACTERISTICS_PASSWORD, stringToEncodedString(UNIT_PASSWORD))
      .then(() => writeBLE(address, UNIT_SERVICE, UNIT_CHARACTERISTICS_OPEN_GATE, packetToEncodedString(UNIT_OPEN_SEQUENCE)))
      .then(delayedResolve)
      .catch(reject)
  })
}

export function close(address) {
  consoleLogWithTime('STEP 5: DISCONNECT')
  return new Promise((resolve, reject) => {
    disconnectAndClose(address)
      .then(resolve)
      .catch(reject)
  })
}

export function scanUnlimited(onResult, error) { // use when you just want to see nearby devices
  consoleLogWithTime('scanning unlimitedly')
  const params = {
    allowDuplicates: true, // iOS
    scanMode:        bluetoothle.SCAN_MODE_LOW_POWER, // lowe power consumtion
    matchMode:       bluetoothle.MATCH_MODE_AGGRESSIVE, // needs lower signal to be reported as visible
    matchNum:        bluetoothle.MATCH_NUM_FEW_ADVERTISEMENT,
    callbackType:    bluetoothle.CALLBACK_TYPE_ALL_MATCHES
  }

  bluetoothle.startScan(onResult, error, params)
}
