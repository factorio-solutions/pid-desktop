import { combineReducers }          from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import login                from '../_shared/reducers/login.reducer'
import signUp               from '../_shared/reducers/signUp.reducer'
import mobileHeader         from '../_shared/reducers/mobile.header.reducer'

import mobileAccess         from '../_shared/reducers/mobile.access.reducer'

import reservations         from '../_shared/reducers/reservations.reducer'
import mobileNewReservation from '../_shared/reducers/mobile.newReservation.reducer'


export default combineReducers({
  routing,

  login,
  signUp,
  mobileHeader,

  mobileAccess,

  reservations,
  mobileNewReservation
})
