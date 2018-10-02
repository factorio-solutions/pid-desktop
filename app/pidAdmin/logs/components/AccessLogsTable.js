import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import { GET_ADMIN_ACCESS_LOGS } from '../../../_shared/queries/pid-admin.logs.queries'

import { t }            from '../../../_shared/modules/localization/localization'
import * as logsActions from '../../../_shared/actions/pid-admin.logs.actions'
import PaginatedTable from '../../../_shared/components/table/PaginatedTable'


class AccessLogsTable extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  formatUser = user => user ?
    <div>
      {user.full_name && <div>{user.full_name}</div>}
      {user.email && <div>{user.email}</div>}
      <div>{user.used_phone || user.phone}</div>
    </div> :
    ''

  formatGate = gate => gate ?
    <div>
      <div>{gate.label}</div>
      <div>{gate.phone}</div>
    </div> :
    t([ 'pidAdmin', 'logs', 'noGate' ])

  formatReservation = reservation => reservation ?
    <div>
      <div>{reservation.place.floor.garage.name}: {reservation.place.floor.label}/{reservation.place.label}</div>
      <div>id: {reservation.id}</div>
      <div>{moment(reservation.begins_at).format('DD.MM.YYYY')} {moment(reservation.begins_at).format('H:mm')}</div>
      <div>{moment(reservation.ends_at).format('DD.MM.YYYY')} {moment(reservation.ends_at).format('H:mm')}</div>
    </div> :
    t([ 'pidAdmin', 'logs', 'noReservation' ])

  transformData = data => data.gate_access_logs.map(log => ({
    ...log,
    user: {
      ...log.user,
      used_phone: log.user_phone
    }
  }))

  render() {
    const { state, actions } = this.props

    const schema = [
      { key:         'user',
        title:       t([ 'pidAdmin', 'logs', 'user' ]),
        representer: this.formatUser,
        includes:    'user',
        orderBy:     'users.full_name'
      },
      { key:        'access_type',
        title:      t([ 'pidAdmin', 'logs', 'accessType' ]),
        comparator: 'string',
        orderBy:    'access_type'
      },
      { key:         'created_at',
        title:       t([ 'pidAdmin', 'logs', 'createdAt' ]),
        comparator:  'date',
        representer: o => <span>{ moment(o).format('DD.MM.YYYY')} <br /> {moment(o).format('H:mm:ss')}</span>,
        orderBy:     'created_at',
        sort:        'DESC'
      },
      { key:         'gate',
        title:       t([ 'pidAdmin', 'logs', 'gate' ]),
        comparator:  (sortType, a, b) => (a.label || '').toLowerCase() < (b.label || '').toLowerCase() ? (sortType === 'asc' ? -1 : 1) : ((a.label || '').toLowerCase() > (b.label || '').toLowerCase() ? (sortType === 'asc' ? 1 : -1) : 0),
        representer: this.formatGate,
        includes:    'gate',
        orderBy:     'gates.label'
      },
      { key:         'reservation',
        title:       t([ 'pidAdmin', 'logs', 'reservation' ]),
        representer: this.formatReservation,
        includes:    'reservation place floor garage',
        orderBy:     'garages.name'
      }
    ]

    // return <Table schema={schema} data={state.accessLogs} />
    return (<PaginatedTable
      query={GET_ADMIN_ACCESS_LOGS}
      parseMetadata={data => data.gate_access_logs_metadata}
      transformData={this.transformData}
      schema={schema}
      storeState={actions.setAccessLogs}
      state={state.accessLogs}
      count={40}
      admin
    />)
  }
}

export default connect(
  state => ({ state: state.pidAdminLogs }),
  dispatch => ({ actions: bindActionCreators(logsActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(AccessLogsTable)
