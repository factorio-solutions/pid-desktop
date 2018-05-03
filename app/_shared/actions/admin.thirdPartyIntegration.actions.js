import { request }     from '../helpers/request'
import actionFactory   from '../helpers/actionFactory'
import requestPromise  from '../helpers/requestPromise'
import { initModules } from './admin.modules.actions'

import { GET_GARAGE, UPDATE_ALL_PLACES } from '../queries/admin.thirdPartyIntegration.queries.js'


export const ADMIN_THIRD_PARTY_INTEGRATION_SET_GARAGE = 'ADMIN_THIRD_PARTY_INTEGRATION_SET_GARAGE'
export const ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_PLACE = 'ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_PLACE'
export const ADMIN_THIRD_PARTY_INTEGRATION_SET_PLACES = 'ADMIN_THIRD_PARTY_INTEGRATION_SET_PLACES'


export const setGarage = actionFactory(ADMIN_THIRD_PARTY_INTEGRATION_SET_GARAGE)
export const togglePlace = actionFactory(ADMIN_THIRD_PARTY_INTEGRATION_TOGGLE_PLACE)
export const setPlaces = actionFactory(ADMIN_THIRD_PARTY_INTEGRATION_SET_PLACES)


export function initThirdPartyIntegration(key) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setGarage(response.data.garage))
      dispatch(setPlaces(response.data.garage.floors.reduce(
        (acc, floor) => [
          ...acc,
          ...floor.places.filter(place => place[key]).map(p => p.id)
        ], []
      )))
    }

    getState().pageBase.garage && request(onSuccess, GET_GARAGE, { id: getState().pageBase.garage })
  }
}


function getPlaces(getState) {
  return getState().adminThirdPartyIntegration.garage.floors.reduce((acc, floor) => [ ...acc, ...(floor.places || []) ], [])
}

export function submitIntegration(key) {
  return (dispatch, getState) => {
    const state = getState().adminThirdPartyIntegration

    requestPromise(UPDATE_ALL_PLACES, { places: getPlaces(getState).map(place => ({
      id:    place.id,
      [key]: state.places.includes(place.id)
    })) }).then(() => dispatch(initModules()))
  }
}

export function disableIntegration(key) {
  return (dispatch, getState) => {
    requestPromise(UPDATE_ALL_PLACES, { places: getPlaces(getState).map(place => ({ id: place.id, [key]: false })) })
    .then(() => {
      dispatch(initThirdPartyIntegration(key))
      dispatch(initModules())
    })
  }
}


export function disableThirdPartyIntegration() {
  return dispatch => {
    dispatch(disableIntegration('third_party'))
  }
}
export function disableMrParkitIntegration() {
  return dispatch => {
    dispatch(disableIntegration('mr_parkit'))
  }
}

export function submitThirdPartyIntegration() {
  return dispatch => {
    dispatch(submitIntegration('third_party'))
  }
}

export function submitMrParkitIntegration() {
  return dispatch => {
    dispatch(submitIntegration('mr_parkit'))
  }
}
