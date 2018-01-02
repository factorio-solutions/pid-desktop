import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as analyticsPaymentsActions    from '../_shared/actions/analytics.payments.actions'

import styles from './payments.page.scss'


class PaymentsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        PaymentsPage page
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.analyticsPayments, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsPaymentsActions, dispatch) })
)(PaymentsPage)
