import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'

import MobileMenuButton from '../buttons/MobileMenuButton'

import { setShowBottomMenu } from '../../actions/mobile.header.actions'
import { RESERVATIONS, NOTIFICATIONS } from '../../../_resources/constants/RouterPaths'


import { t } from '../../modules/localization/localization'

import styles from './MobileBottomMenu.scss'

class MobileBottomMenu extends Component {
  static propTypes = {
    showMenu:        PropTypes.bool,
    selectResButton: PropTypes.bool
  }

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { showMenu, selectResButton } = this.props
    const { router } = this.context
    if (!showMenu) { return null }

    return (
      <div className={styles.menu}>
        <MobileMenuButton
          icon="icon-garage-mobile"
          label={t([ 'mobileApp', 'page', 'resrevations' ])}
          onClick={() => router.push(RESERVATIONS)}
          state={selectResButton ? 'selected' : undefined}
        />
        <MobileMenuButton
          icon="icon-notification-mobile"
          label={t([ 'mobileApp', 'page', 'notifications' ])}
          onClick={() => router.push(NOTIFICATIONS)}
          state={!selectResButton ? 'selected' : undefined}
        />
      </div>
    )
  }
}

export default connect(
  state => ({ showMenu: state.mobileHeader.showBottomMenu, language: state.mobileHeader.language }),
  dispatch => ({ actions: bindActionCreators({ setShowBottomMenu }, dispatch) })
)(MobileBottomMenu)
