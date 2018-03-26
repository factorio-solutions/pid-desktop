import {
	REGISTER_SET_NAME,
	REGISTER_SET_PHONE,
	REGISTER_SET_EMAIL,
	REGISTER_SET_PASSWORD,
	REGISTER_SET_CONFIRMATION,
	REGISTER_REQUEST,
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	REGISTER_SET_RESET_TOKEN,
	REGISTER_SET_ACCEPT_TERMS_OF_SERVICE
}  from '../actions/signUp.actions'

const initialState = 	{ fetching: 			 			false,
												error: 		       			undefined,

												name: 				   			{ value: '', valid: false },
												phone: 				   			{ value: '', valid: false },
												email: 				   			{ value: '', valid: false },
												password: 		   			{ value: '', valid: false },
												confirmation:    			{ value: '', valid: false },
												reset_token: 	   			undefined,
												acceptTermsOfService: false
}


export default function signUp(state = initialState, action) {
	switch (action.type) {

    case REGISTER_REQUEST:
    	return { ...state,
							 fetching: true
    					}

    case REGISTER_FAILURE:
    	return { ...state,
      				 fetching: false,
      				 error:    action.value
    					}

    case REGISTER_SUCCESS:
    	return { ...state,
      				 fetching: false
      				}


    case REGISTER_SET_NAME:
      return { ...state,
						  name: action.value
						 }

    case REGISTER_SET_PHONE:
      return { ...state,
						  phone: action.value
						 }

    case REGISTER_SET_EMAIL:
			return { ...state,
						  email: action.value
					 	 }

    case REGISTER_SET_PASSWORD:
			return { ...state,
						  password: action.value
					 	 }

    case REGISTER_SET_CONFIRMATION:
			return { ...state,
						  confirmation: action.value
					 	 }

		 case REGISTER_SET_RESET_TOKEN:
			 return { ...state,
							 reset_token: action.value
 }
		 case REGISTER_SET_ACCEPT_TERMS_OF_SERVICE:
			 return { ...state,
								acceptTermsOfService: action.value
							}

    default:
      return state
  }
}
