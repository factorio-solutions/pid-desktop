import React from 'react'

import { request }           from '../helpers/request'
import actionFactory         from '../helpers/actionFactory'
import { composeParameters } from '../helpers/parseUrlParameters'
import { t }                 from '../modules/localization/localization'
import * as nav              from '../helpers/navigation'

import ConfirmModal       from '../../_shared/components/modal/ConfirmModal'

import { setSuccess, setError, fetchCurrentUser, setCustomModal, alert } from './pageBase.actions'

import { GET_RENTS, GET_GARAGE_PAYMENT_METHOD, GET_PERMISSION, UPDATE_ACCOUNT } from '../queries/admin.finance.queries'
import { UPDATE_GARAGE }                                                        from '../queries/garageSetup.queries'


export const ADMIN_FINANCE_SET_RENTS = 'ADMIN_FINANCE_SET_RENTS'
export const ADMIN_FINANCE_SET_PAYPAL = 'ADMIN_FINANCE_SET_PAYPAL'
export const ADMIN_FINANCE_SET_CSOB = 'ADMIN_FINANCE_SET_CSOB'
export const ADMIN_FINANCE_SET_GP_WEBPAY = 'ADMIN_FINANCE_SET_GP_WEBPAY'
export const ADMIN_FINANCE_SET_GP_WEBPAY_MERCHANT_ID = 'ADMIN_FINANCE_SET_GP_WEBPAY_MERCHANT_ID'
export const ADMIN_FINANCE_SET_GP_WEBPAY_PASSWORD = 'ADMIN_FINANCE_SET_GP_WEBPAY_PASSWORD'
export const ADMIN_FINANCE_SET_GP_WEBPAY_PRIVATE_KEY = 'ADMIN_FINANCE_SET_GP_WEBPAY_PRIVATE_KEY'
export const ADMIN_FINANCE_SET_ACCOUNT_ID = 'ADMIN_FINANCE_SET_ACCOUNT_ID'
export const ADMIN_FINANCE_SET_CSOB_MERCHANT_ID = 'ADMIN_FINANCE_SET_CSOB_MERCHANT_ID'
export const ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY = 'ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY'
export const ADMIN_FINANCE_SET_VAT = 'ADMIN_FINANCE_SET_VAT'
export const ADMIN_FINANCE_SET_INVOICE_ROW = 'ADMIN_FINANCE_SET_INVOICE_ROW'
export const ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_ROW = 'ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_ROW'
export const ADMIN_FINANCE_SET_INVOICE_PREFIX = 'ADMIN_FINANCE_SET_INVOICE_PREFIX'
export const ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_PREFIX = 'ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_PREFIX'
export const ADMIN_FINANCE_SET_ACCOUNT_NUMBER = 'ADMIN_FINANCE_SET_ACCOUNT_NUMBER'
export const ADMIN_FINANCE_SET_HIGHTLIGHT = 'ADMIN_FINANCE_SET_HIGHTLIGHT'
export const ADMIN_FINANCE_SET_IBAN = 'ADMIN_FINANCE_SET_IBAN'
export const ADMIN_FINANCE_SET_IBAN_PATTERN = 'ADMIN_FINANCE_SET_IBAN_PATTERN'


export const setRents = actionFactory(ADMIN_FINANCE_SET_RENTS)
export const setPaypal = actionFactory(ADMIN_FINANCE_SET_PAYPAL)
export const setCSOB = actionFactory(ADMIN_FINANCE_SET_CSOB)
export const setGpWebpay = actionFactory(ADMIN_FINANCE_SET_GP_WEBPAY)
export const setAccountId = actionFactory(ADMIN_FINANCE_SET_ACCOUNT_ID)
export const setCsobMerchantId = actionFactory(ADMIN_FINANCE_SET_CSOB_MERCHANT_ID)
export const setCsobPrivateKey = actionFactory(ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY)
export const setGpWebpayMerchantId = actionFactory(ADMIN_FINANCE_SET_GP_WEBPAY_MERCHANT_ID)
export const setGpWebpayPassword = actionFactory(ADMIN_FINANCE_SET_GP_WEBPAY_PASSWORD)
export const setGpWebpayPrivateKey = actionFactory(ADMIN_FINANCE_SET_GP_WEBPAY_PRIVATE_KEY)
export const setAccountNumber = actionFactory(ADMIN_FINANCE_SET_ACCOUNT_NUMBER)
export const setHighlight = actionFactory(ADMIN_FINANCE_SET_HIGHTLIGHT)
export const setIban = actionFactory(ADMIN_FINANCE_SET_IBAN)
export const setIbanPattern = actionFactory(ADMIN_FINANCE_SET_IBAN_PATTERN)
export const setInvoicePrefix = actionFactory(ADMIN_FINANCE_SET_INVOICE_PREFIX)
export const setSimplyfiedInvoicePrefix = actionFactory(ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_PREFIX)


