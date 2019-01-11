import React, { Component, PropTypes } from 'react'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'
import moment                          from 'moment'

import Logo             from '../../components/logo/Logo'
import Dropdown         from '../../components/dropdown/Dropdown'
import RoundButton      from '../../components/buttons/RoundButton'
import MobileSlideMenu  from '../../components/mobileSlideMenu/MobileSlideMenu'
import ButtonStack      from '../../components/buttonStack/ButtonStack'
import ButtonGroup      from '../../components/buttons/ButtonGroup'
import MobileMenuButton from '../../components/buttons/MobileMenuButton'
import Modal            from '../../components/modal/Modal'
import Localization     from '../../components/localization/Localization'

import styles from './Page.scss'

import * as headerActions   from '../../actions/mobile.header.actions'
import * as loginActions    from '../../actions/login.actions'
import { initReservations } from '../../actions/mobile.reservations.actions'
import { t }                from '../../modules/localization/localization'

import { LOGIN, RESERVATIONS, NOTIFICATIONS } from '../../../_resources/constants/RouterPaths'
import { version }                            from '../../../../package.json'


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
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.unauthorizedHandler = this.unauthorizedHandler.bind(this)
  }

  componentDidMount() {
    window.addEventListener('unauthorizedAccess', this.unauthorizedHandler) // 401 status, redirect to login
    const { state, actions, hideDropdown, hideHeader } = this.props
    actions.setCustomModal(undefined) // will avoid situations when lost custom modal cannot be removed
    !hideHeader && !hideDropdown && actions.initGarages()

    const platform = (window.cordova && window.cordova.platformId) || 'android'

    if (
      state.currentVersion.lastCheckAt &&
      !moment(state.currentVersion.lastCheckAt).isSame(moment(), 'day')
    ) {
      actions.getCurrentMobileVersion(platform)
      .then(({ mobile_app_version }) => {
        actions.setCurrentVersion(mobile_app_version)

        if (mobile_app_version !== version) {
          actions.showOlderVersionModal()
        } else {
          console.log('Dobra verze')
        }
      })
    }


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

  unauthorizedHandler() {
    this.props.loginActions.refreshLogin(
      () => {
        this.context.router.push(RESERVATIONS)
        this.props.reservationsActions.initReservations()
      },
      () => this.logout(false)
    )
  }

  logout(revoke) { // private method
    this.props.actions.logout(revoke, () => this.context.router.push(LOGIN))
  }


  render() {
    const { actions, reservationsActions, state, gray } = this.props
    const { hideDropdown, hideHamburger, hideHeader, margin } = this.props
    const { back, add, ok, outlineBack } = this.props

    const selectedGarage = () => state.garages.findIndex(garage => garage.id === state.garage_id)
    const currentUser = () => console.log('TODO: current user profile')
    const logOut = () => this.logout(true)

    const garageDropdown = (garage, index) => {
      const garageSelected = () => {
        actions.setGarage(state.garages[index].id)
        reservationsActions.initReservations()
      }
      return { label: garage.name, onClick: garageSelected, order: garage.order }
    }

    const divider = <div className={styles.divider}><div className={styles.line} /></div>

    const currentUserInfo = (state.current_user && <div className={styles.currentUserInfo}> {/* currently singned in user information */}
      <div className={styles.buttonContainer}>
        <RoundButton
          content={<span className="fa fa-user" aria-hidden="true" />}
          onClick={currentUser}
          type="action"
          state={undefined}
        />
      </div>
      <div>
        <div><b> {state.current_user.full_name} </b></div>
        <div> {state.current_user.email} </div>
        {state.current_user.phone && <div>{state.current_user.phone}</div>}
      </div>
    </div>)

    const sideMenuContent = (<div>
      {state.current_user ? currentUserInfo : <div>{t([ 'mobileApp', 'page', 'userInfoUnavailable' ])}</div>}
      {state.current_user && state.current_user.secretary && divider}
      {state.current_user && state.current_user.secretary &&
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={[
              { content:  t([ 'mobileApp', 'page', 'personal' ]),
                onClick:  () => actions.setPersonal(true),
                selected: state.personal
              },
              { content:  t([ 'mobileApp', 'page', 'work' ]),
                onClick:  () => actions.setPersonal(false),
                selected: !state.personal
              }
            ]}
          />
        </div>
      }
      {divider}
      <ButtonStack divider={divider}>
        {[
          <MobileMenuButton
            key="sign-out"
            icon="sign-out"
            label={t([ 'mobileApp', 'page', 'logOut' ])}
            onClick={logOut}
            state={!state.online ? 'disabled' : undefined}
            size={'75'}
          />
        ]}
      </ButtonStack>

      <div className={styles.bottom}>
        <div className={styles.appVersion}>
          {t([ 'mobileApp', 'page', 'version' ])} {version}
        </div>
        <Localization afterChange={actions.initGarages} />
      </div>
    </div>)

    const header = (<div className={styles.header}>
      <div className={styles.logo}><Logo /></div>
      <div className={styles.content}>
        {!hideDropdown &&
          <Dropdown
            label={t([ 'mobileApp', 'page', 'selectGarage' ])}
            content={state.garages.map(garageDropdown)}
            style="mobileDark"
            selected={selectedGarage()}
            fixed
          />
        }
      </div>
      {!hideHamburger &&
        <button
          onClick={actions.toggleMenu}
          className={styles.menuButton}
        >
          <i className="fa fa-bars" aria-hidden="true" />
        </button>
      }
      <MobileSlideMenu
        content={sideMenuContent}
        show={state.showMenu}
        dimmerClick={actions.toggleMenu}
      />
    </div>)

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

    return (<div className={`${margin && styles.app_page} ${styles.page}`}>
      <Modal content={errorContent} show={state.error} />
      <Modal content={state.custom_modal} show={state.custom_modal} zindex={100} />

      <div className={!hideHeader && styles.pageContent}>
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
      {!hideHeader && header}
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
