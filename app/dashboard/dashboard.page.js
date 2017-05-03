import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
// import * as dashboardActions  from '../_shared/actions/dashboard.actions'

import styles from './dashboard.page.scss'


export class DashboardPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        Dashboard page
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: {} }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({}, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(DashboardPage)
