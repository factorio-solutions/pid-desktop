import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import Modal       from '../../components/modal/Modal'
import RoundButton from '../../components/buttons/RoundButton'

import { t }    from '../../modules/localization/localization'
import * as nav from '../../helpers/navigation'

import styles from './PageBase.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
import { logout }           from '../../actions/login.actions'


class PageBase extends Component {
  static propTypes = {
    state:         PropTypes.object,
    actions:       PropTypes.object,
    notifications: PropTypes.object,
    children:      PropTypes.object
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.state.garage !== this.props.state.garage && this.props.actions.initialPageBase()
  }

  render() {
    const {
      state, actions, notifications, scrollbarVisible, children
    } = this.props

    const profileDropdown = [
      (
        <div className={styles.dropdownContent} onClick={() => nav.to('/profile')}>
          <i className="icon-profile" aria-hidden="true" />
          {t([ 'pageBase', 'Profile' ])}
        </div>
      ),
      state.current_user && state.current_user.pid_admin && (
        <div className={styles.dropdownContent} onClick={() => nav.to('/pid-admin')}>
          <i className="fa fa-wrench" aria-hidden="true" />
          {t([ 'pageBase', 'pidAdmin' ])}
        </div>
      ),
      (
        <div className={styles.dropdownContent} onClick={actions.logout}>
          <i className="fa fa-sign-out" aria-hidden="true" />
          {t([ 'pageBase', 'Logout' ])}
        </div>
      )
    ].filter(field => field)

    const notificationsModalClick = () => actions.setShowModal(false)

    const errorContent = (
      <div style={{ textAlign: 'center' }}>
        {t([ 'pageBase', 'error' ])}
        {':'}
        <br />
        {state.error}
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={actions.setError}
          type="confirm"
        />
      </div>
    )

    const successContent = (
      <div style={{ textAlign: 'center' }}>
        {t([ 'pageBase', 'success' ])}
        {':'}
        <br />
        {state.success}
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={actions.setSuccess}
          type="confirm"
        />
      </div>
    )

    const notificationsModal = (
      <div style={{ textAlign: 'center' }}>
        {t([ 'pageBase', 'unredNotifications' ], { count: notifications.count })}
        {'.'}
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={notificationsModalClick}
          type="confirm"
        />
      </div>
    )

    return (
      <div>
        <Modal content={errorContent} show={state.error !== undefined} />
        <Modal content={successContent} show={state.success !== undefined} />
        <Modal content={notificationsModal} show={notifications.count > 0 && state.notificationsModal} />
        <Modal content={state.custom_modal} show={state.custom_modal !== undefined} />
        {children}
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.pageBase, notifications: state.notifications }),
  dispatch => ({ actions: bindActionCreators({ ...pageBaseActions, logout }, dispatch) })
)(PageBase)
