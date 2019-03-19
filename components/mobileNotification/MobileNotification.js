import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RoundButton from '../buttons/RoundButton'

import styles from './MobileNotification.scss'

import * as notificationsActions from '../../actions/notifications.actions'
import { t } from '../../modules/localization/localization'


export class MobileNotification extends Component {
  static propTypes = {
    notification: PropTypes.object,
    actions:      PropTypes.object
  }

  returnMessage(message) {
    const parts = message.split(';')
    return t([ 'notifications', parts[0] ], { arg1: parts[1] || '', arg2: parts[2] || '' })
  }

  render() {
    const { notification, actions } = this.props
    return (
      <div className={styles.notification}>
        <div className={styles.header}>{notification.creator.full_name}</div>
        <div className={styles.header}>{notification.creator.email}</div>

        <div className={styles.body}>
          {this.returnMessage(notification.message)}
        </div>

        <div className={styles.notificationsButtons}>
          {notification.notification_type.indexOf('No') !== -1 && (
            <RoundButton
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={() => { actions.decline(notification) }}
              type="remove"
              question="Are you sure you want to decline?"
            />
          )}
          {notification.notification_type.indexOf('Yes') !== -1 && (
            <RoundButton
              content={<span className="fa fa-check" aria-hidden="true" />}
              onClick={() => { actions.accept(notification) }}
              type="confirm"
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators(notificationsActions, dispatch) })
)(MobileNotification)
