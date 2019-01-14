import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  setCustomModal,
  checkCurrentVersion
} from '../actions/mobile.header.actions'
import MobileHeader from './mobilePage/MobileHeader'

class MobileApp extends Component {
  static propTypes = {
    actions:  PropTypes.object,
    children: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.setCustomModal()
    this.props.actions.checkCurrentVersion()
  }

  render() {
    return (
      <div>
        {this.props.children}
        <MobileHeader />
      </div>
    )
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    actions: bindActionCreators({ checkCurrentVersion, setCustomModal }, dispatch)
  })
)(MobileApp)
