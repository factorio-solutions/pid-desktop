import {
  NEW_GARAGE_SET_ID,
  NEW_GARAGE_SET_NAME,
  NEW_GARAGE_SET_LPG,
  NEW_GARAGE_SET_CITY,
  NEW_GARAGE_SET_POSTAL_CODE,
  NEW_GARAGE_SET_STATE,
  NEW_GARAGE_SET_COUNTRY,
  NEW_GARAGE_SET_FLOORS,
  NEW_GARAGE_SET_GATES,
  NEW_GARAGE_NEW_GARAGE_SELECT_FLOOR,
  NEW_GARAGE_SET_ERROR,
  NEW_GARAGE_SET_AVAILABLE_ACCOUNTS,
  NEW_GARAGE_SET_ACCOUNT,
  NEW_GARAGE_SET_AVAILABLE_TARIFS,
  NEW_GARAGE_SET_TARIF,
  NEW_GARAGE_SET_HIGHLIGHT,
  NEW_GARAGE_SET_FETCHING,
  NEW_GARAGE_CLEAR_FORM
}  from '../actions/newGarage.actions'


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

const defaultState =  { id:                undefined
                      , name:              ""
                      , lpg:               false
                      , city:              ""
                      , postal_code:       ""
                      , state:             ""
                      , country:           ""
                      , gates:             [ emptyGate ]
                      , floors:            [ emptyFloor ]
                      , selectedFloor:     0
                      , availableTarifs:   []
                      , tarif_id:          undefined
                      , availableAccounts: []
                      , account_id:        undefined
                      , hightlight:        false

                      , error:             undefined
                      , fetching:          false
                      }


export default function newGarage (reducerState = defaultState, action) {
  switch (action.type) {

    case NEW_GARAGE_SET_ID:
    return  { ...reducerState
            , id: action.value
            }

    case NEW_GARAGE_SET_NAME:
    return  { ...reducerState
            , name: action.value
            }

    case NEW_GARAGE_SET_LPG:
    return  { ...reducerState
            , lpg: action.value
            }

    case NEW_GARAGE_SET_CITY:
    return  { ...reducerState
            , city: action.value
            }
    case NEW_GARAGE_SET_POSTAL_CODE:
    return  { ...reducerState
            , postal_code: action.value
            }
    case NEW_GARAGE_SET_STATE:
    return  { ...reducerState
            , state: action.value
            }
    case NEW_GARAGE_SET_COUNTRY:
    return  { ...reducerState
            , country: action.value
            }

    case NEW_GARAGE_SET_FLOORS:
    return  { ...reducerState
            , floors: action.value
            }

    case NEW_GARAGE_NEW_GARAGE_SELECT_FLOOR:
    return  { ...reducerState
            , selectedFloor: action.value
            }

    case NEW_GARAGE_SET_GATES:
    return  { ...reducerState
            , gates: action.value
            }

    case NEW_GARAGE_SET_AVAILABLE_ACCOUNTS:
    return { ...reducerState
           , availableAccounts: action.value
           }

    case NEW_GARAGE_SET_ACCOUNT:
    return { ... reducerState
           , account_id: action.value
           }

    case NEW_GARAGE_SET_AVAILABLE_TARIFS:
    return { ...reducerState
           , availableTarifs: action.value
           }

    case NEW_GARAGE_SET_TARIF:
    return { ... reducerState
           , tarif_id: action.value
           }

    case NEW_GARAGE_SET_HIGHLIGHT:
    return { ... reducerState
           , highlight: action.value
           }

    case NEW_GARAGE_SET_ERROR:
    return  { ...reducerState
            , error: action.value
            }

    case NEW_GARAGE_SET_FETCHING:
    return  { ...reducerState
            , fetching: action.value
            }

    case NEW_GARAGE_CLEAR_FORM:
    return defaultState

    default:
      return reducerState
  }
}
