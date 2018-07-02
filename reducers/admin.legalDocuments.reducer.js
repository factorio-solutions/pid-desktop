import {
  LEGAL_DOCUMENTS_SET_DOCUMENTS,
  LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES,
  LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT,
  LEGAL_DOCUMENTS_CLEAR_FORM
} from '../actions/legalDocuments.actions'

const defaultState = {
  documents:      [],
  documentsTypes: [ 'privacy', 'terms' ],
  highlight:      false
}

export default function legalDocuments(state = defaultState, action) {
  switch (action.type) {
    case LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES:
      return {
        ...state,
        documentsTypes: action.value
      }

    case LEGAL_DOCUMENTS_SET_DOCUMENTS:
      return {
        ...state,
        documents: action.value
      }

    case LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    case LEGAL_DOCUMENTS_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}
