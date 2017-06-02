import { request }    from '../helpers/request'
import {t}            from '../modules/localization/localization'

import { GET_SELECTED_TARIF } from '../queries/admin.pidSettings.queries'
import { UPDATE_GARAGE }      from '../queries/garageSetup.queries'

import { setCustomModal } from './pageBase.actions'

export const  PID_SETTINGS_SET_SELECTED = 'PID_SETTINGS_SET_SELECTED'


export function setSelected(value){
  return { type: PID_SETTINGS_SET_SELECTED
         , value
         }
}


export function initSelected() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setSelected(response.data.garage.pid_tarif_id))
    }

    request(onSuccess, GET_SELECTED_TARIF, {id: getState().pageBase.garage})
  }
}

export function changeGarageTarif(garage_id, tarif_id) {
  return (dispatch, getState) => {
    const state = getState().garageSetup

    const onSuccess = (response) => {
      if (response.data.update_garage.payment_url) {
        window.location.replace(response.data.update_garage.payment_url)
      } else {
        dispatch(initSelected())
        dispatch(setCustomModal(undefined))
      }
    }

    const garage = { id: +garage_id
                   , garage: { pid_tarif_id: tarif_id
                             , url:          window.location.href
                             }
                   }

    dispatch(setCustomModal(t(['addFeatures', 'loading'])))
    request( onSuccess, UPDATE_GARAGE, garage , "garageMutations" )
  }
}
