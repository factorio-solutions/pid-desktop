import {
  ADMIN_THIRD_PARTY_INTEGRATION_SET_GARAGE,
  ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_PLACE,
  ADMIN_THIRD_PARTY_INTEGRATION_SET_PLACES,
  ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_HIGHLIGHT
}  from '../actions/admin.thirdPartyIntegration.actions'


const defaultState = {
  garage:    undefined,
  places:    [],
  highlight: false
}


export default function adminThirdPartyIntegration(state = defaultState, action) {
  switch (action.type) {
    case ADMIN_THIRD_PARTY_INTEGRATION_SET_GARAGE:
      return { ...state,
        garage: action.value
      }

    case ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_PLACE: {
      const indexOf = state.places.indexOf(action.value)
      return { ...state,
        places: indexOf > -1 ?
          [ ...state.places.slice(0, indexOf), ...state.places.slice(indexOf + 1) ] :
          [ ...state.places, action.value ].sort((a, b) => a > b)
      }
    }

    case ADMIN_THIRD_PARTY_INTEGRATION_SET_PLACES:
      return {
        ...state,
        places: action.value
      }

    case ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    default:
      return state
  }
}
