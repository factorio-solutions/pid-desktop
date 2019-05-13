import React from 'react'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import { toPidAdmin } from '../../_shared/actions/pageBase.actions'

import FinanceTable from './components/FinanceTable'

function PidAdminFinancePage() {
  return (
    <FinanceTable />
  )
}

export default withMasterPageConf(toPidAdmin('finance'))(PidAdminFinancePage)
