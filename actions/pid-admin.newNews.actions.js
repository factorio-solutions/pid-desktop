import request from '../helpers/requestAdmin'
import * as nav from '../helpers/navigation'

import { CREATE_NEWS, EDIT_NEWS } from '../queries/pid-admin.newNews.queries'


export const SET_PID_ADMIN_NEWS_ID = 'SET_PID_ADMIN_NEWS_ID'
export const SET_PID_ADMIN_NEWS_LABEL = 'SET_PID_ADMIN_NEWS_LABEL'
export const SET_PID_ADMIN_NEWS_URL = 'SET_PID_ADMIN_NEWS_URL'


export function setId(value) {
  return {
    type: SET_PID_ADMIN_NEWS_ID,
    value
  }
}

export function setLabel(value) {
  return {
    type: SET_PID_ADMIN_NEWS_LABEL,
    value
  }
}

export function setUrl(value) {
  return {
    type: SET_PID_ADMIN_NEWS_URL,
    value
  }
}


export function initNewNews(id, label, url) {
  return dispatch => {
    dispatch(setId(id))
    dispatch(setLabel(label))
    dispatch(setUrl(url))
    nav.to(id ? `/pid-admin/news/${id}/edit` : '/pid-admin/news/newNews')
  }
}

export function submit() {
  return (dispatch, getState) => {
    const state = getState().pidAdminNewNews

    request(state.id ? EDIT_NEWS : CREATE_NEWS, {
      id:   state.id,
      news: {
        label: state.label,
        url:   state.url ? state.url : null
      }
    })
    .then(() => nav.to('/pid-admin/news'))
  }
}
