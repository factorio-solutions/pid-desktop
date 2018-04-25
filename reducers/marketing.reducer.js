import { MARKETING_SET_MARKETING }  from '../actions/marketing.actions'

const initialState = { marketing: undefined }


export default function marketing(state = initialState, action) {
  switch (action.type) {

    case MARKETING_SET_MARKETING:
      return { ...state,
        marketing: action.value
      }

    default:
      return state
  }
}
