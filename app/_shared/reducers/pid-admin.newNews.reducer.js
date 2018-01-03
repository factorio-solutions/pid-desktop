import {
  SET_PID_ADMIN_NEWS_ID,
  SET_PID_ADMIN_NEWS_LABEL,
  SET_PID_ADMIN_NEWS_URL
}  from '../actions/pid-admin.newNews.actions'


const defaultState = {
  id:    undefined,
  label: '',
  url:   ''
}

export default function pidAdminNewNews(state = defaultState, action) {
  switch (action.type) {

    case SET_PID_ADMIN_NEWS_ID:
      return {
        ...state,
        id: action.value
      }

    case SET_PID_ADMIN_NEWS_LABEL:
      return {
        ...state,
        label: action.value
      }

    case SET_PID_ADMIN_NEWS_URL:
      return {
        ...state,
        url: action.value
      }


    default:
      return state
  }
}
