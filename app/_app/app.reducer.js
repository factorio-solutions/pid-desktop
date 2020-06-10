import { combineReducers }          from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import pageBase from '../_shared/reducers/pageBase.reducer'

import login         from '../_shared/reducers/login.reducer'
import signUp        from '../_shared/reducers/signUp.reducer'
import resetPassword from '../_shared/reducers/resetPassword.reducer'

import addFeatures     from '../_shared/reducers/addFeatures.reducer'
import gateModuleOrder from '../_shared/reducers/gateModuleOrder.reducer'
import notifications   from '../_shared/reducers/notifications.reducer'

import newReservation         from '../_shared/reducers/newReservation.reducer'
import reservations           from '../_shared/reducers/reservations.reducer'
import reservationInteruption from '../_shared/reducers/reservationInteruption.reducer'
import reservationBulkRemoval from '../_shared/reducers/reservationsBulkRemoval.reducer'

import garageSetup  from '../_shared/reducers/garageSetup.reducer'
import newMarketing from '../_shared/reducers/newMarketing.reducer'
import newRent      from '../_shared/reducers/newRent.reducer'
import garageUsers  from '../_shared/reducers/garageUsers.reducer'

import marketing from '../_shared/reducers/marketing.reducer'

import occupancy from '../_shared/reducers/occupancy.reducer'

import clients     from '../_shared/reducers/clients.reducer'
import newClient   from '../_shared/reducers/newClient.reducer'
import timeCredit  from '../_shared/reducers/admin.timeCredit.reducer'
import newContract from '../_shared/reducers/newContract.reducer'
import clientUsers from '../_shared/reducers/clientUsers.reducer'

import invoices    from '../_shared/reducers/invoices.reducer'
import editInvoice from '../_shared/reducers/editInvoice.reducer'

import newCar   from '../_shared/reducers/newCar.reducer'
import carUsers from '../_shared/reducers/carUsers.reducer'

import users      from '../_shared/reducers/users.reducer'
import inviteUser from '../_shared/reducers/inviteUser.reducer'

import analyticsGarage       from '../_shared/reducers/analytics.garage.reducer'
import analyticsGates        from '../_shared/reducers/analytics.gates.reducer'
import analyticsPayments     from '../_shared/reducers/analytics.payments.reducer'
import analyticsPlaces       from '../_shared/reducers/analytics.places.reducer'
import analyticsReservations from '../_shared/reducers/analytics.reservations.reducer'

import dashboard from '../_shared/reducers/dashboard.reducer'
import garage    from '../_shared/reducers/garage.reducer'
import issues    from '../_shared/reducers/issues.reducer'
import profile   from '../_shared/reducers/profile.reducer'

import adminModules               from '../_shared/reducers/admin.modules.reducer'
import adminGoPublic              from '../_shared/reducers/admin.goPublic.reducer'
import adminGoInternal            from '../_shared/reducers/admin.goInternal.reducer'
import adminFlexiplace            from '../_shared/reducers/admin.flexiplace.reducer'
import adminThirdPartyIntegration from '../_shared/reducers/admin.thirdPartyIntegration.reducer'
import adminFinance               from '../_shared/reducers/admin.finance.reducer'
import adminBillingAddress        from '../_shared/reducers/admin.billingAddress.reducer'
import adminActivityLog           from '../_shared/reducers/admin.activityLog.reducer'
import legalDocuments             from '../_shared/reducers/legalDocuments.reducer'

import pidAdminGenerator        from '../_shared/reducers/pid-admin.generator.reducer'
import pidAdminNews             from '../_shared/reducers/pid-admin.news.reducer'
import pidAdminNewNews          from '../_shared/reducers/pid-admin.newNews.reducer'
import pidAdminFinance          from '../_shared/reducers/pid-admin.finance.reducer'
import pidAdminLogs             from '../_shared/reducers/pid-admin.logs.reducer'
import pidAdminGaragesOverview  from '../_shared/reducers/pid-admin.garagesOverview.reducer'
import pidAdminMobileAppVersion from '../_shared/reducers/pid-admin.mobileAppVersion.reducer'

const appReducer = combineReducers({
  routing,
  pageBase,

  login,
  signUp,
  resetPassword,

  addFeatures,
  gateModuleOrder,
  notifications,

  newReservation,
  reservations,
  reservationInteruption,
  reservationBulkRemoval,

  garageSetup,
  newMarketing,
  newRent,
  garageUsers,

  marketing,

  occupancy,

  clients,
  newClient,
  timeCredit,
  newContract,
  clientUsers,

  invoices,
  editInvoice,

  newCar,
  carUsers,

  users,
  inviteUser,

  analyticsGarage,
  analyticsGates,
  analyticsPayments,
  analyticsPlaces,
  analyticsReservations,

  dashboard,
  garage,
  issues,
  profile,

  adminModules,
  adminGoPublic,
  adminGoInternal,
  adminFlexiplace,
  adminThirdPartyIntegration,
  adminFinance,
  adminBillingAddress,
  adminActivityLog,
  legalDocuments,

  pidAdminGenerator,
  pidAdminNews,
  pidAdminNewNews,
  pidAdminFinance,
  pidAdminLogs,
  pidAdminGaragesOverview,
  pidAdminMobileAppVersion
})

const rootReducer = (state, action) => { // app reducer container reducer
  if (action.type === 'RESET') {
    state = undefined
  } // will erase store
  return appReducer(state, action)
}

export default rootReducer
