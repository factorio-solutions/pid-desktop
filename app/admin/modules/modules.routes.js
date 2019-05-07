import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import ModulesPageBase from './components/modulesPageBase'
import GoPublicPage from './goPublic.page'
import GoInternalPage from './goInternal.page'
import FlexiplacePage from './flexiplace.page'
import MarketingSettingsPage from './marketingSettings.page'
import ThirdPartyIntegrationPage from './thirdPartyIntegration.page'
import MrParkitIntegrationPage from './mrParkitIntegration.page'
// import ReservationButtonPage from './reservationButton.page'

function modulesRoutes({ match }) {
  return (
    <ModulesPageBase>
      <Switch>
        <Route path={`${match.path}/goPublic`} component={GoPublicPage} />
        <Route path={`${match.path}/goInternal`} component={GoInternalPage} />
        <Route path={`${match.path}/flexiplace`} component={FlexiplacePage} />
        <Route path={`${match.path}/marketingPage`} component={MarketingSettingsPage} />
        <Route path={`${match.path}/3rdPartyIntegration`} component={ThirdPartyIntegrationPage} />
        <Route path={`${match.path}/mrParkitIntegration`} component={MrParkitIntegrationPage} />
        {/* <Route to={`${match.path}/reservationButton`} component={ReservationButtonPage} /> */}
      </Switch>
    </ModulesPageBase>
  )
}

modulesRoutes.propTypes = {
  match: PropTypes.object
}

export default modulesRoutes
