import request from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { CREATE_NEW_CAR, EDIT_CAR_INIT, EDIT_CAR_MUTATION } from '../queries/newCar.queries'

export const SET_CAR_LICENCE_PLATE = "SET_CAR_LICENCE_PLATE"
export const SET_CAR_COLOR         = "SET_CAR_COLOR"
export const SET_CAR_MODEL         = "SET_CAR_MODEL"
export const SET_CAR_NAME          = "SET_CAR_NAME"
export const SET_CAR_WIDTH         = "SET_CAR_WIDTH"
export const SET_CAR_HEIGHT        = "SET_CAR_HEIGHT"
export const SET_CAR_LENGTH        = "SET_CAR_LENGTH"
export const SET_CAR_LPG           = "SET_CAR_LPG"
export const SET_CAR_HIGHLIGHT     = "SET_CAR_HIGHLIGHT"
export const CLEAR_CAR_FORM        = "CLEAR_CAR_FORM"


export function setLicencePlate (value){
  return { type: SET_CAR_LICENCE_PLATE
         , value
         }
}

export function setColor (value){
  return { type: SET_CAR_COLOR
         , value
         }
}

export function setModel (value){
  return { type: SET_CAR_MODEL
         , value
         }
}

export function setName (value){
  return { type: SET_CAR_NAME
         , value
         }
}

export function setWidth (value){
  return { type: SET_CAR_WIDTH
         , value
         }
}

export function setHeight (value){
  return { type: SET_CAR_HEIGHT
         , value
         }
}

export function setLength (value){
  return { type: SET_CAR_LENGTH
         , value
         }
}

export function setLPG (){
  return { type: SET_CAR_LPG }
}

export function setHighlight (value){
  return { type: SET_CAR_HIGHLIGHT
         , value
         }
}

export function toggleHighlight (){
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newCar.highlight))
  }
}


export function clearForm (){
  return { type: CLEAR_CAR_FORM }
}



export function initCar(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setLicencePlate(response.data.user_cars[0].car.licence_plate))
      dispatch(setColor(response.data.user_cars[0].car.color))
      dispatch(setModel(response.data.user_cars[0].car.model))
      dispatch(setName(response.data.user_cars[0].car.name))
      dispatch(setWidth(response.data.user_cars[0].car.width))
      dispatch(setHeight(response.data.user_cars[0].car.height))
      dispatch(setLength(response.data.user_cars[0].car.length))
      dispatch(setLPG(response.data.user_cars[0].car.lpg))
    }

    request( onSuccess
           , EDIT_CAR_INIT
           , { id: parseInt(id)}
           )
  }
}

export function submitNewCar(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(clearForm())
      nav.to('/profile')
    }

    if (id) { // then edit client
      request( onSuccess
             , EDIT_CAR_MUTATION
             , { id: parseInt(id)
               , car: generateCar(getState().newCar)
               }
             , "RenameClient"
             )
    } else { // then new client
      request( onSuccess
             , CREATE_NEW_CAR
             , { car: generateCar(getState().newCar) }
             , "garageMutations"
             )
    }
  }
}

function generateCar(state){
  return { licence_plate: state.licence_plate
         , color:         state.color
         , model:         state.model
         , name:          state.name
         , width:         state.width != '' ? parseFloat(state.width) : undefined
         , height:        state.height != '' ? parseFloat(state.height) : undefined
         , length:        state.length != '' ? parseFloat(state.length) : undefined
         , lpg:           state.lpg
         }
}
