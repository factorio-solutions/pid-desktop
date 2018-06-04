import { request }    from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import actionFactory  from '../helpers/actionFactory'
import * as nav       from '../helpers/navigation'
import except         from '../helpers/except'

import {
  CREATE_NEW_CLIENT,
  EDIT_CLIENT_INIT,
  EDIT_CLIENT_MUTATION,
  LOAD_INFO_FROM_IC,
  CREATE_NEW_TEMPLATE,
  UPDATE_SMS_TEMPLATE
} from '../queries/newClient.queries'

export const SET_CLIENT_NAME = 'SET_CLIENT_NAME'
export const SET_CLIENT_SMS_API_TOKEN = 'SET_CLIENT_SMS_API_TOKEN'
export const SET_CLIENT_IS_SMS_API_TOKEN_ACTIVE = 'SET_CLIENT_IS_SMS_API_TOKEN_ACTIVE'
export const SET_CLIENT_IC = 'SET_CLIENT_IC'
export const SET_CLIENT_DIC = 'SET_CLIENT_DIC'
export const SET_CLIENT_LINE1 = 'SET_CLIENT_LINE1'
export const SET_CLIENT_LINE2 = 'SET_CLIENT_LINE2'
export const SET_CLIENT_CITY = 'SET_CLIENT_CITY'
export const SET_CLIENT_POSTAL_CODE = 'SET_CLIENT_POSTAL_CODE'
export const SET_CLIENT_STATE = 'SET_CLIENT_STATE'
export const SET_CLIENT_COUNTRY = 'SET_CLIENT_COUNTRY'
export const SET_CLIENT_SMS_TEMPLATES = 'SET_CLIENT_SMS_TEMPLATES'
export const SET_SELECTED_CLIENT_SMS_TEMPLATE = 'SET_SELECTED_CLIENT_SMS_TEMPLATE'
export const SET_CLIENT_SHOW_NEW_SMS_TEMPLATE_MODAL = 'SET_CLIENT_SHOW_NEW_SMS_TEMPLATE_MODAL'
export const SET_NEW_TEMPLATE_NAME = 'SET_NEW_TEMPLATE_NAME'
export const SET_NEW_TEMPLATE_TEXT = 'SET_NEW_TEMPLATE_TEXT'
export const UPDATE_SMS_TEMPLATE_TEXT = 'UPDATE_SMS_TEMPLATE_TEXT'
export const CLEAR_NEW_TEMPLATE_FORM = 'CLEAR_NEW_TEMPLATE_FORM'
export const SET_CLIENT_HIGHLIGHT = 'SET_CLIENT_HIGHLIGHT'
export const CLEAR_CLIENT_FORM = 'CLEAR_CLIENT_FORM'


export const setName = actionFactory(SET_CLIENT_NAME)
export const setSmsApiToken = actionFactory(SET_CLIENT_SMS_API_TOKEN)
export const setIsSmsApiTokenActive = actionFactory(SET_CLIENT_IS_SMS_API_TOKEN_ACTIVE)
export const setIC = actionFactory(SET_CLIENT_IC)
export const setDIC = actionFactory(SET_CLIENT_DIC)
export const setLine1 = actionFactory(SET_CLIENT_LINE1)
export const setLine2 = actionFactory(SET_CLIENT_LINE2)
export const setCity = actionFactory(SET_CLIENT_CITY)
export const setPostalCode = actionFactory(SET_CLIENT_POSTAL_CODE)
export const setState = actionFactory(SET_CLIENT_STATE)
export const setCountry = actionFactory(SET_CLIENT_COUNTRY)
export const setSmsTemplates = actionFactory(SET_CLIENT_SMS_TEMPLATES)
export const setSelectedSmsTemplate = actionFactory(SET_SELECTED_CLIENT_SMS_TEMPLATE)
export const setShowModalSmsTemplate = actionFactory(SET_CLIENT_SHOW_NEW_SMS_TEMPLATE_MODAL)
export const setNewTemplateName = actionFactory(SET_NEW_TEMPLATE_NAME)
export const setNewTemplateText = actionFactory(SET_NEW_TEMPLATE_TEXT)
export const updateTemplateText = actionFactory(UPDATE_SMS_TEMPLATE_TEXT)
export const clearNewTemplateForm = actionFactory(CLEAR_NEW_TEMPLATE_FORM)
export const setHighlight = actionFactory(SET_CLIENT_HIGHLIGHT)
export const clearForm = actionFactory(CLEAR_CLIENT_FORM)


