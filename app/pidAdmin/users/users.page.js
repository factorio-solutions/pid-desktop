import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import PaginatedTable from '../../_shared/components/table/PaginatedTable'

import { t } from '../../_shared/modules/localization/localization'


class PidAdminDashboardPage extends Component {
  static propTypes = {}

  // componentDidMount() {
  //   import request from '../../_shared/helpers/requestAdmin'
  //   request('{ users { full_name } }').then(data => console.log(data))
  // }

  render() {
    const schema = [
      { key: 'id', title: t([ 'pidAdmin', 'users', 'id' ]), comparator: 'number', orderBy: 'id', sort: 'asc' },
      { key: 'full_name', title: t([ 'pidAdmin', 'users', 'name' ]), comparator: 'string', orderBy: 'full_name' }
    ]

    const query = `query Users($count: Int, $page: Int, $order_by: String, $includes: String) {
      users(count: $count, page: $page, order_by: $order_by, includes: $includes) {
        id
        full_name
      }
    }
    `

    const transformData = data => data.users

    return (
      <PageBase>
        <PaginatedTable query={query} schema={schema} transformData={transformData} admin />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({}, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PidAdminDashboardPage)