export function setVat(value) {
  return { type:  ADMIN_FINANCE_SET_VAT,
    value: parseFloat(value) || 0
  }
}

export function setInvoiceRow(value) {
  return { type:  ADMIN_FINANCE_SET_INVOICE_ROW,
    value: +value
  }
}

export function setSimplyfiedInvoiceRow(value) {
  return { type:  ADMIN_FINANCE_SET_SIMPLYFIED_INVOICE_ROW,
    value: +value
  }
}

export function toggleHighlight() {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().adminFinance.highlight))
  }
}


export function initRents() {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setRents(response.data.rents))
    }

    request(onSuccess, GET_RENTS)

    dispatch(fetchCurrentUser())
  }
}

export function initFinance(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCSOB(response.data.garage.account.csob_merchant_id !== null))
      dispatch(setGpWebpay(response.data.garage.account.gp_webpay_merchant_id !== null))
      dispatch(setCsobMerchantId(response.data.garage.account.csob_merchant_id || ''))
      dispatch(setCsobPrivateKey(response.data.garage.account.csob_private_key ? 'stored' : ''))
      dispatch(setGpWebpayMerchantId(response.data.garage.account.gp_webpay_merchant_id || ''))
      dispatch(setGpWebpayPrivateKey(response.data.garage.account.gp_webpay_private_key ? 'stored' : ''))
      dispatch(setPaypal(response.data.garage.account.paypal_email !== null))
      dispatch(setAccountId(response.data.garage.account.id))
      dispatch(setVat(response.data.garage.vat))
      dispatch(setInvoiceRow(response.data.garage.invoice_row))
      dispatch(setSimplyfiedInvoiceRow(response.data.garage.simplyfied_invoice_row))
      dispatch(setInvoicePrefix(response.data.garage.invoice_prefix))
      dispatch(setSimplyfiedInvoicePrefix(response.data.garage.simplyfied_invoice_prefix))
      dispatch(setAccountNumber(response.data.garage.account_number))
      dispatch(setIban(response.data.garage.account.iban))
      dispatch(setIbanPattern())
    }

    request(onSuccess, GET_GARAGE_PAYMENT_METHOD, { id: +id })
  }
}


export function paypalClick() {
  return (dispatch, getState) => {
    const onPaypalSuccess = response => {
      if (response.data.paypal_get_permissions === '') {
        dispatch(initFinance(getState().pageBase.garage))
        dispatch(setCustomModal())
      } else {
        dispatch(setCustomModal(<div>{t([ 'newAccount', 'redirecting' ])}</div>))
        window.location.replace(response.data.paypal_get_permissions)
      }
    }

    dispatch(setCustomModal(<div>{t([ 'addFeatures', 'loading' ])}</div>))

    const accountId = getState().adminFinance.account_id
    request(
      onPaypalSuccess,
      GET_PERMISSION,
      { url:        `${window.location.href.split('?')[0]}?${composeParameters({ id: accountId })}`,
        account_id: accountId
      }
    )
  }
}


export function upadteAccount(id, account, callback) {
  request(callback, UPDATE_ACCOUNT, { id, account })
}


