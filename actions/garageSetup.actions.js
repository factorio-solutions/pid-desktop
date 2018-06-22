import update from 'immutability-helper'

import { request }   from '../helpers/request'
import { get }       from '../helpers/get'
import * as nav      from '../helpers/navigation'
import { t }         from '../modules/localization/localization'
import geocode       from '../helpers/geocode'
import actionFactory from '../helpers/actionFactory'

import {
  CREATE_NEW_GARAGE,
  UPDATE_GARAGE,
  GET_ACCOUNTS_TARIFS,
  GET_GARAGE_DETAILS_GENERAL,
  GET_GARAGE_DETAILS_FLOORS,
  GET_GARAGE_DETAILS_GATES,
  GET_GARAGE_DETAILS_ORDER
} from '../queries/garageSetup.queries'

import { LOAD_INFO_FROM_IC }                   from '../queries/newClient.queries'
import { emptyGate, emptyFloor, defaultImage } from '../reducers/garageSetup.reducer'
import { setGarage, fetchGarages }             from './pageBase.actions'


export const GARAGE_SETUP_SET_ID = 'GARAGE_SETUP_SET_ID'
export const GARAGE_SETUP_SET_SELECTED_FLOOR = 'GARAGE_SETUP_SET_SELECTED_FLOOR'
export const GARAGE_SETUP_SET_HIGHLIGHT = 'GARAGE_SETUP_SET_HIGHLIGHT'
export const GARAGE_SETUP_SET_ERROR = 'GARAGE_SETUP_SET_ERROR'
export const GARAGE_SETUP_SET_FETCHING = 'GARAGE_SETUP_SET_FETCHING'
export const GARAGE_SETUP_SET_AVAILABLE_TARIFS = 'GARAGE_SETUP_SET_AVAILABLE_TARIFS'
export const GARAGE_SETUP_SET_TARIF_ID = 'GARAGE_SETUP_SET_TARIF_ID'
export const GARAGE_SETUP_SET_IMG = 'GARAGE_SETUP_SET_IMG'
export const GARAGE_SETUP_SET_NAME = 'GARAGE_SETUP_SET_NAME'
export const GARAGE_SETUP_SET_COMPANY_NAME = 'GARAGE_SETUP_SET_COMPANY_NAME'
export const GARAGE_SETUP_SET_IC = 'GARAGE_SETUP_SET_IC'
export const GARAGE_SETUP_SET_DIC = 'GARAGE_SETUP_SET_DIC'
export const GARAGE_SETUP_SET_LINE_1 = 'GARAGE_SETUP_SET_LINE_1'
export const GARAGE_SETUP_SET_LINE_2 = 'GARAGE_SETUP_SET_LINE_2'
export const GARAGE_SETUP_SET_CITY = 'GARAGE_SETUP_SET_CITY'
export const GARAGE_SETUP_SET_POSTAL_CODE = 'GARAGE_SETUP_SET_POSTAL_CODE'
export const GARAGE_SETUP_SET_STATE = 'GARAGE_SETUP_SET_STATE'
export const GARAGE_SETUP_SET_COUNTRY = 'GARAGE_SETUP_SET_COUNTRY'
export const GARAGE_SETUP_SET_LAT = 'GARAGE_SETUP_SET_LAT'
export const GARAGE_SETUP_SET_LNG = 'GARAGE_SETUP_SET_LNG'
export const GARAGE_SETUP_SET_FLOORS = 'GARAGE_SETUP_SET_FLOORS'
export const GARAGE_SETUP_SET_LPG = 'GARAGE_SETUP_SET_LPG'
export const GARAGE_SETUP_SET_LENGTH = 'GARAGE_SETUP_SET_LENGTH'
export const GARAGE_SETUP_SET_HEIGHT = 'GARAGE_SETUP_SET_HEIGHT'
export const GARAGE_SETUP_SET_WIDTH = 'GARAGE_SETUP_SET_WIDTH'
export const GARAGE_SETUP_SET_WEIGHT = 'GARAGE_SETUP_SET_WEIGHT'
export const GARAGE_SETUP_SET_GATES = 'GARAGE_SETUP_SET_GATES'
export const GARAGE_SETUP_SET_REGISTERED_NUMBERS = 'GARAGE_SETUP_SET_REGISTERED_NUMBERS'
export const GARAGE_SETUP_SET_ORDER = 'GARAGE_SETUP_SET_ORDER'
export const GARAGE_SETUP_SET_BOOKING_PAGE = 'GARAGE_SETUP_SET_BOOKING_PAGE'
export const GARAGE_SETUP_CLEAR_FORM = 'GARAGE_SETUP_CLEAR_FORM'

