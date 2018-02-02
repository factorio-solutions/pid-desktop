import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import FinanceTable from '../finance/components/FinanceTable'
import LogsTable from '../logs/components/LogsTable'

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

        <div className={styles.flexbox}>
          <div className={`${styles.flex} ${styles.section}`}>
            <h2>{t([ 'pageBase', 'Activity log' ])}</h2>
            <LogsTable />
          </div>

          <div className={`${styles.flex} ${styles.section}`} />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({}, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PidAdminDashboardPage)
