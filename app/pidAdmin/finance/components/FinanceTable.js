import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import Table from '../../../_shared/components/table/Table'

import { t }               from '../../../_shared/modules/localization/localization'
import * as financeActions from '../../../_shared/actions/pid-admin.finance.actions'

import styles from './FinanceTable.scss'


class FinanceTable extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initFinance()
  }

  render() {
    const { state } = this.props

    const schema = [
      { key: 'invoice_number', title: t([ 'invoices', 'invoiceNumber' ]), comparator: 'integer', representer: o => <b>{o}</b>, sort: 'asc' },
      { key: 'invoice_date', title: t([ 'invoices', 'invoiceDate' ]), comparator: 'date', representer: o => o ? moment(o).format('DD. MM. YYYY') : null },
      { key: 'due_date', title: t([ 'invoices', 'dueDate' ]), comparator: 'date', representer: o => o ? moment(o).format('DD. MM. YYYY') : null },
      { key: 'client_name', title: t([ 'invoices', 'client' ]), comparator: 'string', representer: o => <b>{o}</b> },
      { key: 'longterm_rent', title: t([ 'invoices', 'type' ]), comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-home' : 'fa-clock-o'}`} aria-hidden="true" /> },
      { key: 'subject', title: t([ 'invoices', 'subject' ]), comparator: 'string', representer: o => o.length > 20 ? o.substring(0, 20) + '...' : o },
      { key: 'price', title: t([ 'invoices', 'ammount' ]), comparator: 'string' },
      { key:         'payed',
        title:       t([ 'invoices', 'paid' ]),
        comparator:  'boolean',
        representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-exclamation-triangle'} ${o ? styles.green : styles.red}`} aria-hidden="true" />
      }
    ]

    return <Table schema={schema} data={state.invoices} />
  }
}

export default connect(
  state => ({ state: state.pidAdminFinance }),
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(FinanceTable)
