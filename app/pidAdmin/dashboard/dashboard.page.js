import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'


class PidAdminDashboardPage extends Component {
  static propTypes = {}

  render() {
    return (
      <PageBase>
        ADMIN ONLY PAGE!
        <span className="icon-activitylog" />
        <span className="icon-admin" />
        <span className="icon-airport-nearby" />
        <span className="icon-camera-at-gate" />
        <span className="icon-cameras" />
        <span className="icon-car-wash" />
        <span className="icon-charging-station" />
        <span className="icon-city-center" />
        <span className="icon-client" />
        <span className="icon-dashboard" />
        <span className="icon-fifteen-minutes-from-center" />
        <span className="icon-finance" />
        <span className="icon-garagesetup" />
        <span className="icon-garage" />
        <span className="icon-gate-opened-by-phone" />
        <span className="icon-gate-opened-by-receptionist" />
        <span className="icon-guarded-parking" />
        <span className="icon-historical-center" />
        <span className="icon-invoices" />
        <span className="icon-issues" />
        <span className="icon-marketing" />
        <span className="icon-message" />
        <span className="icon-non-stop-open" />
        <span className="icon-non-stop-reception" />
        <span className="icon-occupancy" />
        <span className="icon-profile" />
        <span className="icon-reservations" />
        <span className="icon-settings" />
        <span className="icon-size-restriction" />
        <span className="icon-tram-nearby" />
        <span className="icon-user" />
        <span className="icon-wc" />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({}, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PidAdminDashboardPage)