export function toggleHighlight() {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newClient.highlight))
  }
}


export function initClient(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setName(response.data.client.name))
      dispatch(setSmsApiToken(response.data.client.sms_api_token))
      dispatch(setIsSmsApiTokenActive(response.data.client.is_sms_api_token_active))
      dispatch(setLine1(response.data.client.address.line_1))
      dispatch(setLine2(response.data.client.address.line_2))
      dispatch(setCity(response.data.client.address.city))
      dispatch(setPostalCode(response.data.client.address.postal_code))
      dispatch(setState(response.data.client.address.state))
      dispatch(setCountry(response.data.client.address.country))
      dispatch(setIC(response.data.client.ic))
      dispatch(setDIC(response.data.client.dic))
      dispatch(setSmsTemplates(response.data.client.sms_templates.map(template => ({ ...template, original: true }))))
      if (response.data.client.sms_templates.length === 1) {
        dispatch(setSelectedSmsTemplate(response.data.client.sms_templates[0].id))
      }
    }

    // const currentUser = getState().pageBase.current_user
    request(
      onSuccess,
      EDIT_CLIENT_INIT,
      { id: parseInt(id, 10) }
    )
  }
}

export function loadFromIc() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      try {
        const res = JSON.parse(response.data.ares).Ares_odpovedi.Odpoved.VBAS

        dispatch(setName(res.OF))
        dispatch(setLine1([ res.AD.UC, res.AA.CO ].filter(o => o).join('/')))
        dispatch(setCity(res.AA.N))
        dispatch(setPostalCode(res.AA.PSC))
        dispatch(setCountry(res.AA.NS))
        dispatch(setDIC(res.DIC))
      } catch (e) {
        console.log('not able to parse info from ICO', e)
      }
    }

    request(onSuccess
           , LOAD_INFO_FROM_IC
           , { ic: getState().newClient.ic }
           )
  }
}

function generateClient(state) {
  return {
    name:    state.name,
    ic:      state.ic === '' ? null : state.ic,
    dic:     state.dic === '' ? null : state.dic,
    address: {
      line_1:      state.line_1,
      line_2:      state.line_2 === '' ? null : state.line_2,
      city:        state.city,
      postal_code: state.postal_code,
      state:       state.state === '' ? null : state.state,
      country:     state.country
    }
  }
}

export function submitNewClient(id) {
  return (dispatch, getState) => {
    const onSuccess = () => {
      dispatch(clearForm())
      nav.to(`/${getState().pageBase.garage}/admin/clients`)
    }

    if (id) { // then edit client
      request(onSuccess, EDIT_CLIENT_MUTATION, {
        id:     parseInt(id, 10),
        client: generateClient(getState().newClient)
      })
    } else { // then new client
      request(onSuccess,
        CREATE_NEW_CLIENT,
        { client: generateClient(getState().newClient) }
      )
    }
  }
}

export function submitNewTemplate(id) {
  return (dispatch, getState) => {
    const state = getState().newClient
    const onSuccess = response => {
      dispatch(setSmsTemplates([ ...state.templates, { ...response.data.create_sms_template, original: true } ]))
    }

    dispatch(clearNewTemplateForm())
    request(onSuccess,
      CREATE_NEW_TEMPLATE,
      {
        sms_template: {
          name:     state.newTemplateName,
          template: state.newTemplateText
        },
        client_id: parseInt(id, 10)
      }
    )
  }
}

export function submitSmsTemplates(id) {
  return (dispatch, getState) => {
    const state = getState().newClient

    Promise.all([
      requestPromise(EDIT_CLIENT_MUTATION, { id: parseInt(id, 10), client: { sms_api_token: state.smsApiToken } }),
      ...state.templates
        .filter(template => !template.original)
        .map(template => requestPromise(UPDATE_SMS_TEMPLATE, { id: template.id, sms_template: except(template, [ 'original', 'id' ]) }))
    ]).then(() => {
      dispatch(initClient(id))
    })
  }
}

export function toggleIsSmsApiTokenActive(id) {
  return (dispatch, getState) => {
    const state = getState().newClient

    requestPromise(EDIT_CLIENT_MUTATION, { id: parseInt(id, 10), client: { is_sms_api_token_active: !state.isSmsApiTokenActive } })
    .then(() => dispatch(initClient(id)))
  }
}