export const setId = actionFactory(GARAGE_SETUP_SET_ID)
export const setFloor = actionFactory(GARAGE_SETUP_SET_SELECTED_FLOOR)
export const setHighlight = actionFactory(GARAGE_SETUP_SET_HIGHLIGHT)
export const setError = actionFactory(GARAGE_SETUP_SET_ERROR)
export const setFetching = actionFactory(GARAGE_SETUP_SET_FETCHING)
export const setAvailableTarifs = actionFactory(GARAGE_SETUP_SET_AVAILABLE_TARIFS)
export const setTarif = actionFactory(GARAGE_SETUP_SET_TARIF_ID)
export const setImage = actionFactory(GARAGE_SETUP_SET_IMG)
export const setName = actionFactory(GARAGE_SETUP_SET_NAME)
export const setCompanyName = actionFactory(GARAGE_SETUP_SET_COMPANY_NAME)
export const setIc = actionFactory(GARAGE_SETUP_SET_IC)
export const setDic = actionFactory(GARAGE_SETUP_SET_DIC)
export const setLine1 = actionFactory(GARAGE_SETUP_SET_LINE_1)
export const setLine2 = actionFactory(GARAGE_SETUP_SET_LINE_2)
export const setCity = actionFactory(GARAGE_SETUP_SET_CITY)
export const setPostalCode = actionFactory(GARAGE_SETUP_SET_POSTAL_CODE)
export const setState = actionFactory(GARAGE_SETUP_SET_STATE)
export const setCountry = actionFactory(GARAGE_SETUP_SET_COUNTRY)
export const setLat = actionFactory(GARAGE_SETUP_SET_LAT)
export const setLng = actionFactory(GARAGE_SETUP_SET_LNG)
export const setFloors = actionFactory(GARAGE_SETUP_SET_FLOORS)
export const setLPG = actionFactory(GARAGE_SETUP_SET_LPG)
export const setLength = actionFactory(GARAGE_SETUP_SET_LENGTH)
export const setHeight = actionFactory(GARAGE_SETUP_SET_HEIGHT)
export const setWidth = actionFactory(GARAGE_SETUP_SET_WIDTH)
export const setWeight = actionFactory(GARAGE_SETUP_SET_WEIGHT)
export const setGates = actionFactory(GARAGE_SETUP_SET_GATES)
export const setRegisteredNumbers = actionFactory(GARAGE_SETUP_SET_REGISTERED_NUMBERS)
export const setOrder = actionFactory(GARAGE_SETUP_SET_ORDER)
export const setBookingPage = actionFactory(GARAGE_SETUP_SET_BOOKING_PAGE)
export const clearForm = actionFactory(GARAGE_SETUP_CLEAR_FORM)


export function toggleHighlight() { return (dispatch, getState) => { dispatch(setHighlight(!getState().garageSetup.highlight)) } }
export function toggleLPG() { return (dispatch, getState) => { dispatch(setLPG(!getState().garageSetup.lpg)) } }
export function toggleBookingPage() { return (dispatch, getState) => { dispatch(setBookingPage(!getState().garageSetup.bookingPage)) } }

export function removeFloor(index) { return (dispatch, getState) => { dispatch(setFloors(update(getState().garageSetup.floors, { $splice: [ [ index, 1 ] ] }))) } }
export function removeGate(index) { return (dispatch, getState) => { dispatch(setGates(update(getState().garageSetup.gates, { $splice: [ [ index, 1 ] ] }))) } }

function updateKey(object, key, value) {
  return update(object, { [key]: { $set: value } })
}

// type - array in which to find - floors, gates ...
// index - index in array
// key - name of key to be updated
// value - value to change key to
function updateValue(type, index, key, value) {
  return (dispatch, getState) => {
    const arr = getState().garageSetup[type]
    const newObject = updateKey(arr[index], key, value)
    const newArr = update(arr, { $splice: [ [ index, 1, newObject ] ] })

    return newArr
  }
}


