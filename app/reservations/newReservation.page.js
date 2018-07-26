import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Uneditable       from '../_shared/components/input/Uneditable'
import RoundButton      from '../_shared/components/buttons/RoundButton'
import GarageLayout     from '../_shared/components/garageLayout/GarageLayout'
import SearchField      from '../_shared/components/searchField/SearchField'
import Form             from '../_shared/components/form/Form'
import Modal            from '../_shared/components/modal/Modal'
import Input            from '../_shared/components/input/Input'
import ExistingUserForm from './newReservation/existingUserForm'
import NewUserForm      from './newReservation/newUserForm'
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
    const { actions, params } = this.props
    actions.setInitialStore(params.id)
    actions.setLanguage(getLanguage()) // Initialize language of communication
  }

  userDropdown = () => {
    const makeButton = (user, label, text) => {
      return {
        label,
        text:    [ <b>{user.full_name}</b>, ' ', text ],
        onClick: () => this.props.actions.downloadUser(user.id, user.rights)
      }
    }

    const buttons = []
    const users = this.props.state.availableUsers.reduce((acc, user) => {
      if (user.id < 0) {
        let roleName = ''
        if (user.id === -1) {
          if (user.rights && user.rights.internal) {
            roleName = 'newInternal'
          } else {
            roleName = 'newHost'
          }
        } else {
          roleName = 'onetimeVisit'
        }
        buttons.push(makeButton(user, [ <b>{user.full_name}</b> ], t([ 'newReservation', `${roleName}Text` ])))
      } else {
        acc.push({
          label:   user.full_name,
          phone:   user.phone,
          email:   user.email,
          order:   user.id === this.props.pageBase.current_user.id ? 1 : undefined,
          onClick: () => {
            const { state } = this.props
            if (state.user === undefined || state.user.id !== user.id) {
              this.props.actions.downloadUser(user.id, user.rights)
            }
          }
        })
      }
      return acc
    }, [])
    return { users, buttons }
  }

  handleBack = () => nav.to('/reservations')

  toOverview = () => {
    const { state, pageBase } = this.props

    if (this.props.params.id) {
      this.props.actions.submitReservation(+this.props.params.id)
    } else if (!state.client_id ||
      (state.paidByHost && (state.user && state.user.id) === (pageBase.current_user && pageBase.current_user.id))
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
    const { state, pageBase, actions } = this.props

    const ongoing = state.reservation && state.reservation.ongoing
    const onetime = state.reservation && state.reservation.onetime
    const isSecretary = state.reservation && state.reservation.client && state.reservation.client.is_secretary
    const selectedClient = actions.selectedClient()
    const outOfTimeCredit = selectedClient && state.timeCreditPrice > selectedClient[state.paidByHost ? 'current_time_credit' : 'current_users_current_time_credit']

    const freePlaces = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.free_places ], []) : []
    // const placeIsGoInternal = selectedPlace && selectedPlace.go_internal
    const userDropdown = this.userDropdown()

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

    const placeLabel = () => {
      if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
        return freePlaces.length ? t([ 'newReservation', 'flexiblePlaceSelected' ]) : t([ 'newReservation', 'noFreePlace' ])
      } else {
        const floor = state.garage && state.garage.floors.find(floor => floor.places.findById(state.place_id) !== undefined)
        const place = floor && floor.places.findById(state.place_id)
        return floor && place ? `${floor.label} / ${place.label}` : t([ 'newReservation', 'noFreePlace' ])
      }
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

    const getUserToSelect = () => {
      if (state.reservation && state.reservation.onetime) {
        return state.availableUsers.findIndex(user => user.id === -2)
      } else if (state.reservation && state.user) {
        return state.availableUsers.findIndexById(state.user.id)
      } else if (state.user && state.user.id === -1) {
        return userDropdown.users.findIndex(user => state.user && user.id === state.user.id && user.rights && JSON.stringify(user.rights) === JSON.stringify(state.user.rights))
      } else {
        return userDropdown.users.findIndex(user => state.user && user.id === state.user.id)
      }
    }

    return (
      <PageBase>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error !== undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form onSubmit={this.toOverview} onBack={this.handleBack} submitable={isSubmitable()} onHighlight={actions.toggleHighlight}>
                { !(state.user && (state.user.id < 0 || onetime)) &&
                  ((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) &&
                  <div className={styles.searchField}>
                    <span
                      className={styles.resetButton}
                      onClick={this.clearForm}
                    >
                      <i className="fa fa-times-circle" aria-hidden="true" />
                    </span>
                    <SearchField
                      editable={!ongoing || isSecretary}
                      placeholder={t([ 'newReservation', 'selectUser' ]) + ' *'}
                      dropdownContent={userDropdown.users}
                      selected={getUserToSelect()}
                      highlight={state.highlight}
                      searchQuery={state.name.value}
                      onChange={actions.setHostName}
                      buttons={userDropdown.buttons}
                      ref={component => this.searchField = component}
                    />
                  </div>
                }

                {state.user && state.user.id >= 0 &&
                  <ExistingUserForm
                    editable={!ongoing || isSecretary}
                  />
                }

                {state.user && state.user.id < 0 &&
                  <NewUserForm
                    editable={!ongoing || isSecretary}
                    onetime={onetime}
                    clearForm={this.clearForm}
                  />
                }
                {(state.user && state.user.id === -2) && !state.email.valid && !state.phone.valid &&
                  <div className={styles.fillInContact}>
                    {t([ 'newReservation', 'fillInContact' ])}
                  </div>
                }

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
                      value={placeLabel()}
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
                          ${(newReservationActions.isPlaceGoInternal(state) && state.price) || ''}
                          (${state.client_id &&
                            !newReservationActions.isPlaceGoInternal(state)
                            ? t([ 'newReservation', 'longtermRent' ])
                            : !state.paidByHost
                              ? t([ 'newReservation', 'onClientsExpenses' ])
                              : t([ 'newReservation', 'onUsersExpenses' ])
                          })
                        `}
                      />
                    }
                    {/*  Sms Part  */}
                    {state.user &&
                      <SmsForm accentRegex={ACCENT_REGEX} />
                    }
                    {/* Note input */}
                    <Input
                      onChange={actions.setNote}
                      label={t([ 'newReservation', 'note' ])}
                      value={state.note}
                      align="left"
                    />
                  </div>
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
