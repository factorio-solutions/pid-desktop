import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import FinancePage from './finance.page'
import NewRentPage from './newRent.page'
import CsobPage from './csob.page'
import GpWebpayPage from './gpWebpay.page'

function financeRoutes({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/newRent`} component={NewRentPage} />
      <Route path={`${match.path}/:rent_id/editRent`} component={NewRentPage} />
      <Route path={`${match.path}/csob`} component={CsobPage} />
      <Route path={`${match.path}/GpWebpay`} component={GpWebpayPage} />
      <Route path={`${match.path}`} component={FinancePage} />
    </Switch>
  )
}

financeRoutes.propTypes = {
  match: PropTypes.object
}

export default financeRoutes
