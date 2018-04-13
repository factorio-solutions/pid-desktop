import moment from 'moment'
import { MOMENT_DATETIME_FORMAT, MOMENT_DATE_FORMAT } from '../helpers/time'

import {
  NEW_RESERVATION_SET_USER,
  NEW_RESERVATION_SET_NOTE,
  NEW_RESERVATION_SET_AVAILABLE_USERS,
  NEW_RESERVATION_SET_RESERVATION,

  NEW_RESERVATION_SET_HOST_NAME,
  NEW_RESERVATION_SET_HOST_PHONE,
  NEW_RESERVATION_SET_HOST_EMAIL,
  NEW_RESERVATION_SET_HOST_LANGUAGE,

  NEW_RESERVATION_SET_CLIENT_ID,
  NEW_RESERVATION_SET_PAID_BY_HOST,
  NEW_RESERVATION_SET_RECURRING_RULE,
  NEW_RESERVATION_SHOW_RECURRING,
  NEW_RESERVATION_SET_USE_RECURRING,
  NEW_RESERVATION_SET_RECURRING_RESERVATION_ID,

  NEW_RESERVATION_CAR_ID,
  NEW_RESERVATION_CAR_LICENCE_PLATE,

  NEW_RESERVATION_SET_GARAGE,

  NEW_RESERVATION_SET_FROM,
  NEW_RESERVATION_SET_TO,
  NEW_RESERVATION_SET_PLACE_ID,
  NEW_RESERVATION_SET_PRICE,

  NEW_RESERVATION_SET_DURATION_DATE,
  NEW_RESERVATION_SET_LOADING,
  NEW_RESERVATION_SET_HIGHLIGHT,
  NEW_RESERVATION_SET_SEND_SMS,
  NEW_RESERVATION_SET_ERROR,

  NEW_RESERVATION_SET_SELECTED_TEMPLATE,
  NEW_RESERVATION_SET_TEMPLATE_TEXT,

  NEW_RESERVATION_SET_GATE_PHONE_NUMBER,

  NEW_RESERVATION_CLEAR_FORM
}  from '../actions/newReservation.actions'

const defaultState = {
  user:           undefined, // id of selected user reservation is for
  note:           '', // users note
  availableUsers: [], // array of other available users
  reservation:    undefined, // object with reservation to be edited

  name:     { value: '', valid: false },
  phone:    { value: '', valid: false },
  email:    { value: '', valid: false },
  language: 'en',

  client_id:                undefined, // currently selected client
  paidByHost:               false,
  recurringRule:            undefined, // rule in string
  showRecurring:            false, // show recurring modal
  useRecurring:             false, // use recurring
  recurring_reservation_id: undefined,

  car_id:          undefined, // selected car id
  carLicencePlate: '', // in case there are no available cars

  garage: undefined, // loaded garage details // GARAGE ID IS IN HERE

  from:     '',
  to:       '',
  place_id: undefined, // if of selected place
  price:    undefined,

  durationDate: false, // set duration or end of parking?
  loading:      false,
  hightlight:   false,
  sendSMS:      false,
  error:        undefined,

  selectedTemplate: undefined, // index of it
  templateText:     '',

  gatePhoneNumber: ''
}

function placeLabel(state) {
  if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
    return 'flexiplace'
  } else {
    const floor = state.garage && state.garage.floors.find(floor => floor.places.findById(state.place_id) !== undefined)
    const place = floor && floor.places.findById(state.place_id)
    return `${floor.label} / ${place.label}`
  }
}

function substituteVariablesInTemplate(template, state) {
  return template
    .replace('{{ garage }}', (state.garage && state.garage.name) || '')
    .replace('{{ address }}', (state.garage && state.garage.address && [
      state.garage.address.line_1,
      state.garage.address.line_2,
      state.garage.address.city,
      state.garage.address.postal_code,
      state.garage.address.state,
      state.garage.address.country
    ].filter(o => o).join(', ')) || '')
    .replace('{{ gps }}', (state.garage && state.garage.address && `${state.garage.address.lat}, ${state.garage.address.lng}`) || '')
    .replace('{{ place }}', placeLabel(state))
    .replace('{{ begin }}', state.from)
    .replace('{{ end }}', state.to)
    .replace('{{ gate }}', state.gatePhoneNumber)
}

