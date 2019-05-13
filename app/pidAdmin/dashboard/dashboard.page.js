import React from 'react'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import FinanceTable from '../finance/components/FinanceTable'
import LogsTable from '../logs/components/LogsTable'

import { t } from '../../_shared/modules/localization/localization'

import { toPidAdmin } from '../../_shared/actions/pageBase.actions'

import styles from './dashboard.page.scss'

const PidAdminDashboardPage = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
export default withMasterPageConf(toPidAdmin('dashboard'))(PidAdminDashboardPage)
