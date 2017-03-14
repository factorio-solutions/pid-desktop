import {
  SET_CAR_LICENCE_PLATE,
  SET_CAR_COLOR,
  SET_CAR_MODEL,
  SET_CAR_WIDTH,
  SET_CAR_HEIGHT,
  SET_CAR_LENGTH,
  SET_CAR_LPG,
  SET_CAR_HIGHLIGHT,
  CLEAR_CAR_FORM
}  from '../actions/newCar.actions'

const defaultState =  { licence_plate: ''
                      , color:         ''
                      , model:         ''
                      , width:         ''
                      , height:        ''
                      , length:        ''
                      , highlight:     false
                      , lpg:           false
                      }


export default function newCar (state = defaultState, action) {
  switch (action.type) {

    case SET_CAR_LICENCE_PLATE:
      return { ... state
             , licence_plate: action.value
             }

    case SET_CAR_COLOR:
      return { ... state
             , color: action.value
             }

    case SET_CAR_MODEL:
      return { ... state
             , model: action.value
             }

    case SET_CAR_WIDTH:
      return { ... state
             , width: action.value
             }

    case SET_CAR_HEIGHT:
      return { ... state
             , height: action.value
             }

    case SET_CAR_LENGTH:
      return { ... state
             , length: action.value
             }

    case SET_CAR_LPG:
      return { ... state
             , lpg: !state.lpg
             }

    case SET_CAR_HIGHLIGHT:
      return { ... state
             , highlight: action.value
             }

    case CLEAR_CAR_FORM:
      return defaultState

    default:
      return state
  }
}
