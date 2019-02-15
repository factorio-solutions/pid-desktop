import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { GET_ADMIN_LOGS } from '../../../_shared/queries/pid-admin.logs.queries'

import { t }            from '../../../_shared/modules/localization/localization'
import * as logsActions from '../../../_shared/actions/pid-admin.logs.actions'
import PaginatedTable   from '../../../_shared/components/table/PaginatedTable'


class LogsTable extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    const schema = [
      { key: 'full_name', title: t([ 'activityLog', 'name' ]), comparator: 'string', includes: 'user', orderBy: 'users.full_name' },
      { key: 'email', title: t([ 'activityLog', 'email' ]), comparator: 'string', includes: 'user', orderBy: 'users.email' },
      { key: 'model', title: t([ 'activityLog', 'subject' ]), comparator: 'string', orderBy: 'model' },
      { key: 'action', title: t([ 'activityLog', 'action' ]), comparator: 'string', orderBy: 'action' },
      { key:         'created_at',
        title:       t([ 'activityLog', 'createdAt' ]),
        comparator:  'date',
        representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span>,
        orderBy:     'created_at',
        sort:        'DESC'
      }
    ]

    const flattenUser = data => data.logs.map(log => ({
      ...log,
      full_name: log.user.full_name,
      email:     log.user.email
    }))

    return (<PaginatedTable
      query={GET_ADMIN_LOGS}
      parseMetadata={data => data.logs_metadata}
      transformData={flattenUser}
      schema={schema}
      storeState={actions.setLogs}
      state={state.logs}
      count={50}
      admin
    />)
  }
}

export default connect(
  state => ({ state: state.pidAdminLogs }),
  dispatch => ({ actions: bindActionCreators(logsActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(LogsTable)
