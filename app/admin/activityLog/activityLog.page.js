import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase from '../../_shared/containers/pageBase/PageBase'
import Table    from '../../_shared/components/table/Table'

import * as nav                      from '../../_shared/helpers/navigation'
import { t }                         from '../../_shared/modules/localization/localization'
import * as adminActivityLogsActions from '../../_shared/actions/admin.activityLog.actions'

import styles from './activityLog.page.scss'


export class ActivityLogPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initLogs()
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initLogs()
  }

  render() {
    const { state, actions } = this.props

    const schema = [ { key: 'full_name',  title: t(['activityLog', 'name']),      comparator: 'string', sort: 'asc' }
                   , { key: 'email',      title: t(['activityLog', 'email']),     comparator: 'string' }
                   , { key: 'model',      title: t(['activityLog', 'subject']),   comparator: 'string' }
                   , { key: 'action',     title: t(['activityLog', 'action']),    comparator: 'string' }
                   , { key: 'created_at', title: t(['activityLog', 'createdAt']), comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.')}  <br/> {moment(o).format('H:mm')}</span> }
                   ]

    return (
      <PageBase>
        <Table schema={schema} data={state.logs} />
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.adminActivityLog, pageBase: state.pageBase }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(adminActivityLogsActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(ActivityLogPage)
