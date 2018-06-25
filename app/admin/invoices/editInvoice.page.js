import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import DatetimeInput from '../../_shared/components/input/DatetimeInput'
import PageBase      from '../../_shared/containers/pageBase/PageBase'
import Input         from '../../_shared/components/input/Input'
import Form          from '../../_shared/components/form/Form'

import * as nav                from '../../_shared/helpers/navigation'
import { t }                   from '../../_shared/modules/localization/localization'
import * as editInvoiceActions from '../../_shared/actions/editInvoice.actions'


class EditInvoicePage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initInvoice(this.props.params.invoice_id)
  }

  onBack = () => nav.to(`/${this.props.pageBase.garage}/admin/invoices`)
  handleDueDate = (value, valid) => valid && this.props.actions.setDueDate(value)
  handleInvoiceDate = (value, valid) => valid && this.props.actions.setInvoiceDate(value)

  render() {
    const { state, actions } = this.props

    const checkSubmitable = () => {
      if (state.ammount <= 0 || state.ammount === '' || state.ammount === undefined) return false
      if (state.vat < 0 || state.vat === '' || state.vat === undefined) return false
      if (state.subject === '' || state.subject === undefined) return false
      if (state.invoice_date === '' || state.invoice_date === undefined) return false
      if (state.due_date === '' || state.due_date === undefined) return false

      return true
    }

    return (
      <PageBase>
        <Form
          onSubmit={actions.submitInvoice}
          submitable={checkSubmitable()}
          onHighlight={actions.toggleHighlight}
          onBack={this.onBack}
        >
          <Input
            onChange={actions.setAmount}
            onEnter={actions.submitInvoice}
            label={t([ 'invoices', 'amount' ]) + ' *'}
            error={t([ 'invoices', 'invalidValue' ])}
            value={state.ammount}
            type="number"
            min={0}
            step={0.01}
            highlight={state.highlight}
          />
          <Input
            onChange={actions.setSubject}
            onEnter={actions.submitInvoice}
            label={t([ 'invoices', 'subject' ]) + ' *'}
            error={t([ 'invoices', 'invalidValue' ])}
            value={state.subject}
            type="text"
            highlight={state.highlight}
          />
          <DatetimeInput
            onChange={this.handleInvoiceDate}
            onEnter={actions.submitInvoice}
            label={t([ 'invoices', 'inoiceDate' ]) + ' *'}
            error={t([ 'invoices', 'invalidaDate' ])}
            value={state.invoice_date}
            highlight={state.highlight}
          />
          <DatetimeInput
            onChange={this.handleDueDate}
            onEnter={actions.submitInvoice}
            label={t([ 'invoices', 'dueDate' ]) + ' *'}
            error={t([ 'invoices', 'invalidaDate' ])}
            value={state.due_date}
            highlight={state.highlight}
          />
          <Input
            onChange={actions.setVat}
            onEnter={actions.submitInvoice}
            label={t([ 'finance', 'vat' ]) + ' *'}
            error={t([ 'finance', 'invalidVat' ])}
            value={state.vat}
            type="number"
            min={0}
            step={0.01}
            highlight={state.highlight}
          />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.editInvoice, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(editInvoiceActions, dispatch) })
)(EditInvoicePage)
