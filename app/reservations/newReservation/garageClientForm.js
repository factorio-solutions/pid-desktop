import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Dropdown from '../../_shared/components/dropdown/Dropdown'

import {
  downloadGarage,
  setPaidByHost,
  setClientId
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
    if (state.user && state.user.availableGarages.length === 1) {
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
      onClick: () => actions.setClientId(state.user.availableClients[index].id)
    })) || []
  }

  render() {
    const { state, actions, editable } = this.props

    const places = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.places ], []) : []
    const selectedPlace = places.findById(state.place_id)

    return (
      <div>
        <Dropdown
          editable={editable}
          label={t([ 'newReservation', 'selectGarage' ])}
          content={this.garageDropdown()}
          selected={state.user.availableGarages.findIndexById(state.garage && state.garage.id)}
          style="reservation"
          highlight={state.highlight}
          placeholder={t([ 'newReservation', 'selectGarage' ])}
        />
        {state.user && state.user.availableClients && state.user.availableClients.length > 1 &&
          <Dropdown
            editable={editable}
            label={t([ 'newReservation', 'selectClient' ])}
            content={this.clientDropdown()}
            selected={state.user.availableClients.findIndexById(state.client_id)}
            style="reservation"
            filter
            placeholder={t([ 'newReservation', 'selectClient' ])}
          />
        }
        {state.garage && state.garage.has_payment_gate && state.client_id && selectedPlace && selectedPlace.go_internal &&
          <div>
            <input
              type="checkbox"
              checked={state.paidByHost}
              onChange={() => actions.setPaidByHost(!state.paidByHost)}
            />
            {t([ 'newReservation', 'paidByHost' ])}
          </div>
        }
      </div>
    )
  }
}

export default connect(
  state => {
    const { user, highlight, paidByHost, garage, client_id, place_id } = state.newReservation
    return { state: { user, highlight, paidByHost, garage, client_id, place_id } }
  },
  dispatch => ({ actions: bindActionCreators(
    { downloadGarage,
      setPaidByHost,
      setClientId
    },
    dispatch
  )
  })
)(GarageClientForm)
