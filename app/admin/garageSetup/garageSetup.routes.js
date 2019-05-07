import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import GarageSetupPage from '../../_shared/containers/garageSetupPage/GarageSetupPage'

import GarageSetupGeneralPage from './garageSetupGeneral.page'
import GarageSetupFloorsPage from './garageSetupFloors.page'
import GarageSetupGatesPage from './garageSetupGates.page'
import GarageSetupOrderPage from './garageSetupOrder.page'
import GarageSetupSubscribtionPage from './garageSetupSubscribtion.page'
import GarageUsersPage from './users.page'
import LegalDocuments from './legalDocuments/legalDocuments.page'

function garageSetupRoutes({ match }) {
  console.log(`${match.path}/general`)
  return (
    <GarageSetupPage>
      <Switch>
        <Route path={`${match.path}/general`} component={GarageSetupGeneralPage} />
        <Route path={`${match.path}/floors`} component={GarageSetupFloorsPage} />
        <Route path={`${match.path}/gates`} component={GarageSetupGatesPage} />
        <Route path={`${match.path}/order`} component={GarageSetupOrderPage} />
        <Route path={`${match.path}/subscribtion`} component={GarageSetupSubscribtionPage} />
        <Route path={`${match.path}/users`} component={GarageUsersPage} />
        <Route path={`${match.path}/legalDocuments`} component={LegalDocuments} />
      </Switch>
    </GarageSetupPage>
  )
}

garageSetupRoutes.propTypes = {
  match: PropTypes.object
}

export default garageSetupRoutes
