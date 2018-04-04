import {
  SET_CLIENT_NAME,
  SET_CLIENT_SMS_API_TOKEN,
  SET_CLIENT_IC,
  SET_CLIENT_DIC,
  SET_CLIENT_LINE1,
  SET_CLIENT_LINE2,
  SET_CLIENT_CITY,
  SET_CLIENT_POSTAL_CODE,
  SET_CLIENT_STATE,
  SET_CLIENT_COUNTRY,
  SET_CLIENT_SMS_TEMPLATES,
  SET_SELECTED_CLIENT_SMS_TEMPLATE,
  SET_CLIENT_SHOW_NEW_SMS_TEMPLATE_MODAL,
  SET_NEW_TEMPLATE_NAME,
  SET_NEW_TEMPLATE_TEXT,
  UPDATE_SMS_TEMPLATE_TEXT,
  CLEAR_NEW_TEMPLATE_FORM,
  SET_CLIENT_HIGHLIGHT,
  CLEAR_CLIENT_FORM
}  from '../actions/newClient.actions'

const defaultState = {
  name:             '',
  smsApiToken:      '',
  ic:               '',
  dic:              '',
  line_1:           '',
  line_2:           '',
  city:             '',
  postal_code:      '',
  state:            '',
  country:          '',
  templates:        [],
  selectedTemplate: null,

  showNewTemplateModal: false,
  newTemplateName:      '',
  newTemplateText:      '',
  highlight:            false
}


export default function newClient(appState = defaultState, action) {
  switch (action.type) {

    case SET_CLIENT_NAME:
      return {
        ...appState,
        name: action.value
      }

    case SET_CLIENT_SMS_API_TOKEN:
      return {
        ...appState,
        smsApiToken: action.value
      }

    case SET_CLIENT_IC :
      return {
        ...appState,
        ic: action.value
      }

    case SET_CLIENT_DIC :
      return {
        ...appState,
        dic: action.value
      }

    case SET_CLIENT_LINE1:
      return {
        ...appState,
        line_1: action.value
      }

    case SET_CLIENT_LINE2:
      return {
        ...appState,
        line_2: action.value
      }

    case SET_CLIENT_CITY:
      return {
        ...appState,
        city: action.value
      }

    case SET_CLIENT_POSTAL_CODE:
      return {
        ...appState,
        postal_code: action.value
      }

    case SET_CLIENT_STATE:
      return {
        ...appState,
        state: action.value
      }

    case SET_CLIENT_COUNTRY:
      return {
        ...appState,
        country: action.value
      }

    case SET_CLIENT_HIGHLIGHT:
      return {
        ...appState,
        highlight: action.value
      }

    case SET_CLIENT_SMS_TEMPLATES:
      return {
        ...appState,
        templates: action.value
      }

    case SET_SELECTED_CLIENT_SMS_TEMPLATE:
      return {
        ...appState,
        selectedTemplate: action.value
      }

    case SET_CLIENT_SHOW_NEW_SMS_TEMPLATE_MODAL:
      return {
        ...appState,
        showNewTemplateModal: action.value
      }

    case SET_NEW_TEMPLATE_NAME:
      return {
        ...appState,
        newTemplateName: action.value
      }

    case SET_NEW_TEMPLATE_TEXT:
      return {
        ...appState,
        newTemplateText: action.value
      }

    case CLEAR_NEW_TEMPLATE_FORM:
      return {
        ...appState,
        newTemplateName:      '',
        newTemplateText:      '',
        showNewTemplateModal: false
      }

    case UPDATE_SMS_TEMPLATE_TEXT: {
      const indexOfTemplate = appState.templates.findIndexById(appState.selectedTemplate)
      return {
        ...appState,
        templates: [
          ...appState.templates.slice(0, indexOfTemplate),
          { ...appState.templates[indexOfTemplate],
            template: action.value,
            original: false
          },
          ...appState.templates.slice(indexOfTemplate + 1)
        ]
      }
    }

    case CLEAR_CLIENT_FORM:
      return defaultState

    default:
      return appState
  }
}
