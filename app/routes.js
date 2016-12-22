import React                                 from 'react';
import { Route, IndexRoute, IndexRedirect  } from 'react-router';

import * as localization from './_shared/modules/localization/localization'

import App from './_app/App';

import LoginPage          from './user/login.page'
import SignUpPage         from './user/signUp.page'
import SettingsPage       from './user/settings.page'
import NotificationsPage  from './user/notifications.page'

import ReservationsPage   from './reservations/reservations.page'
import NewReservationPage from './reservations/newReservation.page'

import GaragesPage        from './garages/garages.page'
import GarageAccountsPage from './garages/accounts.page'
import NewGaragePage      from './garages/newGarage.page'
import Occupancy          from './occupancy/occupancy.page'

import AccountsPage       from './account/accounts.page'
import NewAccountPage     from './account/newAccount.page'
import EditAccountPage    from './account/editAccount.page'
import AccountUsersPage   from './account/users.page'
import inviteUserPage     from './users/inviteUser.page'

import UsersPage          from './users/users.page'

import ReleaseNotesPage   from './user/releaseNotes.page'


export default function createRoutes() {
  const availableLanguages = ['en', 'cs', 'pl', 'de']

  // localization.create('D:/Dokumenty/pid-desktop/app/_shared/locales', 'es')
  // localization.exportCSV('C:/Users/Tomas Hrstka/Documents/pid-desktop/app/_shared/locales', availableLanguages)
  // localization.importCSV('C:/Users/Tomas Hrstka/Documents/pid-desktop/app/_shared/locales', 'C:/Users/Tomas Hrstka/Documents/pid-desktop/app/_shared/locales/languages_20161110.csv')

  const subRoutes = (
    <Route>
      <IndexRoute component={LoginPage} />
      {/* other routes comes here */}
      <Route path="signUpPage" component={SignUpPage}/>
      <Route path="settings" component={SettingsPage}/>
      <Route path="notifications" component={NotificationsPage}/>

      <Route path="reservations" component={ReservationsPage}/>
      <Route path="reservations/newReservation" component={NewReservationPage}/>

      <Route path="garages" component={GaragesPage}/>
      <Route path="garages/:id/accounts" component={GarageAccountsPage}/>
      <Route path="garages/newGarage" component={NewGaragePage}/>
      <Route path="garages/:id/newGarage" component={NewGaragePage}/>

      <Route path="occupancy" component={Occupancy}/>

      <Route path="accounts" component={AccountsPage}/>
      <Route path="accounts/:id/users" component={AccountUsersPage}/>
      <Route path="accounts/newAccount" component={NewAccountPage}/>
      <Route path="accounts/:id/edit" component={EditAccountPage}/>

      <Route path="users" component={UsersPage}/>
      <Route path="users/inviteUser" component={inviteUserPage}/>

      <Route path="releaseNotes" component={ReleaseNotesPage}/>


    </Route>
  );

  return (
    <Route path="/" component={App}>
      <IndexRedirect to={availableLanguages[0]+'/'} />
      {availableLanguages.map(lang => (
        <Route key={lang} path={lang} onEnter={() => {localization.changeLanguage(lang)}}>
          {subRoutes}
        </Route>
      ))}
    </Route>
  );
}
