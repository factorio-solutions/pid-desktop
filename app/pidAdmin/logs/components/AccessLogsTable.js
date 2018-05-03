import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import Table from '../../../_shared/components/table/Table'

import { t }            from '../../../_shared/modules/localization/localization'
import * as logsActions from '../../../_shared/actions/pid-admin.logs.actions'


class AccessLogsTable extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initAccessLogs()
  }

  formatUser = user => user ?
    <div>
      {user.full_name && <div>{user.full_name}</div>}
      {user.email && <div>{user.email}</div>}
      <div>{user.user_phone || user.phone}</div>
    </div> :
    ''

  formatGate = gate => gate ?
    <div>
      <div>{gate.label}</div>
      <div>{gate.phone}</div>
    </div> :
    ''

  formatReservation = reservation => reservation ?
    <div>
      <div>{reservation.place.floor.garage.name}: {reservation.place.floor.label}/{reservation.place.label}</div>
      <div>id: {reservation.id}</div>
      <div>{moment(reservation.begins_at).format('DD.MM.YYYY')} {moment(reservation.begins_at).format('H:mm')}</div>
      <div>{moment(reservation.ends_at).format('DD.MM.YYYY')} {moment(reservation.ends_at).format('H:mm')}</div>
    </div> :
    ''

  render() {
    const { state } = this.props

    const schema = [
      { key:         'user',
        title:       t([ 'pidAdmin', 'logs', 'user' ]),
        comparator:  'string',
        representer: this.formatUser
      },
      { key:        'access_type',
        title:      t([ 'pidAdmin', 'logs', 'accessType' ]),
        comparator: 'string'
      },
      { key:         'created_at',
        title:       t([ 'pidAdmin', 'logs', 'createdAt' ]),
        comparator:  'date',
        representer: o => <span>{ moment(o).format('DD.MM.YYYY')} <br /> {moment(o).format('H:mm:ss')}</span>,
        orderBy:     'created_at',
        sort:        'asc'
      },
      { key:         'gate',
        title:       t([ 'pidAdmin', 'logs', 'gate' ]),
        comparator:  'string',
        representer: this.formatGate
      },
      { key:         'reservation',
        title:       t([ 'pidAdmin', 'logs', 'reservation' ]),
        comparator:  'string',
        representer: this.formatReservation
      }
    ]

    return <Table schema={schema} data={state.accessLogs} />
  }
}

export default connect(
  state => ({ state: state.pidAdminLogs }),
  dispatch => ({ actions: bindActionCreators(logsActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(AccessLogsTable)
