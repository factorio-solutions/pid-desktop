import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase          from '../_shared/containers/pageBase/PageBase'
import RoundButton       from '../_shared/components/buttons/RoundButton'
import GarageLayout      from '../_shared/components/garageLayout/GarageLayout'
import Form              from '../_shared/components/form/Form'
import Modal             from '../_shared/components/modal/Modal'
import PickUserForm      from './newReservation/pickUserForm'
import GarageClientForm  from './newReservation/garageClientForm'
import PlaceForm         from './newReservation/placeForm'
import PriceSmsNote      from './newReservation/priceSmsNote'
import DateTimeForm      from './newReservation/dateTimeForm'
import Recurring         from '../_shared/components/recurring/Recurring'
import SectionWithHeader from '../_shared/components/wrapers/SectionWithHeader'

import {
  MOMENT_DATETIME_FORMAT
} from '../_shared/helpers/time'

import * as newReservationActions from '../_shared/actions/newReservation.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t, getLanguage }         from '../_shared/modules/localization/localization'

import styles from './newReservation.page.scss'

const ACCENT_REGEX = new RegExp('[ěĚšŠčČřŘžŽýÝáÁíÍéÉďĎňŇťŤůŮúÚóÓ]')


class NewReservationPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    params:   PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { actions, params, state } = this.props
    if (state.reservation && ((typeof params.id === 'undefined' && state.reservation.id)
        || (state.reservation.id !== params.id))) {
      actions.clearForm()
    }
    actions.setInitialStore(params.id)
    actions.setLanguage(getLanguage()) // Initialize language of communication
  }

  handleBack = () => nav.to('/reservations')

  toOverview = () => {
    const { state, pageBase } = this.props

    if (this.props.params.id) {
      this.props.actions.submitReservation(+this.props.params.id)
    } else if (
      !state.client_id ||
      (state.paidByHost &&
        (state.user && state.user.id) === (pageBase.current_user && pageBase.current_user.id))
    ) {
      nav.to('/reservations/newReservation/overview')
    } else {
      this.props.actions.submitReservation()
    }
  }

  handlePlaceClick = place => this.props.actions.setPlace(place)

  // hightlightInputs = () => this.props.actions.toggleHighlight()

  modalClick = () => {
    this.props.actions.setError(undefined)
    this.handleBack()
  }

  clearForm = () => {
    this.props.actions.clearForm()
    this.props.actions.setInitialStore()
    if (this.searchField) {
      this.searchField.filter.input.focus()
    }
  }

  // selectedClient = () => {
  //   const { state } = this.props
  //   return state.user && state.client_id && state.user.availableClients.findById(state.client_id)
  // }

  render() {
    const { state, actions } = this.props

    const ongoing = state.reservation && state.reservation.ongoing
    const selectedClient = actions.selectedClient()
    const outOfTimeCredit = selectedClient && state.timeCreditPrice > selectedClient[state.paidByHost ? 'current_time_credit' : 'current_users_current_time_credit']
    const isSecretary = state.reservation && state.reservation.client && state.reservation.client.client_user.secretary

    const freePlaces = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.free_places ], []) : []
    // const placeIsGoInternal = selectedPlace && selectedPlace.go_internal

    const isSubmitable = () => {
      if ((state.user && state.user.id === -1) && (!state.email.valid || !state.phone.valid || !state.name.valid)) return false
      if ((state.user && state.user.id === -2) && (!state.client_id || !state.name.valid)) return false
      if (state.from === '' || state.to === '') return false
      // if onetime visitor and he has to pay by himself, then the email is mandatory
      if (state.user && state.user.id === -2 && state.paidByHost && (!state.email.value || !state.email.valid)) return false
      if (ACCENT_REGEX.test(state.templateText) ? state.templateText.length > 140 : state.templateText.length > 320) return false
      // if onetime visitor and we want to send him sms, then the phone is mandatory
      if (state.user && state.user.id === -2 && state.sendSMS && (!state.phone.value || !state.phone.valid)) return false
      // user has enought time credit?
      if (selectedClient && selectedClient.is_time_credit_active && !newReservationActions.isPlaceGoInternal(state) && outOfTimeCredit) {
        return false
      }

      return state.user && (state.place_id || (state.garage && state.garage.flexiplace && freePlaces.length))
    }

    const highlightSelected = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        selected: place.id === state.place_id
      }))
    })

    const errorContent = (<div className={styles.floatCenter}>
      {t([ 'newReservation', 'fail' ])}: <br />
      { state.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={this.modalClick} type="confirm" />
    </div>)

    return (
      <PageBase scrollbarVisible>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error !== undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form
                onSubmit={this.toOverview}
                onBack={this.handleBack}
                submitable={isSubmitable()}
                onHighlight={actions.toggleHighlight}
              >
                <PickUserForm
                  clearForm={this.clearForm}
                />
                {state.user &&
                  ((state.name.valid && state.email.valid && state.phone.valid && state.user.id === -1) ||
                  (state.name.valid && state.user.id === -2) ||
                  state.user.id > 0) &&
                  <SectionWithHeader header={t([ 'newReservation', 'placeSelector' ])}>

                    <GarageClientForm
                      editable={!ongoing || isSecretary}
                    />

                    {state.garage &&
                      <div>
                        <DateTimeForm editable={!ongoing || isSecretary} />

                        <PlaceForm freePlaces={freePlaces} />
                      </div>
                    }
                  </SectionWithHeader>
                }
                <PriceSmsNote
                  accentRegex={ACCENT_REGEX}
                  selectedClient={selectedClient}
                  outOfTimeCredit={outOfTimeCredit}
                />
              </Form>
              {/* Has to be outside of Form tag because it contains Form */}
              <Recurring
                show={state.showRecurring}
                rule={state.recurringRule}
                onSubmit={actions.setRecurringRule}
                showDays={moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'days') < 1}
                showWeeks={moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'weeks') < 1}
              />
            </div>
          </div>

          <div className={styles.rightCollumn}>
            <div className={!state.showMap && styles.displayNone}>
              {state.loading ?
                <div className={styles.loading}>{t([ 'newReservation', 'loadingGarage' ])}</div> :
                <GarageLayout
                  floors={state.garage ? state.garage.floors.map(highlightSelected) : []}
                  onPlaceClick={this.handlePlaceClick}
                />
              }
            </div>
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.newReservation, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationPage)
