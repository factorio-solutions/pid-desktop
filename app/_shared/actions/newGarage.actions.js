import update         from 'react-addons-update'
import _              from 'lodash'

import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { t }          from '../modules/localization/localization'
import { toGarages }  from './pageBase.actions'

import { CREATE_NEW_GARAGE, GET_GARAGE_DETAILS, UPDATE_GARAGE } from '../queries/newGarage.queries'
import { emptyGate, emptyFloor }                                from '../reducers/newGarage.reducer'


export const NEW_GARAGE_SET_ID                  = "NEW_GARAGE_SET_ID"
export const NEW_GARAGE_SET_NAME                = "NEW_GARAGE_SET_NAME"
export const NEW_GARAGE_SET_LPG                 = "NEW_GARAGE_SET_LPG"
export const NEW_GARAGE_SET_CITY                = "NEW_GARAGE_SET_CITY"
export const NEW_GARAGE_SET_POSTAL_CODE         = "NEW_GARAGE_SET_POSTAL_CODE"
export const NEW_GARAGE_SET_STATE               = "NEW_GARAGE_SET_STATE"
export const NEW_GARAGE_SET_COUNTRY             = "NEW_GARAGE_SET_COUNTRY"
export const NEW_GARAGE_SET_GATES               = "NEW_GARAGE_SET_GATES"
export const NEW_GARAGE_SET_FLOORS              = "NEW_GARAGE_SET_FLOORS"
export const NEW_GARAGE_NEW_GARAGE_SELECT_FLOOR = "NEW_GARAGE_NEW_GARAGE_SELECT_FLOOR"
export const NEW_GARAGE_SET_ERROR               = "NEW_GARAGE_SET_ERROR"
export const NEW_GARAGE_CLEAR_FORM              = "NEW_GARAGE_CLEAR_FORM"


export function setId (id){
  return  { type: NEW_GARAGE_SET_ID
          , value: id
          }
}

export function setName (name){
  return  { type: NEW_GARAGE_SET_NAME
          , value: name
          }
}

export function setLPG (bool){
  return  { type: NEW_GARAGE_SET_LPG
          , value: bool
          }
}

export function setCity (city){
  return  { type: NEW_GARAGE_SET_CITY
          , value: city
          }
}
export function setPostalCode (postalCode){
  return  { type: NEW_GARAGE_SET_POSTAL_CODE
          , value: postalCode
          }
}
export function setState (state){
  return  { type: NEW_GARAGE_SET_STATE
          , value: state
          }
}
export function setCountry (country){
  return  { type: NEW_GARAGE_SET_COUNTRY
          , value: country
          }
}

export function setGates (gates){
  return  { type: NEW_GARAGE_SET_GATES
          , value: gates
          }
}

export function setFloors (floors){
  return  { type: NEW_GARAGE_SET_FLOORS
          , value: floors
          }
}

export function setFloor (floor){
  return  { type: NEW_GARAGE_NEW_GARAGE_SELECT_FLOOR
          , value: floor
          }
}

export function setError (error){
  return  { type: NEW_GARAGE_SET_ERROR
          , value: error
          }
}

export function clearForm (){
  return  { type: NEW_GARAGE_CLEAR_FORM }
}


export function toggleLPG(){ return (dispatch, getState) => { dispatch(setLPG(!getState().newGarage.lpg)) } }

export function removeFloor(index){ return (dispatch, getState) => { dispatch(setFloors(update(getState().newGarage.floors, {$splice: [[index, 1]]}))) } }
export function removeGate(index){ return (dispatch, getState) => { dispatch(setGates(update(getState().newGarage.gates, {$splice: [[index, 1]]}))) } }

export function changeFloorLabel(value, index){ return (dispatch, getState) => { dispatch(setFloors(dispatch(changeFloors(index, 'label',  value)))) } }
export function changeFloorPlaces(value, index){ return (dispatch, getState) => { dispatch(setFloors(dispatch(changeFloors(index, 'places', value)))) } }
export function changeFloorFrom(value, index){
  return (dispatch, getState) => {
    dispatch(setFloors(dispatch(changeFloors(index, 'from',   value))))
    dispatch(createFloor(index))
  }
}
export function changeFloorTo(value, index){
  return (dispatch, getState) => {
    dispatch(setFloors(dispatch(changeFloors(index, 'to',     value))))
    dispatch(createFloor(index))
  }
}
export function changeFloorScheme(value, index, scan){
  return (dispatch, getState) => {
    dispatch(setFloors(dispatch(changeFloors(index, 'scheme', value))))
    if (scan) dispatch(scanSVG(value, index))
  }
}

export function changeGateLabel(value, index){  return (dispatch, getState) => { dispatch(setGates(dispatch(changeGates(index, 'label',  value)))) } }
export function changeGatePhone(value, index){  return (dispatch, getState) => { dispatch(setGates(dispatch(changeGates(index, 'phone',  value)))) } }
export function changeGatePlaces(value, index){ return (dispatch, getState) => { dispatch(setGates(dispatch(changeGates(index, 'places', value)))) } }

