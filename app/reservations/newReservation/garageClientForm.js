import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Dropdown from '../../_shared/components/dropdown/Dropdown'

import {
  downloadGarage,
  setPaidByHost,
  setClient,
  selectedClient
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'


class GarageClientForm extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    editable: PropTypes.bool
  }

  componentDidMount() {
    const { state, actions } = this.props
    // set garage if there is only one
    if (state.user && state.user.availableGarages && state.user.availableGarages.length === 1) {
      actions.downloadGarage(state.user.availableGarages[0].id)
    }
  }

  garageDropdown = () => {
    const { state, actions } = this.props

    return (state.user && state.user.availableGarages && state.user.availableGarages.map((garage, index) => ({
      label:   garage.name,
      onClick: () => actions.downloadGarage(state.user.availableGarages[index].id)
    }))) || []
  }

  clientDropdown = () => {
    const { state, actions } = this.props
    return state.user.availableClients.map((client, index) => ({
      label:   client.name,
      order:   client.id === undefined && 1,
      onClick: () => actions.setClient(state.user.availableClients[index].id)
    })) || []
  }

  render() {
    const { state, actions, editable } = this.props
    const selectedClient = actions.selectedClient()

    return (
      <div>
        <Dropdown
          editable={editable}
          label={`${t([ 'newReservation', 'garageDropdownLabel' ])} *`}
          content={this.garageDropdown()}
          selected={state.user.availableGarages.findIndexById(state.garage && state.garage.id)}
          style="reservation"
          highlight={state.highlight}
          placeholder={t([ 'newReservation', 'selectGarage' ])}
        />
        {state.user && state.user.availableClients && state.user.availableClients.length > 1 && (
          <Dropdown
            editable={editable}
            label={t([ 'newReservation', 'clientDropdownLabel' ])}
            content={this.clientDropdown()}
            selected={state.user.availableClients.findIndexById(state.client_id)}
            style="reservation"
            filter
            placeholder={t([ 'newReservation', 'selectClient' ])}
          />
        )}
      </div>
    )
  }
}

export default connect(
  state => {
    const { user, highlight, paidByHost, garage, client_id, place_id } = state.newReservation
    const { current_user } = state.pageBase
    return { state: { user, highlight, paidByHost, garage, client_id, place_id, current_user } }
  },
  dispatch => ({ actions: bindActionCreators(
    {
      downloadGarage,
      setPaidByHost,
      setClient,
      selectedClient
    },
    dispatch
  )
  })
)(GarageClientForm)
