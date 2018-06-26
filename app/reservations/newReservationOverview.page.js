import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Form     from '../_shared/components/form/Form'
import Checkbox from '../_shared/components/checkbox/Checkbox'

import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'
import * as newReservationActions from '../_shared/actions/newReservation.actions'
import { setGarage }              from '../_shared/actions/pageBase.actions'

import styles from './newReservationOverview.page.scss'

const AVAILABLE_PAYMENT_METHOD = [ 'csob', 'raiffeisenbank', 'paypal' ]


class NewReservationOverviewPage extends Component {
  static propTypes = {
    state:           PropTypes.object,
    actions:         PropTypes.object,
    location:        PropTypes.object,
    pageBaseActions: PropTypes.object
  }

  componentDidMount() {
    const { location, actions, pageBaseActions } = this.props
    if (location.query.hasOwnProperty('token')) {
      location.query.success !== 'true' && actions.paymentUnsucessfull()
    } else if (location.query.hasOwnProperty('csob') || location.query.hasOwnProperty('gp_webpay')) {
      location.query.success === 'true' ? actions.paymentSucessfull() : actions.paymentUnsucessfull()
    } else {
      actions.overviewInit()
    }

    if (location.query.hasOwnProperty('garage_id')) {
      pageBaseActions.setGarage(+location.query.garage_id)
    }
  }

  onBack = () => nav.to('/reservations/newReservation')

  selectPaymentMethod = method => () => this.props.actions.selectPaymentMethod(method)

  placeLabel = () => {
    const { state } = this.props
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

  renderPaymentRow = gate => {
    const { state } = this.props
    const account = state.garage && state.garage.account
    if (!(account && account[`${gate}_is_active`])) return null
    if (!state.paymentMethod) this.selectPaymentMethod(gate)()

    return (<tr onClick={this.selectPaymentMethod(gate)}>
      <td>
        <input type="radio" name="payments" checked={this.props.state.paymentMethod === gate} />
      </td>
      <td>
        {t([ 'newReservationOverview', gate ])}
        {gate === 'csob' && <Checkbox
          checked={state.csobOneClick && state.paymentMethod === 'csob'}
          onChange={() => this.props.actions.selectCsobOneClick(!state.csobOneClick)}
        >
          {t([ 'newReservationOverview', 'csobOneTimePayment' ])}
        </Checkbox>}
      </td>
      <td><img src={`./public/logo/${gate}-logo.png`} alt={gate} /></td>
    </tr>)
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        <Form onSubmit={actions.submitReservation} onBack={this.onBack} submitable>
          <h2>{t([ 'newReservationOverview', 'overview' ])}</h2>
          {state.user && state.user.id < 0 && <div>
            <h4>{t([ 'newReservation', state.user.id === -1 ? 'selectedUser' : 'onetimeVisit' ])}</h4>
            {state.name.value && [
              <span className={styles.label}>{t([ 'newReservation', 'hostsName' ])}: </span>,
              <span>{state.name.value}</span>
            ]}
            {state.phone.value && [
              <span className={styles.label}>{t([ 'newReservation', 'hostsPhone' ])}: </span>,
              <span>{state.phone.value}</span>
            ]}
            {state.email.value && [
              <span className={styles.label}>{t([ 'newReservation', 'hostsEmail' ])}: </span>,
              <span>{state.email.value}</span>
            ]}
          </div>}

          <div>
            <h4>{t([ 'newReservationOverview', 'selectedPlace' ])}</h4>
            <div>{this.placeLabel()}</div>
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
            <div className={styles.label}>
              {`${state.price || ''} (${state.client_id && !state.paidByHost ? t([ 'newReservation', 'onClientsExpenses' ]) : t([ 'newReservation', 'onUsersExpenses' ])})`}
            </div>
          </div>

          <div>
            <h4>{t([ 'newReservationOverview', 'paymentMethod' ])}</h4>
            <table className={styles.paymentMethods}>
              <tbody>
                {AVAILABLE_PAYMENT_METHOD.map(this.renderPaymentRow)}
              </tbody>
            </table>
          </div>
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.newReservation }),
  dispatch => ({
    actions:         bindActionCreators(newReservationActions, dispatch),
    pageBaseActions: bindActionCreators({ setGarage }, dispatch)
  })
)(NewReservationOverviewPage)
