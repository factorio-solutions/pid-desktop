import {
  SET_NEW_ACCOUNT_NAME,
  SET_NEW_ACCOUNT_IC,
  SET_NEW_ACCOUNT_DIC,
  SET_NEW_ACCOUNT_LINE1,
  SET_NEW_ACCOUNT_LINE2,
  SET_NEW_ACCOUNT_CITY,
  SET_NEW_ACCOUNT_POSTAL_CODE,
  SET_NEW_ACCOUNT_STATE,
  SET_NEW_ACCOUNT_COUNTRY,
  SET_NEW_ACCOUNT_HIGHLIGHT,
  SET_NEW_ACCOUNT_PAYMENT_PROCESS,
  SET_NEW_ACCOUNT_CSOB_MERCHANT_ID,
  SET_NEW_ACCOUNT_CSOB_PRIVATE_KEY,
  CLEAR_NEW_ACCOUNT_FORM
}  from '../actions/newAccount.actions'

const defaultState =  { name:             ""
                      , ic:               ""
                      , dic:              ""
                      , line_1:           ""
                      , line_2:           ""
                      , city:             ""
                      , postal_code:      ""
                      , state:            ""
                      , country:          ""
                      , payments_process:  undefined // this can be 'paypal' or 'csob'
                      , csob_merchant_id: ""
                      , csob_private_key: ""
                      , hightlight:       false
                      }


export default function newAccount (appState = defaultState, action) {
  switch (action.type) {

    case SET_NEW_ACCOUNT_NAME:
      return { ...appState
             , name: action.value
             }

    case SET_NEW_ACCOUNT_IC:
      return { ...appState
             , ic: action.value
             }

    case SET_NEW_ACCOUNT_DIC:
      return { ...appState
             , dic: action.value
             }

    case SET_NEW_ACCOUNT_LINE1:
      return { ...appState
             , line_1: action.value
             }

    case SET_NEW_ACCOUNT_LINE2:
      return { ...appState
             , line_2: action.value
             }

    case SET_NEW_ACCOUNT_CITY:
      return { ...appState
             , city: action.value
             }

    case SET_NEW_ACCOUNT_POSTAL_CODE:
      return { ...appState
             , postal_code: action.value
             }

    case SET_NEW_ACCOUNT_STATE:
      return { ...appState
             , state: action.value
             }

    case SET_NEW_ACCOUNT_COUNTRY:
      return { ...appState
             , country: action.value
             }

    case SET_NEW_ACCOUNT_PAYMENT_PROCESS:
      return { ...appState
             , payments_process: action.value
             }

    case SET_NEW_ACCOUNT_CSOB_MERCHANT_ID:
      return { ...appState
             , csob_merchant_id: action.value
             }

    case SET_NEW_ACCOUNT_CSOB_PRIVATE_KEY:
      return { ...appState
             , csob_private_key: action.value
             }

    case SET_NEW_ACCOUNT_HIGHLIGHT:
      return { ...appState
             , highlight: action.value
             }

    case CLEAR_NEW_ACCOUNT_FORM:
      return defaultState

    default:
      return appState
  }
}