import {
  RESET_LOGIN_FORM,
  LOGIN_SET_PASSWORD,
  LOGIN_SET_CODE,
  LOGIN_SET_EMAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_SET_DEVICE_FINGERPRINT,
  LOGIN_FAILURE,
  LOGIN_PASSWORD_RESET_SUCCESSFUL,
  LOGIN_SHOW_PASSWORD_RESET_MODAL,
  LOGIN_SET_REFRESHING_LOGIN
}  from '../actions/login.actions'

const initialState = {
  fetching:                false,
  error:                   undefined,
  email:                   { value: '', valid: false },
  password:                { value: '', valid: false },
  code:                    { value: '', valid: false },
  deviceFingerprint:       undefined,
  passwordResetSuccessful: false,
  showResetPasswordModal:  false,
  refreshingLogin:         false
}


export default function login(state = initialState, action) {
  switch (action.type) {

    case LOGIN_REQUEST:
      return { ...state,
        fetching: true
      }

    case LOGIN_FAILURE:
      return { ...state,
        fetching: false,
        error:    action.value
      }

    case LOGIN_SUCCESS:
      return { ...state,
        fetching: false
      }

    case LOGIN_SET_EMAIL:
      return { ...state,
        email: action.value
      }

    case LOGIN_SET_PASSWORD:
      return { ...state,
        password: action.value
      }

    case LOGIN_SET_CODE:
      return { ...state,
        code: action.value
      }

    case LOGIN_SET_DEVICE_FINGERPRINT:
      return { ...state,
        deviceFingerprint: action.value
      }

    case RESET_LOGIN_FORM:
      return initialState

    case LOGIN_PASSWORD_RESET_SUCCESSFUL:
      return {
        ...state,
        passwordResetSuccessful: action.value
      }

    case LOGIN_SHOW_PASSWORD_RESET_MODAL:
      return {
        ...state,
        showResetPasswordModal: action.value
      }

    case LOGIN_SET_REFRESHING_LOGIN:
      return {
        ...state,
        refreshingLogin: action.value
      }

    default:
      return state
  }
}
