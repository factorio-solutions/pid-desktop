import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import * as localization from '../_shared/modules/localization/localization'

import { AVAILABLE_LANGUAGES } from '../routes'

import LoginPage from '../user/login.page'
import MasterPage from '../_shared/components/masterPage/MasterPage'


export default class App extends PureComponent {
  static propTypes = {
    jwt: PropTypes.string
  }

  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount() {
    localization.changeLanguage(localization.getLanguage())
  }

  render() {
    const { jwt } = this.props
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
              }
              const PidAdminMasterPage = null
              return (
                <Switch>
                  <Route path={`${path}/login`} component={LoginPage} />
                  <Route path={`${path}/pid-admin`} component={PidAdminMasterPage} />
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
