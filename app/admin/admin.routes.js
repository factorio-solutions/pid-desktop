import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import InvoicesPage from './invoices/invoices.page'
import EditInvoicePage from './invoices/editInvoice.page'
import ClientsRoutes from './clients/clients.routes'
import GarageSetupRoutes from './garageSetup/garageSetup.routes'
import ModulesRoutes from './modules/modules.routes'
import UsersPage from './users/users.page'
import InviteUserPage from './users/inviteUser.page'
import FinanceRoutes from './finance/finance.routes'
// import ActivityLogPage from './activityLog/activityLog.page'

function adminRoutes({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/clients`} component={ClientsRoutes} />
      <Route path={`${match.path}/invoices/:invoice_id/edit`} component={EditInvoicePage} />
      <Route path={`${match.path}/garageSetup`} component={GarageSetupRoutes} />
      <Route path={`${match.path}/modules`} component={ModulesRoutes} />
      <Route path={`${match.path}/users/invite`} component={InviteUserPage} />
      <Route path={`${match.path}/users`} component={UsersPage} />
      <Route path={`${match.path}/finance`} component={FinanceRoutes} />
      {/* <Route path={`${match.path}/activityLog`} component={ActivityLogPage} /> */}
      <Route path={match.path} component={InvoicesPage} />
    </Switch>
  )
}

adminRoutes.propTypes = {
  match: PropTypes.object
}

export default adminRoutes
