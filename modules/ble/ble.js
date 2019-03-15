const MAX_SCANNING_DURATION = 15000 // ms
const MAX_SCANNING_BETWEEN_DEVICES_TIME = 5000 // ms
const IS_ANDROID = window.cordova && cordova.platformId === 'android'
let UNIT_PASSWORD = 'heslo'
const UNIT_OPEN_SEQUENCE = [ '0xFE', '0xFF', '0x20' ]
// const UNIT_BLINKING_SEQUENCE = [ '0xFF' ]
const UNIT_SERVICE = '68F60000-FE41-D5EC-5BED-CD853CA1FDBC'
const UNIT_CHARACTERISTICS_PASSWORD = '68F60100-FE41-D5EC-5BED-CD853CA1FDBC'
const UNIT_CHARACTERISTICS_OPEN_GATE = '68F6000B-FE41-D5EC-5BED-CD853CA1FDBC'


function isInitialized() {
  console.log('is initialized?')
  return new Promise((resolve, reject) => {
    const callback = result => result.isInitialized ? resolve(result) : reject(result)
    bluetoothle.isInitialized(callback)
  })
}

function initializeBLE() {
  console.log('Initializing bluetooth')
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
  console.log('is enabled?')
  return new Promise((resolve, reject) => {
    const callback = result => result.isEnabled ? resolve() : reject()
    bluetoothle.isEnabled(callback)
  })
}

function enable() { // doesnt work well, resolve is not being called
  console.log('enabling bluetooth')
  return new Promise((resolve, reject) => IS_ANDROID ? bluetoothle.enable(resolve, reject) : reject())
}

function hasPermission() {
  console.log('checking has permission?')
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
  console.log('requesting for permission')
  return new Promise((resolve, reject) => bluetoothle.requestPermission(resolve, reject))
}

export function isScanning() {
  return new Promise((resolve, reject) => {
    const callback = result => result.isScanning ? reject(result) : resolve(result)
    bluetoothle.isScanning(callback)
  })
}

function startScan(name) { // use when you know the device you are looking for
  console.log('scanning for name', name)
  return new Promise((resolve, reject) => {
    let scanTimeout
    let scanBetweenDevices
    let found = false
    let timeout = false

    const onTimeout = async () => {
      timeout = true
      scanBetweenDevices && clearTimeout(scanBetweenDevices)
      console.log((new Date()).toISOString() + ' BT scanning timeout')
      try {
        await stopScan()
      } catch (e) {
        console.log('Scanning cannot be stopped because:', IS_ANDROID ? e : e.message)
      }
      reject('Device was not found')
    }

    const onBetweenDevicesTimeOut = async () => {
      timeout = true
      scanTimeout && clearTimeout(scanTimeout)
      console.log((new Date()).toISOString() + ' BT scanning timeout, between devices.')

      await onTimeout()
    }

    const onDeviceFound = async device => {
      scanBetweenDevices && clearTimeout(scanBetweenDevices)

      if (device.name && (device.name === name || device.name === 'r' + name)) {
        found = true
        scanTimeout && clearTimeout(scanTimeout)
        console.log('device found')
        try {
          await stopScan()
          setTimeout(() => resolve(device), 200)
        } catch (e) {
          reject(e)
        }
      } else {
        console.log('found', device, 'but i am looking for', name)
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
  console.log('scan stop')
  return new Promise((resolve, reject) => bluetoothle.stopScan(resolve, reject))
}

function wasConnected(address) {
  console.log('checking if was connected')
  return new Promise((resolve, reject) => {
    const callback = result => {
      console.log(result.wasConnected ? 'resolveing' : 'rejecting')
      result.wasConnected ? resolve(address) : reject(address)
    }

    bluetoothle.wasConnected(callback, reject, { address })
  })
}

function connectBLE(address) {
  console.log('connecting to device:', address)
  return new Promise((resolve, reject) => {
    bluetoothle.connect(resolve, reject, { address })
    setTimeout(reject, MAX_SCANNING_DURATION)
  })
}

function reconnect(address) {
  console.log('recconecting to device: ', address)
  return new Promise((resolve, reject) => bluetoothle.reconnect(resolve, reject, { address }))
}

function discover(address) {
  console.log('discovering device', address)
  return new Promise((resolve, reject) => bluetoothle.discover(resolve, reject, { address }))
}

function writeBLE(address, service, characteristic, value) {
  console.log('writing', value)
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
  console.log('disconnecting from', address)
  return new Promise((resolve, reject) => bluetoothle.disconnect(resolve, reject, { address }))
}

function closeBLE(address) {
  console.log('closing connection')
  return new Promise((resolve, reject) => bluetoothle.close(resolve, reject, { address }))
}

function reconnectErrorHandler(address, error) {
  console.log('reconnect error handling', address, error)
  return new Promise((resolve, reject) => {
    if (error.error === 'isNotDisconnected') {
      closeBLE(address)
        .then(() => connectBLE(address))
        .catch(err => reconnectErrorHandler(address, err))
        .catch(reject)
        .then(resolve)
    } else if (error.error === 'neverConnected') {
      connectBLE(address)
        .then(resolve)
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
  console.log('STEP 1: INITIALIZE')
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

export function scan(name) {
  console.log('STEP 2: SCAN')
  return new Promise((resolve, reject) => {
    startScan(name)
      .then(resolve)
      .catch(() => startScan(name))
      .catch(reject)
      .then(resolve)
  })
}

export function connect(address) {
  console.log('STEP 3: CONNECT', address)
  return new Promise((resolve, reject) => {
    isScanning()
      .catch(() => { console.log('connect stop'); stopScan() })
      .then(() => connectBLE(address))
      .catch(() => reconnect(address))
      .catch(error => reconnectErrorHandler(address, error))
      .then(result => discover(result.address))
      .then(resolve)
      .catch(reject)
  })
}

export function write(address, repeater, success) {
  console.log('STEP 4: WRITE', address)
  return new Promise((resolve, reject) => {
    const delayedResolve = () => {
      success()
      setTimeout(resolve, repeater ? 5000 : 1000)
    }

    console.log('writing password: ', UNIT_PASSWORD)
    writeBLE(address, UNIT_SERVICE, UNIT_CHARACTERISTICS_PASSWORD, stringToEncodedString(UNIT_PASSWORD))
      .then(() => writeBLE(address, UNIT_SERVICE, UNIT_CHARACTERISTICS_OPEN_GATE, packetToEncodedString(UNIT_OPEN_SEQUENCE)))
      .then(delayedResolve)
      .catch(reject)
  })
}

export function close(address) {
  console.log('STEP 5: DISCONNECT')
  return new Promise((resolve, reject) => {
    disconnect(address)
      .then(result => closeBLE(result.address))
      .then(resolve)
      .catch(reject)
  })
}

export function scanUnlimited(onResult, error) { // use when you just want to see nearby devices
  console.log('scanning unlimitedly')
  const params = {
    allowDuplicates: true, // iOS
    scanMode:        bluetoothle.SCAN_MODE_LOW_POWER, // lowe power consumtion
    matchMode:       bluetoothle.MATCH_MODE_AGGRESSIVE, // needs lower signal to be reported as visible
    matchNum:        bluetoothle.MATCH_NUM_FEW_ADVERTISEMENT,
    callbackType:    bluetoothle.CALLBACK_TYPE_ALL_MATCHES
  }

  bluetoothle.startScan(onResult, error, params)
}
