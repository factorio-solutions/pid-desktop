import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../../_shared/containers/pageBase/PageBase'
import Input    from '../../_shared/components/input/Input'
import Form     from '../../_shared/components/form/Form'

import * as nav               from '../../_shared/helpers/navigation'
import { t }                  from '../../_shared/modules/localization/localization'
import * as newClientActions  from '../../_shared/actions/newClient.actions'


class NewClientPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.clearForm()
    this.props.params.client_id && this.props.actions.initClient(this.props.params.client_id)
  }

  render() {
    const { state, actions, pageBase } = this.props

    const checkSubmitable = () => {
      if (state.name === '') return false
      if (state.line_1 === '') return false
      if (state.city === '') return false
      if (state.postal_code === '') return false
      if (state.country === '') return false
      return true
    }

    const submitForm = () => checkSubmitable() && actions.submitNewClient(this.props.params.client_id)
    const goBack = () => nav.to(`/${pageBase.garage}/admin/clients`)
    const hightlightInputs = () => actions.toggleHighlight()


    return (
      <PageBase>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
          {pageBase.current_user && pageBase.current_user.pid_admin && <Input
            onEnter={submitForm}
            onChange={actions.setSmsApiToken}
            label={t([ 'newClient', 'SmsApiToken' ])}
            error={t([ 'newClient', 'invalidSmsApiToken' ])}
            value={state.smsApiToken}
            placeholder={t([ 'newClient', 'SmsApiTokenPlaceholder' ])}
          />}
          <Input
            onEnter={submitForm}
            onChange={actions.setIC}
            label={t([ 'newClient', 'IC' ])}
            error={t([ 'newClient', 'invalidIC' ])}
            value={state.ic}
            placeholder={t([ 'newClient', 'ICplaceholder' ])}
            onBlur={actions.loadFromIc}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setName}
            label={t([ 'newClient', 'name' ]) + ' *'}
            error={t([ 'newClient', 'invalidName' ])}
            value={state.name}
            placeholder={t([ 'newClient', 'placeholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setDIC}
            label={t([ 'newClient', 'DIC' ])}
            error={t([ 'newClient', 'invalidDIC' ])}
            value={state.dic}
            placeholder={t([ 'newClient', 'DICplaceholder' ])}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setLine1}
            label={t([ 'addresses', 'line1' ])}
            error={t([ 'addresses', 'line1Invalid' ])}
            value={state.line_1}
            placeholder={t([ 'addresses', 'line1Placeholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setLine2}
            label={t([ 'addresses', 'line2' ])}
            error={t([ 'addresses', 'line2Invalid' ])}
            value={state.line_2}
            placeholder={t([ 'addresses', 'line2Placeholder' ])}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setCity}
            label={t([ 'addresses', 'city' ])}
            error={t([ 'addresses', 'cityInvalid' ])}
            value={state.city}
            placeholder={t([ 'addresses', 'cityPlaceholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setPostalCode}
            label={t([ 'addresses', 'postalCode' ])}
            error={t([ 'addresses', 'postalCodeInvalid' ])}
            value={state.postal_code}
            placeholder={t([ 'addresses', 'postalCodePlaceholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setState}
            label={t([ 'addresses', 'state' ])}
            error={t([ 'addresses', 'stateInvalid' ])}
            value={state.state}
            placeholder={t([ 'addresses', 'statePlaceholder' ])}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setCountry}
            label={t([ 'addresses', 'country' ])}
            error={t([ 'addresses', 'countryInvalid' ])}
            value={state.country}
            placeholder={t([ 'addresses', 'countryPlaceholder' ])}
            highlight={state.highlight}
          />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.newClient, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newClientActions, dispatch) })
)(NewClientPage)
