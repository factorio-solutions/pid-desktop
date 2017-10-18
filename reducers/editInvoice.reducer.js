import {
  EDIT_INVOICE_SET_AMOUNT,
  EDIT_INVOICE_SET_VAT,
  EDIT_INVOICE_SET_HIGHLIGHT,
  EDIT_INVOICE_SET_SUBJECT,
  EDIT_INVOICE_SET_INVOICE_DATE,
  EDIT_INVOICE_SET_DUE_DATE ,
  EDIT_INVOICE_SET_INOVICE_NUMBER,
  EDIT_INVOICE_SET_ORIGINAl
}  from '../actions/editInvoice.actions'

const defaultState =  { ammount:        ''
                      , vat:            ''
                      , subject:        ''
                      , invoice_date:   ''
                      , due_date:       ''
                      , invoice_number: ''
                      , original:       undefined
                      , highlight:      false
                      }


export default function editInvoice (state = defaultState, action) {
  switch (action.type) {

    case EDIT_INVOICE_SET_AMOUNT :
      return { ...state
             , ammount: action.value
             }

    case EDIT_INVOICE_SET_VAT :
      return { ...state
             , vat: action.value
             }

    case EDIT_INVOICE_SET_HIGHLIGHT :
      return { ...state
             , highlight: action.value
             }

    case EDIT_INVOICE_SET_SUBJECT :
      return { ...state
             , subject: action.value
             }

    case EDIT_INVOICE_SET_INVOICE_DATE :
      return { ...state
             , invoice_date: action.value
             }

    case EDIT_INVOICE_SET_DUE_DATE :
      return { ...state
             , due_date: action.value
             }

    case EDIT_INVOICE_SET_INOVICE_NUMBER :
      return { ...state
             , invoice_number: action.value
             }

    case EDIT_INVOICE_SET_ORIGINAl :
      return { ...state
             , original: action.value
             }

    default:
      return state
  }
}
