import {
  GARAGE_SETUP_SET_ID,
  GARAGE_SETUP_SET_SELECTED_FLOOR,
  GARAGE_SETUP_SET_HIGHLIGHT,
  GARAGE_SETUP_SET_ERROR,
  GARAGE_SETUP_SET_FETCHING,
  GARAGE_SETUP_SET_AVAILABLE_TARIFS,
  GARAGE_SETUP_SET_TARIF_ID,
  GARAGE_SETUP_SET_IMG,
  GARAGE_SETUP_SET_NAME,
  GARAGE_SETUP_SET_IC,
  GARAGE_SETUP_SET_DIC,
  GARAGE_SETUP_SET_IBAN,
  GARAGE_SETUP_SET_LINE_1,
  GARAGE_SETUP_SET_LINE_2,
  GARAGE_SETUP_SET_CITY,
  GARAGE_SETUP_SET_POSTAL_CODE,
  GARAGE_SETUP_SET_STATE,
  GARAGE_SETUP_SET_COUNTRY,
  GARAGE_SETUP_SET_LAT,
  GARAGE_SETUP_SET_LNG,
  GARAGE_SETUP_SET_FLOORS,
  GARAGE_SETUP_SET_LPG,
  GARAGE_SETUP_SET_LENGTH,
  GARAGE_SETUP_SET_HEIGHT,
  GARAGE_SETUP_SET_WIDTH,
  GARAGE_SETUP_SET_WEIGHT,
  GARAGE_SETUP_SET_GATES,
  GARAGE_SETUP_SET_ORDER,
  GARAGE_SETUP_SET_BOOKING_PAGE,
  GARAGE_SETUP_CLEAR_FORM
}  from '../actions/garageSetup.actions'


export const emptyFloor = { label:  ""
                          , from:   ""
                          , to:     ""
                          , scheme: ""
                          , places: [] //places: [{label: ... }, ... ]
                          }

export const emptyGate = { label:   ""
                         , phone:   ""
                         , places:  "" // places of this gate, example: "5-15, 17-20, 30, 32"
                         , address: { line_1:      ""
                                    , lat:         ""
                                    , lng:         ""
                                    }
                         }

export const defaultImage = './public/garage_icon.jpg'
export const gsmModulePrice = 4600
export const layoutPrice = 540
export const bookingPagePrice = 2100


const defaultState =  { id:                undefined
                      , selectedFloor:     0
                      , highlight:         false
                      , error:             undefined
                      , fetching:          false

                      // general settings
                      , availableTarifs:   []
                      , tarif_id:          undefined
                      , img:               defaultImage
                      , name:              ""
                      , ic:                ""
                      , dic:               ""
                      , iban:              ""
                      , line_1:            ""
                      , line_2:            ""
                      , city:              ""
                      , postal_code:       ""
                      , state:             ""
                      , country:           ""
                      , lat:               ""
                      , lng:               ""

                      // floors
                      , floors:            [ emptyFloor ]
                      , lpg:               false
                      , length:            undefined
                      , height:            undefined
                      , width:             undefined
                      , weight:            undefined

                      // gates
                      , gates:             [] // first empty floor is added onComponentMount

                      //order
                      , order:             [] // ['label 1', 'label 2', ...]

                      // subscribe
                      , bookingPage:       false
                      }


export default function garageSetup (reducerState = defaultState, action) {
  switch (action.type) {

    case GARAGE_SETUP_SET_ID:
      return { ... reducerState
             , id: action.value
             }

    case GARAGE_SETUP_SET_SELECTED_FLOOR:
      return { ... reducerState
             , selectedFloor: action.value
             }

    case GARAGE_SETUP_SET_HIGHLIGHT:
      return { ... reducerState
             , highlight: action.value
             }

    case GARAGE_SETUP_SET_ERROR:
      return { ... reducerState
             , error: action.value
             }

    case GARAGE_SETUP_SET_FETCHING:
      return { ... reducerState
             , fetching: action.value
             }

    case GARAGE_SETUP_SET_AVAILABLE_TARIFS:
      return { ... reducerState
             , availableTarifs: action.value
             }

    case GARAGE_SETUP_SET_TARIF_ID:
      return { ... reducerState
             , tarif_id: action.value
             }

    case GARAGE_SETUP_SET_IMG:
      return { ... reducerState
             , img: action.value
             }

    case GARAGE_SETUP_SET_NAME:
      return { ... reducerState
             , name: action.value
             }

    case GARAGE_SETUP_SET_IC:
      return { ... reducerState
             , ic: action.value
             }

    case GARAGE_SETUP_SET_DIC:
      return { ... reducerState
             , dic: action.value
             }

    case GARAGE_SETUP_SET_IBAN:
      return { ... reducerState
             , iban: action.value
             }

    case GARAGE_SETUP_SET_LINE_1:
      return { ... reducerState
             , line_1: action.value
             }

    case GARAGE_SETUP_SET_LINE_2:
      return { ... reducerState
             , line_2: action.value
             }

    case GARAGE_SETUP_SET_CITY:
      return { ... reducerState
             , city: action.value
             }

    case GARAGE_SETUP_SET_POSTAL_CODE:
      return { ... reducerState
             , postal_code: action.value
             }

    case GARAGE_SETUP_SET_STATE:
      return { ... reducerState
             , state: action.value
             }

    case GARAGE_SETUP_SET_COUNTRY:
      return { ... reducerState
             , country: action.value
             }

    case GARAGE_SETUP_SET_LAT:
      return { ... reducerState
             , lat: action.value
             }

    case GARAGE_SETUP_SET_LNG:
      return { ... reducerState
             , lng: action.value
             }

    case GARAGE_SETUP_SET_FLOORS:
      return { ... reducerState
             , floors: action.value
             }

    case GARAGE_SETUP_SET_LPG:
      return { ... reducerState
             , lpg: action.value
             }

    case GARAGE_SETUP_SET_LENGTH:
      return { ... reducerState
             , length: action.value
             }

    case GARAGE_SETUP_SET_HEIGHT:
      return { ... reducerState
             , height: action.value
             }

    case GARAGE_SETUP_SET_WIDTH:
      return { ... reducerState
             , width: action.value
             }

    case GARAGE_SETUP_SET_WEIGHT:
      return { ... reducerState
             , weight: action.value
             }

    case GARAGE_SETUP_SET_GATES:
      return { ... reducerState
             , gates: action.value
             }

    case GARAGE_SETUP_SET_ORDER:
      return { ... reducerState
             , order: action.value
             }

    case GARAGE_SETUP_SET_BOOKING_PAGE:
      return { ... reducerState
             , bookingPage: action.value
             }

    case GARAGE_SETUP_CLEAR_FORM:
      return defaultState

    default:
      return reducerState
  }
}