export function changeGateAddressLine1(value, index){ return (dispatch, getState) => { dispatch(setGates(dispatch(changeGates(index, 'address', updateKey( getState().newGarage.gates[index].address, 'line_1', value))))) } }
export function changeGateAddressLat(value, index){   return (dispatch, getState) => { dispatch(setGates(dispatch(changeGates(index, 'address', updateKey( getState().newGarage.gates[index].address, 'lat',    value))))) } }
export function changeGateAddressLng(value, index){   return (dispatch, getState) => { dispatch(setGates(dispatch(changeGates(index, 'address', updateKey( getState().newGarage.gates[index].address, 'lng',    value))))) } }


function changeFloors(index, key, value){
  return (dispatch, getState) => {
    return insertEmptyFloor(dispatch(updateValue('floors', index, key, value)))
  }
}

function changeGates(index, key, value){
  return (dispatch, getState) => {
    return insertEmptyGate(dispatch(updateValue('gates', index, key, value)))
  }
}

function insertEmptyFloor(data){
  if (!_.isEqual(data[data.length-1], emptyFloor)) data.push(emptyFloor)
  return data
}

function insertEmptyGate(data){
  if (!_.isEqual(data[data.length-1], emptyGate)) data.push(emptyGate)
  return data
}

// type - array in which to find - floors, gates ...
// index - index in array
// key - name of key to be updated
// value - value to change key to
function updateValue(type, index, key, value){
  return (dispatch, getState) => {
    let arr = getState().newGarage[type]
    let newObject = updateKey(arr[index], key, value)
    var newArr = update(arr, {$splice: [[index, 1, newObject]] })

    return newArr
  }
}

function updateKey(object, key, value){
  return update(object, {[key]: {$set: value}})
}


function scanPlaces(string){
  return string.split(',').reduce((arr, val)=>{
    if (val.indexOf('-') == -1){ // single value
      arr.push(parseInt(val)+"")
    } else { // range
      const range = val.split('-')
      const from = parseInt(range[0])
      const to = parseInt(range[1])

      if (from < to){
        for (var i = from; i <= to; i++) { arr.push(i+"") }
      } else {
        for (var i = to; i <= from; i++) { arr.push(i+"") }
      }
    }
    return arr
  }, []).filter(unique).filter((value)=>{return value != "NaN"}) // only unique not NaN numbers
}

function unique(value, index, array){
  return array.indexOf(value) === index
}

export function scanSVG (fileContent, index){
  return (dispatch, getState) => {
    var places         = []
    var from           = undefined
    var to             = undefined
    var splitedContent = fileContent.split('Place')

    for (var i = 1; i < splitedContent.length; i++) {
      const label = splitedContent[i].substring(0,splitedContent[i].indexOf('"',0))
      from = from ? from > parseInt(label) ? parseInt(label) : from : parseInt(label)
      to = to ? to < parseInt(label) ? parseInt(label) : to : parseInt(label)
      places.push( {label: label} )
    }

    dispatch(setFloors(dispatch(changeFloors(index, 'places', places))))
    dispatch(setFloors(dispatch(changeFloors(index, 'from', from))))
    dispatch(setFloors(dispatch(changeFloors(index, 'to', to))))
    dispatch(setFloors(dispatch(changeFloors(index, 'scheme', fileContent)))) // has to be last, from or to change will render new scheme
  }
}

