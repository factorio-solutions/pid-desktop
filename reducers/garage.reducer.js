import moment from 'moment'
import {
  GARAGE_SET_SELECTED,
  GARAGE_SET_GARAGE,
  GARAGE_SET_NOW,
  GARAGE_SET_SHOW_SELECTOR,
  GARAGE_SET_TIME,
  GARAGE_SET_LOADING
}  from '../actions/garage.actions'

const defaultState = {
  selected:     'clients',
  garage:       undefined, // garage details
  now:          true, // is now selected
  showSelector: false, // show datetime selector?
  time:         moment(),
  loading:      false
}


export default function garage(state = defaultState, action) {
  switch (action.type) {

    case GARAGE_SET_SELECTED:
      return {
        ...state,
        selected: action.value
      }

    case GARAGE_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case GARAGE_SET_NOW:
      return {
        ...state,
        time: moment(),
        now:  true
      }

    case GARAGE_SET_SHOW_SELECTOR:
      return {
        ...state,
        showSelector: action.value
      }

    case GARAGE_SET_TIME:
      return {
        ...state,
        time: action.value,
        now:  moment().isBetween(moment(action.value), moment(action.value).add(15, 'minutes'))
      }

    case GARAGE_SET_LOADING:
      return {
        ...state,
        loading: action.value
      }

    default:
      return state
  }
}
