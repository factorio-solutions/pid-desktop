import React, { Component, PropTypes } from 'react'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'

import RoundButton      from '../../components/buttons/RoundButton'
import MobileMenuButton from '../../components/buttons/MobileMenuButton'
import Modal            from '../../components/modal/Modal'

import styles from './Page.scss'

import * as headerActions   from '../../actions/mobile.header.actions'
import * as loginActions    from '../../actions/login.actions'
import { initReservations } from '../../actions/mobile.reservations.actions'
import { t }                from '../../modules/localization/localization'

import { LOGIN, RESERVATIONS, NOTIFICATIONS } from '../../../_resources/constants/RouterPaths'

export class Page extends Component {
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

  componentDidMount() {
    window.addEventListener('unauthorizedAccess', this.unauthorizedHandler) // 401 status, redirect to login
    const { state, actions, hideDropdown, hideHeader } = this.props
    !hideHeader && !hideDropdown && actions.initGarages()

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
    this.props.loginActions.refreshLogin(
      () => {
        this.context.router.push(RESERVATIONS)
        this.props.reservationsActions.initReservations()
      },
      () => this.logout(false)
    )
  }

  render() {
    const { actions, state, gray } = this.props
    const { margin } = this.props
    const { back, add, ok, outlineBack } = this.props

    const menu = (<div className={styles.menu}>
      <MobileMenuButton
        icon="icon-garage-mobile"
        label={t([ 'mobileApp', 'page', 'resrevations' ])}
        onClick={() => this.context.router.push(RESERVATIONS)}
        state={window.location.hash.includes(RESERVATIONS) ? 'selected' : undefined}
      />
      <MobileMenuButton
        icon="icon-notification-mobile"
        label={t([ 'mobileApp', 'page', 'notifications' ])}
        onClick={() => this.context.router.push(NOTIFICATIONS)}
        state={window.location.hash.includes(NOTIFICATIONS) ? 'selected' : undefined}
      />
    </div>)

    const errorContent = (<div className={styles.errorContent}>
      <div>{state.error}</div>
      <RoundButton
        content={<i className="fa fa-check" aria-hidden="true" />}
        onClick={actions.setError} type="confirm"
        state={undefined}
      />
    </div>)

    return (
      <div className={`${margin && styles.app_page} ${styles.page}`}>
        <Modal content={errorContent} show={state.error} />
        <Modal content={state.custom_modal} show={state.custom_modal} zindex={100} />

        <div className={state.showHeader && styles.pageContent}>
          {this.props.children}
        </div>

        {back &&
          <div className={`${styles.backButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-chevron-left" />}
              onClick={back}
              state={undefined}
            />
          </div>
        }
        {outlineBack &&
          <div className={`${styles.backButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-chevron-left" />}
              onClick={outlineBack}
              type="whiteBorder"
              state={undefined}
            />
          </div>
        }
        {add &&
          <div className={`${styles.addButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-plus" />}
              onClick={add} type="action"
              state={!state.online ? 'disabled' : undefined}
            />
          </div>
        }
        {ok &&
          <div className={`${styles.okButton} ${gray && styles.addOffset}`}>
            <RoundButton
              content={<span className="fa fa-check" />}
              onClick={ok}
              type="confirm"
              state={!state.online ? 'disabled' : undefined}
            />
          </div>
        }

        {gray && menu}
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