function createFloor (index) {
  return (dispatch, getState) => {
    var floor = getState().newGarage.floors[index]
    if (floor.from == "" || floor.to == "") return
    var from = parseInt(floor.from)
    var to = parseInt(floor.to)

    var inRow = Math.floor(Math.sqrt( to - from + 1 )) //+ 1 // optional + 1
    var inColumn = Math.ceil((to - from + 1) / inRow)

    var padding = 10
    var canvasWidth = 900
    var canvasHeight = 1350

    var newSVGHead = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="${canvasWidth}px" height="${canvasHeight}px" viewBox="0 0 900 1350" style="enable-background:new 0 0 900 1350;" xml:space="preserve"><style type="text/css">.st0{fill:#B3B3B3;}.st1{fill:#00D3FF;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st2{fill:#E6E6E6;}.st3{fill:#CCCCCC;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st4{fill:#4D4D4D;stroke:#4D4D4D;stroke-width:0.75;stroke-miterlimit:10;}.st5{fill:none;stroke:#000000;stroke-miterlimit:10;}.st6{fill:none;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st7{fill:none;stroke:#000000;stroke-width:7;stroke-miterlimit:10;}.st8{stroke:#000000;stroke-width:3;stroke-miterlimit:10;}.st9{stroke:#000000;stroke-miterlimit:10;}.st10{fill:#CCCCCC;}.st11{fill:#8CC63F;}</style><g id="IMGback"><rect style="fill: gray" id="Outside" className="st0" x="0" y="0" width="900" height="1350"/></g><g id="Gcontrol">`
    var newSVGEnd = '</g></svg>'

    var rectWidth = ( canvasWidth - (padding * (inRow + 1) ) ) / inRow
    var rectHeight = ( canvasHeight - ( padding * ( inColumn + 1 ) ) ) / inColumn

    var rects = ""
    var places = []
    for (let i = 0; i <= (to - from); i++) {
      var x = (i % inRow) * (rectWidth + padding) + padding
      var y = ( ( Math.floor(i / inRow) + 1 ) * padding ) + Math.floor(i / inRow) * rectHeight
      rects += `<rect id="Place${from + i}" x="${x}" y="${y}" class="st2" width="${rectWidth}" height="${rectHeight}"/>`
      places.push({label: (from + i) + ""}) // has to be string...
    }

    dispatch(changeFloorScheme(newSVGHead+rects+newSVGEnd, index), false)
    dispatch(changeFloorPlaces(places, index))
  }
}


// EDIT GARAGE
export function initEditGarage(id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      console.log(response);

      dispatch(setId(response.data.garage.id))
      dispatch(setName(response.data.garage.name))

      response.data.garage.floors.push(emptyFloor)
      dispatch(setFloors(response.data.garage.floors))
      getState().newGarage.floors.filter((fl, index, arr) => {return index != arr.length-1})
                                 .forEach((floor, index) => {dispatch(scanSVG (floor.scheme, index))})

      if (response.data.garage.gates.length != 0){
        dispatch(setCity(response.data.garage.gates[0].address.city))
        dispatch(setPostalCode(response.data.garage.gates[0].address.postal_code))
        dispatch(setState(response.data.garage.gates[0].address.state))
        dispatch(setCountry(response.data.garage.gates[0].address.country))
      }

      response.data.garage.gates.forEach((gate)=>{
        gate.places = gate.places.reduce((arr, place)=> {
          arr.push(place.label)
          return arr
        }, []).join(', ')
      })
      response.data.garage.gates.push(emptyGate)
      dispatch(setGates(response.data.garage.gates))

      dispatch(toGarages())
    }
    request(onSuccess, GET_GARAGE_DETAILS, {id: parseInt(id)})
  }
}

export function submitGarage() {
  return (dispatch, getState) => {
    let state = getState().newGarage
    // check that all places at least one gate and gate.places have real place
    let garagePlaces = state.floors.reduce((arr, floor)=>{
      return arr.concat(floor.places.map((place)=>{return place.label}))
    }, []).filter(unique).sort()

    let gatePlaces = state.gates.reduce((arr, gate)=>{
      return arr.concat(scanPlaces(gate.places))
    }, []).filter(unique).sort()

    let placesHaveGate = garagePlaces.reduce((bool, garagePlace)=>{
      return bool && gatePlaces.indexOf(garagePlace) != -1
    }, true)

    let gatePlacesExist = gatePlaces.reduce((bool, gatePlace)=>{
      return bool && garagePlaces.indexOf(gatePlace) != -1
    }, true)

    if (placesHaveGate && gatePlacesExist){ // all OK
      // remove last (empty) floor, last (empty) gate, scan gate places
      let newFloors = update(state.floors, {$splice: [[state.floors.length-1, 1]]})
      let newGates = update(state.gates, {$splice: [[state.gates.length-1, 1]]})

      newFloors = newFloors.map((floor) => {
        return _.omit(floor, ['from', 'to']);
      })

      newGates = newGates.map((gate)=>{
        let newGate = Object.assign({}, gate)
        newGate.address.city = state.city
        newGate.address.postal_code = state.postal_code
        if (state.state != "") newGate.address.state = state.state
        newGate.address.country = state.country
        newGate.address.lng = parseFloat(newGate.address.lng)
        newGate.address.lat = parseFloat(newGate.address.lat)
        newGate.places = scanPlaces(newGate.places)
        return newGate
      })

      const onSuccess = (response) => {
        console.log('success');
        dispatch(clearForm())
        nav.to('/garages')
      }

      if (state.id == undefined) { // new garage
        request( onSuccess
               , CREATE_NEW_GARAGE
               , { garage: { name: state.name
                          //  , lpg: state.lpg
                           , floors: newFloors
                           , gates: newGates
                           }
                 }
               , "garageMutations"
               )
      } else { // garage edit
        request( onSuccess
               , UPDATE_GARAGE
               , { id: state.id
                 , garage: { name: state.name
                          //  , lpg: state.lpg
                           , floors: newFloors
                           , gates: newGates
                           }
                 }
               , "garageMutations"
               )
      }
    } else { // not OK
      gatePlacesExist ? dispatch(setError(t(['newGarage', 'placeNoGate']))) : dispatch(setError(t(['newGarage', 'placeNoExist'])))
    }
  }
}