function insertEmptyFloor(data) {
  data.push(emptyFloor)
  return data
}

function insertEmptyGate(data, line_1, lat, lng) {
  data.push({ ...emptyGate, address: { line_1, lat, lng } })
  return data
}

function changeFloors(index, key, value) {
  return dispatch => {
    return dispatch(updateValue('floors', index, key, value))
  }
}

function changeGates(index, key, value) {
  return dispatch => {
    return dispatch(updateValue('gates', index, key, value))
  }
}

export function changeFloorLabel(value, index) { return dispatch => { dispatch(setFloors(dispatch(changeFloors(index, 'label', value)))) } }
export function changeFloorPlaces(value, index) { return dispatch => { dispatch(setFloors(dispatch(changeFloors(index, 'places', value)))) } }
export function changeFloorFrom(value, index) {
  return dispatch => {
    dispatch(setFloors(dispatch(changeFloors(index, 'from', value))))
    dispatch(createFloor(index))
  }
}
export function changeFloorTo(value, index) {
  return dispatch => {
    dispatch(setFloors(dispatch(changeFloors(index, 'to', value))))
    dispatch(createFloor(index))
  }
}
export function changeFloorScheme(value, index, scan) {
  return dispatch => {
    dispatch(setFloors(dispatch(changeFloors(index, 'scheme', value))))
    if (scan) dispatch(scanSVG(value, index))
  }
}
export function addFloor() {
  return (dispatch, getState) => {
    dispatch(setFloors(insertEmptyFloor(getState().garageSetup.floors)))
  }
}
export function addGate() {
  return (dispatch, getState) => {
    dispatch(setGates(insertEmptyGate(getState().garageSetup.gates, getState().garageSetup.line_1, getState().garageSetup.lat, getState().garageSetup.lng)))
  }
}
export function addTemplate(file, label) {
  return (dispatch, getState) => {
    const floors = getState().garageSetup.floors
    if (!( // If no othe places, make template first floor
      floors.length === 1 &&
      floors[0].from === '' &&
      floors[0].label === '' &&
      floors[0].places.length === 0 &&
      floors[0].scheme === '' &&
      floors[0].to === ''
    )) dispatch(addFloor())
    get(file).then(data => {
      const index = getState().garageSetup.floors.length - 1
      dispatch(scanSVG(data, index))
      dispatch(changeFloorLabel(label, index))
    })
  }
}

export function changeGateLabel(value, index) { return dispatch => { dispatch(setGates(dispatch(changeGates(index, 'label', value)))) } }
export function changeGatePhone(value, index) { return dispatch => { dispatch(setGates(dispatch(changeGates(index, 'phone', value)))) } }
export function changeGatePlaces(value, index) { return dispatch => { dispatch(setGates(dispatch(changeGates(index, 'places', value)))) } }
export function changeGatePhoneNumberId(value, index) { return dispatch => { dispatch(setGates(dispatch(changeGates(index, 'phone_number_id', value)))) } }
export function changeGatePassword(value, index) { return dispatch => dispatch(setGates(dispatch(changeGates(index, 'password', value)))) }

export function changeGateAddressLine1(value, index) {
  return (dispatch, getState) => {
    dispatch(setGates(dispatch(changeGates(index, 'address', updateKey(getState().garageSetup.gates[index].address, 'line_1', value)))))
  }
}
export function changeGateAddressLat(value, index) {
  return (dispatch, getState) => {
    dispatch(setGates(dispatch(changeGates(index, 'address', updateKey(getState().garageSetup.gates[index].address, 'lat', value)))))
  }
}
export function changeGateAddressLng(value, index) {
  return (dispatch, getState) => {
    dispatch(setGates(dispatch(changeGates(index, 'address', updateKey(getState().garageSetup.gates[index].address, 'lng', value)))))
  }
}


