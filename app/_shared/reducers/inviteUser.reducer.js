import {
  INVITE_USER_BOOLEAN_ATTR,
  INVITE_USER_SET_PHONE,
  INVITE_USER_SET_NAME,
  INVITE_USER_SET_MESSAGE,
  INVITE_USER_SET_EMAIL,
  INVITE_USER_SET_CLIENT,
  INVITE_USER_SET_CLIENTS,
  INVITE_USER_SET_GARAGE,
  INVITE_USER_SET_GARGES,
  INVITE_USER_SET_CAR,
  INVITE_USER_SET_CARS,
  INVITE_USER_SET_SUCCESS,
  INVITE_USER_SET_ERROR,
  INVITE_USER_SET_CURRENT_EMAIL,
  INVITE_USER_SET_HIGHLIGHT,
  INVITE_USER_RESET_FORM
} from '../actions/inviteUser.actions'

const booleanAttributes = { client_admin:         false
                          , client_secretary:     false
                          , client_host:          false
                          , client_internal:      false
                          , garage_admin:         false
                          , garage_receptionist:  false
                          , garage_security:      false
                          , car_admin:            false

                          , highlight:            false
                          }

const defaultState =  { ...booleanAttributes
                      , email:        {value: '', valid: false}
                      , message:      ""
                      , full_name:    ""
                      , phone:        ""

                      , clients:      []
                      , client_id:    undefined

                      , garages:      []
                      , garage_id:    undefined

                      , cars:         []
                      , car_id:       undefined

                      , error:        undefined
                      , success:      undefined
                      , currentEmail: undefined
                      }


export default function inviteUser (state = defaultState, action) {
  switch (action.type) {

    case INVITE_USER_BOOLEAN_ATTR:
    return { ...state
           , [action.attribute]: action.value
           }

    case INVITE_USER_SET_EMAIL:
    return  { ...state
            , email: action.value
            }
    case INVITE_USER_SET_MESSAGE:
    return  { ...state
            , message: action.value
            }
    case INVITE_USER_SET_NAME:
    return  { ...state
            , full_name: action.value
            }
    case INVITE_USER_SET_PHONE:
    return  { ...state
            , phone: action.value
            }

    case INVITE_USER_SET_CLIENTS:
    return  { ...state
            , clients: action.value
            }
    case INVITE_USER_SET_CLIENT:
    return  { ...state
            , client_id: action.value
            }

    case INVITE_USER_SET_GARAGE:
    return { ...state
           , garage_id: action.value
           }
    case INVITE_USER_SET_GARGES:
    return { ...state
           , garages: action.value
           }

    case INVITE_USER_SET_CAR:
    return { ...state
           , car_id: action.value
           }
    case INVITE_USER_SET_CARS:
    return { ...state
           , cars: action.value
           }

    case INVITE_USER_SET_ERROR:
    return  { ...state
            , error: action.value
            }
    case INVITE_USER_SET_SUCCESS:
    return  { ...state
            , success: action.value
            }
    case INVITE_USER_SET_CURRENT_EMAIL:
    return  { ...state
            , currentEmail: action.value
            }

    case INVITE_USER_SET_HIGHLIGHT:
    return  { ...state
            , highlight: action.value
            }

    case INVITE_USER_RESET_FORM:
    return { ...defaultState
            , success: state.success
            , error: state.error
            , currentEmail: undefined
            }

    default:
      return state
  }
}
