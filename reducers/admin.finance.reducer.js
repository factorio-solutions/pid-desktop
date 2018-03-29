import {
  ADMIN_FINANCE_SET_RENTS,
  ADMIN_FINANCE_SET_PAYPAL,
  ADMIN_FINANCE_SET_CSOB,
  ADMIN_FINANCE_SET_ACCOUNT_ID,
  ADMIN_FINANCE_SET_CSOB_MERCHANT_ID,
  ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY,
  ADMIN_FINANCE_SET_VAT,
  ADMIN_FINANCE_SET_INVOICE_ROW,
  ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_ROW,
  ADMIN_FINANCE_SET_ACCOUNT_NUMBER,
  ADMIN_FINANCE_SET_HIGHTLIGHT
}  from '../actions/admin.finance.actions'

const defaultState = {
  rents:                [],
  paypal:               false,
  csob:                 false,
  account_id:           undefined,
  csob_merchant_id:     '',
  csob_private_key:     '',
  vat:                  undefined,
  invoiceRow:           undefined,
  simplyfiedInvoiceRow: undefined,
  accountNumber:        undefined,
  highlight:            false
}


export default function adminFinance(state = defaultState, action) {
  switch (action.type) {

    case ADMIN_FINANCE_SET_RENTS:
      return {
        ...state,
        rents: action.value
      }

    case ADMIN_FINANCE_SET_PAYPAL:
      return {
        ...state,
        paypal: action.value
      }

    case ADMIN_FINANCE_SET_CSOB:
      return {
        ...state,
        csob: action.value
      }

    case ADMIN_FINANCE_SET_ACCOUNT_ID:
      return {
        ...state,
        account_id: action.value
      }

    case ADMIN_FINANCE_SET_CSOB_MERCHANT_ID:
      return {
        ...state,
        csob_merchant_id: action.value
      }

    case ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY:
      return {
        ...state,
        csob_private_key: action.value
      }

    case ADMIN_FINANCE_SET_VAT:
      return {
        ...state,
        vat: action.value
      }

    case ADMIN_FINANCE_SET_INVOICE_ROW:
      return {
        ...state,
        invoiceRow: action.value
      }

    case ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_ROW:
      return {
        ...state,
        simplyfiedInvoiceRow: action.value
      }

    case ADMIN_FINANCE_SET_ACCOUNT_NUMBER:
      return {
        ...state,
        accountNumber: action.value
      }

    case ADMIN_FINANCE_SET_HIGHTLIGHT:
      return {
        ...state,
        highlight: action.value
      }

    default:
      return state
  }
}
