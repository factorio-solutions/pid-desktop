import { ADD_FEATURES_SET_TARIFS }  from '../actions/addFeatures.actions'

const defaultState =  { tarifs: [] }


export default function addFeatures (state = defaultState, action) {
  switch (action.type) {

    case ADD_FEATURES_SET_TARIFS:
      return  { ...state
              , tarifs: action.value
              }

    default:
      return state
  }
}
