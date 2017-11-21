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
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({}, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PidAdminDashboardPage)