export function loadAddressFromIc() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      try {
        const res = JSON.parse(response.data.ares).Ares_odpovedi.Odpoved.VBAS

        dispatch(setCompanyName(res.OF))
        dispatch(setLine1([ res.AD.UC, res.AA.CO ].filter(o => o).join('/')))
        dispatch(setLine2(''))
        dispatch(setCity(res.AA.N))
        dispatch(setPostalCode(res.AA.PSC))
        dispatch(setState(''))
        dispatch(setCountry(res.AA.NS))
        dispatch(setDic(res.DIC))

        const onCoordinatesFound = (lat, lng) => {
          dispatch(setLat(lat))
          dispatch(setLng(lng))
        }
        geocode(onCoordinatesFound, res.AD.UC, res.AA.N, res.AA.PSC, res.AA.NS)
      } catch (e) {
        console.log('not able to parse info from ICO', e)
      }
    }

    request(onSuccess, LOAD_INFO_FROM_IC, { ic: getState().garageSetup.ic })
  }
}

function unique(value, index, array) {
  return array.indexOf(value) === index
}

export function scanSVG(fileContent, index) {
  return (dispatch, getState) => {
    const floor = getState().garageSetup.floors[index]
    const places = []
    let from
    let to
    const splitedContent = fileContent.split('Place')

    for (let i = 1; i < splitedContent.length; i++) {
      const label = splitedContent[i].substring(0, splitedContent[i].indexOf('"', 0))
      from = from ? from > parseInt(label, 10) ? parseInt(label, 10) : from : parseInt(label, 10)
      to = to ? to < parseInt(label, 10) ? parseInt(label, 10) : to : parseInt(label, 10)

      const originalPlace = floor.places.find(place => place.label === label)
      places.push({
        id: originalPlace && originalPlace.id,
        label
      })
    }

    dispatch(setFloors(dispatch(changeFloors(index, 'places', places))))
    dispatch(setFloors(dispatch(changeFloors(index, 'from', from))))
    dispatch(setFloors(dispatch(changeFloors(index, 'to', to))))
    dispatch(setFloors(dispatch(changeFloors(index, 'scheme', fileContent)))) // has to be last, from or to change will render new scheme
  }
}

function createFloor(index) {
  return (dispatch, getState) => {
    const floor = getState().garageSetup.floors[index]
    if (floor.from === '' || floor.to === '') return
    const from = parseInt(floor.from, 10)
    const to = parseInt(floor.to, 10)

    const inRow = Math.floor(Math.sqrt(to - from + 1)) // + 1 // optional + 1
    const inColumn = Math.ceil((to - from + 1) / inRow)

    const padding = 10
    const canvasWidth = 900
    const canvasHeight = 1350

    const newSVGHead = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="${canvasWidth}px" height="${canvasHeight}px" viewBox="0 0 900 1350" style="enable-background:new 0 0 900 1350;" xml:space="preserve"><style type="text/css">.st0{fill:#B3B3B3;}.st1{fill:#00D3FF;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st2{fill:#E6E6E6;}.st3{fill:#CCCCCC;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st4{fill:#4D4D4D;stroke:#4D4D4D;stroke-width:0.75;stroke-miterlimit:10;}.st5{fill:none;stroke:#000000;stroke-miterlimit:10;}.st6{fill:none;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st7{fill:none;stroke:#000000;stroke-width:7;stroke-miterlimit:10;}.st8{stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st9{stroke:#000000;stroke-miterlimit:10;}.st10{fill:#CCCCCC;}.st11{fill:#8CC63F;}</style><g id="IMGback"><rect style="fill: gray" id="Outside" className="st0" x="0" y="0" width="900" height="1350"/></g><g id="Gcontrol">`
    const newSVGEnd = '</g></svg>'

    const rectWidth = (canvasWidth - (padding * (inRow + 1))) / inRow
    const rectHeight = (canvasHeight - (padding * (inColumn + 1))) / inColumn

    let rects = ''
    const places = []
    for (let i = 0; i <= (to - from); i++) {
      const x = (i % inRow) * (rectWidth + padding) + padding
      const y = ((Math.floor(i / inRow) + 1) * padding) + Math.floor(i / inRow) * rectHeight
      rects += `<rect id="Place${from + i}" x="${x}" y="${y}" class="st2" width="${rectWidth}" height="${rectHeight}"/>`

      const label = (from + i) + '' // has to be string...
      const originalPlace = floor.places.find(place => place.label === label)
      places.push({
        id: originalPlace && originalPlace.id,
        label
      })
    }

    dispatch(changeFloorScheme(newSVGHead + rects + newSVGEnd, index), false)
    dispatch(changeFloorPlaces(places, index))
  }
}

export function initTarif() {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setAvailableTarifs(response.data.tarifs))
    }

    request(onSuccess, GET_ACCOUNTS_TARIFS)
  }
}

