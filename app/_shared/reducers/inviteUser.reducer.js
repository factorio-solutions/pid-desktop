import {
  INVITE_USER_SET_PHONE,
  INVITE_USER_SET_NAME,
  INVITE_USER_SET_MESSAGE,
  INVITE_USER_SET_EMAIL,
  INVITE_USER_SET_IS_INTERNAL,
  INVITE_USER_SET_CAN_MANAGE,
  INVITE_USER_SET_CAN_CREATE_OWN,
  INVITE_USER_SET_CAN_CREATE_INTERNAL,
  INVITE_USER_SET_ACCOUNT,
  INVITE_USER_SET_ACCOUNTS,
  INVITE_USER_SET_SUCCESS,
  INVITE_USER_SET_ERROR,
  INVITE_USER_SET_CURRENT_EMAIL,
  INVITE_USER_RESET_FORM
} from '../actions/inviteUser.actions'


const defaultState =  { email:      {value: '', valid: false},
                        message:    "",
                        full_name:  "",
                        phone:      "",

                        can_manage:           false,
                        can_create_own:       false,
                        can_create_internal:  false,
                        is_internal:          false,

                        accounts:   [],
                        account_id: undefined,

                        error:        undefined,
                        success:      undefined,
                        currentEmail: undefined
                      }


export default function inviteUser (state = defaultState, action) {
  switch (action.type) {

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

    case INVITE_USER_SET_CAN_CREATE_INTERNAL:
    return  { ...state
            , can_create_internal: action.value
            }
    case INVITE_USER_SET_CAN_CREATE_OWN:
    return  { ...state
            , can_create_own: action.value
            }
    case INVITE_USER_SET_CAN_MANAGE:
    return  { ...state
            , can_manage: action.value
            }
    case INVITE_USER_SET_IS_INTERNAL:
    return  { ...state
            , is_internal: action.value
            }

    case INVITE_USER_SET_ACCOUNTS:
    return  { ...state
            , accounts: action.value
            }
    case INVITE_USER_SET_ACCOUNT:
    return  { ...state
            , account_id: action.value
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
