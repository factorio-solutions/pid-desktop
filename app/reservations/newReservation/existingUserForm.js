import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Input    from '../../_shared/components/input/Input'
import Dropdown from '../../_shared/components/dropdown/Dropdown'

import { setCarId, setCarLicencePlate } from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import inputStyle from '../../_shared/components/input/ReservationInput.scss'

class ExistingUserForm extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    editable: PropTypes.bool
  }

  carDropdown = () => {
    const { state, actions } = this.props
    return (state.user && state.user.reservable_cars && state.user.reservable_cars.map((car, index) => ({
      label:   car.name,
      onClick: () => actions.setCarId(state.user.reservable_cars[index].id)
    }))) || []
  }

  render() {
    const { state, actions, editable } = this.props
    return (
      <div>
        { state.user.reservable_cars && state.user.reservable_cars.length === 0 ?
          <Input
            readOnly={!editable}
            onChange={actions.setCarLicencePlate}
            value={state.carLicencePlate}
            label={t([ 'newReservation', 'licencePlate' ])}
            error={t([ 'newReservation', 'licencePlateInvalid' ])}
            placeholder={t([ 'newReservation', 'licencePlatePlaceholder' ])}
            type="text"
            align="left"
            // highlight={state.highlight && state.user.id !== -2}
            style={inputStyle}
          /> :
          <Dropdown
            editable={editable}
            placeholder={`${t([ 'newReservation', 'selectCar' ])} *`}
            content={this.carDropdown()}
            selected={state.user && state.user.reservable_cars && state.user.reservable_cars.findIndexById(state.car_id)}
            style="reservation"
            highlight={state.highlight}
            label={`${t([ 'newReservation', 'selectCarLabel' ])} *`}
          />
        }
      </div>
    )
  }
}

export default connect(
  state => {
    const { user, car_id, carLicencePlate, highlight, reservation } = state.newReservation
    return { state: { user, car_id, carLicencePlate, highlight, reservation } }
  },
  dispatch => ({ actions: bindActionCreators({ setCarId, setCarLicencePlate }, dispatch) })
)(ExistingUserForm)
