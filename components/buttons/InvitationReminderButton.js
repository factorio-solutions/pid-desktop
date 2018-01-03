import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from '../../helpers/requestPromise'

import LabeledRoundButton from './LabeledRoundButton'

import { setError, setSuccess } from '../../actions/pageBase.actions'
import { t } from '../../modules/localization/localization'


class InvitationReminderButton extends Component {
  static propTypes = {
    userId:   PropTypes.number.isRequired,
    clientId: PropTypes.number,
    garageId: PropTypes.number,
    carId:    PropTypes.number,
    actions:  PropTypes.array.isRequired
  }

  static defaultProps = {
    clientId: null,
    garageId: null,
    carId:    null
  }

  render() {
    const { userId, clientId, garageId, carId, actions } = this.props

    const resendClick = () => {
      request(`mutation resendInvitation($user_id: Id!, $client_id: Id, $car_id: Id, $garage_id: Id) {
        resend_invitation(user_id: $user_id, client_id: $client_id, car_id: $car_id, garage_id: $garage_id)
      }`, {
        user_id:   userId,
        client_id: clientId,
        garage_id: garageId,
        car_id:    carId
      }).then(data => {
        if (data.resend_invitation === null) {
          actions.setError(t([ 'clientUsers', 'userNotFound' ]))
        } else {
          actions.setSuccess(t([ 'clientUsers', 'resendSuccessfull' ]))
        }
      })
    }

    return <LabeledRoundButton label={t([ 'clientUsers', 'resendInvitation' ])} content={<span className="fa fa-repeat" aria-hidden="true" />} onClick={resendClick} type="action" />
  }
}

export default connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators({ setSuccess, setError }, dispatch) })
)(InvitationReminderButton)
