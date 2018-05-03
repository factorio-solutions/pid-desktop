import React, { Component } from 'react'

import PageBase        from '../../_shared/containers/adminPageBase/PageBase'
import LogsTable       from './components/LogsTable'
import AccessLogsTable from './components/AccessLogsTable'
import TabMenu         from '../../_shared/components/tabMenu/TabMenu'
import TabButton       from '../../_shared/components/buttons/TabButton'

import { t } from '../../_shared/modules/localization/localization'


const LOG_TABS = [
  { name:    'accessLogs',
    content: <AccessLogsTable />
  },
  { name:    'garageLogs',
    content: <LogsTable />
  }
]

export default class PidAdminLogsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { selected: LOG_TABS[0].name }
  }

  selectTab = tab => () => this.setState({ ...this.state, selected: tab.name })

  tabFactory = tab => (<TabButton
    label={t([ 'pidAdmin', 'logs', tab.name ])}
    onClick={this.selectTab(tab)}
    state={this.state.selected === tab.name && 'selected'}
  />)

  render() {
    const tabs = LOG_TABS.map(this.tabFactory)

    return (
      <PageBase>
        <TabMenu left={tabs} />

        <div>
          { LOG_TABS.find(tab => tab.name === this.state.selected).content }
        </div>
      </PageBase>
    )
  }
}
