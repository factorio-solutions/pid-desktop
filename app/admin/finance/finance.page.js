import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'immutability-helper'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Table              from '../../_shared/components/table/Table'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import Switch             from '../../_shared/components/switch/Switch'
import Input              from '../../_shared/components/input/Input'
import Form               from '../../_shared/components/form/Form'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as financeActions      from '../../_shared/actions/admin.finance.actions'

import styles from './finance.page.scss'


class FinancePage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    location: PropTypes.object,
    params:   PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    if (this.props.location.query.hasOwnProperty('request_token')) { // got request token => Permissions granted -> update account
      this.props.actions.upadteAccount(this.props.location.query)
    }
    this.props.actions.initRents()
    this.props.actions.initFinance(this.props.params.id)
  }


  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      this.props.actions.initRents()
      this.props.actions.initFinance(nextProps.pageBase.garage)
    }
  }

  newRentClick = () => nav.to(`/${this.props.pageBase.garage}/admin/finance/newRent`)

  editRent = id => nav.to(`/${this.props.pageBase.garage}/admin/finance/${id}/editRent`)

  toPaypalSettings = () => this.props.actions.paypalClick()

  toCsobSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/finance/csob`)

  submitForm = () => this.checkSubmitable() && this.props.actions.submitGarage(this.props.params.id)

  checkSubmitable = () => {
    const { state } = this.props

    if (state.vat === undefined || state.vat === '') return false
    if (state.invoiceRow === undefined || state.invoiceRow === '') return false
    if (state.simplyfiedInvoiceRow === undefined || state.simplyfiedInvoiceRow === '') return false
    return true
  }

  render() {
    const { state, pageBase, actions } = this.props
    const rentSchema = [
      { key: 'name', title: t([ 'garages', 'rentName' ]), comparator: 'string', sort: 'asc' },
      { key: 'price', title: t([ 'garages', 'price' ]), comparator: 'string' },
      { key: 'place_count', title: t([ 'garages', 'places' ]), comparator: 'string' }
    ]

    const prepareRent = rent => {
      const spoiler = (<div>
        <span className={styles.floatRight}>
          <LabeledRoundButton label={t([ 'garages', 'editRent' ])} content={<span className="fa fa-pencil" aria-hidden="true" />} onClick={() => this.editRent(rent.id)} type="action" />
        </span>
      </div>)

      return update(rent, { spoiler: { $set: spoiler }, price: { $set: `${Math.round(rent.price * 10) / 10} ${rent.currency.symbol}` }, place_count: { $set: rent.place_count + '' } })
    }


    return (
      <PageBase>
        <div className={styles.module}>
          {t([ 'finance', 'paypal' ])}
          <div className={styles.settings}>
            {/* <CallToActionButton label={t([ 'modules', 'setting' ])} state={'inverted'} onClick={this.toPaypalSettings} /> */}
            <Switch on={state.paypal} onClick={this.toPaypalSettings} />
          </div>
        </div>

        <div className={styles.module}>
          {t([ 'finance', 'csob' ])}
          <div className={styles.settings}>
            <CallToActionButton label={t([ 'modules', 'setting' ])} state={'inverted'} onClick={this.toCsobSettings} />
            <Switch on={state.csob} onClick={this.toCsobSettings} />
          </div>
        </div>

        {pageBase.current_user && pageBase.current_user.garage_admin &&
          <div>
            <h2>{t([ 'garages', 'placeRent' ])}</h2>
            <Table schema={rentSchema} data={state.rents.map(prepareRent)} />
            <div className={styles.centerDiv}>
              <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={this.newRentClick} type="action" size="big" />
            </div>
          </div>
        }

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
          </Form>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(FinancePage)
