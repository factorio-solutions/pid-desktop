<<<<<<< HEAD
import { PAGE_BASE_SET_MENU_WIDTH, PAGE_BASE_SET_HINT, SET_VERTICAL_SELECTED, SET_HORIZONTAL_SELECTED, SET_HORIZONTAL_CONTENT, PAGE_BASE_SET_ERROR, PAGE_BASE_SET_CURRENT_USER }  from '../actions/pageBase.actions'

const defaultState =  { verticalSelected: 0 // id of selected user reservation is for
                      , horizontalSelected: 0
                      , horizontalContent: []
                      , error: undefined
                      , current_user: undefined
                      , hint: undefined
                      , menuWidth: 200
                      }

=======
import {
  PAGE_BASE_SET_MENU_WIDTH,
  PAGE_BASE_SET_HINT,
  SET_VERTICAL_SELECTED,
  SET_HORIZONTAL_SELECTED,
  SET_HORIZONTAL_CONTENT,
  PAGE_BASE_SET_ERROR,
  PAGE_BASE_SET_NOTIFICATIONS_MODAL,
  PAGE_BASE_SET_CURRENT_USER
}  from '../actions/pageBase.actions'

const defaultState =  { verticalSelected:   0 // id of selected user reservation is for
                      , horizontalSelected: 0
                      , horizontalContent:  []
                      , error:              undefined
                      , notificationsModal: false
                      , current_user:       {}
                      , hint:               undefined
                      , hintVideo:          undefined
                      , menuWidth:          200
                      }


>>>>>>> feature/new_api
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

<<<<<<< HEAD
=======
    case PAGE_BASE_SET_NOTIFICATIONS_MODAL:
    return  { ...state
            , notificationsModal: action.value
            }

>>>>>>> feature/new_api
    case PAGE_BASE_SET_CURRENT_USER:
    return  { ...state
            , current_user: action.value
            }

    case PAGE_BASE_SET_HINT:
    return  { ...state
            , hint: action.value
<<<<<<< HEAD
=======
            , hintVideo: action.video
>>>>>>> feature/new_api
            }

    case PAGE_BASE_SET_MENU_WIDTH:
    return  { ...state
            , menuWidth: action.value
            }

<<<<<<< HEAD

=======
>>>>>>> feature/new_api
    default:
      return state
  }
}
