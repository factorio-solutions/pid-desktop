import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase          from '../_shared/containers/pageBase/PageBase'
import RoundButton       from '../_shared/components/buttons/RoundButton'
import GarageLayout      from '../_shared/components/garageLayout/GarageLayout'
import Form              from '../_shared/components/form/Form'
import Modal             from '../_shared/components/modal/Modal'
import PickUserForm      from './newReservation/pickUserForm/pickUserForm'
import GarageClientForm  from './newReservation/garageClientForm'
import PlaceForm         from './newReservation/placeForm'
import PriceSmsNote      from './newReservation/priceSmsNote'
import DateTimeForm      from './newReservation/dateTimeForm'
import Recurring         from '../_shared/components/recurring/Recurring'
import SectionWithHeader from '../_shared/components/wrapers/SectionWithHeader'
import {
  getIsSubmittable,
  getFreePlaces,
  getSelectedClient,
  getOutOfTimeCredit,
  getFloors
} from './selectors/newReservation.selectors'

import {
  MOMENT_DATETIME_FORMAT
} from '../_shared/helpers/time'

import * as newReservationActions from '../_shared/actions/newReservation.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t, getLanguage }         from '../_shared/modules/localization/localization'

import styles from './newReservation.page.scss'

export const ACCENT_REGEX = new RegExp('[ěĚšŠčČřŘžŽýÝáÁíÍéÉďĎňŇťŤůŮúÚóÓ]')


class NewReservationPage extends Component {
  static propTypes = {
    state:           PropTypes.object,
    params:          PropTypes.object,
    actions:         PropTypes.object,
    isSubmittable:   PropTypes.bool,
    freePlaces:      PropTypes.array,
    selectedClient:  PropTypes.object,
    outOfTimeCredit: PropTypes.bool,
    floors:          PropTypes.array
  }

  componentDidMount() {
    const { actions, params, state } = this.props
    if (state.reservation && ((typeof params.id === 'undefined' && state.reservation.id)
        || state.reservation.id !== params.id)) {
      actions.clearForm()
    }
    actions.setInitialStore(params.id)
    actions.setLanguage(getLanguage()) // Initialize language of communication
  }

  handleBack = () => nav.to('/reservations')

  toOverview = () => {
    const { state, params, actions } = this.props

    if (params.id) {
      actions.submitReservation(+params.id)
    } else if (
      !state.clientId
      || (
        state.paidByHost
        && (state.user && state.user.id) === (state.currentUser && state.currentUser.id)
      )
    ) {
      nav.to('/reservations/newReservation/overview')
    } else {
      actions.submitReservation()
    }
  }

  handlePlaceClick = place => this.props.actions.setPlace(place)

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

  render() {
    const {
      state,
      actions,
      isSubmittable,
      freePlaces,
      selectedClient,
      outOfTimeCredit,
      floors
    } = this.props

    const ongoing = state.reservation && state.reservation.ongoing
    const isSecretary = state.reservation
    && state.reservation.client
    && state.reservation.client.client_user.secretary

    const errorContent = (
      <div className={styles.floatCenter}>
        {t([ 'newReservation', 'fail' ])}
        {': '}
        <br />
        {state.error}
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={this.modalClick}
          type="confirm"
        />
      </div>
    )

    return (
      <PageBase scrollbarVisible>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error !== undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form
                onSubmit={this.toOverview}
                onReset={this.clearForm}
                submitable={isSubmittable}
                onHighlight={actions.toggleHighlight}
              >
                <PickUserForm />

                {
                  state.user
                  && (
                    (
                      state.name.valid
                      && state.email.valid
                      && state.phone.valid
                      && state.user.id === -1
                    )
                    || (state.name.valid && state.user.id === -2)
                    || state.user.id > 0
                  )
                  && (
                    <SectionWithHeader header={t([ 'newReservation', 'placeSelector' ])}>

                      <GarageClientForm
                        editable={!ongoing || isSecretary}
                      />

                      {state.garage && (
                        <div>
                          <DateTimeForm editable={!ongoing || isSecretary} />

                          <PlaceForm freePlaces={freePlaces} />
                        </div>
                      )}
                    </SectionWithHeader>
                  )
                }
                {state.user && state.garage && (
                  <PriceSmsNote
                    accentRegex={ACCENT_REGEX}
                    selectedClient={selectedClient}
                    outOfTimeCredit={outOfTimeCredit}
                  />
                )}
              </Form>
              {/* Has to be outside of Form tag because it contains Form */}
              <Recurring
                show={state.showRecurring}
                rule={state.recurringRule}
                onSubmit={actions.setRecurringRule}
                preferedFrom={moment(state.from, MOMENT_DATETIME_FORMAT)}
                showDays={moment(state.to, MOMENT_DATETIME_FORMAT)
                  .diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'days') < 1}
                showWeeks={moment(state.to, MOMENT_DATETIME_FORMAT)
                  .diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'weeks') < 1}
              />
            </div>
          </div>

          <div className={styles.rightCollumn}>
            <div className={!state.showMap && styles.displayNone}>
              {state.loading
                ? <div className={styles.loading}>{t([ 'newReservation', 'loadingGarage' ])}</div>
                : (
                  <GarageLayout
                    floors={floors}
                    placeId={state.placeId}
                    onPlaceClick={this.handlePlaceClick}
                  />
                )
              }
            </div>
          </div>
        </div>
      </PageBase>
    )
  }
}

function mapStateToProps(state) {
  const {
    reservation,
    client_id: clientId,
    user,
    paidByHost,
    error,
    name,
    email,
    phone,
    garage,
    showRecurring,
    recurringRule,
    from,
    to,
    showMap,
    loading,
    place_id: placeId
  } = state.newReservation
  const { current_user: currentUser } = state.pageBase

  return {
    state: {
      reservation,
      clientId,
      user,
      paidByHost,
      error,
      name,
      email,
      phone,
      garage,
      showRecurring,
      recurringRule,
      from,
      to,
      showMap,
      loading,
      currentUser,
      placeId
    },
    isSubmittable:   getIsSubmittable(state),
    freePlaces:      getFreePlaces(state),
    selectedClient:  getSelectedClient(state),
    outOfTimeCredit: getOutOfTimeCredit(state),
    floors:          getFloors(state)
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationPage)
