import { request }        from '../helpers/request'
import { download }       from '../helpers/download'
import { setCustomModal } from './pageBase.actions'
import { t }              from '../modules/localization/localization'

import { GET_RESERVATIONS_QUERY, DESTROY_RESERVATION } from '../queries/reservations.queries'
import { DOWNLOAD_INVOICE }                            from '../queries/invoices.queries'
import { PAY_RESREVATION }                             from '../queries/newReservation.queries'


export const SET_RESERVATIONS           = "SET_RESERVATIONS"
export const SET_RESERVATIONS_TABLEVIEW = "SET_RESERVATIONS_TABLEVIEW"


export function setReservations (reservations){
  return  { type: SET_RESERVATIONS
          , value: reservations
          }
}

export function setTableView (bool){
  return  { type: SET_RESERVATIONS_TABLEVIEW
          , value: bool
          }
}


export function initReservations (){
  return (dispatch, getState) => {
    const onSuccess = (respoonse) => {
      dispatch( setReservations(respoonse.data.reservations) )
    }
    request(onSuccess, GET_RESERVATIONS_QUERY)
  }
}

export function destroyReservation (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(initReservations())
    }
    request(onSuccess, DESTROY_RESERVATION, {id: id})
  }
}

export function downloadInvoice (id){
  return (dispatch, getState) => {
    download(`${id}.pdf`, DOWNLOAD_INVOICE, {id})
  }
}

export function payReservation (url){
  return (dispatch, getState) => {
    dispatch(setCustomModal(<div>{t(['newReservation', 'redirecting'])}</div>))
    window.location.replace(url)
  }
}
