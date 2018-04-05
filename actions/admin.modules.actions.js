import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import { t }         from '../modules/localization/localization'

import { setCustomModal, setError } from './pageBase.actions'
import { GET_GARAGE_MODULES, UPDATE_MARKETING, UPDATE_GARAGE } from '../queries/admin.modules.queries.js'


export const ADMIN_MODULES_SET_GO_PUBLIC = 'ADMIN_MODULES_SET_GO_PUBLIC'
export const ADMIN_MODULES_SET_GO_INTERNAL = 'ADMIN_MODULES_SET_GO_INTERNAL'
export const ADMIN_MODULES_SET_FLEXIPLACE = 'ADMIN_MODULES_SET_FLEXIPLACE'
export const ADMIN_MODULES_SET_MARKETING_PAGE = 'ADMIN_MODULES_SET_MARKETING_PAGE'
export const ADMIN_MODULES_SET_MARKETING_SHORT_NAME = 'ADMIN_MODULES_SET_MARKETING_SHORT_NAME'
export const ADMIN_MODULES_SET_RESERVATION_FORM = 'ADMIN_MODULES_SET_RESERVATION_FORM'
export const ADMIN_MODULES_SET_MR_PARKIT_CONNECTION = 'ADMIN_MODULES_SET_MR_PARKIT_CONNECTION'


export const setGoPublic = actionFactory(ADMIN_MODULES_SET_GO_PUBLIC)
export const setGoInternal = actionFactory(ADMIN_MODULES_SET_GO_INTERNAL)
export const setFlexiplace = actionFactory(ADMIN_MODULES_SET_FLEXIPLACE)
export const setMarketingPage = actionFactory(ADMIN_MODULES_SET_MARKETING_PAGE)
export const setMarketingShortName = actionFactory(ADMIN_MODULES_SET_MARKETING_SHORT_NAME)
export const setAdminReservationForm = actionFactory(ADMIN_MODULES_SET_RESERVATION_FORM)
export const setMrParkitConnection = actionFactory(ADMIN_MODULES_SET_MR_PARKIT_CONNECTION)


export function initModules() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setGoPublic(response.data.garage.is_public))
      dispatch(setGoInternal(response.data.garage.go_internal))
      dispatch(setFlexiplace(response.data.garage.flexiplace))
      dispatch(setMarketingPage(response.data.garage.marketing))
      dispatch(setMarketingShortName(response.data.garage.marketing.short_name))
    }

    getState().pageBase.garage && request(onSuccess, GET_GARAGE_MODULES, { id: getState().pageBase.garage })
  }
}


export function toggleMarketing() {
  return (dispatch, getState) => {
    const state = getState().adminModules

    const onSuccess = response => {
      window.location.replace(response.data.update_marketing.payment_url)
    }

    dispatch(setCustomModal(t([ 'modules', 'startingMarketing' ])))
    request(onSuccess
           , UPDATE_MARKETING
           , { id:        state.marketing.id,
             marketing: { marketing_launched: !state.marketing.active_marketing_launched,
               url:                window.location.href
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

    request(onSuccess
           , UPDATE_GARAGE
           , { id:     getState().pageBase.garage,
             garage: { is_public: value }
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

    request(onSuccess
           , UPDATE_GARAGE
           , { id:     getState().pageBase.garage,
             garage: { flexiplace: false }
           }
           )
  }
}