export default function newReservation(state = defaultState, action) {
  switch (action.type) {

    case NEW_RESERVATION_SET_USER:
      return {
        ...state,
        user: action.value
      }

    case NEW_RESERVATION_SET_NOTE:
      return {
        ...state,
        note: action.value
      }

    case NEW_RESERVATION_SET_AVAILABLE_USERS:
      return {
        ...state,
        availableUsers: action.value
      }

    case NEW_RESERVATION_SET_RESERVATION:
      return {
        ...state,
        reservation: action.value
      }


    case NEW_RESERVATION_SET_HOST_NAME:
      return {
        ...state,
        name: action.value
      }

    case NEW_RESERVATION_SET_HOST_PHONE:
      return {
        ...state,
        phone: action.value
      }

    case NEW_RESERVATION_SET_HOST_EMAIL:
      return {
        ...state,
        email: action.value
        // paidByHost: action.value.valid ? state.paidByHost : false
      }

    case NEW_RESERVATION_SET_HOST_LANGUAGE:
      return {
        ...state,
        language: action.value
      }

    case NEW_RESERVATION_SET_CLIENT_ID:
      return {
        ...state,
        client_id:        action.value,
        recurringRule:    action.value ? state.recurringRule : undefined,
        sendSMS:          false,
        selectedTemplate: undefined,
        templateText:     ''
      }

    case NEW_RESERVATION_SET_PAID_BY_HOST:
      return { ...state,
        // paidByHost: state.user.id === -2 ? state.email.value && state.email.valid && action.value : action.value
        paidByHost: action.value
      }

    case NEW_RESERVATION_SET_RECURRING_RULE: {
      const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1
      return {
        ...state,
        recurringRule: action.value,
        showRecurring: false,
        useRecurring:  !overMonth && !!action.value
      }
    }

    case NEW_RESERVATION_SHOW_RECURRING:
      return {
        ...state,
        showRecurring: action.value
      }

    case NEW_RESERVATION_SET_USE_RECURRING: {
      const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1
      return {
        ...state,
        useRecurring:  !overMonth && action.value,
        showRecurring: !overMonth && action.value && !state.rule
      }
    }

    case NEW_RESERVATION_SET_RECURRING_RESERVATION_ID: {
      return {
        ...state,
        recurring_reservation_id: action.value
      }
    }

    case NEW_RESERVATION_CAR_ID:
      return {
        ...state,
        car_id: action.value
      }

    case NEW_RESERVATION_CAR_LICENCE_PLATE:
      return {
        ...state,
        carLicencePlate: action.value
      }


    case NEW_RESERVATION_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }


    case NEW_RESERVATION_SET_FROM:
      return {
        ...state,
        from:          action.value,
        to:            action.to || state.to,
        recurringRule: { ...state.recurringRule,
          starts: moment(action.value, MOMENT_DATETIME_FORMAT).format(MOMENT_DATE_FORMAT)
        }
      }

    case NEW_RESERVATION_SET_TO:
      return {
        ...state,
        to: action.value
      }

    case NEW_RESERVATION_SET_PLACE_ID:
      return {
        ...state,
        place_id: state.garage && state.garage.flexiplace ? undefined : action.value
      }

    case NEW_RESERVATION_SET_PRICE:
      return {
        ...state,
        price: action.value
      }


    case NEW_RESERVATION_SET_DURATION_DATE:
      return {
        ...state,
        durationDate: action.value
      }

    case NEW_RESERVATION_SET_LOADING:
      return {
        ...state,
        loading: action.value
      }

    case NEW_RESERVATION_SET_HIGHLIGHT:
      return {
        ...state,
        highlight: action.value
      }

    case NEW_RESERVATION_SET_SEND_SMS:
      const client = state.user.availableClients.findById(state.client_id)
      return {
        ...state,
        sendSMS:          action.value,
        selectedTemplate: action.value ? client.sms_templates.length === 1 ? 0 : undefined : undefined,
        templateText:     action.value ? client.sms_templates.length === 1 ? client.sms_templates[0].template : '' : ''
      }

    case NEW_RESERVATION_SET_ERROR:
      return {
        ...state,
        error: action.value
      }

    case NEW_RESERVATION_SET_SELECTED_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.value,
        templateText:     substituteVariablesInTemplate(action.template, state)
      }

    case NEW_RESERVATION_SET_TEMPLATE_TEXT:
      return {
        ...state,
        templateText: substituteVariablesInTemplate(action.value, state)
      }

    case NEW_RESERVATION_SET_GATE_PHONE_NUMBER:
      return {
        ...state,
        gatePhoneNumber: action.value
      }


    case NEW_RESERVATION_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}
