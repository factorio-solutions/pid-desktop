import { RESET_PASSWORD_EMAIL, RESET_PASSWORD_MODAL }  from '../actions/resetPassword.actions'

const defaultState =  { email: {value:'', valid: false}
                      , modal: undefined
                      }


export default function resetPassword (state = defaultState, action) {
  switch (action.type) {

    case RESET_PASSWORD_EMAIL:
			return { ...state
						 , email: action.value
					 	 }
             
    case RESET_PASSWORD_MODAL:
			return { ...state
						 , modal: action.value
					 	 }

    default:
      return state
  }
}
