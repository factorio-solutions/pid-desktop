import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import GarageTurnoverPage from './garageTurnover.page'
import ReservationsAnalyticsPage from './reservations.page'
import PlacesAnalyticsPage from './places.page'
import paymentsAnalyticsPage from './payments.page'
import gatesAnalyticsPage from './gates.page'

function analyticsRouter({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/reservationsAnalytics`} component={ReservationsAnalyticsPage} />
      <Route path={`${match.path}/placesAnalytics`} component={PlacesAnalyticsPage} />
      <Route path={`${match.path}/paymentsAnalytics`} component={paymentsAnalyticsPage} />
      <Route path={`${match.path}/gatesAnalytics`} component={gatesAnalyticsPage} />
      <Route path={`${match.path}/`} component={GarageTurnoverPage} />
    </Switch>
  )
}

analyticsRouter.propTypes = {
  match: PropTypes.object
}

export default analyticsRouter
