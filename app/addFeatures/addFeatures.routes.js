import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import GarageSetupPage from '../_shared/containers/garageSetupPage/GarageSetupPage'

import GateModuleOrderPage from './gateModuleOrder.page'
import AddFeaturesPage from './addFeatures.page'
import GarageSetupSubRoutes from '../admin/garageSetup/garageSetup.subRoutes'

function GarageSetupWrapper({ match }) {
  return (
    <GarageSetupPage>
      <GarageSetupSubRoutes match={match} />
    </GarageSetupPage>
  )
}

GarageSetupWrapper.propTypes = {
  match: PropTypes.object
}

function garageSetupRoutes({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/gateModuleOrder`} component={GateModuleOrderPage} />
      <Route path={`${match.path}/garageSetup`} component={GarageSetupWrapper} />
      <Route exact patch={match.path} component={AddFeaturesPage} />
    </Switch>
  )
}

garageSetupRoutes.propTypes = {
  match: PropTypes.object
}

export default garageSetupRoutes
