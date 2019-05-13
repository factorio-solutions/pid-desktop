import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import CallToActionButton from '../../../_shared/components/buttons/CallToActionButton'
import Switch             from '../../../_shared/components/switch/Switch'

import * as nav            from '../../../_shared/helpers/navigation'
import { parseParameters } from '../../../_shared/helpers/parseUrlParameters'
import { t }               from '../../../_shared/modules/localization/localization'
import * as financeActions from '../../../_shared/actions/admin.finance.actions'

import styles from '../finance.page.scss'


class PaymentGatesTab extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    params:   PropTypes.object,
    actions:  PropTypes.object,
    location: PropTypes.object
  }

  componentDidMount() {
    const { actions, location, params } = this.props
    const query = parseParameters(location.search)
    if (query.hasOwnProperty('request_token')) { // got request token => Permissions granted -> update account
      actions.upadteAccountPaypal(query)
    }
    actions.initFinance(params.id)
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      this.props.actions.initFinance(nextProps.pageBase.garage)
    }
  }

  toPaypalSettings = () => this.props.actions.paypalClick()

  toCsobSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/finance/csob`)

  toGpWebpaySettings = () => nav.to(`/${this.props.pageBase.garage}/admin/finance/GpWebpay`)

  render() {
    const { state, actions } = this.props

    return (
      <div>
        <div className={styles.module}>
          {t([ 'finance', 'paypal' ])}
          <div className={styles.settings}>
            <Switch on={state.paypal} onClick={this.toPaypalSettings} />
          </div>
        </div>

        <div className={styles.module}>
          {t([ 'finance', 'csob' ])}
          <div className={styles.settings}>
            <CallToActionButton label={t([ 'modules', 'setting' ])} state="inverted" onClick={this.toCsobSettings} />
            <Switch on={state.csob} onClick={state.csob ? actions.disableAccountCsob : this.toCsobSettings} />
          </div>
        </div>

        <div className={styles.module}>
          {t([ 'finance', 'gpWebpay' ])}
          <div className={styles.settings}>
            <CallToActionButton label={t([ 'modules', 'setting' ])} state="inverted" onClick={this.toGpWebpaySettings} />
            <Switch on={state.gp_webpay} onClick={state.gp_webpay ? actions.disableAccountGpWebpay : this.toGpWebpaySettings} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(PaymentGatesTab)
