import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import Table from '../../../_shared/components/table/Table'

import { t }            from '../../../_shared/modules/localization/localization'
import * as logsActions from '../../../_shared/actions/pid-admin.logs.actions'


class LogsTable extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initLogs()
  }

  render() {
    const { state } = this.props

    const schema = [
      { key: 'full_name', title: t([ 'activityLog', 'name' ]), comparator: 'string', sort: 'asc' },
      { key: 'email', title: t([ 'activityLog', 'email' ]), comparator: 'string' },
      { key: 'model', title: t([ 'activityLog', 'subject' ]), comparator: 'string' },
      { key: 'action', title: t([ 'activityLog', 'action' ]), comparator: 'string' },
      { key: 'created_at', title: t([ 'activityLog', 'createdAt' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span> }
    ]

    const flattenUser = log => ({
      ...log,
      full_name: log.user.full_name,
      email:     log.user.email
    })

    return <Table schema={schema} data={state.logs.map(flattenUser)} />
  }
}

export default connect(
  state => ({ state: state.pidAdminLogs }),
  dispatch => ({ actions: bindActionCreators(logsActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(LogsTable)
