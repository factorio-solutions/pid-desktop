import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import PaginatedTable from '../../_shared/components/table/PaginatedTable'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'

import * as usersActions from '../../_shared/actions/pid-admin.users.actions'
import { t } from '../../_shared/modules/localization/localization'
import { USERS_PAGINATED_TABLE } from '../../_shared/queries/pid-admin.users.queries'


class PidAdminDashboardPage extends Component {
  static propTypes = {}

  render() {
    const schema = [
      { key: 'id', title: t([ 'pidAdmin', 'users', 'id' ]), comparator: 'number', orderBy: 'id', sort: 'asc' },
      { key: 'full_name', title: t([ 'pidAdmin', 'users', 'name' ]), comparator: 'string', orderBy: 'full_name' },
      { key:         'last_active',
        title:       t([ 'pidAdmin', 'users', 'lastActive' ]),
        comparator:  'date',
        representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span>,
        orderBy:     'last_active'
      }
    ]

    const transformData = data => data.users

    return (
      <PageBase>
        <PaginatedTable query={USERS_PAGINATED_TABLE} schema={schema} transformData={transformData} admin />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(usersActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PidAdminDashboardPage)
