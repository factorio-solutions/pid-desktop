import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import * as localization from './_shared/modules/localization/localization'

import App from './_app/App'

// //////////////////////////////////////////////////////////////////////////////
// ////////////////////////////REGULAR PAGES/////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
// login pages
import LoginPage from './user/login.page'
import CodeVerificationPage from './user/codeVerification.page'
import SignUpPage from './user/signUp.page'
import ResetPasswordPage from './user/resetPassword.page'

// user profile and notifications
import ProfilePage from './user/profile.page'
import CarUsersPage from './user/cars/users.page'
import NewCarPage from './user/cars/newCar.page'
import NotificationsPage from './notifications/notifications.page'

// dashboard
import DashboardPage from './dashboard/dashboard.page'

// reservations
import ReservationsPage from './reservations/reservations.page'
import NewReservationPage from './reservations/newReservation.page'
import NewReservationOverviewPage from './reservations/newReservationOverview.page'

// occupancy page
import OccupancyPage from './occupancy/occupancy.page'

// garage in main menu
import GaragePage from './garage/garage.page'

// issues
import IssuesPage from './issues/issues.page'

// analytics
import GarageTurnoverPage from './analytics/garageTurnover.page'
import ReservationsAnalyticsPage from './analytics/reservations.page'
import PlacesPage from './analytics/places.page'
import PaymentsPage from './analytics/payments.page'
import GatesPage from './analytics/gates.page'

// Add features page
import AddFeaturesPage from './addFeatures/addFeatures.page'
import GateModuleOrderPage from './addFeatures/gateModuleOrder.page'

// ADMIN
// invoices
import InvoicesPage from './admin/invoices/invoices.page'
import EditInvoicePage from './admin/invoices/editInvoice.page'

// clients
import ClientsPage from './admin/clients/clients.page'
import ClientUsersPage from './admin/clients/users.page'
import NewClientPage from './admin/clients/newClient.page'
import NewContractPage from './admin/clients/newContract.page'

// modules
import ModulesPage from './admin/modules/modules.page'
import MarketingSettingsPage from './admin/modules/marketingSettings.page'
import ReservationButtonPage from './admin/modules/reservationButton.page'
import MrParkitIntegrationPage from './admin/modules/mrParkitIntegration.page'
import GoPublicPage from './admin/modules/goPublic.page'
import FlexiplacePage from './admin/modules/flexiplace.page'

// garageSetup
import GarageSetupGeneralPage from './admin/garageSetup/garageSetupGeneral.page'
import GarageSetupFloorsPage from './admin/garageSetup/garageSetupFloors.page'
import GarageSetupGatesPage from './admin/garageSetup/garageSetupGates.page'
import GarageSetupOrderPage from './admin/garageSetup/garageSetupOrder.page'
import GarageSetupSubscribtionPage from './admin/garageSetup/garageSetupSubscribtion.page'
import GarageUsersPage from './admin/garageSetup/users.page'

// users
import UsersPage from './admin/users/users.page'
import InviteUserPage from './admin/users/inviteUser.page'

// finance
import FinancePage from './admin/finance/finance.page'
import NewRentPage from './admin/finance/newRent.page'
import PayPalPage from './admin/finance/paypal.page'
import CsobPage from './admin/finance/csob.page'

// pidSettings
import PidSettingsPage from './admin/pidSettings/pidSettings.page'

// activityLog
import ActivityLogPage from './admin/activityLog/activityLog.page'

// Marketing page
import MarketingPage from './marketing/marketing.page'

import TestingPage from './testing/testing.page'

// //////////////////////////////////////////////////////////////////////////////
// //////////////////////////PID ADMIN PAGES/////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
import PidAdminDashboardPage from './pidAdmin/dashboard/dashboard.page'
import PidAdminUsersPage from './pidAdmin/users/users.page'

import PidAdminGeneratorGaragesPage from './pidAdmin/generator/generatorGarages.page'
import PidAdminGeneratorClientsPage from './pidAdmin/generator/generatorClients.page'
import PidAdminGeneratorReservationsPage from './pidAdmin/generator/generatorReservations.page'
import PidAdminGeneratorUsersPage from './pidAdmin/generator/generatorUsers.page'
import PidAdminGeneratorOverviewPage from './pidAdmin/generator/generatorOverview.page'


export const AVAILABLE_LANGUAGES = [ 'en', 'cs', 'pl', 'de' ]


