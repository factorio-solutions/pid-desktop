import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase    from '../_shared/containers/pageBase/PageBase'
import Input       from '../_shared/components/input/Input'
import Form        from '../_shared/components/form/Form'
import RoundButton from '../_shared/components/buttons/RoundButton'

import styles                     from './newAccount.page.scss'
import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'
import * as pageNewAccountActions from '../_shared/actions/newAccount.actions'
import { setError }               from '../_shared/actions/pageBase.actions'


export class NewAccountPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    const { actions, location, params } = this.props
    actions.clearForm()

    if (location.query.hasOwnProperty('request_token')){ // got request token => Permissions granted -> create account
      actions.createAccount(location.query)
    } else {
      if (location.query.hasOwnProperty('name')){ // has parameters in URL => Permissions not granted -> prefill form
        actions.setName(location.query.name)
        actions.setPaymentProcess('paypal')
        actions.setIC(location.query.ic)
        actions.setDIC(location.query.dic)
        actions.setLine1(location.query.line_1)
        actions.setLine2(location.query.line_2)
        actions.setCity(location.query.city)
        actions.setPostalCode(location.query.postal_code)
        actions.setState(location.query.state)
        actions.setCountry(location.query.country)
        actions.setError(t(['newAccount', 'permissionNotGranted']))
      } else { // no url parameters, if has id in propos.params, load info about account
        params.id && actions.initAccount(params.id)
      }
    }
  }

  render() {
    const {state, actions} = this.props

    const submitForm       = () => { checkSubmitable() && actions.submitNewAccount(this.props.params.id) }
    const goBack           = () => { nav.to('/accounts') }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const checkSubmitable = () => {
      if (state.name == "") return false
      if (state.line_1 == "") return false
      if (state.payments_process == undefined) return false
      if (state.payments_process=='csob' && (state.csob_merchant_id=="" || state.csob_private_key=="")) return false
      if (state.city == "") return false
      if (state.postal_code == "") return false
      if (state.country == "") return false

      return true
    }

    const content = <div className={styles.flexBox}>
                      <div className={styles.flexChild}>
                        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
                          <Input onEnter={submitForm} onChange={actions.setName}       label={t(['newAccount', 'name'])}       error={t(['newAccount', 'invalidName'])}        value={state.name}        name="client[name]"       placeholder={t(['newAccount', 'placeholder'])}          highlight={state.highlight}/>
                          <div className={styles.payments}>
                            <label>{t(['newAccount', 'selectPaymentMethod'])}</label>
                            <div>
                              <img className={`${styles.brand} ${state.payments_process=='csob' && styles.brandSelected}`} src='../../public/logo/csob-logo.png' onClick={()=>{actions.setPaymentProcess('csob')}}/>
                              <img className={`${styles.brand} ${state.payments_process=='paypal' && styles.brandSelected}`} src='../../public/logo/paypal-logo.png' onClick={()=>{actions.setPaymentProcess('paypal')}}/>
                            </div>
                            {state.payments_process === 'csob' && <div>
                              <label>{t(['newAccount', 'csobPayment'])}</label>
                              <Input onEnter={submitForm} onChange={actions.setCsobMerchantId} label={t(['newAccount', 'csobMerchantID'])} error={t(['newAccount', 'invalidMerchantId'])} value={state.csob_merchant_id} name="client[merchantId]" placeholder={t(['newAccount', 'csobMerchantIdplaceholder'])}/>
                              <label>{t(['newAccount', 'SelectPrivateKey'])}</label>
                              <Input style={styles.hidden} onChange={actions.setCsobPrivateKey} label='file' type="file" name={`newAccountPrivateKey`} accept=".key" />
                              <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={() => { document.getElementsByName(`newAccountPrivateKey`)[0].click() }} type={state.csob_private_key===""?'action':'confirm'} />
                            </div>}
                            {state.payments_process === 'paypal' && <div>
                              <label>{t(['newAccount', 'paypalPayment'])}</label>
                            </div>}
                          </div>
                          <Input onEnter={submitForm} onChange={actions.setIC}         label={t(['newClient', 'IC'])}          error={t(['newClient', 'invalidIC'])}           value={state.ic}          name="client[ic]"         placeholder={t(['newClient', 'ICplaceholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setDIC}        label={t(['newClient', 'DIC'])}         error={t(['newClient', 'invalidDIC'])}          value={state.dic}         name="client[dic]"        placeholder={t(['newClient', 'DICplaceholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setLine1}      label={t(['addresses', 'line1'])}       error={t(['addresses', 'line1Invalid'])}        value={state.line_1}      name="client[line1]"      placeholder={t(['addresses', 'line1Placeholder'])}      highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setLine2}      label={t(['addresses', 'line2'])}       error={t(['addresses', 'line2Invalid'])}        value={state.line_2}      name="client[line2]"      placeholder={t(['addresses', 'line2Placeholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setCity}       label={t(['addresses', 'city'])}        error={t(['addresses', 'cityInvalid'])}         value={state.city}        name="client[city]"       placeholder={t(['addresses', 'cityPlaceholder'])}       highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setPostalCode} label={t(['addresses', 'postalCode'])}  error={t(['addresses', 'postalCodeInvalid'])}   value={state.postal_code} name="client[postalCode]" placeholder={t(['addresses', 'postalCodePlaceholder'])} highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setState}      label={t(['addresses', 'state'])}       error={t(['addresses', 'stateInvalid'])}        value={state.state}       name="client[state]"      placeholder={t(['addresses', 'statePlaceholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setCountry}    label={t(['addresses', 'country'])}     error={t(['addresses', 'countryInvalid'])}      value={state.country}     name="client[country]"    placeholder={t(['addresses', 'countryPlaceholder'])}    highlight={state.highlight}/>
                        </Form>
                      </div>


                      {this.props.params.id ?
                        <div className={`${styles.flexChild} ${styles.hint}`}>
                          <h3>{t(['newAccount', 'updateProcess'])}</h3>
                          {state.payments_process === 'paypal' && <div>
                            <div>{t(['newAccount', 'merchantUpdateDesc'])}</div>
                            <img className={styles.hintImg} src="../../public/accountGuide/step2.png" />
                          </div>}
                          {state.payments_process === 'csob' && <div>
                            <div>{t(['newAccount', 'merchantUpdateCsobDesc'])}</div>
                          </div>}

                        </div>
                        :
                        <div className={`${styles.flexChild} ${styles.hint}`}>
                          <h3>{t(['newAccount', 'whatIsMerchant'])}</h3>
                          {state.payments_process === undefined && <div>{t(['newAccount', 'start'])}</div>}
                          {state.payments_process === 'csob' && <div>
                            <div>{t(['newAccount', 'csobMerchantDesc'])}</div>
                            <div>{t(['newAccount', 'csobMerchantDesc2'])}</div>
                          </div>}
                          {state.payments_process === 'paypal' && <div>
                            <div>{t(['newAccount', 'merchantDesc'])}</div>
                            <img className={styles.hintImg} src="../../public/accountGuide/step1.png" />
                            <div>{t(['newAccount', 'merchantDesc2'])}</div>
                            <img className={styles.hintImg} src="../../public/accountGuide/step2.png" />
                          </div>}

                        </div>
                      }
                    </div>

    return (
      <PageBase content={content} />
    );
  }
}

export default connect(
  state    => ({ state: state.newAccount }),
  dispatch => ({ actions: bindActionCreators({ ...pageNewAccountActions, setError}, dispatch) })
)(NewAccountPage)
