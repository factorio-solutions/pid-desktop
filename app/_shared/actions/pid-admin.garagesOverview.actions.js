import request from '../helpers/requestAdmin'
import actionFactory from '../helpers/actionFactory'

import { GET_ADMIN_GARAGES } from '../queries/pid-admin.garagesOverview.queries'


export const SET_PID_ADMIN_GARAGESOVERVIEW_SET_GARAGES = 'SET_PID_ADMIN_GARAGESOVERVIEW_SET_GARAGES'
export const SET_PID_ADMIN_GARAGESOVERVIEW_SET_LOADING = 'SET_PID_ADMIN_GARAGESOVERVIEW_SET_LOADING'


export const setGarages = actionFactory(SET_PID_ADMIN_GARAGESOVERVIEW_SET_GARAGES)
export const setLoading = actionFactory(SET_PID_ADMIN_GARAGESOVERVIEW_SET_LOADING)


export function initState() {
  return dispatch => {
    dispatch(setLoading(true))
    request(GET_ADMIN_GARAGES).then(data => {
      dispatch(setGarages(data.garages))
      dispatch(setLoading(false))
    })
  }
}
