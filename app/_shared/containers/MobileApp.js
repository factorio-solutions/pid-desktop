import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { setCustomModal, initGarages } from '../actions/mobile.header.actions'
import { checkCurrentVersion } from '../actions/mobile.version.actions'
import MobileHeader from './mobilePage/MobileHeader'
import MobileBottomMenu from '../components/mobileBottomMenu/MobileBottomMenu'
import { RESERVATIONS } from '../../_resources/constants/RouterPaths'

import styles from './MobileApp.scss'

class MobileApp extends Component {
  static propTypes = {
    showHeader:     PropTypes.bool,
    showBottomMenu: PropTypes.bool,
    actions:        PropTypes.object,
    children:       PropTypes.object
  }

  componentDidMount() {
    const { actions } = this.props
    actions.setCustomModal()
  }

  afterLanguageChange = () => {
    const { actions } = this.props
    actions.initGarages()
  }

  render() {
    const { showHeader, showBottomMenu, children } = this.props
    return (
      <div>
        <MobileHeader afterLanguageChange={this.afterLanguageChange} />
        <div className={`${showHeader && styles.pageContent} ${showBottomMenu && styles.app_page}`}>
          {children}
        </div>
        <MobileBottomMenu
          selectResButton={window.location.hash.includes(RESERVATIONS)}
          ref={ref => this.bottomMenu = ref}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    showHeader:     state.mobileHeader.showHeader,
    showBottomMenu: state.mobileHeader.showBottomMenu
  }),
  dispatch => ({
    actions: bindActionCreators({ checkCurrentVersion, setCustomModal, initGarages }, dispatch)
  })
)(MobileApp)
