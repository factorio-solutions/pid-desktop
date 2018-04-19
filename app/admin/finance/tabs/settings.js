import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import Iban                            from 'iban'

import Input              from '../../../_shared/components/input/Input'
import Form               from '../../../_shared/components/form/Form'

import { t }                    from '../../../_shared/modules/localization/localization'
import * as financeActions      from '../../../_shared/actions/admin.finance.actions'

import styles from '../finance.page.scss'


class SettingsTab extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    params:   PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initFinance(this.props.params.id)
  }


  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      this.props.actions.initFinance(nextProps.pageBase.garage)
    }
  }

  submitForm = () => this.checkSubmitable() && this.props.actions.submitGarage(this.props.params.id)

  checkSubmitable = () => {
    const { state } = this.props

    if (state.vat === undefined || state.vat === '') return false
    if (state.invoiceRow === undefined || state.invoiceRow === '') return false
    if (state.simplyfiedInvoiceRow === undefined || state.simplyfiedInvoiceRow === '') return false
    if (state.iban && !Iban.isValid(state.iban)) return false
    return true
  }

  isIbanValid = iban => {
    const valid = Iban.isValid(iban)
    const pattern = valid ? undefined : '/(?=a)b/'
    if (this.props.state.ibanPattern !== pattern) {
      this.props.actions.setIbanPattern(pattern)
    }
  }

  render() {
    const { actions, state } = this.props

    return (
      <div className={styles.finance}>
        <h2>{t([ 'finance', 'financeSettings' ])}</h2>
        <Form onSubmit={this.submitForm} submitable={this.checkSubmitable()} onHighlight={actions.toggleHighlight}>
          <Input
            onChange={actions.setVat}
            onEnter={this.submitForm}
            label={t([ 'finance', 'vat' ])}
            error={t([ 'finance', 'invalidVat' ])}
            value={state.vat}
            type="number"
            min={0}
            step={0.01}
            highlight={state.highlight}
          />
          <Input
            onChange={actions.setInvoiceRow}
            onEnter={this.submitForm}
            label={t([ 'finance', 'invoiceRow' ])}
            error={t([ 'finance', 'invalidRow' ])}
            value={state.invoiceRow}
            type="number"
            min={0}
            step={1}
            highlight={state.highlight}
          />
          <Input
            onChange={actions.setSimplyfiedInvoiceRow}
            onEnter={this.submitForm}
            label={t([ 'finance', 'simplyfiedInvoiceRow' ])}
            error={t([ 'finance', 'invalidRow' ])}
            value={state.simplyfiedInvoiceRow}
            type="number"
            min={0}
            step={1}
            highlight={state.highlight}
          />
          <Input
            onChange={actions.setAccountNumber}
            onEnter={this.submitForm}
            label={t([ 'finance', 'accountNumber' ])}
            error={t([ 'finance', 'invalidAccountNumber' ])}
            value={state.accountNumber}
          />
          <Input
            onChange={actions.setIban}
            label={t([ 'newClient', 'IBAN' ])}
            error={t([ 'newClient', 'invalidIBAN' ])}
            value={state.iban}
            placeholder={t([ 'newClient', 'IBANplaceholder' ])}
            highlight={state.highlight}
            pattern={state.ibanPattern}
            isValid={this.isIbanValid}
          />
        </Form>
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(SettingsTab)
