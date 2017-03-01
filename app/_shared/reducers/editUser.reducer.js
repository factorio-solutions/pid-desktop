import {
  EDIT_USER_SET_NAME,
  EDIT_USER_SET_EMAIL,
  EDIT_USER_SET_PHONE
}  from '../actions/editUser.actions'

const defaultState =  { name:  {value:'', valid: false}
                      // , email: {value:'', valid: false}
                      , phone: {value:'', valid: false}
                      }


export default function editUser (state = defaultState, action) {
  switch (action.type) {

    case EDIT_USER_SET_NAME:
			return { ...state
						 , name: action.value
					 	 }

    // case EDIT_USER_SET_EMAIL:
		// 	return { ...state
		// 				 , email: action.value
		// 			 	 }

    case EDIT_USER_SET_PHONE:
			return { ...state
						 , phone: action.value
					 	 }

    default:
      return state
  }
}
