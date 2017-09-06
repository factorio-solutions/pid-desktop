import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Logo from '../../components/logo/Logo'
import Dropdown from '../../components/dropdown/Dropdown'
import RoundButton from '../../components/buttons/RoundButton'
import MobileSlideMenu from '../../components/mobileSlideMenu/MobileSlideMenu'
import ButtonStack from '../../components/buttonStack/ButtonStack'
import MobileMenuButton from '../../components/buttons/MobileMenuButton'
import Modal from '../../components/modal/Modal'

import styles from './Page.scss'

import * as headerActions from '../../actions/mobile.header.actions'
import * as loginActions from '../../actions/login.actions'


export class Page extends Component {
  static propTypes = { actions: PropTypes.object
    , loginActions: PropTypes.object
    , state: PropTypes.object
    , children: PropTypes.object

    // header looks
    , hideHeader: PropTypes.bool
    , hideDropdown: PropTypes.bool
    , hideHamburger: PropTypes.bool
    , label: PropTypes.string // header content
    , margin: PropTypes.bool // will give page 10px margin to offset content

    // navigation functions
    , back: PropTypes.func
    , add: PropTypes.func
    , pay: PropTypes.func
    , ok: PropTypes.func
    , remove: PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentDidMount() {
    window.addEventListener('unauthorizedAccess', () => { localStorage.jwt && this.logout(false) }, false) // 401 status, redirect to login
    const { actions, hideDropdown, hideHeader } = this.props
    actions.setCustomModal(undefined) // will avoid situations when lost custom modal cannot be removed
    !hideHeader && !hideDropdown && actions.initGarages()
  }

  logout(revoke) { // private method
    this.props.actions.logout(revoke, () => { this.context.router.push('/login') })
  }

  render() {
    const { actions, state } = this.props
    const { hideDropdown, hideHamburger, hideHeader, label, margin } = this.props
    const { back, add, pay, ok, remove } = this.props

    const selectedGarage = () => state.garages.findIndex(garage => garage.id === state.garage_id)
    const currentUser = () => { console.log('TODO: current user profile') }
    const logOut = () => { this.logout(true) }

    const garageDropdown = (garage, index) => {
      const garageSelected = () => { actions.setGarage(state.garages[index].id) }
      return { label: garage.name, onClick: garageSelected }
    }

    const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

    const currentUserInfo = (<div className={styles.currentUserInfo}> {/* currently singned in user information */}
      <div className={styles.buttonContainer}>
        <RoundButton content={<span className="fa fa-user" aria-hidden="true"></span>} onClick={currentUser} type="action" />
      </div>
      <div>
        <div><b> {state.current_user.full_name} </b></div>
        <div> {state.current_user.email} </div>
        {state.current_user.phone && <div>{state.current_user.phone}</div>}
      </div>
    </div>)

    const sideMenuContent = (<div>
      {state.current_user ? currentUserInfo : <div>User info unavailable.</div>}
      {divider}
      <ButtonStack divider={divider}>
        {[ <MobileMenuButton key="sign-out" icon="sign-out" label="log out" onClick={logOut} state={!state.online && 'disabled'} size={75} /> ]}
      </ButtonStack>
    </div>)

    const header = (<div className={styles.header}>
      <div className={styles.logo}><Logo /></div>
      <div className={styles.content}>
        <div><b> {label} </b></div>
      {!hideDropdown && <div><Dropdown label="Select garage" content={state.garages.map(garageDropdown)} style="dark" selected={selectedGarage()} fixed /></div>}
      </div>
      {!hideHamburger && <button onClick={actions.toggleMenu} className={styles.menuButton}> <i className="fa fa-bars" aria-hidden="true"></i> </button>}
      <MobileSlideMenu content={sideMenuContent} show={state.showMenu} dimmerClick={actions.toggleMenu} />
    </div>)

    const errorContent = (<div className={styles.errorContent}>
      <div>{state.error}</div>
      <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={actions.setError} type="confirm" />
    </div>)

    return (<div className={margin && styles.app_page}>
      <Modal content={errorContent} show={state.error} />
      <Modal content={state.custom_modal} show={state.custom_modal} />

      <div className={!hideHeader && styles.pageContent}>
        {this.props.children}
      </div>

      {back && <div className={styles.backButton}><RoundButton content={<span className="fa fa-chevron-left"></span>} onClick={back} /></div>}
      {add && <div className={styles.addButton}> <RoundButton content={<span className="fa fa-plus"></span>} onClick={add} type="action" state={!state.online && 'disabled'} /></div>}
      {pay && <div className={styles.addButton}> <RoundButton content={'Pay'} onClick={pay} type="action" state={!state.online && 'disabled'} /></div>}
      {ok && <div className={styles.okButton}> <RoundButton content={<span className="fa fa-check"></span>} onClick={ok} type="confirm" state={!state.online && 'disabled'} /></div>}
      {remove && <div className={styles.okButton}> <RoundButton content={<span className="fa fa-times"></span>} onClick={remove} type="remove" state={!state.online && 'disabled'} /></div>}

      {!hideHeader && header}
    </div>
    )
  }
}

export default connect(
  state => ({ state: state.mobileHeader }),
  dispatch => ({ actions: bindActionCreators(headerActions, dispatch), loginActions: bindActionCreators(loginActions, dispatch) })
)(Page)
