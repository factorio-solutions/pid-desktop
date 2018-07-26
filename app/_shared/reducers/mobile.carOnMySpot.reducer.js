import {
  SET_CAR_ON_MY_SPOT_SHOW_LICENCE_PLATE_MODAL,
  SET_CAR_ON_MY_SPOT_LICENCE_PLATE,
  CLEAR_CAR_ON_MY_SPOT_STATE
}  from '../actions/mobile.carOnMySpot.actions'

const defaultState = {
  showLicecencePlateModal: false,
  licencePlate:            ''
}


export default function carOnMySpot(state = defaultState, action) {
  switch (action.type) {

    case SET_CAR_ON_MY_SPOT_SHOW_LICENCE_PLATE_MODAL:
      return {
        ...state,
        showLicecencePlateModal: action.value
      }

    case SET_CAR_ON_MY_SPOT_LICENCE_PLATE:
      return {
        ...state,
        licencePlate: action.value
      }

    case CLEAR_CAR_ON_MY_SPOT_STATE:
      return defaultState

    default:
      return state
  }
}
