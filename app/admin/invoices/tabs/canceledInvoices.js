import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Table         from '../../../_shared/components/table/Table'
import ExportButtons from '../components/ExportButtons'

import * as invoicesActions from '../../../_shared/actions/invoices.actions'

import { createSchema, prepareInvoice, filterByClient } from '../invoices.page'


class CanceledInvoices extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { state, pageBase, actions } = this.props

    const invoiceData = state.invoices
      .filter(invoice => invoice.canceled)
      .filter(invoice => filterByClient(invoice, state.client_id))
      .map(invoice => prepareInvoice(invoice, actions, pageBase))

    return (<div>
      <Table schema={createSchema()} data={invoiceData} returnFiltered={actions.setFilteredInvoices} />
      <ExportButtons actions={actions} invoices={invoiceData} />
    </div>)
  }
}

export default connect(
  state => ({ state: state.invoices, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(CanceledInvoices)
