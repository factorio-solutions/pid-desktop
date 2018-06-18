import {
  SET_PID_ADMIN_GARAGESOVERVIEW_SET_GARAGES,
  SET_PID_ADMIN_GARAGESOVERVIEW_SET_LOADING
} from '../actions/pid-admin.garagesOverview.actions'

const defaultState = {
  loading: false,
  garages: []
}


export default function garagesOverview(state = defaultState, action) {
  switch (action.type) {
    case SET_PID_ADMIN_GARAGESOVERVIEW_SET_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case SET_PID_ADMIN_GARAGESOVERVIEW_SET_LOADING:
      return {
        ...state,
        loading: action.value
      }

    default:
      return state
  }
}
