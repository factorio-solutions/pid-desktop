import { combineReducers }          from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import login            from '../_shared/reducers/login.reducer'
import signUp           from '../_shared/reducers/signUp.reducer'

import pageBase         from '../_shared/reducers/pageBase.reducer'
import notifications    from '../_shared/reducers/notifications.reducer'

import newReservation   from '../_shared/reducers/newReservation.reducer'
import reservations     from '../_shared/reducers/reservations.reducer'

import garages          from '../_shared/reducers/garages.reducer'
import newGarage        from '../_shared/reducers/newGarage.reducer'
import garageAccounts   from '../_shared/reducers/garageAccounts.reducer'
import garageMarketing  from '../_shared/reducers/garageMarketing.reducer'
import newMarketing     from '../_shared/reducers/newMarketing.reducer'

import marketing        from '../_shared/reducers/marketing.reducer'

import occupancy        from '../_shared/reducers/occupancy.reducer'

import accounts         from '../_shared/reducers/accounts.reducer'
import newAccount       from '../_shared/reducers/newAccount.reducer'
import accountUsers     from '../_shared/reducers/accountUsers.reducer'

import users            from '../_shared/reducers/users.reducer'
import inviteUser       from '../_shared/reducers/inviteUser.reducer'


const rootReducer = combineReducers({
  routing,

  login,
  signUp,

  pageBase,
  notifications,

  newReservation,
  reservations,

  garages,
  newGarage,
  garageAccounts,
  garageMarketing,
  newMarketing,

  marketing,

  occupancy,

  accounts,
  newAccount,
  accountUsers,

  users,
  inviteUser
})

export default rootReducer