export function addToOrder(label) {
  return (dispatch, getState) => {
    dispatch(setOrder([ ...getState().garageSetup.order, label ]))
  }
}
export function removeFromOrder(index) {
  return (dispatch, getState) => {
    const order = getState().garageSetup.order
    dispatch(setOrder(order.slice(0, index).concat(order.slice(index + 1))))
  }
}

// EDIT GARAGE
export function intiEditGarageGeneral(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setId(response.data.garage.id))
      dispatch(setTarif(response.data.garage.pid_tarif_id))

      response.data.garage.img && dispatch(setImage(response.data.garage.img))

      dispatch(setName(response.data.garage.name))
      dispatch(setCompanyName(response.data.garage.company))
      dispatch(setIc(response.data.garage.ic))
      dispatch(setDic(response.data.garage.dic))
      dispatch(setLPG(response.data.garage.lpg))
      dispatch(setLine1(response.data.garage.address.line_1))
      dispatch(setLine2(response.data.garage.address.line_2))
      dispatch(setCity(response.data.garage.address.city))
      dispatch(setPostalCode(response.data.garage.address.postal_code))
      dispatch(setState(response.data.garage.address.state))
      dispatch(setCountry(response.data.garage.address.country))
      dispatch(setLat(response.data.garage.address.lat))
      dispatch(setLng(response.data.garage.address.lng))

      dispatch(setFetching(false))
    }

    dispatch(setFetching(true))
    request(onSuccess, GET_GARAGE_DETAILS_GENERAL, { id: parseInt(id, 10) })
  }
}

export function intiEditGarageFloors(id) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setId(response.data.garage.id))

      dispatch(setFloors(response.data.garage.floors))
      // getState().garageSetup.floors.forEach((floor, index) => dispatch(scanSVG(floor.scheme, index)))
      getState().garageSetup.floors.forEach((floor, index) => {
        const placeLabels = floor.places.map(place => parseInt(place.label, 10))
        dispatch(setFloors(dispatch(changeFloors(index, 'from', Math.min(...placeLabels)))))
        dispatch(setFloors(dispatch(changeFloors(index, 'to', Math.max(...placeLabels)))))
      })

      dispatch(setLength(response.data.garage.length))
      dispatch(setHeight(response.data.garage.height))
      dispatch(setWidth(response.data.garage.width))
      dispatch(setWeight(response.data.garage.weight))

      dispatch(setFetching(false))
    }

    dispatch(setFetching(true))
    request(onSuccess, GET_GARAGE_DETAILS_FLOORS, { id: parseInt(id, 10) })
  }
}

export function intiEditGarageGates(id) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setRegisteredNumbers(response.data.registered_phone_numbers))

      dispatch(setId(response.data.garage.id))

      dispatch(setFloors(response.data.garage.floors))
      getState().garageSetup.floors.forEach((floor, index) => { dispatch(scanSVG(floor.scheme, index)) })
      dispatch(setGates(response.data.garage.gates.map(gate => ({
        ...gate,
        places: gate.places.map(place => `${place.floor.label}/${place.label}`).join(', ')
      }))))

      dispatch(setFetching(false))
    }

    dispatch(setFetching(true))
    request(onSuccess, GET_GARAGE_DETAILS_GATES, { id: parseInt(id, 10) })
  }
}

export function intiEditGarageOrder(id) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setId(response.data.garage.id))

      dispatch(setFloors(response.data.garage.floors))
      getState().garageSetup.floors.forEach((floor, index) => { dispatch(scanSVG(floor.scheme, index)) })
      dispatch(setOrder(
        response.data.garage.floors
        .reduce((arr, floor) => [ ...arr, ...floor.places ], [])
        .filter(place => place.priority !== 0)
        .sort((a, b) => b.priority - a.priority)
        .map(place => place.label)
      ))

      dispatch(setFetching(false))
    }

    dispatch(setFetching(true))
    request(onSuccess, GET_GARAGE_DETAILS_ORDER, { id: parseInt(id, 10) })
  }
}

