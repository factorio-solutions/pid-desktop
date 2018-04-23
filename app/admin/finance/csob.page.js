import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Input              from '../../_shared/components/input/Input'
import Form               from '../../_shared/components/form/Form'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'

import * as nav            from '../../_shared/helpers/navigation'
import { t }               from '../../_shared/modules/localization/localization'
import * as financeActions from '../../_shared/actions/admin.finance.actions'

import styles from './csob.page.scss'


class CsobPage extends Component {
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

  checkSubmitable = () => {
    const { state } = this.props
    if (state.csob_merchant_id === '' || state.csob_private_key === '') return false
    return true
  }

  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/finance`)

  submitForm = () => this.checkSubmitable() && this.props.actions.enableCsobAccount()

  render() {
    const { state, actions } = this.props
    return (
      <PageBase>
        <Form onSubmit={this.submitForm} submitable={this.checkSubmitable()} onBack={this.goBack} onHighlight={actions.toggleHighlight}>
          <h2>{t([ 'finance', 'csobPayment' ])}</h2>
          <Input
            onEnter={this.submitForm}
            onChange={actions.setCsobMerchantId}
            label={t([ 'newAccount', 'csobMerchantID' ])}
            error={t([ 'newAccount', 'invalidMerchantId' ])}
            value={state.csob_merchant_id}
            placeholder={t([ 'newAccount', 'csobMerchantIdplaceholder' ])}
            highlight={state.highlight}
          />
          <label className={state.highlight && styles.red}>{t([ 'finance', 'SelectPrivateKey' ])}: </label>
          <Input style={styles.hidden} onChange={actions.setCsobPrivateKey} label="file" type="file" name={'newAccountPrivateKey'} accept=".key" />
          <LabeledRoundButton
            label={t([ 'finance', 'uploadKey' ])}
            content={<span className="fa fa-file-code-o" aria-hidden="true" />}
            onClick={() => { document.getElementsByName('newAccountPrivateKey')[0].click() }}
            type={state.csob_private_key === '' ? 'action' : 'confirm'}
          />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) })
)(CsobPage)
