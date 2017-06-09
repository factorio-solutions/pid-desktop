import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import DatetimeInput from '../../_shared/components/input/DatetimeInput'
import PageBase      from '../../_shared/containers/pageBase/PageBase'
import Input         from '../../_shared/components/input/Input'
import Form          from '../../_shared/components/form/Form'

import styles                  from './invoices.page.scss'
import * as nav                from '../../_shared/helpers/navigation'
import { t }                   from '../../_shared/modules/localization/localization'
import * as editInvoiceActions from '../../_shared/actions/editInvoice.actions'


export class EditInvoicePage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initInvoice(this.props.params.invoice_id)
  }

  render() {
    const {state, pageBase, actions} = this.props
    const handleDueDate = (value, valid) => { valid && actions.setDueDate(value) }
    const handleInvoiceDate = (value, valid) => { valid && actions.setInvoiceDate(value) }
    const submitForm = () => { actions.submitInvoice() }

    const onBack = () => {
      nav.to(`/${pageBase.garage}/admin/invoices`)
    }

    const checkSubmitable = () => {
      if (state.ammount <= 0 || state.ammount === '' || state.ammount === undefined) return false
      if (state.vat < 0 || state.vat === '' || state.vat === undefined) return false
      if (state.subject === '' || state.subject === undefined) return false
      if (state.invoice_date === '' || state.invoice_date === undefined) return false
      if (state.due_date === '' || state.due_date === undefined) return false
      // if (state.invoice_number === '' || state.invoice_number === undefined) return false

      return true
    }

    return (
      <PageBase>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onHighlight={actions.toggleHighlight} onBack={onBack}>
          <Input onChange={actions.setAmount} onEnter={submitForm} label={t(['invoices', 'amount'])} error={t(['invoices', 'invalidValue'])} value={state.ammount} type="number" min={0} step={0.01} highlight={state.highlight} />
          <Input onChange={actions.setSubject} onEnter={submitForm} label={t(['invoices', 'subject'])} error={t(['invoices', 'invalidValue'])} value={state.subject} type="text"                     highlight={state.highlight} />
          <DatetimeInput onChange={handleInvoiceDate} onEnter={submitForm} label={t(['invoices', 'inoiceDate'])} error={t(['invoices', 'invalidaDate'])} value={state.invoice_date} highlight={state.highlight}/>
          <DatetimeInput onChange={handleDueDate}     onEnter={submitForm} label={t(['invoices', 'dueDate'])}    error={t(['invoices', 'invalidaDate'])} value={state.due_date}     highlight={state.highlight}/>
          <Input onChange={actions.setVat}            onEnter={submitForm} label={t(['finance', 'vat'])}         error={t(['finance', 'invalidVat'])}    value={state.vat}                  type="number" min={0} step={0.01} highlight={state.highlight} />
          {/*<Input onChange={actions.setInvoiceNumber}  onEnter={submitForm} label={t(['finance', 'invoiceRow'])}  error={t(['finance', 'invalidRow'])}    value={state.invoice_number}       type="number" min={0} step={1}    highlight={state.highlight} />*/}
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.editInvoice, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(editInvoiceActions, dispatch) })
)(EditInvoicePage)
