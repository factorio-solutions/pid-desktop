import { TEST_ACTION }  from '../actions/analytics.actions'

const defaultState =  { test: [] }


export default function garage (state = defaultState, action) {
  switch (action.type) {

    case TEST_ACTION:
      return  { ...state
              , testvar: action.value
              }

    default:
      return state
  }
}
