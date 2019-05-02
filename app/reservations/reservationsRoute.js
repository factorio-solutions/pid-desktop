import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import ReservationsPage from './reservations.page'
import NewReservationPage from './newReservation.page'
import ReservationsBulkRemoval from './bulkRemoval.page'
import NewReservationOverviewPage from './newReservationOverview.page'

function reservationsRoute({ match }) {
  return (
    <Switch>
      <Route exact path={`${match.path}/newReservation`} component={NewReservationPage} />
      <Route path={`${match.path}/:id/edit`} component={NewReservationPage} />
      <Route path={`${match.path}/newReservation/overview`} component={NewReservationOverviewPage} />

      <Route path={`${match.path}/bulkRemoval`} component={ReservationsBulkRemoval} />

      <Route path={`${match.path}/find/:id`} component={ReservationsPage} />
      <Route exact path={match.path} component={ReservationsPage} />
    </Switch>
  )
}

reservationsRoute.propTypes = {
  match: PropTypes.object
}

export default reservationsRoute
