import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import RoundButton      from '../_shared/components/buttons/RoundButton'
import Braintree        from '../_shared/components/braintree/Braintree'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as newReservationActions  from '../_shared/actions/newReservation.actions'

import styles from './newReservationOverview.page.scss'


export class NewReservationOverviewPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.overviewInit()
  }

  render() {
    const { state, actions } = this.props

    const onBack = () => { nav.to('/reservations/newReservation') }

    const formOnSubmit = (evt) => {
      evt.preventDefault()
      state.client_id && actions.submitReservation(undefined)
      return false
    }

    const onPayment = (payload) => {
      actions.submitReservation(payload)
    }

    const placeLabel = () => {
      const findPlace = (place) => {return place.id == state.place_id}
      const floor = state.garage && state.garage.floors.find((floor)=>{ return floor.places.find(findPlace)!=undefined })
      const place = floor && floor.places.find(findPlace)
      if (floor && place) {
        return (
          <div>
            <span className={styles.label}>{t(['newReservationOverview', 'garage'])}: </span>
            <span>{state.garage.name}</span>
            <span className={styles.label}>{t(['newReservationOverview', 'floor'])}: </span>
            <span>{floor.label}</span>
            <span className={styles.label}>{t(['newReservationOverview', 'place'])}: </span>
            <span>{place.label}</span>
          </div>
        )
      }
    }

    const content = <div>
                      <h2>{t(['newReservationOverview', 'overview'])}</h2>
                      <div>
                        <h4>{t(['newReservationOverview', 'selectedPlace'])}</h4>
                        <div>{placeLabel()}</div>
                      </div>
                      <div>
                        <h4>{t(['newReservationOverview', 'duration'])}</h4>
                        <div>
                          <span className={styles.label}>{t(['newReservationOverview', 'from'])}: </span>
                          <span>{state.from}</span>
                          <span className={styles.label}>{t(['newReservationOverview', 'to'])}: </span>
                          <span>{state.to}</span>
                        </div>
                      </div>
                      <div>
                        <h4>{t(['newReservationOverview', 'price'])}</h4>
                        <div className={styles.label}>{ state.client_id ? t(['newReservation', 'onClientsExpenses']) : state.price }</div>
                      </div>
                      <form className={styles.form} onSubmit={formOnSubmit}>
                        {state.client_id==undefined && state.braintree_token && <Braintree token={state.braintree_token} onPayment={onPayment}/>}
                        <div className={styles.floatLeft}>
                          <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/>
                        </div>
                        <div className={styles.floatRight}>
                          <button className={styles.submitButton} type="submit"> <span className='fa fa-check' aria-hidden="true"></span> </button>
                        </div>
                      </form>
                    </div>


    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.newReservation }),
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationOverviewPage)
