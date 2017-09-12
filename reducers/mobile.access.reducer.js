import {
  MOBILE_ACCESS_SET_OPENED,
  MOBILE_ACCESS_SET_MESSAGE,
  MOBILE_ACCESS_SET_EMPTY_GATES
} from '../actions/mobile.access.actions'


function setKeyOnIndex(object, index, key, value) {
  const newObject = { ...object[index] }
  newObject[key] = value
  return [ ...object.slice(0, index)
         , newObject
         , ...object.slice(index + 1)
         ]
}

const defaultState = { gates: [] // [{gate: { ... }, message: " ... ", opened: undefined}, { ... }]
                     }


export default function mobileAccess(state = defaultState, action) {
  switch (action.type) {

    case MOBILE_ACCESS_SET_EMPTY_GATES:
      return { ...state
             , gates: action.value.map(gate => ({ gate, message: 'Loading ...', opened: undefined }))
             }

    case MOBILE_ACCESS_SET_OPENED:
      return { ...state
             , gates: setKeyOnIndex(state.gates, action.index, 'opened', action.value)
             }

    case MOBILE_ACCESS_SET_MESSAGE:
      return { ...state
             , gates: setKeyOnIndex(state.gates, action.index, 'message', action.value)
             }

    default:
      return state
  }
}
