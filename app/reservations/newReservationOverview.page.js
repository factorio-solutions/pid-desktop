import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import withMasterPageConf from '../hoc/withMasterPageConf'
import Form     from '../_shared/components/form/Form'
import Checkbox from '../_shared/components/checkbox/Checkbox'

import * as nav                   from '../_shared/helpers/navigation'
import { parseParameters }        from '../_shared/helpers/parseUrlParameters'
import { t }                      from '../_shared/modules/localization/localization'
import * as newReservationActions from '../_shared/actions/newReservation.actions'
import { setGarage, toReservations } from '../_shared/actions/pageBase.actions'

import styles from './newReservationOverview.page.scss'

const AVAILABLE_PAYMENT_METHOD = [ 'csob', 'raiffeisenbank', 'paypal' ]


class NewReservationOverviewPage extends Component {
  static propTypes = {
    state:           PropTypes.object,
    pageBase:        PropTypes.object,
    actions:         PropTypes.object,
    location:        PropTypes.object,
    pageBaseActions: PropTypes.object,
    match:           PropTypes.object
  }

  componentDidMount() {
    const {
      location, actions, pageBaseActions, match
    } = this.props
    const query = parseParameters(location.search)
    if (query.hasOwnProperty('garage_id')) {
      const garageId = parseInt(query.garage_id, 10)
      !isNaN(garageId) && pageBaseActions.setGarage(garageId)
    }

    if (query.hasOwnProperty('token') || query.hasOwnProperty('csob') || query.hasOwnProperty('gp_webpay')) {
      actions.afterPayment(query.id, query.success)
    } else {
      actions.overviewInit()
    }
  }

  onBack = () => nav.to('/reservations/newReservation')

  selectPaymentMethod = method => () => this.props.actions.selectPaymentMethod(method)

  placeLabel = () => {
    const { state } = this.props
    if (!state.place_id && state.garage && state.garage.flexiplace) {
      return (
        <div>
          <span className={styles.label}>
            {t([ 'newReservationOverview', 'garage' ])}
            {':'}
          </span>
          <span>{state.garage.name}</span>
          <span className={styles.label}>
            {t([ 'newReservationOverview', 'place' ])}
            {':'}
          </span>
          <span>{t([ 'newReservation', 'flexiblePlaceSelected' ])}</span>
        </div>
      )
    } else {
      const findPlace = place => place.id === state.place_id
      const floor = state.garage && state.garage.floors.find(floor => floor.places.find(findPlace) !== undefined)
      const place = floor && floor.places.find(findPlace)
      if (floor && place) {
        return (
          <div>
            <span className={styles.label}>
              {t([ 'newReservationOverview', 'garage' ])}








:
{' '}
            </span>
            <span>{state.garage.name}</span>
            <span className={styles.label}>
              {t([ 'newReservationOverview', 'floor' ])}








:
{' '}
            </span>
            <span>{floor.label}</span>
            <span className={styles.label}>
              {t([ 'newReservationOverview', 'place' ])}








:
{' '}
            </span>
            <span>{place.label}</span>
          </div>
        )
      }
    }
  }

  renderPaymentRow = gate => {
    const { state, pageBase } = this.props
    const userHasThisGate = pageBase.current_user && pageBase.current_user.merchant_ids.includes(state.garage.account.csob_merchant_id)
    const account = state.garage && state.garage.account
    if (!(account && account[`${gate}_is_active`])) return null
    if (!state.paymentMethod) this.selectPaymentMethod(gate)()

    return (
      <tr onClick={this.selectPaymentMethod(gate)}>
        <td>
          <input type="radio" name="payments" checked={this.props.state.paymentMethod === gate} />
        </td>
        <td>
          {t([ 'newReservationOverview', gate ])}
          {state.paymentMethod === 'csob' && gate === 'csob' && [
            <Checkbox
              checked={state.paymentMethod === 'csob' && state.csobOneClick}
              onChange={() => this.props.actions.selectCsobOneClick(!state.csobOneClick)}
            >
              {userHasThisGate
                ? t([ 'newReservationOverview', 'csobOneTimePaymentUseCard' ])
                : t([ 'newReservationOverview', 'csobOneTimePayment' ])
              }
            </Checkbox>,
            userHasThisGate && state.csobOneClick && state.paymentMethod === 'csob' && (
              <Checkbox
                checked={state.paymentMethod === 'csob' && state.csobOneClick && state.csobOneClickNewCard}
                onChange={() => this.props.actions.selectCsobOneClickNewCard(!state.csobOneClickNewCard)}
              >
                {t([ 'newReservationOverview', 'csobOneTimePaymentNewCard' ])}
              </Checkbox>
            )
          ]}
        </td>
        <td><img src={`./public/logo/${gate}-logo.png`} alt={gate} /></td>
      </tr>
    )
  }

  render() {
    const { state, actions } = this.props

    return (
      <Form onSubmit={actions.submitReservation} onBack={this.onBack} submitable>
        <h2>{t([ 'newReservationOverview', 'overview' ])}</h2>
        {state.user && state.user.id < 0 && (
          <div>
            <h4>
              {t([
                'newReservation',
                state.user.id === -1
                  ? 'selectedUser'
                  : 'onetimeVisit'
              ])}
            </h4>
            {state.name.value && [
              <span className={styles.label}>
                {t([ 'newReservation', 'hostsName' ])}
                {':'}
              </span>,
              <span>{state.name.value}</span>
            ]}
            {state.phone.value && [
              <span className={styles.label}>
                {t([ 'newReservation', 'hostsPhone' ])}
                {':'}
              </span>,
              <span>{state.phone.value}</span>
            ]}
            {state.email.value && [
              <span className={styles.label}>
                {t([ 'newReservation', 'hostsEmail' ])}
                {':'}
              </span>,
              <span>{state.email.value}</span>
            ]}
          </div>
        )}

        <div>
          <h4>{t([ 'newReservationOverview', 'selectedPlace' ])}</h4>
          <div>{this.placeLabel()}</div>
        </div>

        <div>
          <h4>{t([ 'newReservationOverview', 'duration' ])}</h4>
          <div>
            <span className={styles.label}>
              {t([ 'newReservationOverview', 'from' ])}
              {':'}
            </span>
            <span>{state.from}</span>
            <span className={styles.label}>
              {t([ 'newReservationOverview', 'to' ])}
              {':'}
            </span>
            <span>{state.to}</span>
          </div>
        </div>

        <div>
          <h4>{t([ 'newReservationOverview', 'price' ])}</h4>
          <div className={styles.label}>
            {`${state.price || ''} (${
              state.client_id
              && !state.paidByHost
                ? t([ 'newReservation', 'onClientsExpenses' ])
                : t([ 'newReservation', 'onUsersExpenses' ])})`}
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
    )
  }
}

const mapStateToProps = state => ({ state: state.newReservation, pageBase: state.pageBase })

const mapActionsToProps = dispatch => ({
  actions:         bindActionCreators(newReservationActions, dispatch),
  pageBaseActions: bindActionCreators({ setGarage }, dispatch)
})

const enhancers = compose(
  withMasterPageConf(toReservations('overview')),
  connect(
    mapStateToProps,
    mapActionsToProps
  )
)

export default enhancers(NewReservationOverviewPage)
