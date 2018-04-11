import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import CallToActionButton from '../../../_shared/components/buttons/CallToActionButton'
import Switch             from '../../../_shared/components/switch/Switch'

import * as nav                 from '../../../_shared/helpers/navigation'
import { t }                    from '../../../_shared/modules/localization/localization'
import * as financeActions      from '../../../_shared/actions/admin.finance.actions'

import styles from '../finance.page.scss'


class PaymentGatesTab extends Component {
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

  toPaypalSettings = () => this.props.actions.paypalClick()

  toCsobSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/finance/csob`)

  render() {
    const { state } = this.props

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
            <CallToActionButton label={t([ 'modules', 'setting' ])} state={'inverted'} onClick={this.toCsobSettings} />
            <Switch on={state.csob} onClick={this.toCsobSettings} />
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