export function updateGarageGeneral(id, backUrl) {
  return (dispatch, getState) => {
    const state = getState().garageSetup

    const onSuccess = response => {
      dispatch(setFetching(false))
      dispatch(fetchGarages())
      nav.to(`/${id}/admin/garageSetup/floors`)
    }

    const garage = { id:     +id,
      garage: { name:         state.name,
        company:      state.company,
        ic:           state.ic,
        dic:          state.dic,
        lpg:          state.lpg,
        img:          state.img === defaultImage ? null : state.img,
        pid_tarif_id: state.tarif_id,
        url:          backUrl,
        address:      { line_1:      state.line_1,
          line_2:      state.line_2,
          city:        state.city,
          postal_code: state.postal_code,
          state:       state.state,
          country:     state.country,
          lat:         parseFloat(state.lat),
          lng:         parseFloat(state.lng)
        }
      }
    }

    dispatch(setFetching(true))
    request(onSuccess, UPDATE_GARAGE, garage, 'garageMutations')
  }
}

export function updateGarageFloors(id, backUrl) {
  return (dispatch, getState) => {
    const state = getState().garageSetup

    const onSuccess = response => {
      if (response.data.update_garage.payment_url) {
        window.location.replace(response.data.update_garage.payment_url)
      } else {
        dispatch(setFetching(false))
        nav.to(`/${id}/admin/garageSetup/gates`)
      }
    }

    const garage = { id: +id, garage: { url: backUrl, floors: floorsForRequest(state) } }

    // console.log(garage)
    dispatch(setFetching(true))
    request(onSuccess, UPDATE_GARAGE, garage, 'garageMutations')
  }
}

export function updateGarageGates(id) {
  return (dispatch, getState) => {
    const state = getState().garageSetup

    const onSuccess = response => {
      dispatch(setFetching(false))
      nav.to(`/${id}/admin/garageSetup/order`)
    }

    const garage = { id: +id, garage: { gates: gatesForRequest(state) } }

    dispatch(setFetching(true))
    request(onSuccess, UPDATE_GARAGE, garage, 'garageMutations')
  }
}

export function updateGarageOrder(id) {
  return (dispatch, getState) => {
    const state = getState().garageSetup

    const onSuccess = response => {
      dispatch(setFetching(false))
      nav.to(`/${id}/admin/garageSetup/order`)
    }

    const garage = { id: +id, garage: { floors: floorsForRequest(state) } }
    dispatch(setFetching(true))
    request(onSuccess, UPDATE_GARAGE, garage, 'garageMutations')
  }
}

export function submitGarage() {
  return (dispatch, getState) => {
    const state = getState().garageSetup
    // check that all places at least one gate and gate.places have real place
    const garagePlaces = state.floors.reduce((arr, floor) => {
      return arr.concat(floor.places.map(place => { return place.label }))
    }, []).filter(unique).sort()

    const newFloors = floorsForRequest(state)
    const newGates = gatesForRequest(state)

    const onSuccess = response => {
      if (response.data.create_garage.payment_url) { // recurring payment redirect needed
        window.location.replace(response.data.create_garage.payment_url)
      } else {
        dispatch(fetchGarages())
        dispatch(setGarage(response.data.create_garage.id))
        dispatch(clearForm())
        nav.to('/dashboard')
      }
    }

    dispatch(setFetching(true))
    if (state.id === undefined) { // new garage
      request(onSuccess
             , CREATE_NEW_GARAGE
             , { garage: { name:         state.name,
               company:      state.company,
               ic:           state.ic,
               dic:          state.dic,
               lpg:          state.lpg,
               img:          state.img === defaultImage ? null : state.img,
               floors:       newFloors,
               gates:        newGates,
               pid_tarif_id: state.tarif_id,
               url:          window.location.href.split('?')[0],
               marketing:    state.bookingPage,
               address:      { line_1:      state.line_1,
                 line_2:      state.line_2,
                 city:        state.city,
                 postal_code: state.postal_code,
                 state:       state.state,
                 country:     state.country,
                 lat:         parseFloat(state.lat),
                 lng:         parseFloat(state.lng)
               }
             }
             }
             , 'garageMutations'
             )
    } else { // garage edit
      request(onSuccess
             , UPDATE_GARAGE
             , { id:     state.id,
               garage: { name:         state.name,
                 company:      state.company,
                 ic:           state.ic,
                 dic:          state.dic,
                 lpg:          state.lpg,
                 img:          state.img === defaultImage ? null : state.img,
                 floors:       newFloors,
                 gates:        newGates,
                 pid_tarif_id: state.tarif_id,
                        //  , url:          window.location.href.split('?')[0]
                 address:      { line_1:      state.line_1,
                   line_2:      state.line_2,
                   city:        state.city,
                   postal_code: state.postal_code,
                   state:       state.state,
                   country:     state.country,
                   lat:         parseFloat(state.lat),
                   lng:         parseFloat(state.lng)
                 }
               }
             }
             , 'garageMutations'
             )
    }

    // check if all places have gates
    const gatePlaces = newGates.reduce((arr, gate) => {
      return arr.concat(gate.places)
    }, []).filter(unique).sort()

    const placesHaveGate = garagePlaces.reduce((bool, garagePlace) => {
      return bool && gatePlaces.indexOf(garagePlace) !== -1
    }, true)

    if (!placesHaveGate) {
      dispatch(setError(t([ 'newGarage', 'placeNoGate' ])))
    }
  }
}

