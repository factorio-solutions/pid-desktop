import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import { t } from '../../modules/localization/localization'

import Logo            from '../../components/logo/Logo'
import Dropdown        from '../../components/dropdown/Dropdown'
import MobileSlideMenu from '../../components/mobileSlideMenu/MobileSlideMenu'

import { initReservations } from '../../actions/mobile.reservations.actions'
import * as headerActions   from '../../actions/mobile.header.actions'

import { LOGIN } from '../../../_resources/constants/RouterPaths'


import styles from './MobileHeader.scss'

class MobileHeader extends Component {
  static propTypes = {
    actions:             PropTypes.object,
    state:               PropTypes.object,
    afterLanguageChange: PropTypes.func
  }

  static contextTypes = {
    router: PropTypes.object
  }

  onLogoutClick = () => this.logout(true)

  garageDropdown = garage => {
    const { actions } = this.props
    const garageSelected = () => {
      actions.setGarage(garage.id)
      actions.initReservations()
    }
    return { label: garage.name, onClick: garageSelected, order: garage.order }
  }

  logout = revoke => { // private method
    const { actions: { logout } } = this.props
    const { router } = this.context
    logout(revoke, () => router.push(LOGIN))
  }

  render() {
    const { actions, state, afterLanguageChange } = this.props
    if (!state.showHeader) { return null }

    const selectedGarage = state.garages.findIndex(garage => garage.id === state.garage_id)

    return (
      <div className={styles.header}>
        <div className={styles.logo}><Logo /></div>
        <div className={styles.content}>
          {
            state.showDropdown && (
              <Dropdown
                placeholder={t([ 'mobileApp', 'page', 'selectGarage' ])}
                content={state.garages.map(this.garageDropdown)}
                style="mobileDark"
                selected={selectedGarage}
                fixed
              />
            )
          }
        </div>
        {
          state.showHamburger && (
            <button
              onClick={actions.toggleMenu}
              className={styles.menuButton}
              type="button"
            >
              <i className="fa fa-bars" aria-hidden="true" />
            </button>
          )
        }
        <MobileSlideMenu
          showSlideMenu={state.showMenu}
          dimmerClick={actions.toggleMenu}
          currentUser={state.current_user}
          personal={state.personal}
          version={state.appVersion}
          online={state.online}
          onLogoutClick={this.onLogoutClick}
          onPersonalWorkChange={actions.setPersonal}
          onLocalizationChange={afterLanguageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    showMenu, current_user, personal, online,
    showDropdown, showHamburger, garages,
    garage_id, showHeader
  } = state.mobileHeader
  const { appVersion } = state.mobileVersion
  return {
    state: {
      showMenu, current_user, personal, online,
      showDropdown, showHamburger, garages,
      garage_id, showHeader, appVersion
    }
  }
}

const mapActionsToProps = dispatch => ({
  actions: bindActionCreators({ ...headerActions, initReservations }, dispatch)
})

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MobileHeader)
