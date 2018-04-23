import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Input              from '../../_shared/components/input/Input'
import Form               from '../../_shared/components/form/Form'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as financeActions      from '../../_shared/actions/admin.finance.actions'

import styles from './csob.page.scss'


class GpWebpayPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    pageBase: PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initFinance(this.props.params.id)
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      this.props.actions.initFinance(nextProps.pageBase.garage)
    }
  }

  checkSubmitable = () => {
    const { state } = this.props
    return state.csob_merchant_id !== '' && state.csob_private_key !== ''
  }

  render() {
    const { state, pageBase, actions } = this.props

    const goBack = () => { nav.to(`/${pageBase.garage}/admin/finance`) }
    const submitForm = () => { this.checkSubmitable() && actions.updateGpWebpayAccount() }

    return (
      <PageBase>
        <Form
          onSubmit={submitForm}
          submitable={this.checkSubmitable()}
          onBack={goBack}
          onHighlight={actions.toggleHighlight}
        ><h2>{t([ 'finance', 'csobPayment' ])}</h2>
          <Input
            onEnter={submitForm}
            onChange={actions.setGpWebpayMerchantId}
            label={t([ 'newAccount', 'csobMerchantID' ])}
            error={t([ 'newAccount', 'invalidMerchantId' ])}
            value={state.gp_webpay_merchant_id}
            name="client[merchantId]"
            placeholder={t([ 'newAccount', 'csobMerchantIdplaceholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setGpWebpayPassword}
            label={t([ 'newAccount', 'gpWebpayPassword' ])}
            error={t([ 'newAccount', 'invalidGpWebpayPassword' ])}
            value={state.gp_webpay_password}
            name="client[password]"
            placeholder={t([ 'newAccount', 'gpWebPayplaceholder' ])}
            highlight={state.highlight}
          />
          <label className={state.highlight && styles.red}>
            {t([ 'finance', 'SelectPrivateKey' ])}:
          </label>
          <Input
            style={styles.hidden}
            onChange={actions.setGpWebpayPrivateKey}
            label="file"
            type="file"
            name={`newAccountPrivateKey`}
            accept=".key"
          />
          <LabeledRoundButton
            label={t([ 'finance', 'uploadKey' ])}
            content={<span className="fa fa-file-code-o" aria-hidden="true" />}
            onClick={() => { document.getElementsByName(`newAccountPrivateKey`)[0].click() }}
            type={state.gp_webpay_private_key === '' ? 'action' : 'confirm'}
          />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) })
)(GpWebpayPage)
