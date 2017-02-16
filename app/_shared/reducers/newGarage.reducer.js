import {
  SET_GARAGE_ID,
  SET_GARAGE_NAME,
  SET_FLOORS,
  CLEAR_FORM,
  SET_GARAGE_ADDRESS,
  SET_GARAGE_LAT,
  SET_GARAGE_LNG,
  NEW_GARAGE_SELECT_FLOOR
}  from '../actions/newGarage.actions'

const defaultState =  { id:             undefined
                      , name:           ""
                      , address:        ""
                      , lat:            ""
                      , lng:            ""
                      , floors:         [{ label:"",  from: "", to: "", scheme:"", places:[]}] //places: [{label: ... }, ... ]
                      , selectedFloor:  0
                      }


export default function newGarage (state = defaultState, action) {
  switch (action.type) {

    case SET_GARAGE_ID:
    return  { ...state
            , id: action.value
            }
    case SET_GARAGE_NAME:
    return  { ...state
            , name: action.value
            }
    case SET_GARAGE_ADDRESS:
    return  { ...state
            , address: action.value
            }
    case SET_GARAGE_LAT:
    return  { ...state
            , lat: action.value
            }
    case SET_GARAGE_LNG:
    return  { ...state
            , lng: action.value
            }

    case SET_FLOORS:
    return  { ...state
            , floors: action.value
            }

    case NEW_GARAGE_SELECT_FLOOR:
    return  { ...state
            , selectedFloor: action.value
            }


    case CLEAR_FORM:
    return defaultState

    default:
      return state
  }
}
