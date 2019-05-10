import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Input    from '../../_shared/components/input/Input'
import Form     from '../../_shared/components/form/Form'

import * as nav              from '../../_shared/helpers/navigation'
import { t }                 from '../../_shared/modules/localization/localization'
import * as newClientActions from '../../_shared/actions/newClient.actions'
import { toAdminClients }    from '../../_shared/actions/pageBase.actions'


class NewClientPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    match:    PropTypes.object
  }

  componentDidMount() {
    const { actions, match: { params } } = this.props
    actions.clearForm()
    params.client_id && actions.initClient(params.client_id)
  }

  checkSubmitable = () => {
    if (this.props.state.name === '') return false
    if (this.props.state.line_1 === '') return false
    if (this.props.state.city === '') return false
    if (this.props.state.postal_code === '') return false
    if (this.props.state.country === '') return false
    return true
  }

  submitForm = () => this.checkSubmitable() && this.props.actions.submitNewClient(this.props.match.params.client_id)

  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/clients`)

  render() {
    const { state, actions } = this.props

    return (
      <Form
        onSubmit={this.submitForm}
        submitable={this.checkSubmitable()}
        onBack={this.goBack}
        onHighlight={actions.toggleHighlight}
      >
        <Input
          onEnter={this.submitForm}
          onChange={actions.setIC}
          label={t([ 'newClient', 'IC' ])}
          error={t([ 'newClient', 'invalidIC' ])}
          value={state.ic}
          placeholder={t([ 'newClient', 'ICplaceholder' ])}
          onBlur={actions.loadFromIc}
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
    )
  }
}

const enhancers = compose(
  withMasterPageConf(() => {
    const { hash } = window.location
    const tag = hash.includes('edit') ? 'editClient' : 'newClient'

    return toAdminClients(tag)
  }),
  connect(
    state => ({ state: state.newClient, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators(newClientActions, dispatch) })
  )
)

export default enhancers(NewClientPage)
