import {
	RESET_LOGIN_FORM,
	LOGIN_SET_PASSWORD,
	LOGIN_SET_CODE,
	LOGIN_SET_EMAIL,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_SET_DEVICE_FINGERPRINT,
	LOGIN_FAILURE
}  from '../actions/login.actions'

const initialState = 	{ fetching: 				 false
											,	error: 						 undefined
											,	email: 						 {value:'', valid: false}
											,	password: 				 {value:'', valid: false}
											, code:							 {value:'', valid: false}
											, deviceFingerprint: undefined
											}


export default function login (state = initialState, action) {
  switch (action.type) {

    case LOGIN_REQUEST:
    	return  { ...state,
      	fetching: true,
    	}

    case LOGIN_FAILURE:
    	return  { ...state,
      	fetching: false,
      	error: action.value
    	}

    case LOGIN_SUCCESS:
    	return  { ...state,
      	fetching: false,
      }

		case LOGIN_SET_EMAIL:
			return { ...state
						 , email: action.value
					 	 }

		case LOGIN_SET_PASSWORD:
			return { ...state
						 , password: action.value
					 	 }

		case LOGIN_SET_CODE:
			return { ...state
						 , code: action.value
					 	 }

		case LOGIN_SET_DEVICE_FINGERPRINT:
			return { ...state
						 , deviceFingerprint: action.value
					 	 }

	 case RESET_LOGIN_FORM:
	 	return initialState

    default:
      return state
  }
}
