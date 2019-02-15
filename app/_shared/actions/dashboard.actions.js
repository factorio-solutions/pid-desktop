import request  from '../helpers/request'

import { INIT_DASHBOARD, INIT_GARAGE } from '../queries/dashboard.queries'


export const DASHBOARD_SET_NEWS = 'DASHBOARD_SET_NEWS'
export const DASHBOARD_SET_GARAGE = 'DASHBOARD_SET_GARAGE'
export const DASHBOARD_SET_LOGS = 'DASHBOARD_SET_LOGS'


export function setNews(value) {
  return {
    type: DASHBOARD_SET_NEWS,
    value
  }
}

export function setGarage(value) {
  return {
    type: DASHBOARD_SET_GARAGE,
    value
  }
}

export function setLogs(value) {
  return {
    type: DASHBOARD_SET_LOGS,
    value
  }
}


export function initDashboard() {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setNews(response.data.news))
    }

    request(onSuccess, INIT_DASHBOARD)
  }
}

export function initGarage() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const garage = {
        ...response.data.garage,
        floors: response.data.garage.floors.map(floor => {
          return {
            ...floor,
            places: floor.places.map(place => {
              return {
                ...place,
                group: response.data.reservations.find(res => res.place_id === place.id) !== undefined ? 1 : undefined
              }
            })
          }
        })
      }

      dispatch(setGarage(garage))
    }

    getState().pageBase.garage && request(onSuccess, INIT_GARAGE, { id: getState().pageBase.garage })
  }
}
