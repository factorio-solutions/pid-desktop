import React, { PureComponent, PropTypes } from 'react'
import { connect }                         from 'react-redux'
import { bindActionCreators }              from 'redux'

import LabeledRoundButton from './LabeledRoundButton'

import { setError, setSuccess } from '../../actions/pageBase.actions'
import request                  from '../../helpers/requestPromise'
import { t }                    from '../../modules/localization/localization'


class InvitationReminderButton extends PureComponent {
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

  resendClick = () => {
    const { userId, clientId, garageId, carId, actions } = this.props

    request(`mutation resendInvitation($user_id: Id!, $client_id: Id, $car_id: Id, $garage_id: Id) {
      resend_invitation(user_id: $user_id, client_id: $client_id, car_id: $car_id, garage_id: $garage_id)
    }`, {
      user_id:   userId,
      client_id: clientId,
      garage_id: garageId,
      car_id:    carId
    }).then(data => data.resend_invitation
      ? actions.setSuccess(t([ 'clientUsers', 'resendSuccessfull' ]))
      : actions.setError(t([ 'clientUsers', 'userNotFound' ]))
    )
  }

  render() {
    const content = <span className="fa fa-repeat" aria-hidden="true" />

    return (<LabeledRoundButton
      label={t([ 'clientUsers', 'resendInvitation' ])}
      content={content}
      onClick={this.resendClick}
      type="action"
    />)
  }
}

export default connect(
  undefined,
  dispatch => ({ actions: bindActionCreators({ setSuccess, setError }, dispatch) })
)(InvitationReminderButton)
