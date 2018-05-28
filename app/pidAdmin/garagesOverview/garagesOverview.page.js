import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase           from '../../_shared/containers/adminPageBase/PageBase'
import PaginatedTable     from '../../_shared/components/table/PaginatedTable'

import { initState } from '../../_shared/actions/pid-admin.garagesOverview.actions'

class GaragesOverview extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initState()
  }

  render() {
    const { state } = this.props

    const schema = [
      { key: 'id', title: 'ID', comparator: 'number', orderBy: 'id' },
      { key: 'name', title: 'Garage name', comparator: 'string', orderBy: 'name' },
      { key: 'tarif', title: 'tarif', comparator: 'string', includes: 'active_pid_tarif', orderBy: 'active_pid_tarif.name' }
    ]

    return (
      <PageBase>
        <h3>Garage Overview</h3>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGaragesOverview }),
  dispatch => ({ actions: bindActionCreators({ initState }, dispatch) })
)(GaragesOverview)
