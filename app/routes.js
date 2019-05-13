import React from 'react'
import {
  Route, Switch, HashRouter
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

export const AVAILABLE_LANGUAGES = [ 'en', 'cs', 'de' ] // 'pl'


export default function createRoutes(jwt) {
  const subRoutes = (
    <Switch>
      {/* <IndexRoute component={LoginPage} /> */}

      <Route path="codeVerification" component={CodeVerificationPage} />
      {/* <Route path="signUpPage" component={SignUpPage} />
      <Route path="resetPassword" component={ResetPasswordPage} /> */}

      <Route path=":id/issues" component={IssuesPage} />

      <Route path=":id/admin/pidSettings" component={PidSettingsPage} />

      <Route path="marketing/:short_name" component={MarketingPage} />

      {/* Testing page for not production environments */}
      {process.env.NODE_ENV !== 'production' && <Route path="testing" component={TestingPage} />}

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
