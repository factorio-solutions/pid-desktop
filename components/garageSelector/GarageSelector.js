import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Dropdown from '../dropdown/Dropdown'

import styles from './GarageSelector.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
import { t } from '../../modules/localization/localization'


export class GarageSelector extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    const content = state.garages.map(userGarage => userGarage.garage)
    const selectedIndex = content.findIndex(garage => garage.id === state.garage)

    if (content === undefined || content.length === 0 || selectedIndex === -1) return null

    const selected = object => actions.setGarage(object.id)

    const dropdownContent = content.map(object => ({ label: object.name, onClick: () => selected(object) }))

    return (
      <div>
        <div className={styles.img} >
          <img src={content[selectedIndex].img || './public/garage_icon.jpg'} />
        </div>
        <Dropdown label={t([ 'occupancy', 'selectGarage' ])} content={dropdownContent} selected={selectedIndex} style="garageSelector" position="fixed" />
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch) })
)(GarageSelector)
