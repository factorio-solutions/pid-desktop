import React, { Component } from 'react'

import PageBase     from '../../_shared/containers/adminPageBase/PageBase'
import FinanceTable from './components/FinanceTable'


export default class PidAdminFinancePage extends Component {
  render() {
    return (
      <PageBase>
        <FinanceTable />
      </PageBase>
    )
  }
}
