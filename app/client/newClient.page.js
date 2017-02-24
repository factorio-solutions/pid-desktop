import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Input    from '../_shared/components/input/Input'
import Form     from '../_shared/components/form/Form'

import * as nav               from '../_shared/helpers/navigation'
import { t }                  from '../_shared/modules/localization/localization'
import * as newClientActions from '../_shared/actions/newClient.actions'

import styles from './newClient.page.scss'


export class NewClientPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    // this.props.actions.setName('')
    this.props.actions.clearForm()
    this.props.params.id && this.props.actions.initClient(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitNewClient(this.props.params.id)
    }

    const goBack = () => {
      nav.to('/clients')
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      if (state.line_1 == "") return false
      if (state.city == "") return false
      if (state.postal_code == "") return false
      if (state.country == "") return false

      return true
    }

    const content = <div>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <Input onEnter={submitForm} onChange={actions.setName}       label={t(['newClient', 'name'])}       error={t(['newClient', 'invalidName'])}       value={state.name}        name="client[name]"       placeholder={t(['newClient', 'placeholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setIC}         label={t(['newClient', 'IC'])}         error={t(['newClient', 'invalidIC'])}         value={state.ic}          name="client[ic]"         placeholder={t(['newClient', 'ICplaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setDIC}        label={t(['newClient', 'DIC'])}        error={t(['newClient', 'invalidDIC'])}        value={state.dic}         name="client[dic]"        placeholder={t(['newClient', 'DICplaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setLine1}      label={t(['addresses', 'line1'])}      error={t(['addresses', 'line1Invalid'])}      value={state.line_1}      name="client[line1]"      placeholder={t(['addresses', 'line1Placeholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setLine2}      label={t(['addresses', 'line2'])}      error={t(['addresses', 'line2Invalid'])}      value={state.line_2}      name="client[line2]"      placeholder={t(['addresses', 'line2Placeholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setCity}       label={t(['addresses', 'city'])}       error={t(['addresses', 'cityInvalid'])}       value={state.city}        name="client[city]"       placeholder={t(['addresses', 'cityPlaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setPostalCode} label={t(['addresses', 'postalCode'])} error={t(['addresses', 'postalCodeInvalid'])} value={state.postal_code} name="client[postalCode]" placeholder={t(['addresses', 'postalCodePlaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setState}      label={t(['addresses', 'state'])}      error={t(['addresses', 'stateInvalid'])}      value={state.state}       name="client[state]"      placeholder={t(['addresses', 'statePlaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setCountry}    label={t(['addresses', 'country'])}    error={t(['addresses', 'countryInvalid'])}    value={state.country}     name="client[country]"    placeholder={t(['addresses', 'countryPlaceholder'])}/>
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.newClient }),
  dispatch => ({ actions: bindActionCreators(newClientActions, dispatch) })
)(NewClientPage)