export default function createRoutes() {
  const adminSubRoutes = (
    <Route>
      <IndexRoute component={PidAdminDashboardPage} />
      <Route path="users" component={PidAdminUsersPage} />
      <Route path="generator" component={PidAdminGeneratorGaragesPage} />

      <Route path="generator/clients" component={PidAdminGeneratorClientsPage} />
      <Route path="generator/reservations" component={PidAdminGeneratorReservationsPage} />
      <Route path="generator/users" component={PidAdminGeneratorUsersPage} />
      <Route path="generator/overview" component={PidAdminGeneratorOverviewPage} />
    </Route>
  )

  const subRoutes = (
    <Route>
      <IndexRoute component={LoginPage} />
      <Route path="codeVerification" component={CodeVerificationPage} />
      <Route path="signUpPage" component={SignUpPage} />
      <Route path="resetPassword" component={ResetPasswordPage} />

      <Route path="profile" component={ProfilePage} />
      <Route path="profile/cars/:id/users" component={CarUsersPage} />
      <Route path="profile/cars/newCar" component={NewCarPage} />
      <Route path="profile/cars/:id/edit" component={NewCarPage} />
      <Route path="notifications" component={NotificationsPage} />

      <Route path="dashboard" component={DashboardPage} />

      <Route path="reservations" component={ReservationsPage} />
      <Route path="reservations/newReservation" component={NewReservationPage} />
      <Route path="reservations/:id/edit" component={NewReservationPage} />
      <Route path="reservations/newReservation/overview" component={NewReservationOverviewPage} />

      <Route path=":id/occupancy" component={OccupancyPage} />

      <Route path=":id/garage" component={GaragePage} />

      <Route path=":id/issues" component={IssuesPage} />

      <Route path=":id/analytics/garageTurnover" component={GarageTurnoverPage} />
      <Route path=":id/analytics/reservationsAnalytics" component={ReservationsAnalyticsPage} />
      <Route path=":id/analytics/placesAnalytics" component={PlacesPage} />
      <Route path=":id/analytics/paymentsAnalytics" component={PaymentsPage} />
      <Route path=":id/analytics/gatesAnalytics" component={GatesPage} />

      <Route path="addFeatures" component={AddFeaturesPage} />
      <Route path="addFeatures/gateModuleOrder" component={GateModuleOrderPage} />

      <Route path=":id/admin/invoices" component={InvoicesPage} />
      <Route path=":id/admin/invoices/:invoice_id/edit" component={EditInvoicePage} />

      <Route path=":id/admin/clients" component={ClientsPage} />
      <Route path=":id/admin/clients/:client_id/users" component={ClientUsersPage} />
      <Route path=":id/admin/clients/newClient" component={NewClientPage} />
      <Route path=":id/admin/clients/:client_id/edit" component={NewClientPage} />
      <Route path=":id/admin/clients/newContract" component={NewContractPage} />
      <Route path=":id/admin/clients/:contract_id/editContract" component={NewContractPage} />

      <Route path=":id/admin/modules" component={ModulesPage} />
      <Route path=":id/admin/modules/marketingSettings" component={MarketingSettingsPage} />
      <Route path=":id/admin/modules/reservationButton" component={ReservationButtonPage} />
      <Route path=":id/admin/modules/mrParkitIntegration" component={MrParkitIntegrationPage} />
      <Route path=":id/admin/modules/goPublic" component={GoPublicPage} />
      <Route path=":id/admin/modules/flexiplace" component={FlexiplacePage} />

      <Route path="addFeatures/garageSetup/general" component={GarageSetupGeneralPage} />
      <Route path="addFeatures/garageSetup/floors" component={GarageSetupFloorsPage} />
      <Route path="addFeatures/garageSetup/gates" component={GarageSetupGatesPage} />
      <Route path="addFeatures/garageSetup/order" component={GarageSetupOrderPage} />
      <Route path="addFeatures/garageSetup/subscribtion" component={GarageSetupSubscribtionPage} />
      <Route path=":id/admin/garageSetup/general" component={GarageSetupGeneralPage} />
      <Route path=":id/admin/garageSetup/floors" component={GarageSetupFloorsPage} />
      <Route path=":id/admin/garageSetup/gates" component={GarageSetupGatesPage} />
      <Route path=":id/admin/garageSetup/order" component={GarageSetupOrderPage} />
      <Route path=":id/admin/garageSetup/subscribtion" component={GarageSetupSubscribtionPage} />
      <Route path=":id/admin/garageSetup/users" component={GarageUsersPage} />

      <Route path=":id/admin/users" component={UsersPage} />
      <Route path=":id/admin/users/invite" component={InviteUserPage} />

      <Route path=":id/admin/finance" component={FinancePage} />
      <Route path=":id/admin/finance/newRent" component={NewRentPage} />
      <Route path=":id/admin/finance/:rent_id/editRent" component={NewRentPage} />
      <Route path=":id/admin/finance/paypal" component={PayPalPage} />
      <Route path=":id/admin/finance/csob" component={CsobPage} />

      <Route path=":id/admin/pidSettings" component={PidSettingsPage} />

      <Route path=":id/admin/activityLog" component={ActivityLogPage} />

      <Route path="marketing/:short_name" component={MarketingPage} />

      {/* Testing page for not production environments */}
      {process.env.NODE_ENV !== 'production' && <Route path="testing" component={TestingPage} />}

      {/* Admin subroutes */}
      <Route path="pid-admin">
        {adminSubRoutes}
      </Route>
    </Route>
  )

  return (
    <Route path="/" component={App}>
      <IndexRedirect to={`${AVAILABLE_LANGUAGES[0]}/${localStorage.jwt ? 'dashboard/' : ''}`} />
      {AVAILABLE_LANGUAGES.map(lang => (
        <Route key={lang} path={lang} onEnter={() => { localization.changeLanguage(lang) }}>
          {subRoutes}
        </Route>
      ))}

    </Route>
  )
}
