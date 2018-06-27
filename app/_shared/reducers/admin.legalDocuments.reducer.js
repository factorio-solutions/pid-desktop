import {
  LEGAL_DOCUMENTS_SET_SELECTED
} from '../actions/legalDocuments.actions'

const defaultState = {
  selected: undefined
}

export default function legalDocuments(state = defaultState, action) {
  switch (action.type) {
    case LEGAL_DOCUMENTS_SET_SELECTED:
      return {
        ...state,
        selected: action.value
      }

    default:
      return state
  }
}
