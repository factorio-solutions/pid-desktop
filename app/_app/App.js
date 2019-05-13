import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import * as localization from '../_shared/modules/localization/localization'

import { AVAILABLE_LANGUAGES } from '../routes'

import { setCurrentUserLanguage } from '../_shared/actions/pageBase.actions'

import LoginPage from '../user/login.page'
import SignUpPage from '../user/signUp.page'
import ResetPasswordPage from '../user/resetPassword.page'
import MarketingPage from '../marketing/marketing.page'
import MasterPage from '../_shared/components/masterPage/MasterPage'


class App extends PureComponent {
  static propTypes = {
    jwt:                    PropTypes.string,
    setCurrentUserLanguage: PropTypes.func
  }

  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount() {
    localization.changeLanguage(localization.getLanguage())
  }

  render() {
    const { jwt, setCurrentUserLanguage } = this.props
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            component={() => {
              return <Redirect to={`${AVAILABLE_LANGUAGES[0]}/${jwt ? 'occupancy/' : 'login/'}`} />
            }}
          />

          <Route
            path="/:lang"
            render={({
              match: { params, path }
            }) => {
              if (params.lang !== localization.getLanguage()) {
                localization.changeLanguage(params.lang)
                setCurrentUserLanguage(params.lang)
              }
              return (
                <Switch>
                  <Route path={`${path}/login`} component={LoginPage} />
                  <Route path={`${path}/signUpPage`} component={SignUpPage} />
                  <Route path={`${path}/resetPassword`} component={ResetPasswordPage} />
                  <Route path={`${path}/marketing/:short_name`} component={MarketingPage} />
                  <Route path={`${path}`} component={MasterPage} />
                </Switch>
              )
            }}
          />
        </Switch>
      </div>
    )
  }
}

export default connect(null, { setCurrentUserLanguage })(App)
