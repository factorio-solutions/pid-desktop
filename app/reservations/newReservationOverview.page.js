import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Form             from '../_shared/components/form/Form'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as newReservationActions  from '../_shared/actions/newReservation.actions'

import styles from './newReservationOverview.page.scss'


class NewReservationOverviewPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    const { location, actions } = this.props
    if (location.query.hasOwnProperty('token')) {
      location.query.success === 'true' ? actions.payReservation(location.query.token) : actions.paymentUnsucessfull()
    } else if (location.query.hasOwnProperty('csob')) {
      location.query.success === 'true' ? actions.paymentSucessfull() : actions.paymentUnsucessfull()
    } else {
      actions.overviewInit()
    }
  }

  render() {
    const { state, actions } = this.props

    const onBack = () => { nav.to('/reservations/newReservation') }

    const placeLabel = () => {
      if (!state.place_id && state.garage && state.garage.flexiplace) {
        return (<div>
          <span className={styles.label}>{t([ 'newReservationOverview', 'garage' ])}: </span>
          <span>{state.garage.name}</span>
          <span className={styles.label}>{t([ 'newReservationOverview', 'place' ])}: </span>
          <span>{t([ 'newReservation', 'flexiblePlaceSelected' ])}</span>
        </div>)
      } else {
        const findPlace = place => place.id === state.place_id
        const floor = state.garage && state.garage.floors.find(floor => floor.places.find(findPlace) !== undefined)
        const place = floor && floor.places.find(findPlace)
        if (floor && place) {
          return (
            <div>
              <span className={styles.label}>{t([ 'newReservationOverview', 'garage' ])}: </span>
              <span>{state.garage.name}</span>
              <span className={styles.label}>{t([ 'newReservationOverview', 'floor' ])}: </span>
              <span>{floor.label}</span>
              <span className={styles.label}>{t([ 'newReservationOverview', 'place' ])}: </span>
              <span>{place.label}</span>
            </div>
          )
        }
      }
    }

    return (
      <PageBase>
        <Form onSubmit={actions.submitReservation} onBack={onBack} submitable>
          <h2>{t([ 'newReservationOverview', 'overview' ])}</h2>
          {state.user && state.user.id === -1 && <div>
            <h4>{t([ 'newReservation', 'selectedUser' ])}</h4>
            <span className={styles.label}>{t([ 'newReservation', 'hostsName' ])}: </span><span>{state.name.value}</span>
            <span className={styles.label}>{t([ 'newReservation', 'hostsPhone' ])}: </span><span>{state.phone.value}</span>
            <span className={styles.label}>{t([ 'newReservation', 'hostsEmail' ])}: </span><span>{state.email.value}</span>
          </div>}

          <div>
            <h4>{t([ 'newReservationOverview', 'selectedPlace' ])}</h4>
            <div>{placeLabel()}</div>
          </div>
          <div>
            <h4>{t([ 'newReservationOverview', 'duration' ])}</h4>
            <div>
              <span className={styles.label}>{t([ 'newReservationOverview', 'from' ])}: </span>
              <span>{state.from}</span>
              <span className={styles.label}>{t([ 'newReservationOverview', 'to' ])}: </span>
              <span>{state.to}</span>
            </div>
          </div>
          <div>
            <h4>{t([ 'newReservationOverview', 'price' ])}</h4>
            <div className={styles.label}>{ state.client_id ? t([ 'newReservation', 'onClientsExpenses' ]) : state.price }</div>
          </div>
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.newReservation }),
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationOverviewPage)
