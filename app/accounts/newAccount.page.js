import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Input    from '../_shared/components/input/Input'
import Form     from '../_shared/components/form/Form'

import styles                     from './newAccount.page.scss'
import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'
import * as pageNewAccountActions from '../_shared/actions/newAccount.actions'


export class NewAccountPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.params.id && this.props.actions.initAccount(this.props.params.id)
  }

  render() {
    const {state, actions} = this.props

    const submitForm       = () => { checkSubmitable() && actions.submitNewAccount(this.props.params.id) }
    const goBack           = () => { nav.to('/accounts') }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const checkSubmitable = () => {
      if (state.name == "") return false
      if (state.line_1 == "") return false
      if (state.city == "") return false
      if (state.postal_code == "") return false
      if (state.country == "") return false

      return true
    }

    const content = <div className={styles.flexBox}>
                      <div className={styles.flexChild}>
                        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
                          <Input onEnter={submitForm} onChange={actions.setName}       label={t(['newAccount', 'name'])}       error={t(['newAccount', 'invalidName'])}        value={state.name}        name="client[name]"       placeholder={t(['newAccount', 'placeholder'])}          highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setIC}         label={t(['newClient', 'IC'])}          error={t(['newClient', 'invalidIC'])}           value={state.ic}          name="client[ic]"         placeholder={t(['newClient', 'ICplaceholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setDIC}        label={t(['newClient', 'DIC'])}         error={t(['newClient', 'invalidDIC'])}          value={state.dic}         name="client[dic]"        placeholder={t(['newClient', 'DICplaceholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setMerchantId} label={t(['newAccount', 'merchant'])}   error={t(['newAccount', 'invalidMerchant'])}    value={state.merchant_id} name="client[merchant]"   placeholder={t(['newAccount', 'placeholderMerchant'])}/>
                          <Input onEnter={submitForm} onChange={actions.setPrivateKey} label={t(['newAccount', 'privateKey'])} error={t(['newAccount', 'invalidPrivateKey'])}  value={state.private_key} name="client[privateKey]" placeholder={t(['newAccount', 'placeholderPrivateKey'])}/>
                          <Input onEnter={submitForm} onChange={actions.setPublicKey}  label={t(['newAccount', 'publicKey'])}  error={t(['newAccount', 'invalidPublicKey'])}   value={state.public_key}  name="client[publicKey]"  placeholder={t(['newAccount', 'placeholderPublicKey'])}/>
                          <Input onEnter={submitForm} onChange={actions.setLine1}      label={t(['addresses', 'line1'])}       error={t(['addresses', 'line1Invalid'])}        value={state.line_1}      name="client[line1]"      placeholder={t(['addresses', 'line1Placeholder'])}      highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setLine2}      label={t(['addresses', 'line2'])}       error={t(['addresses', 'line2Invalid'])}        value={state.line_2}      name="client[line2]"      placeholder={t(['addresses', 'line2Placeholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setCity}       label={t(['addresses', 'city'])}        error={t(['addresses', 'cityInvalid'])}         value={state.city}        name="client[city]"       placeholder={t(['addresses', 'cityPlaceholder'])}       highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setPostalCode} label={t(['addresses', 'postalCode'])}  error={t(['addresses', 'postalCodeInvalid'])}   value={state.postal_code} name="client[postalCode]" placeholder={t(['addresses', 'postalCodePlaceholder'])} highlight={state.highlight}/>
                          <Input onEnter={submitForm} onChange={actions.setState}      label={t(['addresses', 'state'])}       error={t(['addresses', 'stateInvalid'])}        value={state.state}       name="client[state]"      placeholder={t(['addresses', 'statePlaceholder'])}/>
                          <Input onEnter={submitForm} onChange={actions.setCountry}    label={t(['addresses', 'country'])}     error={t(['addresses', 'countryInvalid'])}      value={state.country}     name="client[country]"    placeholder={t(['addresses', 'countryPlaceholder'])}    highlight={state.highlight}/>
                        </Form>
                      </div>
                      <div className={`${styles.flexChild} ${styles.hint}`}>
                        <h3>{t(['newAccount', 'whatIsMerchant'])}</h3>
                        <div>{t(['newAccount', 'merchantDesc'])}</div>
                        <div><img src="../../public/accountGuide/step1.png" /></div>
                        <div>{t(['newAccount', 'merchantDesc2'])}</div>
                        <div><img src="../../public/accountGuide/step2.png" /></div>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    );
  }
}

export default connect(
  state    => ({ state: state.newAccount }),
  dispatch => ({ actions: bindActionCreators(pageNewAccountActions, dispatch) })
)(NewAccountPage)
