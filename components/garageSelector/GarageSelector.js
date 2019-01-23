import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Dropdown from '../dropdown/Dropdown'

import styles from './GarageSelector.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
import * as occupancyActions from '../../actions/occupancy.actions'
import { t } from '../../modules/localization/localization'


class GarageSelector extends Component {
  static propTypes = {
    state:           PropTypes.object,
    occupancy:       PropTypes.object,
    actions:         PropTypes.object,
    occupancyAction: PropTypes.object
  }

  emptyGarageSelector = (
    <div>
      <div className={styles.emptyImg} />
      <div className={styles.emptyDropdown} />
    </div>
  )

  selected = object => {
    const {
      occupancyAction: { resetClientsLoadGarage },
      actions:         { setGarage }
    } = this.props
    if (window.location.hash.includes('occupancy')) {
      resetClientsLoadGarage(object.id)
    } else {
      setGarage(object.id)
    }
  }

  render() {
    const { state, occupancy } = this.props

    const content = window.location.hash.includes('occupancy') ?
      occupancy.garages :
      state.garages.map(userGarage => userGarage.garage)

    const selectedIndex = window.location.hash.includes('occupancy') ?
      content.findIndex(garage => garage.id === (occupancy.garage && occupancy.garage.id)) :
      content.findIndex(garage => garage.id === state.garage)

    if (content === undefined || content.length === 0 || selectedIndex === -1) return this.emptyGarageSelector

    const dropdownContent = content.map(object => ({ label: object.name, onClick: () => this.selected(object) }))

    return (
      <div>
        <div className={styles.img} >
          <img src={content[selectedIndex].img || './public/garage_icon.jpg'} />
        </div>
        <Dropdown
          placeholder={t([ 'occupancy', 'selectGarage' ])}
          content={dropdownContent}
          selected={selectedIndex}
          style="garageSelector"
          position="fixed"
          filter
        />
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.pageBase, occupancy: state.occupancy }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch), occupancyAction: bindActionCreators(occupancyActions, dispatch) })
)(GarageSelector)
