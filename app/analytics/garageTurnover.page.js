import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as analyticsActions    from '../_shared/actions/analytics.actions'

import styles from './garageTurnover.page.scss'


export class GarageTurnoverPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initGarageTurnover(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        GarageTurnoverPage page
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.analytics, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsActions, dispatch) })
)(GarageTurnoverPage)
