import React, { Component } from 'react'

import PageBase     from '../../_shared/containers/adminPageBase/PageBase'
import LogsTable from './components/LogsTable'


export default class PidAdminLogsPage extends Component {
  render() {
    return (
      <PageBase>
        <LogsTable />
      </PageBase>
    )
  }
}
