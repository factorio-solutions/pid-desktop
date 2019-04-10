import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'

import RequestInProgressError from '../../errors/requestInProgress.error'

import RoundButton      from '../../components/buttons/RoundButton'
import Modal            from '../../components/modal/Modal'

import styles from './Page.scss'

import * as headerActions   from '../../actions/mobile.header.actions'
import * as loginActions    from '../../actions/login.actions'
import { initReservations } from '../../actions/mobile.reservations.actions'
import { checkCurrentVersion } from '../../actions/mobile.version.actions'

import { LOGIN, RESERVATIONS } from '../../../_resources/constants/RouterPaths'

class Page extends Component {
  static propTypes = {
    actions:             PropTypes.object,
    reservationsActions: PropTypes.object,
    loginActions:        PropTypes.object,
    state:               PropTypes.object,
    children:            PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),

    // header looks
    hideHeader:    PropTypes.bool,
    hideDropdown:  PropTypes.bool,
    hideHamburger: PropTypes.bool,
    gray:          PropTypes.bool, // will be gray background and menu

    // navigation functions
    back:        PropTypes.func,
    add:         PropTypes.func,
    ok:          PropTypes.func,
    outlineBack: PropTypes.func
  }

  static defaultProps = {
    gray: false
  }

  static contextTypes = {
    router: PropTypes.object
  }

  async componentDidMount() {
    // 401 status, redirect to login
    window.addEventListener('unauthorizedAccess', this.unauthorizedHandler)
    const {
      state, actions, hideDropdown, hideHeader, hideHamburger, gray
    } = this.props
    actions.setAllHeader(!hideHeader, !hideHamburger, !hideDropdown)
    actions.setShowBottomMenu(gray)
    console.log('init garages call')
    !hideHeader && !hideDropdown && await actions.initGarages()
    actions.checkCurrentVersion()

    state.current_user && !state.current_user.secretary && actions.setPersonal(true)

    console.log('hide splashscreen')
    // actions.hideSplashscreen()
  }

  componentWillReceiveProps(newProps) {
    document.getElementsByTagName('body')[0]
      .style.backgroundColor = newProps.gray ? '#292929' : 'white'
  }

  componentWillUnmount() {
    // 401 status, redirect to login
    window.removeEventListener('unauthorizedAccess', this.unauthorizedHandler)
  }

  onLogoutClick = () => this.logout(true)

  // private method
  logout = revoke => {
    const { actions } = this.props
    const { router } = this.context
    actions.logout(revoke, () => router.push(LOGIN))
  }

  unauthorizedHandler = async () => {
    const {
      state,
      actions,
      loginActions: login,
      reservationsActions
    } = this.props
    const { router } = this.context
    console.log('unauthorizedAccess')
    try {
      await login.refreshLogin()
    } catch (e) {
      if (e instanceof RequestInProgressError) {
        console.log('Refreshing in progress')
        // console.error(e)
      } else {
        console.log('Error while refreshing token. Error:')
        console.error(e)
        this.logout(false)
      }
      return
    }

    router.push(RESERVATIONS)
    await actions.initGarages()
    actions.checkCurrentVersion()
    if (state.current_user && !state.current_user.secretary) {
      actions.setPersonal(true)
    } else {
      reservationsActions.initReservations()
    }
  }

  render() {
    const {
      actions,
      state,
      gray,
      children,
      back,
      add,
      ok,
      outlineBack
    } = this.props

    const errorContent = (
      <div className={styles.errorContent}>
        <div>{state.error}</div>
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={actions.setError}
          type="confirm"
          state={undefined}
        />
      </div>
    )

    return (
      <div className={styles.page}>
        <Modal content={errorContent} show={state.error} />
        <Modal content={state.custom_modal} show={state.custom_modal} zindex={100} />

        {children}

        {back && (
          <div className={`${styles.backButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-chevron-left" />}
              onClick={back}
              state={undefined}
            />
          </div>
        )}
        {outlineBack && (
          <div className={`${styles.backButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-chevron-left" />}
              onClick={outlineBack}
              type="whiteBorder"
              state={undefined}
            />
          </div>
        )}
        {add && (
          <div className={`${styles.addButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-plus" />}
              onClick={add}
              type="action"
              state={!state.online ? 'disabled' : undefined}
            />
          </div>
        )}
        {ok && (
          <div className={`${styles.okButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-check" />}
              onClick={ok}
              type="confirm"
              state={!state.online ? 'disabled' : undefined}
            />
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.mobileHeader }),
  dispatch => ({
    actions:             bindActionCreators({ ...headerActions, checkCurrentVersion }, dispatch),
    loginActions:        bindActionCreators(loginActions, dispatch),
    reservationsActions: bindActionCreators({ initReservations }, dispatch)
  })
)(Page)
