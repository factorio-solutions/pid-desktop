import moment from 'moment'
import { MOMENT_DATETIME_FORMAT } from '../helpers/time'

import {
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_RENTS,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_TO,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES,
  ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_SECURITY_INTERVAL,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_PLACES,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_INDEFINITLY,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_TO,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS_MODAL,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS,
  ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM,
  ADMIN_CLIENTS_NEW_CONTRACT_SET_GENERATE_INVOICE
} from '../actions/newContract.actions'

const defaultState = {
  contract_id:      undefined, // id is editing
  clients:          [],
  client_id:        undefined,
  addClient:        false,
  client_token:     '',
  rents:            [],
  rent:             undefined,
  newRent:          false,
  price:            undefined,
  currencies:       [],
  currency_id:      undefined,
  from:             moment().startOf('day').format(MOMENT_DATETIME_FORMAT),
  to:               moment().endOf('day').format(MOMENT_DATETIME_FORMAT),
  garage:           undefined,
  places:           [],
  highlight:        false,
  indefinitly:      false,
  generateInvoice:  false,
  securityInterval: 0,

  // determining what should happen to reservations of removed places
  originalPlaces:           [],
  originalIndefinitly:      false,
  originalTo:               moment().endOf('day').format(MOMENT_DATETIME_FORMAT),
  removedReservationsModal: false,
  removeReservations:       false
}


export default function newContract(state = defaultState, action) {
  switch (action.type) {
    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID:
      return {
        ...state,
        contract_id: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS:
      return {
        ...state,
        clients: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT:
      return {
        ...state,
        client_id: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT:
      return {
        ...state,
        addClient: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN:
      return {
        ...state,
        client_token: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_RENTS:
      return {
        ...state,
        rents: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT:
      return {
        ...state,
        rent: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT:
      return {
        ...state,
        newRent: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE:
      return {
        ...state,
        price: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES:
      return {
        ...state,
        currencies: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY:
      return {
        ...state,
        currency_id: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM:
      return {
        ...state,
        from: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_TO:
      return {
        ...state,
        to: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES:
      return {
        ...state,
        places: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY:
      return {
        ...state,
        indefinitly: action.value,
        to:          action.value ? state.to : moment().endOf('day').format(MOMENT_DATETIME_FORMAT)
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_SECURITY_INTERVAL:
      return {
        ...state,
        securityInterval: (action.value || 0) > 60 ? 60 : (action.value || 0)
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_PLACES:
      return {
        ...state,
        originalPlaces: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_INDEFINITLY:
      return {
        ...state,
        originalIndefinitly: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_TO:
      return {
        ...state,
        originalTo: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS_MODAL:
      return {
        ...state,
        removedReservationsModal: !!action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS:
      return {
        ...state,
        removeReservations: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_SET_GENERATE_INVOICE:
      return {
        ...state,
        generateInvoice: action.value
      }

    case ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM:
      return defaultState

    default:
      return state
  }
}
