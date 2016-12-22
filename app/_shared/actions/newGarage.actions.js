import update         from 'react-addons-update'
import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { toGarages }  from './pageBase.actions'

import { CREATE_NEW_GARAGE, GET_GARAGE_DETAILS, UPDATE_GARAGE } from '../queries/newGarage.queries'

export const SET_GARAGE_ID           = "SET_GARAGE_ID"
export const SET_GARAGE_NAME         = "SET_GARAGE_NAME"
export const SET_GARAGE_ADDRESS      = "SET_GARAGE_ADDRESS"
export const SET_GARAGE_GPS          = "SET_GARAGE_GPS"
export const SET_FLOORS              = "SET_FLOORS"
export const NEW_GARAGE_SELECT_FLOOR = "NEW_GARAGE_SELECT_FLOOR"
export const CLEAR_FORM              = "CLEAR_FORM"


export function setId (id){
  return  { type: SET_GARAGE_ID
          , value: id
          }
}

export function setName (name){
  return  { type: SET_GARAGE_NAME
          , value: name
          }
}

export function setAddress (address){
  return  { type: SET_GARAGE_ADDRESS
          , value: address
          }
}

export function setGPS (GPS){
  return  { type: SET_GARAGE_GPS
          , value: GPS
          }
}

export function setFloors (floors){
  return  { type: SET_FLOORS
          , value: floors
          }
}

export function setFloor (floor){
  return  { type: NEW_GARAGE_SELECT_FLOOR
          , value: floor
          }
}

export function clearForm (){
  return  { type: CLEAR_FORM }
}


export function changeScheme (fileContent, index){
  return (dispatch, getState) => {
    var floors = getState().newGarage.floors
    var updateFloor = update(floors[index], {scheme: {$set: fileContent}})

    var places = []
    var from = undefined
    var to = undefined
    var splitedContent = fileContent.split('Place')
    for (var i = 1; i < splitedContent.length; i++) {
      const label = splitedContent[i].substring(0,splitedContent[i].indexOf('"',0))
      from = from ? from > parseInt(label) ? parseInt(label) : from : parseInt(label)
      to = to ? to < parseInt(label) ? parseInt(label) : to : parseInt(label)
      places.push( {label: label} )
    }
    updateFloor = update(updateFloor, {places: {$set: places}})
    updateFloor = update(updateFloor, {from: {$set: from}})
    updateFloor = update(updateFloor, {to: {$set: to}})
    var newData = update(floors, {$splice: [[index, 1, updateFloor]] });

    if (newData[floors.length-1].label != "" || newData[floors.length-1].scheme != "") {
      newData.push({ label:"", scheme:"", places:[]})
    }

    dispatch(setFloors(newData))
  }
}

export function removeFloor(index){
  return (dispatch, getState) => {
    dispatch(setFloors(update(getState().newGarage.floors, {$splice: [[index, 1]]})))
  }
}

export function submitNewGarage(state) {
  return (dispatch, getState) => {
    var newFloors = update(state.floors, {$splice: [[state.floors.length-1, 1]]})

    newFloors = newFloors.map((floor) => {
      delete floor['from']
      delete floor['to']
      return floor
    })

    const onSuccess = (response) => {
      dispatch(clearForm())
      nav.to('/garages')
    }


      dispatch(clearForm())

    if (state.id == undefined) { // new garage
      request( onSuccess
             , CREATE_NEW_GARAGE
             , { garage: {name: state.name, address: state.address, GPS: state.GPS, floors: newFloors}}
             , "garageMutations"
             )
    } else { // garage edit
      request( onSuccess
             , UPDATE_GARAGE
             , {id: state.id, garage: { name: state.name, address: state.address, GPS: state.GPS, floors: newFloors}}
             , "garageMutations"
             )
    }

  }
}


export function changeFloorName(value, index) {
  return (dispatch, getState) => {
    dispatch(changeFloorValue("label", value, index))
  }
}

export function changeFloorFrom(value,index) {
  return (dispatch, getState) => {
    dispatch(changeFloorValue("from", value, index))
    dispatch(createFloor(index))
  }
}

export function changeFloorTo(value,index) {
  return (dispatch, getState) => {
    dispatch(changeFloorValue("to", value, index))
    dispatch(createFloor(index))
  }
}

function changeFloorValue(name, value, index){
  return (dispatch, getState) => {
    var floors = getState().newGarage.floors
    var newFloor = update(floors[index], {[name]: {$set: value}})
    var newData = update(floors, {$splice: [[index, 1, newFloor]] });

    newData = insertEmptyRow(newData)
    dispatch(setFloors(newData))
  }
}

//=============================================================================
// No SVG Floor handling
function insertEmptyRow(data){
  if (data[data.length-1].label != "" || data[data.length-1].from != "" || data[data.length-1].to != "") {
    data.push({ label:"", from: "", to: "", scheme:"", places:[]})
  }
  return data
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
    for (var i = 0; i <= (to - from); i++) {
      var x = (i % inRow) * (rectWidth + padding) + padding
      var y = ( ( Math.floor(i / inRow) + 1 ) * padding ) + Math.floor(i / inRow) * rectHeight
      rects += `<rect id="Place${from + i}" x="${x}" y="${y}" class="st2" width="${rectWidth}" height="${rectHeight}"/>`
      places.push({label: (from + i) + ""}) // has to be string...
    }

    // return { label: label, scheme: newSVGHead+rects+newSVGEnd, places: places}
    dispatch(changeFloorValue('scheme', newSVGHead+rects+newSVGEnd, index))
    dispatch(changeFloorValue('places', places, index))
  }
}

// ============================================================================
// EDIT GARAGE
export function initEditGarage(id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      response.data.garage.floors = response.data.garage.floors.map((floor) => {
        return floor
      })
      response.data.garage.floors.push({ label:"", from: "", to: "", scheme:"", places:[]})

      dispatch(setId(response.data.garage.id))
      dispatch(setName(response.data.garage.name))
      dispatch(setAddress(response.data.garage.address))
      dispatch(setGPS(response.data.garage.GPS))
      dispatch(setFloors(response.data.garage.floors))
      response.data.garage.floors.filter((fl, index, arr) => {return index != arr.length-1})
                                 .map((floor, index) => {dispatch(changeScheme (floor.scheme, index))})

      dispatch(toGarages())
    }
    request(onSuccess, GET_GARAGE_DETAILS, {id: parseInt(id)})
  }
}
