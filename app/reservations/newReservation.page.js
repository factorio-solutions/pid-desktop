import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Uneditable       from '../_shared/components/input/Uneditable'
import RoundButton      from '../_shared/components/buttons/RoundButton'
import GarageLayout     from '../_shared/components/garageLayout/GarageLayout'
import Form             from '../_shared/components/form/Form'
import Modal            from '../_shared/components/modal/Modal'
import Input            from '../_shared/components/input/Input'
import PickUserForm     from './newReservation/pickUserForm'
import GarageClientForm from './newReservation/garageClientForm'
import SmsForm          from './newReservation/smsForm'
import DateTimeForm     from './newReservation/dateTimeForm'
import Recurring        from '../_shared/components/recurring/Recurring'
import {
  MOMENT_DATETIME_FORMAT
} from '../_shared/helpers/time'


import * as newReservationActions from '../_shared/actions/newReservation.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t, getLanguage }         from '../_shared/modules/localization/localization'
import SectionWithHeader          from '../_shared/components/wrapers/SectionWithHeader'


import styles from './newReservation.page.scss'

const ACCENT_REGEX = new RegExp('[ěĚšŠčČřŘžŽýÝáÁíÍéÉďĎňŇťŤ]')


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

  placeLabel = (state, freePlaces) => {
    if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
      return freePlaces.length ? 'flexiblePlaceSelected' : 'noFreePlace'
    } else {
      const floor = state.garage && state.garage.floors.find(floor => floor.places.findById(state.place_id) !== undefined)
      const place = floor && floor.places.findById(state.place_id)
      return floor && place ? `${floor.label} / ${place.label}` : 'noFreePlace'
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

    const placeLabelKey = this.placeLabel(state, freePlaces)

    return (
      <PageBase>
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
                <SectionWithHeader header={t([ 'newReservation', 'placeSelector' ])}>
                  {state.user &&
                  ((state.name.valid && state.email.valid && state.phone.valid && state.user.id === -1) ||
                  (state.name.valid && state.user.id === -2) ||
                  state.user.id > 0) &&
                    <GarageClientForm
                      editable={!ongoing || isSecretary}
                    />
                  }
                  {state.garage &&
                    <div>
                      <DateTimeForm editable={!ongoing || isSecretary} />
                      {/* Place and price  */}
                      <Uneditable
                        label={t([ 'newReservation', 'place' ])}
                        value={placeLabelKey.includes('/') ? placeLabelKey : t([ 'newReservation', placeLabelKey ])}
                        highlight={placeLabelKey === 'noFreePlace'}
                      />

                      {selectedClient && selectedClient.is_time_credit_active &&
                      !newReservationActions.isPlaceGoInternal(state) ?
                        <Uneditable
                          label={t([ 'newReservation', 'price' ])}
                          highlight={state.highlight && outOfTimeCredit}
                          value={`${state.timeCreditPrice} /
                            ${selectedClient[state.paidByHost ? 'current_time_credit' : 'current_users_current_time_credit']}
                            ${selectedClient.time_credit_currency || t([ 'newClient', 'timeCredit' ])}
                          `}
                        /> :
                        <Uneditable
                          label={t([ 'newReservation', 'price' ])}
                          value={`
                            ${((newReservationActions.isPlaceGoInternal(state) || !state.client_id) && state.price) || ''}
                            (${!state.client_id
                              ? t([ 'newReservation', 'onUsersExpenses' ])
                              : !newReservationActions.isPlaceGoInternal(state)
                                ? t([ 'newReservation', 'longtermRent' ])
                                : state.paidByHost
                                  ? t([ 'newReservation', 'onUsersExpenses' ])
                                  : t([ 'newReservation', 'onClientsExpenses' ])
                            })
                          `}
                        />
                      }
                    </div>
                  }
                </SectionWithHeader>
                {/*  Sms Part  */}
                {state.user && state.garage &&
                  <SmsForm accentRegex={ACCENT_REGEX} />
                }
                {/* Note input */}
                {state.garage &&
                  <Input
                    onChange={actions.setNote}
                    label={t([ 'newReservation', 'note' ])}
                    value={state.note}
                    align="left"
                  />
                }
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
            {state.loading ?
              <div className={styles.loading}>{t([ 'newReservation', 'loadingGarage' ])}</div> :
              <GarageLayout
                floors={state.garage ? state.garage.floors.map(highlightSelected) : []}
                onPlaceClick={this.handlePlaceClick}
              />
            }
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
