import React                                 from 'react'
import { Route, IndexRoute, IndexRedirect  } from 'react-router'

import * as localization from './_shared/modules/localization/localization'

import App from './_app/App'

import LoginPage                  from './user/login.page'
import SignUpPage                 from './user/signUp.page'
import SettingsPage               from './user/settings.page'
import AddFeaturesPage            from './user/addFeatures.page'
import NotificationsPage          from './user/notifications.page'

import ReservationsPage           from './reservations/reservations.page'
import NewReservationPage         from './reservations/newReservation.page'
import NewReservationOverviewPage from './reservations/newReservationOverview.page'

import GaragesPage                from './garages/garages.page'
import GarageClientsPage          from './garages/clients.page'
import NewGaragePage              from './garages/newGarage.page'
import GarageMarketingPage        from './garages/garageMarketing.page'
import NewMarketingPage           from './garages/newMarketing.page'
import NewPricingPage             from './garages/newPricing.page'
import NewRentPage                from './garages/newRent.page'
import AddClientPage              from './garages/addClient.page'
import GarageUsersPage            from './garages/users.page'

import MarketingPage              from './marketing/marketing.page'

import Occupancy                  from './occupancy/occupancy.page'

import ClientsPage                from './client/clients.page'
import NewClientPage              from './client/newClient.page'
import ClientUsersPage            from './client/users.page'

import AccountsPage               from './accounts/accounts.page'
import NewAccountPage             from './accounts/newAccount.page'

import InvoicesPage               from './invoices/invoices.page'
import PayInvoicePage             from './invoices/payInvoice.page'

import CarsPage                   from './cars/cars.page'
import NewCarPage                 from './cars/newCar.page'
import CarUsersPage               from './cars/users.page'

import inviteUserPage             from './users/inviteUser.page'

import UsersPage                  from './users/users.page'

import ReleaseNotesPage           from './user/releaseNotes.page'


export const AVAILABLE_LANGUAGES = ['en', 'cs', 'pl', 'de']


export default function createRoutes() {

  // localization.create('D:/Dokumenty/pid-desktop/app/_shared/locales', 'es')
  // localization.exportCSV('/home/hrstka/Documents/pid-desktop/app/_shared/locales/', AVAILABLE_LANGUAGES)
  // localization.importCSV('C:/Users/Tomas Hrstka/Documents/pid-desktop/app/_shared/locales', 'C:/Users/Tomas Hrstka/Documents/pid-desktop/app/_shared/locales/languages_20161110.csv')

  const subRoutes = (
    <Route>
      <IndexRoute component={LoginPage} />
      {/* other routes comes here */}
      <Route path="signUpPage"    component={SignUpPage}/>
      <Route path="settings"      component={SettingsPage}/>
      <Route path="addFeatures"   component={AddFeaturesPage}/>
      <Route path="notifications" component={NotificationsPage}/>

      <Route path="reservations"                          component={ReservationsPage}/>
      <Route path="reservations/newReservation"           component={NewReservationPage}/>
      <Route path="reservations/newReservation/overview"  component={NewReservationOverviewPage}/>

      <Route path="garages"                                 component={GaragesPage}/>
      <Route path="garages/:id/clients"                     component={GarageClientsPage}/>
      <Route path="garages/newGarage"                       component={NewGaragePage}/>
      <Route path="garages/:id/newGarage"                   component={NewGaragePage}/>
      <Route path="garages/:id/marketing"                   component={GarageMarketingPage}/>
      <Route path="garages/:id/marketing/newMarketing"      component={NewMarketingPage}/>
      <Route path="garages/:id/marketing/:marketingId/edit" component={NewMarketingPage}/>
      <Route path="garages/pricings/newPricing"             component={NewPricingPage}/>
      <Route path="garages/pricings/:id/edit"               component={NewPricingPage}/>
      <Route path="garages/rents/newRent"                   component={NewRentPage}/>
      <Route path="garages/rents/:id/edit"                  component={NewRentPage}/>
      <Route path="garages/:id/clients/addClient"           component={AddClientPage}/>
      <Route path="garages/:id/users"                       component={GarageUsersPage}/>

      <Route path="marketing/:short_name" component={MarketingPage}/>

      <Route path="occupancy" component={Occupancy}/>

      <Route path="clients"                                     component={ClientsPage}/>
      <Route path="clients/:id/users"                           component={ClientUsersPage}/>
      <Route path="clients/newClient"                           component={NewClientPage}/>
      <Route path="clients/:id/edit"                            component={NewClientPage}/>
      <Route path="clients/:client_id/invoices"                 component={InvoicesPage}/>
      <Route path="clients/:client_id/invoices/:invoice_id/pay" component={PayInvoicePage}/>

      <Route path="accounts"                      component={AccountsPage}/>
      <Route path="accounts/newAccount"           component={NewAccountPage}/>
      <Route path="accounts/:id/edit"             component={NewAccountPage}/>
      <Route path="accounts/:account_id/invoices" component={InvoicesPage}/>

      <Route path="cars"            component={CarsPage}/>
      <Route path="cars/:id/users"  component={CarUsersPage}/>
      <Route path="cars/newCar"     component={NewCarPage}/>
      <Route path="cars/:id/edit"   component={NewCarPage}/>

      <Route path="users"            component={UsersPage}/>
      <Route path="users/inviteUser" component={inviteUserPage}/>

      <Route path="releaseNotes" component={ReleaseNotesPage}/>

    </Route>
  );

  return (
    <Route path="/" component={App}>
      <IndexRedirect to={AVAILABLE_LANGUAGES[0]+'/'} />
      {AVAILABLE_LANGUAGES.map(lang => (
        <Route key={lang} path={lang} onEnter={() => {localization.changeLanguage(lang)}}>
          {subRoutes}
        </Route>
      ))}
    </Route>
  );
}
