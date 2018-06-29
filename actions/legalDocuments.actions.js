import React from 'react'

import { UPDATE_GARAGE, GET_GARAGE_DOCUMENTS } from '../queries/admin.legalDocuments.queries'

import { request }      from '../helpers/request'
import actionFactory    from '../helpers/actionFactory'
import * as thisFile    from './legalDocuments.actions'

export const LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES = 'LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES'
export const LEGAL_DOCUMENTS_SET_DOCUMENT = 'LEGAL_DOCUMENTS_SET_DOCUMENT'
export const LEGAL_DOCUMENTS_SET_PRIVACY_DOCUMENTS = 'LEGAL_DOCUMENTS_SET_PRIVACY_DOCUMENTS'
export const LEGAL_DOCUMENTS_SET_TERMS_DOCUMENTS = 'LEGAL_DOCUMENTS_SET_TERMS_DOCUMENTS'
export const LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT = 'LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT'


export const setDocumentsTypes = actionFactory(LEGAL_DOCUMENTS_SET_DOCUMENTS_TYPES)
export const setDocument = actionFactory(LEGAL_DOCUMENTS_SET_DOCUMENT)
export const setPrivacyDocuments = actionFactory(LEGAL_DOCUMENTS_SET_PRIVACY_DOCUMENTS)
export const setTermsDocuments = actionFactory(LEGAL_DOCUMENTS_SET_TERMS_DOCUMENTS)
export const toggleHighlight = actionFactory(LEGAL_DOCUMENTS_TOGGLE_HIGHLIGHT)

export function initDocuments() {
  return (dispatch, getState) => {
    const types = getState().adminLegalDocuments.documentsTypes
    const onSuccess = response => {
      if (response.data) {
        types.forEach(type => {
          const upperCasedType = type.charAt(0).toUpperCase() + type.slice(1)
          dispatch(thisFile[`set${upperCasedType}Documents`](response.data.garage[`${type}_documents`]))
        })
      }
    }
    request(onSuccess, GET_GARAGE_DOCUMENTS(types), { id: getState().pageBase.garage })
  }
}

export function documentUploaded(documentType, documentUrl, fileName) {
  return (dispatch, getState) => {
    const document = {
      id:            undefined,
      document:      documentUrl,
      document_name: fileName,
      document_type: documentType,
      update_at:     'Now'
    }
    const documents = getState().adminLegalDocuments[`${documentType}Documents`].concat(document)
    const upperCasedType = documentType.charAt(0).toUpperCase() + documentType.slice(1)
    dispatch(thisFile[`set${upperCasedType}Documents`](documents))
  }
}
// TODO: Add deletion of documents
export function updateGarageDocuments() {
  return (dispatch, getState) => {
    const garageId = getState().pageBase.garage
    const state = getState().adminLegalDocuments

    const onSuccess = () => {
      console.log('neco se mozna updatovalo')
    }

    const mapDocuments = doc => ({ document: doc.document, document_name: doc.document_name, document_type: doc.document_type })

    const garage = {
      privacy_documents: state.privacyDocuments.filter(doc => doc.id === undefined).map(mapDocuments),
      terms_documents:   state.termsDocuments.filter(doc => doc.id === undefined).map(mapDocuments)
    }
    request(onSuccess,
      UPDATE_GARAGE,
      { id: garageId,
        garage
      })
  }
}
