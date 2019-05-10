import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import GarageSetupPage from '../../_shared/containers/garageSetupPage/GarageSetupPage'

import GarageUsersPage from './users.page'
import GarageSetupSubRoutes from './garageSetup.subRoutes'

function garageSetupRoutes({ match }) {
  return (
    <GarageSetupPage>
      <Switch>
        <Route path={`${match.path}/users`} component={GarageUsersPage} />
        <Route path={match.path} component={GarageSetupSubRoutes} />
      </Switch>
    </GarageSetupPage>
  )
}

garageSetupRoutes.propTypes = {
  match: PropTypes.object
}

export default garageSetupRoutes
