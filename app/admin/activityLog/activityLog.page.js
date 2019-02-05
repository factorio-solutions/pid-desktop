import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase from '../../_shared/containers/pageBase/PageBase'

import { t }                         from '../../_shared/modules/localization/localization'
import * as adminActivityLogsActions from '../../_shared/actions/admin.activityLog.actions'
import PaginatedTable                from '../../_shared/components/table/PaginatedTable'
import { GET_LOGS_PAGINATION_QUERY } from '../../_shared/queries/admin.activityLog.queries'


class ActivityLogPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  transformData = data => {
    return data.logs.map(log => ({
      full_name:  log.user.full_name,
      email:      log.user.email,
      model:      log.model,
      action:     log.action,
      created_at: log.created_at
    }))
  }

  render() {
    const { state, actions, pageBase } = this.props

    const schema = [
      { key: 'full_name', title: t([ 'activityLog', 'name' ]), comparator: 'string', includes: 'user', orderBy: 'users.full_name', sort: 'asc' },
      { key: 'email', title: t([ 'activityLog', 'email' ]), comparator: 'string', includes: 'user', orderBy: 'users.email' },
      { key: 'model', title: t([ 'activityLog', 'subject' ]), comparator: 'string', orderBy: 'model' },
      { key: 'action', title: t([ 'activityLog', 'action' ]), comparator: 'string', orderBy: 'action' },
      { key:         'created_at',
        title:       t([ 'activityLog', 'createdAt' ]),
        comparator:  'date',
        representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span>,
        orderBy:     'created_at'
      }
    ]

    return (
      <PageBase>
        <PaginatedTable
          query={GET_LOGS_PAGINATION_QUERY}
          parseMetadata={data => data.logs_metadata}
          transformData={this.transformData}
          schema={schema}
          storeState={actions.setTableState}
          state={state.tableState}
          count={40}
          variables={{ garage_id: pageBase.garage }}
        />
      </PageBase>
        // <Table schema={schema} data={state.logs} />
    )
  }
}

export default connect(
  state => ({ state: state.adminActivityLog, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(adminActivityLogsActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(ActivityLogPage)
