import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import * as legalDocumentsActions from '../../../_shared/actions/legalDocuments.actions'

class Terms extends Component {

  render() {
    return (
      <h1>Terms</h1>
    )
  }
}
export default connect(
  state => ({ state: state.adminLegalDocuments }),
  dispatch => ({ actions: bindActionCreators(legalDocumentsActions, dispatch) })
)(Terms)
