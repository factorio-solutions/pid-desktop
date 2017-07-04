import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as analyticsPlacesActions    from '../_shared/actions/analytics.places.actions'

import styles from './places.page.scss'


export class PlacesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        PlacesPage page
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.analyticsPlaces, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsPlacesActions, dispatch) })
)(PlacesPage)
