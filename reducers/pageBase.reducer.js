import {
  PAGE_BASE_SET_MENU_WIDTH,
  PAGE_BASE_SET_HINT,
  SET_VERTICAL_SELECTED,
  SET_HORIZONTAL_SELECTED,
  SET_HORIZONTAL_CONTENT,
  PAGE_BASE_SET_ERROR,
  PAGE_BASE_SET_CUSTOM_MODAL,
  PAGE_BASE_SET_NOTIFICATIONS_MODAL,
  PAGE_BASE_SET_CURRENT_USER
}  from '../actions/pageBase.actions'

const defaultState =  { verticalSelected:   0 // id of selected user reservation is for
                      , horizontalSelected: 0
                      , horizontalContent:  []
                      , error:              undefined
                      , custom_modal:       undefined
                      , notificationsModal: false
                      , current_user:       {}
                      , hint:               undefined
                      , hintVideo:          undefined
                      , menuWidth:          200
                      }


export default function pageBase (state = defaultState, action) {
  switch (action.type) {

    case SET_VERTICAL_SELECTED:
    return  { ...state
            , verticalSelected: action.value
            }

    case SET_HORIZONTAL_SELECTED:
    return  { ...state
            , horizontalSelected: action.value
            }

    case SET_HORIZONTAL_CONTENT:
    return  { ...state
            , horizontalContent: action.value
            }

    case PAGE_BASE_SET_ERROR:
    return  { ...state
            , error: action.value
            }

    case PAGE_BASE_SET_CUSTOM_MODAL:
    return  { ...state
            , custom_modal: action.value
            }

    case PAGE_BASE_SET_NOTIFICATIONS_MODAL:
    return  { ...state
            , notificationsModal: action.value
            }

    case PAGE_BASE_SET_CURRENT_USER:
    return  { ...state
            , current_user: action.value
            }

    case PAGE_BASE_SET_HINT:
    return  { ...state
            , hint: action.value
            , hintVideo: action.video
            }

    case PAGE_BASE_SET_MENU_WIDTH:
    return  { ...state
            , menuWidth: action.value
            }

    default:
      return state
  }
}
