<<<<<<< HEAD
import { SET_NOTIFICATIONS_TABLEVIEW, SET_NOTIFICATIONS_DETAILS, SET_NOTIFICATIONS_COUNT, SET_NOTIFICATIONS_PAST }  from '../actions/notifications.actions'

const defaultState =  { count: 0
                      , notifications:[]
                      , past: false
                      , tableView: true
                      }

=======
import {
  SET_NOTIFICATIONS_TABLEVIEW,
  SET_NOTIFICATIONS_DETAILS,
  SET_NOTIFICATIONS_COUNT,
  SET_NOTIFICATIONS_PAST
}  from '../actions/notifications.actions'

const defaultState =  { count:          0
                      , notifications:  []
                      , past:           false
                      , tableView:      true
                      }


>>>>>>> feature/new_api
export default function notifications (state = defaultState, action) {
  switch (action.type) {

    case SET_NOTIFICATIONS_COUNT:
    return  { ...state
            , count: action.value
            }

    case SET_NOTIFICATIONS_DETAILS:
    return  { ...state
            , notifications: action.value
            }

    case SET_NOTIFICATIONS_PAST:
    return  { ...state
            , past: action.value
            }

    case SET_NOTIFICATIONS_TABLEVIEW:
    return  { ...state
            , tableView: action.value
            }

<<<<<<< HEAD

=======
>>>>>>> feature/new_api
    default:
      return state
  }
}
