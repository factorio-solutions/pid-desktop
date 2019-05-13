import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import ClientModules from './clientModules.page'
import SmsSettingsPage from './smsSettings.page'
import TimeCreditPage from './timeCredit.page'
import MinMaxDurationPage from './MinMaxDuration.page'

function clientsModulesRoutes({ match }) {
  return (
    <ClientModules params={match.params}>
      <Switch>
        <Route path={`${match.path}/smsSettings`} component={SmsSettingsPage} />
        <Route path={`${match.path}/timeCredit`} component={TimeCreditPage} />
        <Route path={`${match.path}/minMaxReservationDuration`} component={MinMaxDurationPage} />
      </Switch>
    </ClientModules>
  )
}

clientsModulesRoutes.propTypes = {
  match: PropTypes.object
}

export default clientsModulesRoutes
