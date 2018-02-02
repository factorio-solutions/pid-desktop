import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import FinanceTable from '../finance/components/FinanceTable'

import { t } from '../../_shared/modules/localization/localization'

import styles from './dashboard.page.scss'


class PidAdminDashboardPage extends Component {
  static propTypes = {}

  render() {
    return (
      <PageBase>
        <div className={styles.section}>
          <h2>{t([ 'pidAdmin', 'pageBase', 'finance' ])}</h2>
          <FinanceTable />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({}, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PidAdminDashboardPage)
