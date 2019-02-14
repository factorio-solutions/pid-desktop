import { SET_PID_ADMIN_NEWS_NEWS, SET_PID_ADMIN_MPI_GAR_NAME }  from '../actions/pid-admin.news.actions'

const defaultState = {
  news:    [],
  garName: 'Click to MPI test'
}

export default function pidAdminNews(state = defaultState, action) {
  switch (action.type) {
    case SET_PID_ADMIN_NEWS_NEWS:
      return {
        ...state,
        news: action.value
      }

    case SET_PID_ADMIN_MPI_GAR_NAME:
      return {
        ...state,
        garName: action.value
      }

    default:
      return state
  }
}
