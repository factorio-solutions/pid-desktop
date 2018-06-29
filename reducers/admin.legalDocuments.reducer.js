import {
  LEGAL_DOCUMENTS_SET_DOCUMENT,
  LEGAL_DOCUMENTS_SET_PRIVACY_DOCUMENTS,
  LEGAL_DOCUMENTS_SET_TERMS_DOCUMENTS,
  LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES,
  LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT
} from '../actions/legalDocuments.actions'

const defaultState = {
  document: undefined,

  privacyDocuments: [],
  termsDocuments:   [],
  documentsTypes:   [ 'privacy', 'terms' ],
  highlight:        false
}

export default function legalDocuments(state = defaultState, action) {
  switch (action.type) {
    case LEGAL_DOCUMENTS_SET_DOCUMENT:
      return {
        ...state,
        document: action.value
      }

    case LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES:
      return {
        ...state,
        documentsTypes: action.value
      }

    case LEGAL_DOCUMENTS_SET_PRIVACY_DOCUMENTS:
      return {
        ...state,
        privacyDocuments: action.value
      }

    case LEGAL_DOCUMENTS_SET_TERMS_DOCUMENTS:
      return {
        ...state,
        termsDocuments: action.value
      }

    case LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    default:
      return state
  }
}
