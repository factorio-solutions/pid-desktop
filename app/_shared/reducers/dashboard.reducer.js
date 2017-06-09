import {
  DASHBOARD_SET_NEWS,
  DASHBOARD_SET_GARAGE,
  DASHBOARD_SET_LOGS
} from '../actions/dashboard.actions'

const defaultState =  { news: []
                      , garage: undefined
                      , logs: []
                      }


export default function dashboard (state = defaultState, action) {
  switch (action.type) {

    case DASHBOARD_SET_NEWS:
      return  { ...state
              , news: action.value
              }

    case DASHBOARD_SET_GARAGE:
      return  { ...state
              , garage: action.value
              }

    case DASHBOARD_SET_LOGS:
      return  { ...state
              , logs: action.value
              }

    default:
      return state
  }
}
