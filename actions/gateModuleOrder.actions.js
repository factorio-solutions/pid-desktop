import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { t }          from '../modules/localization/localization'

import { GATE_MODULE_NEW_ORDER } from '../queries/gateModuleOrder.queries'
import { setCustomModal, setSuccess, setError }        from './pageBase.actions'

export const GATE_MODULE_ORDER_AMOUNT               = 'GATE_MODULE_ORDER_AMOUNT'
export const GATE_MODULE_ORDER_HIGHLIGHT            = 'GATE_MODULE_ORDER_HIGHLIGHT'
export const GATE_MODULE_ORDER_EQUAL_ADDRESSES      = 'GATE_MODULE_ORDER_EQUAL_ADDRESSES'
export const GATE_MODULE_ORDER_NAME                 = 'GATE_MODULE_ORDER_NAME'
export const GATE_MODULE_ORDER_LINE_1               = 'GATE_MODULE_ORDER_LINE_1'
export const GATE_MODULE_ORDER_LINE_2               = 'GATE_MODULE_ORDER_LINE_2'
export const GATE_MODULE_ORDER_CITY                 = 'GATE_MODULE_ORDER_CITY'
export const GATE_MODULE_ORDER_POSTAL_CODE          = 'GATE_MODULE_ORDER_POSTAL_CODE'
export const GATE_MODULE_ORDER_STATE                = 'GATE_MODULE_ORDER_STATE'
export const GATE_MODULE_ORDER_COUNTRY              = 'GATE_MODULE_ORDER_COUNTRY'
export const GATE_MODULE_ORDER_INVOICE_NAME         = 'GATE_MODULE_ORDER_INVOICE_NAME'
export const GATE_MODULE_ORDER_INVOICE_LINE_1       = 'GATE_MODULE_ORDER_INVOICE_LINE_1'
export const GATE_MODULE_ORDER_INVOICE_LINE_2       = 'GATE_MODULE_ORDER_INVOICE_LINE_2'
export const GATE_MODULE_ORDER_INVOICE_CITY         = 'GATE_MODULE_ORDER_INVOICE_CITY'
export const GATE_MODULE_ORDER_INVOICE_POSTAL_CODE  = 'GATE_MODULE_ORDER_INVOICE_POSTAL_CODE'
export const GATE_MODULE_ORDER_INVOICE_STATE        = 'GATE_MODULE_ORDER_INVOICE_STATE'
export const GATE_MODULE_ORDER_INVOICE_COUNTRY      = 'GATE_MODULE_ORDER_INVOICE_COUNTRY'


export function setAmount (value){
  return {type: GATE_MODULE_ORDER_AMOUNT
         , value: parseInt(value)
         }
}

export function setHighlight (value){
  return {type: GATE_MODULE_ORDER_HIGHLIGHT
         , value
         }
}

export function setEqualAddresses (value){
  return {type: GATE_MODULE_ORDER_EQUAL_ADDRESSES
         , value
         }
}

export function setName (value){
  return {type: GATE_MODULE_ORDER_NAME
         , value
         }
}

export function setLine1 (value){
  return {type: GATE_MODULE_ORDER_LINE_1
         , value
         }
}

export function setLine2 (value){
  return {type: GATE_MODULE_ORDER_LINE_2
         , value
         }
}

export function setCity (value){
  return {type: GATE_MODULE_ORDER_CITY
         , value
         }
}

export function setPostalCode (value){
  return {type: GATE_MODULE_ORDER_POSTAL_CODE
         , value
         }
}

export function setState (value){
  return {type: GATE_MODULE_ORDER_STATE
         , value
         }
}

export function setCountry (value){
  return {type: GATE_MODULE_ORDER_COUNTRY
         , value
         }
}

export function setInvoiceName (value){
  return {type: GATE_MODULE_ORDER_INVOICE_NAME
         , value
         }
}

export function setInvoiceLine1 (value){
  return {type: GATE_MODULE_ORDER_INVOICE_LINE_1
         , value
         }
}

export function setInvoiceLine2 (value){
  return {type: GATE_MODULE_ORDER_INVOICE_LINE_2
         , value
         }
}

export function setInvoiceCity (value){
  return {type: GATE_MODULE_ORDER_INVOICE_CITY
         , value
         }
}

export function setInvoicePostalCode (value){
  return {type: GATE_MODULE_ORDER_INVOICE_POSTAL_CODE
         , value
         }
}

export function setInvoiceState (value){
  return {type: GATE_MODULE_ORDER_INVOICE_STATE
         , value
         }
}

export function setInvoiceCountry (value){
  return {type: GATE_MODULE_ORDER_INVOICE_COUNTRY
         , value
         }
}


export function toggleHighlight () {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().gateModuleOrder.highlight))
  }
}
export function toggleEqualAddresses () {
  return (dispatch, getState) => {
    dispatch(setEqualAddresses(!getState().gateModuleOrder.equalAddresses))
  }
}

export function submitOrder() {
  return (dispatch, getState) => {
    const state = getState().gateModuleOrder

    const onSuccess = (response) => {
      console.log(response);
      window.location.replace(response.data.create_module_order.payment_url)
      // dispatch(setCustomModal( undefined ))
    }

    dispatch(setCustomModal( <div> {t(['orderGarageModule', 'placingOrder'])} </div> ))
    request( onSuccess
           , GATE_MODULE_NEW_ORDER
           , { module: { amount:  state.amount
                       , url:     window.location.href.split('?')[0]
                       , address: { name:         state.address.name
                                  , line_1:       state.address.line_1
                                  , line_2:       state.address.line_2
                                  , city:         state.address.city
                                  , postal_code:  state.address.postal_code
                                  , state:        state.address.state
                                  , country:      state.address.country
                                  }
                       , invoice_address: state.equalAddresses ? null : { name:        state.invoice_address.name
                                                                        , line_1:      state.invoice_address.line_1
                                                                        , line_2:      state.invoice_address.line_2
                                                                        , city:        state.invoice_address.city
                                                                        , postal_code: state.invoice_address.postal_code
                                                                        , state:       state.invoice_address.state
                                                                        , country:     state.invoice_address.country
                                                                        }
                       }
             }
           )
  }
}

export function paymentComplete(success){
  return (dispatch, getState) => {
    nav.to(`/addFeatures`)
    success ? dispatch(setSuccess(t(['orderGarageModule', 'orderSuccessfull']))) : dispatch(setError(t(['orderGarageModule', 'orderFailed'])))
  }
}