function prepareModuleOrder() {
  return (dispatch, getState) => {
    const state = getState().garageSetup
    return state.gsmModules === 0 ? null : { amount:  state.gsmModules,
      address: { name:        state.gsm_name,
        line_1:      state.gsm_line_1,
        line_2:      state.gsm_line_2,
        city:        state.gsm_city,
        postal_code: state.gsm_postal_code,
        state:       state.gsm_state,
        country:     state.gsm_country
      }
    }
  }
}

function prepareLayoutOrder() {
  return (dispatch, getState) => {
    const state = getState().garageSetup
    return state.gsmModules === 0 ? null : { amount: state.floors.length }
  }
}

function floorsForRequest(state) {
  const reverseOrder = [ ...state.order ].reverse()
  return state.floors.map(floor => {
    floor.places = floor.places.map(place => ({
      ...place,
      length:   +state.length || null,
      height:   +state.height || null,
      width:    +state.width || null,
      weight:   +state.weight || null,
      priority: reverseOrder.findIndex(p => p === place.label) + 1
    }))
    return removeKeys(floor, [ 'from', 'to' ])
  })
}

function removeKeys(object, keys) {
  return Object.keys(object)
               .filter(key => keys.indexOf(key) < 0)
               .reduce((newObj, key) => ({ ...newObj, [key]: object[key] }), {})
}


function gatesForRequest(state) {
  return state.gates.map(gate => {
    const { places, has_password, ...gateWithoutPlaces } = gate
    const floors = gate.places
      .split(',')
      .filter(string => string.includes('/')) // remove labels without "/" of a bat
      .map(floorPlace => ({ // find place and floor labels
        floor: floorPlace.split('/')[0].trim(),
        place: floorPlace.split('/')[1].trim()
      }))
      .filter(o => { // find places where floor exists and place exists
        const floor = state.floors.find(fl => fl.label === o.floor)
        return floor && !!floor.places.find(place => place.label === o.place)
      })
      .reduce((acc, o) => { // create [{ label: floor, places: [palce, ...]}, ...] structure
        const floor = acc.find(fl => fl.label === o.floor)
        floor ? floor.places.push(o.place) : acc.push({ label: o.floor, places: [ o.place ] })
        return acc
      }, [])

    return { ...gateWithoutPlaces,
      address: {
        line_1:      gate.address.line_1,
        city:        state.city,
        postal_code: state.postal_code,
        state:       state.state || undefined,
        line_2:      state.line_2 || undefined,
        country:     state.country,
        lng:         parseFloat(gate.address.lng),
        lat:         parseFloat(gate.address.lat)
      },
      floors
    }
  })
}

export function addAllPlaces(index) {
  return (dispatch, getState) => {
    const allPlaces = getState().garageSetup.floors
      .reduce((acc, floor) => [ ...acc, ...floor.places.map(place => `${floor.label}/${place.label}`) ], [])
      .join(', ')

    dispatch(changeGatePlaces(allPlaces, index))
  }
}
