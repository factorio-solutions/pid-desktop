import { combineReducers }          from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import pageBase         from '../_shared/reducers/pageBase.reducer'

import login            from '../_shared/reducers/login.reducer'
import signUp           from '../_shared/reducers/signUp.reducer'
import resetPassword    from '../_shared/reducers/resetPassword.reducer'

import addFeatures      from '../_shared/reducers/addFeatures.reducer'
import gateModuleOrder  from '../_shared/reducers/gateModuleOrder.reducer'
import notifications    from '../_shared/reducers/notifications.reducer'

import newReservation   from '../_shared/reducers/newReservation.reducer'
import reservations     from '../_shared/reducers/reservations.reducer'

import garageSetup      from '../_shared/reducers/garageSetup.reducer'
import newMarketing     from '../_shared/reducers/newMarketing.reducer'
import newRent          from '../_shared/reducers/newRent.reducer'
import garageUsers      from '../_shared/reducers/garageUsers.reducer'

import marketing        from '../_shared/reducers/marketing.reducer'

import occupancy        from '../_shared/reducers/occupancy.reducer'

import clients          from '../_shared/reducers/clients.reducer'
import newClient        from '../_shared/reducers/newClient.reducer'
import newContract      from '../_shared/reducers/newContract.reducer'
import clientUsers      from '../_shared/reducers/clientUsers.reducer'


import invoices         from '../_shared/reducers/invoices.reducer'
import editInvoice      from '../_shared/reducers/editInvoice.reducer'

import newCar           from '../_shared/reducers/newCar.reducer'
import carUsers         from '../_shared/reducers/carUsers.reducer'

import users            from '../_shared/reducers/users.reducer'
import inviteUser       from '../_shared/reducers/inviteUser.reducer'

import analytics        from '../_shared/reducers/analytics.reducer'
import dashboard        from '../_shared/reducers/dashboard.reducer'
import garage           from '../_shared/reducers/garage.reducer'
import issues           from '../_shared/reducers/issues.reducer'
import profile          from '../_shared/reducers/profile.reducer'

import adminModules     from '../_shared/reducers/admin.modules.reducer'
import adminGoPublic    from '../_shared/reducers/admin.goPublic.reducer'
import adminFinance     from '../_shared/reducers/admin.finance.reducer'
import adminActivityLog from '../_shared/reducers/admin.activityLog.reducer'

// import editUser         from '../_shared/reducers/editUser.reducer'
// import garages          from '../_shared/reducers/garages.reducer'
// import garageClients    from '../_shared/reducers/garageClients.reducer'
// import garageGates      from '../_shared/reducers/garageGates.reducer'
// import garageMarketing  from '../_shared/reducers/garageMarketing.reducer'
// import newPricing       from '../_shared/reducers/newPricing.reducer'
// import accounts         from '../_shared/reducers/accounts.reducer'
// import newAccount       from '../_shared/reducers/newAccount.reducer'
// import cars             from '../_shared/reducers/cars.reducer'


const appReducer = combineReducers({ routing
                                   , pageBase

                                   , login
                                   , signUp
                                   , resetPassword

                                   , addFeatures
                                   , gateModuleOrder
                                   , notifications

                                   , newReservation
                                   , reservations

                                   , garageSetup
                                   , newMarketing
                                   , newRent
                                   , garageUsers

                                   , marketing

                                   , occupancy

                                   , clients
                                   , newClient
                                   , newContract
                                   , clientUsers


                                   , invoices
                                   , editInvoice

                                   , newCar
                                   , carUsers

                                   , users
                                   , inviteUser

                                   , analytics
                                   , dashboard
                                   , garage
                                   , issues
                                   , profile

                                   , adminModules
                                   , adminGoPublic
                                   , adminFinance
                                   , adminActivityLog

                                   // , editUser
                                   // , garages
                                   // , garageClients
                                   // , garageGates
                                   // , garageMarketing
                                   // , newPricing
                                   // , accounts
                                   // , newAccount
                                   // , cars
                                   })

const rootReducer = (state, action) => { // app reducer container reducer
  if (action.type === 'RESET') { state = undefined } // will erase store
  return appReducer(state, action)
}

export default rootReducer