export function upadteAccountPaypal(params) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCustomModal(undefined))
      dispatch(setCSOB(response.data.update_account.csob_merchant_id !== null))
      dispatch(setPaypal(response.data.update_account.paypal_email !== null))
    }
    const valuesToChange = {
      paypal_temporary_token:          params.request_token,
      paypal_temporary_token_verifier: params.verification_code
    }

    upadteAccount(+params.id, valuesToChange, onSuccess)
  }
}


export function updateAccountCsob(csobMerchantId, csobPrivateKey, callback) {
  return (dispatch, getState) => {
    const valuesToChange = {
      csob_merchant_id: csobMerchantId,
      csob_private_key: csobPrivateKey
    }

    upadteAccount(+getState().adminFinance.account_id, valuesToChange, callback)
  }
}

export function enableAccountCsob() {
  return (dispatch, getState) => {
    const state = getState().adminFinance
    const onSuccess = response => {
      if (response.data.update_account) {
        nav.to(`/${getState().pageBase.garage}/admin/finance`)
      } else {
        dispatch(setError(t([ 'newAccount', 'invalidKeyPair' ])))
      }
    }

    dispatch(updateAccountCsob(state.csob_merchant_id, state.csob_private_key, onSuccess))
  }
}

export function disableAccountCsob() {
  return (dispatch, getState) => {
    const onSuccess = () => dispatch(initFinance(getState().pageBase.garage))
    dispatch(updateAccountCsob(null, null, onSuccess))
  }
}


export function updateAccountGpWebpay(gpWebpayMerchantId, gpWebpayPrivateKey, gpWebpayPassword, url, callback) {
  return (dispatch, getState) => {
    const valuesToChange = {
      gp_webpay_merchant_id: gpWebpayMerchantId,
      gp_webpay_private_key: gpWebpayPrivateKey,
      gp_webpay_password:    gpWebpayPassword,
      return_url:            url
    }

    upadteAccount(+getState().adminFinance.account_id, valuesToChange, callback)
  }
}

export function enableAccountGpWebpay() {
  return (dispatch, getState) => {
    const state = getState().adminFinance
    const callback = url => () => window.location.replace(url)
    const onBack = () => {
      nav.to(`/${getState().pageBase.garage}/admin/finance`)
      dispatch(setCustomModal())
    }
    const onSuccess = response => {
      if (response.data && response.data.update_account.return_url) {
        dispatch(setCustomModal(
          <ConfirmModal
            question={t([ 'finance', 'testPayment' ])}
            onConfirm={callback(response.data.update_account.return_url)}
            onBack={onBack}
          />))
      } else {
        onBack()
      }
    }
    dispatch(updateAccountGpWebpay(
      state.gp_webpay_merchant_id,
      state.gp_webpay_private_key, // update account, key unchanged => set to null
      state.gp_webpay_password,
      window.location.href.split('?')[0],
      onSuccess
    ))
  }
}

export function testPaymentSuccessful(successful) {
  const message = t([ 'finance', successful ? 'testPaymentSuccessful' : 'testPaymentUnsuccessful' ])
  return dispatch => dispatch(alert(message))
}

export function disableAccountGpWebpay() {
  return (dispatch, getState) => {
    const onSuccess = () => dispatch(initFinance(getState().pageBase.garage))
    dispatch(updateAccountGpWebpay(null, null, null, null, onSuccess))
  }
}


export function submitGarage(id) {
  return (dispatch, getState) => {
    const state = getState().adminFinance
    const onSuccess = response => {
      dispatch(response.data ? setSuccess(t([ 'finance', 'changeSuccess' ])) : setError(t([ 'finance', 'changeFailed' ])))
    }

    request(onSuccess,
      UPDATE_GARAGE,
      { id:     +id,
        garage: {
          vat:                       state.vat,
          invoice_row:               state.invoiceRow,
          simplyfied_invoice_row:    state.simplyfiedInvoiceRow,
          invoice_prefix:            state.invoicePrefix,
          simplyfied_invoice_prefix: state.simplyfiedInvoicePrefix,
          account_number:            state.accountNumber,
          iban:                      state.iban
        }
      })
  }
}
