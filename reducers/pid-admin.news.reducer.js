import { SET_PID_ADMIN_NEWS_NEWS }  from '../actions/pid-admin.news.actions'

const defaultState = {
  news: []
}

export default function pidAdminNews(state = defaultState, action) {
  switch (action.type) {

    case SET_PID_ADMIN_NEWS_NEWS:
      return {
        ...state,
        news: action.value
      }

    default:
      return state
  }
}
