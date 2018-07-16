import {
  LEGAL_DOCUMENTS_SET_DOCUMENTS,
  LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES,
  LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT,

  LEGAL_DOCUMENTS_SHOW_MODAL,
  LEGAL_DOCUMENTS_SET_DOCUMENTS_NAME,
  LEGAL_DOCUMENTS_SET_DOCUMENTS_URL,
  LEGAL_DOCUMENTS_SUBMIT_DOCUMENT,

  LEGAL_DOCUMENTS_CLEAR_FORM
} from '../actions/legalDocuments.actions'

const defaultState = {
  documents:      [],
  documentsTypes: [ 'privacy', 'terms' ],
  highlight:      false,

  showModal:    '', // type
  documentName: '',
  documentURL:  ''
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


    case LEGAL_DOCUMENTS_SHOW_MODAL:
      return {
        ...state,
        showModal: action.value
      }

    case LEGAL_DOCUMENTS_SET_DOCUMENTS_NAME:
      return {
        ...state,
        documentName: action.value
      }

    case LEGAL_DOCUMENTS_SET_DOCUMENTS_URL:
      return {
        ...state,
        documentURL: action.value
      }

    case LEGAL_DOCUMENTS_SUBMIT_DOCUMENT:
      return {
        ...state,
        showModal:    false,
        documentName: '',
        documentURL:  ''
      }


    case LEGAL_DOCUMENTS_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}
