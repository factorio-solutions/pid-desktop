import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import styles from '../newReservation.page.scss'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import { showMap } from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'


class PlaceForm extends Component {
  static propTypes = {
    state:      PropTypes.object,
    actions:    PropTypes.object,
    freePlaces: PropTypes.array
  }

  placeLabel = (state, freePlaces) => {
    if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
      return freePlaces.length ? 'flexiblePlaceSelected' : 'noFreePlace'
    } else {
      const floor = state.garage && state.garage.floors.find(floor => floor.places.findById(state.place_id) !== undefined)
      const place = floor && floor.places.findById(state.place_id)
      return floor && place ? `${floor.label} / ${place.label}` : 'noFreePlace'
    }
  }

  render() {
    const { state, actions, freePlaces } = this.props
    const placeLabelKey = this.placeLabel(state, freePlaces)

    const showMapOnClick = () => {
      actions.showMap(!state.showMap)
    }

    return (
      <div className={styles.dateTimeContainer}>
        <div className={styles.leftCollumn}>
          <div className={styles.label}>
            {t([ 'newReservation', 'place' ])}
          </div>
          <div className={styles.placeLabel}>
            {placeLabelKey.includes('/') ? placeLabelKey : t([ 'newReservation', placeLabelKey ])}
          </div>
        </div>
        <div className={styles.middleCollumn} />
        <div className={`${styles.rightCcollumn} ${styles.showMap} ${styles.actionButton}`}>
          <div className={styles.label} />
          <CallToActionButton
            label={t([ 'newReservation', 'showMap' ])}
            onClick={showMapOnClick}
          />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.newReservation }),
  dispatch => ({
    actions: bindActionCreators(
      {
        showMap
      },
      dispatch
    )
  })
)(PlaceForm)
