import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import { setInPidAdmin } from '../_shared/actions/pageBase.actions'

import { t } from '../_shared/modules/localization/localization'

import PidAdminDashboardPage from './dashboard/dashboard.page'
import PidAdminUsersPage from './users/users.page'
import PidAdminNewsPage from './news/news.page'
import PidAdminNewNewsPage from './news/newNews.page'
import PidAdminFinancePage from './finance/finance.page'
import PidAdminLogsPage from './logs/logs.page'
import PidAdminGaragesOverview from './garagesOverview/garagesOverview.page'
import PidAdminMobileAppVersion from './mobileAppVersion/mobileAppVersion.page'
import PidAdminGeneratorGaragesPage from './generator/generatorGarages.page'
import PidAdminGeneratorClientsPage from './generator/generatorClients.page'
import PidAdminGeneratorReservationsPage from './generator/generatorReservations.page'
import PidAdminGeneratorUsersPage from './generator/generatorUsers.page'
import PidAdminGeneratorOverviewPage from './generator/generatorOverview.page'

class PidAdminRoutes extends Component {
  static propTypes = {
    setInPidAdmin: PropTypes.func,
    match:         PropTypes.object
  }

  componentDidMount() {
    const { setInPidAdmin: setInPidAdminAction } = this.props
    setInPidAdminAction(true)
  }

  componentWillUnmount() {
    const { setInPidAdmin: setInPidAdminAction } = this.props
    setInPidAdminAction(false)
  }

  render() {
    const { match } = this.props
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center' }}>{t([ 'pidAdmin', 'pageBase', 'adminMode' ])}</h1>
        <Switch>
          <Route path={`${match.path}/dashboard`} component={PidAdminDashboardPage} />
          <Route path={`${match.path}/users`} component={PidAdminUsersPage} />
          <Route exact path={`${match.path}/news`} component={PidAdminNewsPage} />
          <Route path={`${match.path}/news/newNews`} component={PidAdminNewNewsPage} />
          <Route path={`${match.path}/news/:id/edit`} component={PidAdminNewNewsPage} />
          <Route path={`${match.path}/finance`} component={PidAdminFinancePage} />
          <Route path={`${match.path}/logs`} component={PidAdminLogsPage} />
          <Route path={`${match.path}/garagesOverview`} component={PidAdminGaragesOverview} />
          <Route path={`${match.path}/mobileAppVersion`} component={PidAdminMobileAppVersion} />
          <Route exact path={`${match.path}/generator`} component={PidAdminGeneratorGaragesPage} />
          <Route path={`${match.path}/generator/clients`} component={PidAdminGeneratorClientsPage} />
          <Route path={`${match.path}/generator/reservations`} component={PidAdminGeneratorReservationsPage} />
          <Route path={`${match.path}/generator/users`} component={PidAdminGeneratorUsersPage} />
          <Route path={`${match.path}/generator/overview`} component={PidAdminGeneratorOverviewPage} />
        </Switch>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  setInPidAdmin
}

export default connect(null, mapDispatchToProps)(PidAdminRoutes)
