import {
  GARAGE_MARKETING_SET_MARKETING,
  GARAGE_MARKETING_SET_GARAGE
}  from '../actions/garageMarketing.actions'

const initialState =  { garage:     undefined
                      , marketing:  []
                      }


export default function garageMarketing (state = initialState, action) {
  switch (action.type) {
    case GARAGE_MARKETING_SET_MARKETING:
			return { ...state
						 , marketing: action.value
					 	 }

    case GARAGE_MARKETING_SET_GARAGE:
      return { ...state
             , garage: action.value
             }

    default:
      return state
  }
}
