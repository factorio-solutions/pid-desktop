import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Input         from '../../../_shared/components/input/Input'
import Form          from '../../../_shared/components/form/Form'
import ClientModules from './clientModules.page'

import { t }                      from '../../../_shared/modules/localization/localization'
import * as minMaxDurationActions from '../../../_shared/actions/admin.clientMinMaxDuration.actions'


class SmsSettingsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    params:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initMinMaxDuration(+this.props.params.client_id)
  }

  submitMinMaxDuration = () => this.props.actions.submitMinMaxDuration(+this.props.params.client_id)

  render() {
    const { state, actions } = this.props
    return (
      <ClientModules params={this.props.params}>
        <Form
          onSubmit={this.submitMinMaxDuration}
          submitable
        >
          <Input
            onChange={actions.setMinReservationDuration}
            value={state.minReservationDuration === null ? '' : String(state.minReservationDuration)}
            label={t([ 'newPricing', 'minReservationDuration' ])}
            error={t([ 'newPricing', 'durationErr' ])}
            placeholder={t([ 'newPricing', 'minReservationDurationPlaceholder' ])}
            type="number"
            min="15"
            step="15"
            onBlur={actions.checkMinReservationDuration}
          />
          <Input
            onChange={actions.setMaxReservationDuration}
            value={state.maxReservationDuration}
            label={t([ 'newPricing', 'maxReservationDuration' ])}
            error={t([ 'newPricing', 'durationErr' ])}
            placeholder={t([ 'newPricing', 'maxReservationDurationPlaceholder' ])}
            type="number"
            min="15"
            step="15"
            onBlur={actions.checkMaxReservationDuration}
          />
        </Form>
      </ClientModules>
    )
  }
}

export default connect(
  state => ({ state: state.clients }),
  dispatch => ({ actions: bindActionCreators(minMaxDurationActions, dispatch) })
)(SmsSettingsPage)
