import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { setCustomModal } from '../actions/mobile.header.actions'
import { checkCurrentVersion } from '../actions/mobile.version.actions'
import MobileHeader from './mobilePage/MobileHeader'
import MobileBottomMenu from '../components/mobileBottomMenu/MobileBottomMenu'
import { RESERVATIONS } from '../../_resources/constants/RouterPaths'

import styles from './MobileApp.scss'

const emptyObject = {}
class MobileApp extends Component {
  static propTypes = {
    showHeader:     PropTypes.bool,
    showBottomMenu: PropTypes.bool,
    actions:        PropTypes.object,
    children:       PropTypes.object
  }

  componentDidMount() {
    this.props.actions.setCustomModal()
    this.props.actions.checkCurrentVersion()
  }

  render() {
    const { showHeader, showBottomMenu } = this.props
    return (
      <div>
        <MobileHeader />
        <div className={`${showHeader && styles.pageContent} ${showBottomMenu && styles.app_page}`}>
          {this.props.children}
        </div>
        <MobileBottomMenu selectResButton={window.location.hash.includes(RESERVATIONS)} />
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
    actions: bindActionCreators({ checkCurrentVersion, setCustomModal }, dispatch)
  })
)(MobileApp)
