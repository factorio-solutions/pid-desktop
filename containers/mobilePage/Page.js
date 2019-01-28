import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'

import RoundButton      from '../../components/buttons/RoundButton'
import Modal            from '../../components/modal/Modal'

import styles from './Page.scss'

import * as headerActions   from '../../actions/mobile.header.actions'
import * as loginActions    from '../../actions/login.actions'
import { initReservations } from '../../actions/mobile.reservations.actions'

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
    margin:        PropTypes.bool, // will give page 10px margin to offset content
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
    window.addEventListener('unauthorizedAccess', this.unauthorizedHandler) // 401 status, redirect to login
    const { state, actions, hideDropdown, hideHeader, hideHamburger, gray } = this.props
    actions.setAllHeader(!hideHeader, !hideHamburger, !hideDropdown)
    actions.setShowBottomMenu(gray)
    !hideHeader && !hideDropdown && await actions.initGarages()

    state.current_user && !state.current_user.secretary && actions.setPersonal(true)

    console.log('hide splashscreen')
    // actions.hideSplashscreen()
  }

  componentWillReceiveProps(newProps) {
    document.getElementsByTagName('body')[0].style.backgroundColor = newProps.gray ? '#292929' : 'white'
  }

  componentWillUnmount() {
    window.removeEventListener('unauthorizedAccess', this.unauthorizedHandler) // 401 status, redirect to login
  }

  onLogoutClick = () => this.logout(true)

  logout = revoke => { // private method
    this.props.actions.logout(revoke, () => this.context.router.push(LOGIN))
  }

  unauthorizedHandler = () => {
    const {
      state,
      actions,
      loginActions: login,
      reservationsActions
    } = this.props
    const { router } = this.context
    console.log('unauthorizedAccess')
    login.refreshLogin(
      async () => {
        router.push(RESERVATIONS)
        await actions.initGarages()
        if (state.current_user && !state.current_user.secretary) {
          actions.setPersonal(true)
        } else {
          reservationsActions.initReservations()
        }
      },
      () => this.logout(false)
    )
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
    actions:             bindActionCreators(headerActions, dispatch),
    loginActions:        bindActionCreators(loginActions, dispatch),
    reservationsActions: bindActionCreators({ initReservations }, dispatch)
  })
)(Page)
