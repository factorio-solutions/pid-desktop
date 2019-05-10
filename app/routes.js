import React from 'react'
import {
  Route, IndexRoute, Switch, HashRouter
} from 'react-router-dom'

import App from './_app/App'

// //////////////////////////////////////////////////////////////////////////////
// ////////////////////////////REGULAR PAGES/////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
// login pages
import LoginPage            from './user/login.page' // Done
import CodeVerificationPage from './user/codeVerification.page'
import SignUpPage           from './user/signUp.page'
import ResetPasswordPage    from './user/resetPassword.page'


// issues
import IssuesPage from './issues/issues.page'

// pidSettings
import PidSettingsPage from './admin/pidSettings/pidSettings.page'

// Marketing page
import MarketingPage from './marketing/marketing.page'

import TestingPage from './testing/testing.page'

// //////////////////////////////////////////////////////////////////////////////
// //////////////////////////PID ADMIN PAGES/////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
import PidAdminDashboardPage    from './pidAdmin/dashboard/dashboard.page'
import PidAdminUsersPage        from './pidAdmin/users/users.page'
import PidAdminFinancePage      from './pidAdmin/finance/finance.page'
import PidAdminLogsPage         from './pidAdmin/logs/logs.page'
import PidAdminGaragesOverview  from './pidAdmin/garagesOverview/garagesOverview.page'
import PidAdminMobileAppVersion from './pidAdmin/mobileAppVersion/mobileAppVersion.page'

import PidAdminGeneratorGaragesPage      from './pidAdmin/generator/generatorGarages.page'
import PidAdminGeneratorClientsPage      from './pidAdmin/generator/generatorClients.page'
import PidAdminGeneratorReservationsPage from './pidAdmin/generator/generatorReservations.page'
import PidAdminGeneratorUsersPage        from './pidAdmin/generator/generatorUsers.page'
import PidAdminGeneratorOverviewPage     from './pidAdmin/generator/generatorOverview.page'

import PidAdminNewsPage    from './pidAdmin/news/news.page'
import PidAdminNewNewsPage from './pidAdmin/news/newNews.page'

export const AVAILABLE_LANGUAGES = [ 'en', 'cs', 'de' ] // 'pl'


export default function createRoutes(jwt) {
  const adminSubRoutes = (
    <Route>
      <IndexRoute component={PidAdminDashboardPage} />
      <Route path="users" component={PidAdminUsersPage} />
      <Route path="finance" component={PidAdminFinancePage} />
      <Route path="logs" component={PidAdminLogsPage} />
      <Route path="garagesOverview" component={PidAdminGaragesOverview} />
      <Route path="mobileAppVersion" component={PidAdminMobileAppVersion} />

      <Route path="generator" component={PidAdminGeneratorGaragesPage} />
      <Route path="generator/clients" component={PidAdminGeneratorClientsPage} />
      <Route path="generator/reservations" component={PidAdminGeneratorReservationsPage} />
      <Route path="generator/users" component={PidAdminGeneratorUsersPage} />
      <Route path="generator/overview" component={PidAdminGeneratorOverviewPage} />

      <Route path="news" component={PidAdminNewsPage} />
      <Route path="news/newNews" component={PidAdminNewNewsPage} />
      <Route path="news/:id/edit" component={PidAdminNewNewsPage} />
    </Route>
  )

  const subRoutes = (
    <Switch>
      {/* <IndexRoute component={LoginPage} /> */}

      <Route path="codeVerification" component={CodeVerificationPage} />
      <Route path="signUpPage" component={SignUpPage} />
      <Route path="resetPassword" component={ResetPasswordPage} />

      <Route path=":id/issues" component={IssuesPage} />

      <Route path=":id/admin/pidSettings" component={PidSettingsPage} />

      <Route path="marketing/:short_name" component={MarketingPage} />

      {/* Testing page for not production environments */}
      {process.env.NODE_ENV !== 'production' && <Route path="testing" component={TestingPage} />}

      {/* Admin subroutes */}
      <Route path="pid-admin">
        {adminSubRoutes}
      </Route>
      <Route exact path="/en/" component={LoginPage} />
    </Switch>
  )

  return (
    <HashRouter>
      <Route path="/">
        <App jwt={jwt} />
        {/* <IndexRedirect to={`${AVAILABLE_LANGUAGES[0]}/${jwt ? 'occupancy/' : ''}`} /> */}
      </Route>
    </HashRouter>
  )
}
