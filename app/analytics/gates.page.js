import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'

import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'
import * as analyticsGatesActions from '../_shared/actions/analytics.gates.actions'

import styles from './gates.page.scss'


class GatesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        GatesPage page
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.analyticsGates, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsGatesActions, dispatch) })
)(GatesPage)
