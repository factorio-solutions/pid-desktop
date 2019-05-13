import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import CarUsersPage from './cars/users.page'
import NewCarPage from './cars/newCar.page'
import ProfilePage from './profile.page'

function profileRoutes({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/cars/:id/users`} component={CarUsersPage} />
      <Route path={`${match.path}/cars/newCar`} component={NewCarPage} />
      <Route path={`${match.path}/cars/:id/edit`} component={NewCarPage} />
      <Route path={match.path} component={ProfilePage} />
    </Switch>
  )
}

profileRoutes.propTypes = {
  match: PropTypes.object
}

export default profileRoutes
