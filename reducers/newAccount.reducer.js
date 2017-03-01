<<<<<<< HEAD
import { SET_ACCOUNT_NAME, CLEAR_ACCOUNT_FORM }  from '../actions/newAccount.actions'


const defaultState =  { name: ""
                      }

export default function newAccount (state = defaultState, action) {
  switch (action.type) {

    case SET_ACCOUNT_NAME:
    return  { ...state
            , name: action.value
            }

    case CLEAR_ACCOUNT_FORM:
    return defaultState

    default:
      return state
=======
import {
  SET_NEW_ACCOUNT_NAME,
  SET_NEW_ACCOUNT_MERCHANT_ID,
  SET_NEW_ACCOUNT_PRIVATE_KEY,
  SET_NEW_ACCOUNT_PUBLIC_KEY,
  SET_NEW_ACCOUNT_IC,
  SET_NEW_ACCOUNT_DIC,
  SET_NEW_ACCOUNT_LINE1,
  SET_NEW_ACCOUNT_LINE2,
  SET_NEW_ACCOUNT_CITY,
  SET_NEW_ACCOUNT_POSTAL_CODE,
  SET_NEW_ACCOUNT_STATE,
  SET_NEW_ACCOUNT_COUNTRY,
  CLEAR_NEW_ACCOUNT_FORM
}  from '../actions/newAccount.actions'

const defaultState =  { name:        ""
                      , merchant_id: ""
                      , private_key: ""
                      , public_key:  ""
                      , ic:          ""
                      , dic:         ""
                      , line_1:      ""
                      , line_2:      ""
                      , city:        ""
                      , postal_code: ""
                      , state:       ""
                      , country:     ""
                      }


export default function newAccount (appState = defaultState, action) {
  switch (action.type) {

    case SET_NEW_ACCOUNT_NAME:
      return { ...appState
             , name: action.value
             }

    case SET_NEW_ACCOUNT_MERCHANT_ID:
      return { ...appState
             , merchant_id: action.value
             }

    case SET_NEW_ACCOUNT_PRIVATE_KEY:
      return { ...appState
             , private_key: action.value
             }

    case SET_NEW_ACCOUNT_PUBLIC_KEY:
      return { ...appState
             , public_key: action.value
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

    case CLEAR_NEW_ACCOUNT_FORM:
      return defaultState

    default:
      return appState
>>>>>>> feature/new_api
  }
}
