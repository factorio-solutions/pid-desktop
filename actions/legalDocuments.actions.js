import { UPDATE_GARAGE, GET_GARAGE_DOCUMENTS } from '../queries/legalDocuments.queries'

import { request }      from '../helpers/request'
import actionFactory    from '../helpers/actionFactory'
import { getLanguage }  from '../modules/localization/localization'


export const LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES = 'LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES'
export const LEGAL_DOCUMENTS_SET_DOCUMENTS = 'LEGAL_DOCUMENTS_SET_DOCUMENTS'
export const LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT = 'LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT'
export const LEGAL_DOCUMENTS_SHOW_MODAL = 'LEGAL_DOCUMENTS_SHOW_MODAL'
export const LEGAL_DOCUMENTS_SET_DOCUMENTS_NAME = 'LEGAL_DOCUMENTS_SET_DOCUMENTS_NAME'
export const LEGAL_DOCUMENTS_SET_DOCUMENTS_URL = 'LEGAL_DOCUMENTS_SET_DOCUMENTS_URL'
export const LEGAL_DOCUMENTS_SUBMIT_DOCUMENT = 'LEGAL_DOCUMENTS_SUBMIT_DOCUMENT'
export const LEGAL_DOCUMENTS_CLEAR_FORM = 'LEGAL_DOCUMENTS_CLEAR_FORM'


export const setDocumentsTypes = actionFactory(LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES)
export const setDocuments = actionFactory(LEGAL_DOCUMENTS_SET_DOCUMENTS)
export const toggleHighlight = actionFactory(LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT)
export const showModal = actionFactory(LEGAL_DOCUMENTS_SHOW_MODAL)
export const setDocumentName = actionFactory(LEGAL_DOCUMENTS_SET_DOCUMENTS_NAME)
export const setDocumentURL = actionFactory(LEGAL_DOCUMENTS_SET_DOCUMENTS_URL)
export const submitDocument = actionFactory(LEGAL_DOCUMENTS_SUBMIT_DOCUMENT)
export const clearLegalDocumentsForm = actionFactory(LEGAL_DOCUMENTS_CLEAR_FORM)


const stateName = 'legalDocuments'

export function initDocuments() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data) {
        dispatch(setDocuments(response.data.garage.documents))
      }
    }
    request(onSuccess, GET_GARAGE_DOCUMENTS, { id: getState().pageBase.garage })
  }
}

export function documentUploaded(documentType, documentUrl, fileName, lang = getLanguage()) {
  return (dispatch, getState) => {
    const document = {
      id:        undefined,
      url:       documentUrl,
      name:      fileName,
      doc_type:  documentType,
      lang,
      remove:    false,
      update_at: 'Now'
    }
    const documents = getState()[stateName].documents.concat(document)
    dispatch(setDocuments(documents))
    dispatch(submitDocument())
  }
}


export function newDocuments(getState) {
  const mapDocuments = doc => ({ url: doc.url, name: doc.name, doc_type: doc.doc_type, lang: doc.lang })
  return getState()[stateName].documents.filter(doc => typeof doc.id === 'undefined').map(mapDocuments)
}

export function removedDocuments(getState) {
  return getState()[stateName].documents.filter(doc => doc.remove && typeof doc.id !== 'undefined').map(doc => doc.id)
}

export function updateGarageDocuments() {
  return (dispatch, getState) => {
    const garageId = getState().pageBase.garage

    const onSuccess = () => {
      dispatch(initDocuments())
    }

    const garage = {
      new_documents:     newDocuments(getState),
      removed_documents: removedDocuments(getState)
    }
    request(onSuccess,
      UPDATE_GARAGE,
      { id: garageId,
        garage
      })
  }
}

export function destroyDocument(documentToRemove) {
  return (dispatch, getState) => {
    const state = getState()[stateName]
    let document = state.documents.findById(documentToRemove.id) || state.documents.find(doc => doc.url === documentToRemove.url)
    document = {
      ...document,
      remove: true
    }
    let documents = state.documents.filter(doc => doc.id !== documentToRemove.id || doc.url !== documentToRemove.url)
    if (typeof document.id !== 'undefined') {
      documents = documents.concat(document)
    }
    dispatch(setDocuments(documents))
  }
}
