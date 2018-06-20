import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Table         from '../../../_shared/components/table/Table'
import ExportButtons from '../components/ExportButtons'

import { t }                from '../../../_shared/modules/localization/localization'
import * as invoicesActions from '../../../_shared/actions/invoices.actions'
import { prepareInvoice }   from '../invoices.page'

import styles from '../invoices.page.scss'


class SimplifiedTaxReceipts extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initUserInvoices()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [
      { key: 'invoice_number', title: t([ 'invoices', 'invoiceNumber' ]), comparator: 'number', representer: o => <b>{o}</b>, sort: 'desc' },
      { key: 'invoice_date', title: t([ 'invoices', 'invoiceDate' ]), comparator: 'date', representer: o => o ? moment(o).format('DD. MM. YYYY') : null },
      { key: 'user_name', title: t([ 'invoices', 'userName' ]), comparator: 'string', representer: o => <b>{o}</b> },
      { key: 'subject', title: t([ 'invoices', 'subject' ]), comparator: 'string', representer: o => o.length > 20 ? o.substring(0, 20) + '...' : o },
      { key: 'price', title: t([ 'invoices', 'ammount' ]), comparator: 'string' },
      { key:         'payed',
        title:       t([ 'invoices', 'paid' ]),
        comparator:  'boolean',
        representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-exclamation-triangle'} ${o ? styles.green : styles.red}`} aria-hidden="true" />
      }
    ]

    const invoiceData = state.usersInvoices
      .map(invoice => prepareInvoice(invoice, actions, pageBase))

    return (<div>
      <Table schema={schema} data={invoiceData} returnFiltered={actions.setFilteredInvoices} />
      <ExportButtons actions={actions} invoices={invoiceData} />
    </div>)
  }
}

export default connect(
  state => ({ state: state.invoices, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(SimplifiedTaxReceipts)
