import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import InvoicesPage from './invoices/invoices.page'
import EditInvoicePage from './invoices/editInvoice.page'
import ClientsRoutes from './clients/clients.routes'

function adminRoutes({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/clients`} component={ClientsRoutes} />
      <Route path={`${match.path}/invoices/:invoice_id/edit`} component={EditInvoicePage} />
      <Route path={match.path} component={InvoicesPage} />
    </Switch>
  )
}

adminRoutes.propTypes = {
  match: PropTypes.object
}

export default adminRoutes
