import { ADD_FEATURES_SET_TARIFS }  from '../actions/addFeatures.actions'
import { PID_SETTINGS_SET_SELECTED } from '../actions/admin.pidSettings.actions'

const defaultState = {
  tarifs:   [],
  selected: undefined // selected tarif for pidSettings
}


export default function addFeatures(state = defaultState, action) {
  switch (action.type) {

    case ADD_FEATURES_SET_TARIFS:
      return {
        ...state,
        tarifs: action.value
      }

    case PID_SETTINGS_SET_SELECTED:
      return {
        ...state,
        selected: action.value
      }

    default:
      return state
  }
}
