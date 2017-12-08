import request from '../helpers/requestAdmin'

import { GET_ALL_NEWS, DELETE_NEWS } from '../queries/pid-admin.news.queries'


export const SET_PID_ADMIN_NEWS_NEWS = 'SET_PID_ADMIN_NEWS_NEWS'


export function setNews(value) {
  return {
    type: SET_PID_ADMIN_NEWS_NEWS,
    value
  }
}


export function initNews() {
  return dispatch => {
    request(GET_ALL_NEWS)
    .then(data => dispatch(setNews(data.news)))
  }
}

export function deleteNews(id) {
  return dispatch => {
    request(DELETE_NEWS, { id })
    .then(() => dispatch(initNews()))
  }
}
