import { ACCOUNTPLACES_RESET_FORM, SET_ACCOUNTPLACES_FROM, SET_ACCOUNTPLACES_TO, SET_ACCOUNTPLACES_ACCOUNTS, SET_ACCOUNTPLACES_FLOORS, SET_ACCOUNTPLACES_GARAGE, SET_ACCOUNTPLACES_FLOOR, SET_ACCOUNTPLACES_ACCOUNT }  from '../actions/garageAccounts.actions'
import moment from 'moment'

const defaultState =  { accounts: []
                      , account_id: undefined
                      , garage: undefined
                      , selectedFloor: undefined
                      , availableFloors: []
                      , from: moment().startOf('month').format('DD.MM.YYYY')
                      , to: moment().endOf('month').format('DD.MM.YYYY')
                      }

export default function garageAccounts (state = defaultState, action) {
  switch (action.type) {

    case SET_ACCOUNTPLACES_ACCOUNTS:
    return  { ...state
            , accounts: action.value
            }

    case SET_ACCOUNTPLACES_ACCOUNT:
    return  { ...state
            , account_id: action.value
            }

    case SET_ACCOUNTPLACES_GARAGE:
    return  { ...state
            , garage: action.value
            }

    case SET_ACCOUNTPLACES_FLOOR:
    return  { ...state
            , selectedFloor: action.value
            }

    case SET_ACCOUNTPLACES_FLOORS:
    return  { ...state
            , availableFloors: action.value
            }

    case SET_ACCOUNTPLACES_FROM:
    return  { ...state
            , from: action.value
            }

    case SET_ACCOUNTPLACES_TO:
    return  { ...state
            , to: action.value
            }

    case ACCOUNTPLACES_RESET_FORM:
    return  defaultState

    default:
      return state
  }
}
