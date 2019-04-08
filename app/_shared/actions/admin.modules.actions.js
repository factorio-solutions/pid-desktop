import request    from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { t }          from '../modules/localization/localization'
import actionFactory  from '../helpers/actionFactory'

import { setCustomModal, setError } from './pageBase.actions'
import { GET_GARAGE_MODULES, UPDATE_MARKETING, UPDATE_GARAGE } from '../queries/admin.modules.queries.js'
import { GET_GARAGE_TOKEN, REGENERATE_GARAGE_TOKEN } from '../queries/admin.thirdPartyIntegration.queries.js'


export const ADMIN_MODULES_SET_GO_PUBLIC = 'ADMIN_MODULES_SET_GO_PUBLIC'
export const ADMIN_MODULES_SET_GO_INTERNAL = 'ADMIN_MODULES_SET_GO_INTERNAL'
export const ADMIN_MODULES_SET_FLEXIPLACE = 'ADMIN_MODULES_SET_FLEXIPLACE'
export const ADMIN_MODULES_SET_MARKETING_PAGE = 'ADMIN_MODULES_SET_MARKETING_PAGE'
export const ADMIN_MODULES_SET_MARKETING_SHORT_NAME = 'ADMIN_MODULES_SET_MARKETING_SHORT_NAME'
export const ADMIN_MODULES_SET_RESERVATION_FORM = 'ADMIN_MODULES_SET_RESERVATION_FORM'
export const ADMIN_MODULES_SET_MR_PARKIT_INTEGRATION = 'ADMIN_MODULES_SET_MR_PARKIT_INTEGRATION'
export const ADMIN_MODULES_SET_THIRD_PARTY_INTEGRATION = 'ADMIN_MODULES_SET_THIRD_PARTY_INTEGRATION'
export const ADMIN_MODULES_SET_THIRD_PARTY_TOKEN = 'ADMIN_MODULES_SET_THIRD_PARTY_TOKEN'
export const ADMIN_MODULES_TOGGLE_SHOW_HINT = 'ADMIN_MODULES_TOGGLE_SHOW_HINT'

export const setGoPublic = actionFactory(ADMIN_MODULES_SET_GO_PUBLIC)
export const setGoInternal = actionFactory(ADMIN_MODULES_SET_GO_INTERNAL)
export const setFlexiplace = actionFactory(ADMIN_MODULES_SET_FLEXIPLACE)
export const setMarketingPage = actionFactory(ADMIN_MODULES_SET_MARKETING_PAGE)
export const setMarketingShortName = actionFactory(ADMIN_MODULES_SET_MARKETING_SHORT_NAME)
export const setAdminReservationForm = actionFactory(ADMIN_MODULES_SET_RESERVATION_FORM)
export const setMrParkitIntegration = actionFactory(ADMIN_MODULES_SET_MR_PARKIT_INTEGRATION)
export const setThirdPartyIntegration = actionFactory(ADMIN_MODULES_SET_THIRD_PARTY_INTEGRATION)
export const setToken = actionFactory(ADMIN_MODULES_SET_THIRD_PARTY_TOKEN)
export const toggleShowHint = actionFactory(ADMIN_MODULES_TOGGLE_SHOW_HINT)


export function initModules() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setGoPublic(response.data.garage.is_public))
      dispatch(setGoInternal(response.data.garage.go_internal))
      dispatch(setFlexiplace(response.data.garage.flexiplace))
      dispatch(setMarketingPage(response.data.garage.marketing))
      dispatch(setMarketingShortName(response.data.garage.marketing.short_name))
      dispatch(setMrParkitIntegration(response.data.garage.mr_parkit_integration))
      dispatch(setThirdPartyIntegration(response.data.garage.third_party_integration))
    }

    getState().pageBase.garage && request(onSuccess, GET_GARAGE_MODULES, { id: getState().pageBase.garage })
  }
}


export function toggleMarketing() {
  return (dispatch, getState) => {
    const state = getState().adminModules

    const onSuccess = response => {
      dispatch(initModules())
    }

    request(onSuccess,
      UPDATE_MARKETING,
      { id:        state.marketing.id,
        marketing: {
          marketing_launched: !state.marketing.active_marketing_launched,
        }
      }
    )
  }
}

export function toggleGoPublic() {
  return (dispatch, getState) => {
    const state = getState().adminModules
    const value = !state.goPublic

    const onSuccess = response => {
      if (response.data.update_garage.is_public !== value) {
        dispatch(setError(t([ 'modules', 'cannotBeChanged' ])))
      }
      dispatch(setGoPublic(response.data.update_garage.is_public))
    }

    request(onSuccess,
      UPDATE_GARAGE,
      { id:     getState().pageBase.garage,
        garage: {
          is_public: value
        }
      }
    )
  }
}

export function disableFlexiplace() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.update_garage.flexiplace) {
        dispatch(setError(t([ 'modules', 'cannotBeChanged' ])))
      }
      dispatch(setFlexiplace(response.data.update_garage.flexiplace))
    }

    request(onSuccess,
      UPDATE_GARAGE,
      { id:     getState().pageBase.garage,
        garage: {
          flexiplace: false
        }
      }
    )
  }
}

export function showApiEndpoint() {
  return (dispatch, getState) => {
    requestPromise(GET_GARAGE_TOKEN, { id: getState().pageBase.garage })
    .then(data => dispatch(setToken(data.garage.token)))
  }
}

export function regenerateApiKey() {
  return (dispatch, getState) => {
    requestPromise(REGENERATE_GARAGE_TOKEN, { id: getState().pageBase.garage })
    .then(data => dispatch(setToken(data.garage.regenerate_token)))
  }
}
