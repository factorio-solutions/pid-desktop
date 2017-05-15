import { PROFILE_EDIT_USER_SET_NAME, PROFILE_EDIT_USER_SET_PHONE, PROFILE_SET_CARS }  from '../actions/profile.actions'

const defaultState =  { name:  {value:'', valid: false}
                      , phone: {value:'', valid: false}
                      , cars: []
                      }


export default function profile (state = defaultState, action) {
  switch (action.type) {

    case PROFILE_EDIT_USER_SET_NAME:
			return { ...state
						 , name: action.value
					 	 }

    case PROFILE_EDIT_USER_SET_PHONE:
			return { ...state
						 , phone: action.value
					 	 }

    case PROFILE_SET_CARS:
			return { ...state
						 , cars: action.value
					 	 }

    default:
      return state
  }
}