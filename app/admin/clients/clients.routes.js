import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import ClientsPage from './clients.page'
import ClientUsersPage from './users.page'
import NewClientPage from './newClient.page'
import ClientModulesRoute from './modules/clientsModules.routes'
import NewContractPage from './newContract.page'

function clientsRoutes({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/:client_id/users`} component={ClientUsersPage} />
      <Route path={`${match.path}/newClient`} component={NewClientPage} />
      <Route path={`${match.path}/:client_id/edit`} component={NewClientPage} />
      <Route path={`${match.path}/:client_id/modules`} component={ClientModulesRoute} />
      <Route path={`${match.path}/newContract`} component={NewContractPage} />
      <Route path={`${match.path}/:contract_id/editContract`} component={NewContractPage} />
      <Route path={match.path} component={ClientsPage} />
    </Switch>
  )
}

clientsRoutes.propTypes = {
  match: PropTypes.object
}

export default clientsRoutes
