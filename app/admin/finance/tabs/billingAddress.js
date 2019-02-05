import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Form  from '../../../_shared/components/form/Form'
import Input from '../../../_shared/components/input/Input'

import * as billinAddressActions from '../../../_shared/actions/admin.billingAddress.actions'
import { t }                     from '../../../_shared/modules/localization/localization'


class BillingAddressTab extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initialize()
  }

  checkSubmitable = () => {
    if (this.props.state.line_1 === '') return false
    if (this.props.state.city === '') return false
    if (this.props.state.postal_code === '') return false
    if (this.props.state.country === '') return false
    return true
  }

  submitForm = () => this.checkSubmitable() && this.props.actions.submitBillingAddress()

  render() {
    const { state, actions } = this.props
    return (
      <div>
        <Form onSubmit={this.submitForm} submitable={this.checkSubmitable()} onHighlight={actions.toggleHighlight}>
          <Input
            onEnter={this.submitForm}
            onChange={actions.setIC}
            label={t([ 'newClient', 'IC' ])}
            error={t([ 'newClient', 'invalidIC' ])}
            value={state.ic}
            placeholder={t([ 'newClient', 'ICplaceholder' ])}
            onBlur={actions.loadInfoFromIc}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setName}
            label={t([ 'newClient', 'name' ]) + ' *'}
            error={t([ 'newClient', 'invalidName' ])}
            value={state.name}
            placeholder={t([ 'newClient', 'placeholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setDIC}
            label={t([ 'newClient', 'DIC' ])}
            error={t([ 'newClient', 'invalidDIC' ])}
            value={state.dic}
            placeholder={t([ 'newClient', 'DICplaceholder' ])}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setLine1}
            label={t([ 'addresses', 'line1' ]) + ' *'}
            error={t([ 'addresses', 'line1Invalid' ])}
            value={state.line_1}
            placeholder={t([ 'addresses', 'line1Placeholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setLine2}
            label={t([ 'addresses', 'line2' ])}
            error={t([ 'addresses', 'line2Invalid' ])}
            value={state.line_2}
            placeholder={t([ 'addresses', 'line2Placeholder' ])}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setCity}
            label={t([ 'addresses', 'city' ]) + ' *'}
            error={t([ 'addresses', 'cityInvalid' ])}
            value={state.city}
            placeholder={t([ 'addresses', 'cityPlaceholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setPostalCode}
            label={t([ 'addresses', 'postalCode' ]) + ' *'}
            error={t([ 'addresses', 'postalCodeInvalid' ])}
            value={state.postal_code}
            placeholder={t([ 'addresses', 'postalCodePlaceholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setState}
            label={t([ 'addresses', 'state' ])}
            error={t([ 'addresses', 'stateInvalid' ])}
            value={state.state}
            placeholder={t([ 'addresses', 'statePlaceholder' ])}
          />
          <Input
            onEnter={this.submitForm}
            onChange={actions.setCountry}
            label={t([ 'addresses', 'country' ]) + ' *'}
            error={t([ 'addresses', 'countryInvalid' ])}
            value={state.country}
            placeholder={t([ 'addresses', 'countryPlaceholder' ])}
            highlight={state.highlight}
          />
        </Form>
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.adminBillingAddress }),
  dispatch => ({ actions: bindActionCreators(billinAddressActions, dispatch) })
)(BillingAddressTab)
