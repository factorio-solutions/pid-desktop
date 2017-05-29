import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase    from '../../_shared/containers/pageBase/PageBase'
import Input       from '../../_shared/components/input/Input'
import Form        from '../../_shared/components/form/Form'
import RoundButton from '../../_shared/components/buttons/RoundButton'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as financeActions      from '../../_shared/actions/admin.finance.actions'

import styles from './csob.page.scss'


export class CsobPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    // if (this.props.state.account_id == undefined) nav.to(`/${this.props.pageBase.garage}/admin/finance`)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const goBack = () => { nav.to(`/${pageBase.garage}/admin/finance`)}
    const submitForm = () => { checkSubmitable() && actions.updateCsobAccount() }

    const checkSubmitable = () => {
      if (state.csob_merchant_id=="" || state.csob_private_key=="") return false

      return true
    }

    return (
      <PageBase>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
          <h2>{t(['finance', 'csobPayment'])}</h2>
          <Input onEnter={submitForm} onChange={actions.setCsobMerchantId} label={t(['newAccount', 'csobMerchantID'])} error={t(['newAccount', 'invalidMerchantId'])} value={state.csob_merchant_id} name="client[merchantId]" placeholder={t(['newAccount', 'csobMerchantIdplaceholder'])}/>
          <label>{t(['finance', 'SelectPrivateKey'])}</label>
          <Input style={styles.hidden} onChange={actions.setCsobPrivateKey} label='file' type="file" name={`newAccountPrivateKey`} accept=".key" />
          <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={() => { document.getElementsByName(`newAccountPrivateKey`)[0].click() }} type={state.csob_private_key===""?'action':'confirm'} />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.adminFinance, pageBase: state.pageBase }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(CsobPage)
