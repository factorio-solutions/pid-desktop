import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as analyticsPaymentsActions    from '../_shared/actions/analytics.payments.actions'

import styles from './payments.page.scss'


class PaymentsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    return (
      <React.Fragment>
        {'PaymentsPage page'}
      </React.Fragment>
    )
  }
}

export default connect(
  state => ({ state: state.analyticsPayments, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsPaymentsActions, dispatch) })
)(PaymentsPage)
