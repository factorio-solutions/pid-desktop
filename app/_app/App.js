import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import * as localization from '../_shared/modules/localization/localization'

import { AVAILABLE_LANGUAGES } from '../routes'

import LoginPage from '../user/login.page'
import OccupancyPage from '../occupancy/occupancy.page'
import MasterPage from '../_shared/components/masterPage/MasterPage'


export default class App extends PureComponent {
  static propTypes = {
    jwt: PropTypes.string
  }

  static contextTypes = {
    store: PropTypes.object
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
              console.log('redirect')
              return <Redirect to={`${AVAILABLE_LANGUAGES[0]}/${jwt ? 'occupancy/' : 'login'}`} />
            }}
          />
          {/* {AVAILABLE_LANGUAGES.map(lang => (
            <Route key={lang} path={lang} onEnter={() => { localization.changeLanguage(lang) }}>
              {subRoutes}
            </Route>
          ))} */}

          <Route
            path="/:lang"
            render={({
              match: {
                params,
                path
              }
            }) => {
              console.log('path:', path)
              localization.changeLanguage(params.lang)
              return (
                <Switch>
                  <Route path={`${path}/login`} component={LoginPage} />

                  <Route path={`${path}/`} component={MasterPage} />
                </Switch>
              )
            }}
          />
        </Switch>
      </div>
    )
  }
}
