import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase      from '../_shared/containers/pageBase/PageBase'
import Input         from '../_shared/components/input/Input'
import PatternInput  from '../_shared/components/input/PatternInput'
import Uneditable    from '../_shared/components/input/Uneditable'
import Dateinput     from '../_shared/components/input/DateInput'
import TimeInput     from '../_shared/components/input/TimeInput'
import ButtonStack   from '../_shared/components/buttonStack/ButtonStack'
import RoundButton   from '../_shared/components/buttons/RoundButton'
import GarageLayout  from '../_shared/components/garageLayout/GarageLayout'
import Dropdown      from '../_shared/components/dropdown/Dropdown'
import SearchField   from '../_shared/components/searchField/SearchField'
import Form          from '../_shared/components/form/Form'
import Modal         from '../_shared/components/modal/Modal'
import Recurring     from '../_shared/components/recurring/Recurring'

import * as newReservationActions from '../_shared/actions/newReservation.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t, getLanguage }         from '../_shared/modules/localization/localization'
import describeRule               from '../_shared/helpers/recurringRuleToDescribtion'
import { MOMENT_DATETIME_FORMAT, MOMENT_DATE_FORMAT, MOMENT_TIME_FORMAT } from '../_shared/helpers/time'
import { AVAILABLE_LANGUAGES }    from '../routes'

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
    const makeButton = (id, label, text, user) => {
      return {
        label,
        text:    [ t([ 'newReservation',  'dropButtonDescrText' ]), <b>{user.full_name}</b>, text ],
        onClick: () => this.props.actions.downloadUser(id)
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
        buttons.push(makeButton(user.id, [ t([ 'newReservation', 'dropButtonText' ]), <b>{user.full_name}</b> ], t([ 'newReservation', `${roleName}Text` ]), user))
      } else {
        acc.push({
          label:   user.full_name,
          phone:   user.phone,
          email:   user.email,
          order:   user.id === this.props.pageBase.current_user.id ? 1 : undefined,
          onClick: () => this.props.actions.downloadUser(user.id, user.rights)
        })
      }
      return acc
    }, [])
    return { users, buttons }
  }


  garageDropdown = () => {
    const { state, actions } = this.props
    return (state.user && state.user.availableGarages && state.user.availableGarages.map((garage, index) => ({
      label:   garage.name,
      onClick: () => actions.downloadGarage(state.user.availableGarages[index].id)
    }))) || []
  }

  clientDropdown = () => this.props.state.user.availableClients.map((client, index) => ({
    label:   client.name,
    order:   client.id === undefined && 1,
    onClick: () => this.props.actions.setClientId(this.props.state.user.availableClients[index].id)
  })) || []

  carDropdown = () => {
    const { state, actions } = this.props
    return (state.user && state.user.reservable_cars && state.user.reservable_cars.map((car, index) => ({
      label:   car.name,
      onClick: () => actions.setCarId(state.user.reservable_cars[index].id)
    }))) || []
  }

  handleBack = () => nav.to('/reservations')

  toOverview = () => {
    if (this.props.params.id) {
      this.props.actions.submitReservation(+this.props.params.id)
    } else {
      nav.to('/reservations/newReservation/overview')
    }
  }

  handleDuration = () => this.props.actions.setDurationDate(true)

  handleDate = () => this.props.actions.setDurationDate(false)

  handlePlaceClick = place => this.props.actions.setPlace(place)

  hightlightInputs = () => this.props.actions.toggleHighlight()

  showRecurring = () => this.props.actions.setShowRecurring(true)

  modalClick = () => {
    this.props.actions.setError(undefined)
    this.handleBack()
  }

  onTextAreaChange = event => this.props.actions.setTemplateText(event.target.value)

  render() {
    const { state, actions, pageBase } = this.props

    const ongoing = state.reservation !== undefined && state.reservation.ongoing

    const onetime = state.reservation !== undefined && state.reservation.onetime

    const freePlaces = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.free_places ], []) : []
    const places = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.places ], []) : []
    const selectedPlace = places.findById(state.place_id)
    // const placeIsGoInternal = selectedPlace && selectedPlace.go_internal
    const userDropdown = this.userDropdown()

    const isSubmitable = () => {
      if ((state.user && state.user.id === -1) && (!state.email.valid || !state.phone.valid || !state.name.valid)) return false
      if ((state.user && state.user.id === -2) && (!state.client_id || !state.name.valid)) return false
      if (state.car_id === undefined && state.carLicencePlate === '' && (state.user && state.user.id !== -2)) return false
      if (state.from === '' || state.to === '') return false
      // if onetime visitor and he has to pay by himself, then the email is mandatory
      if (state.user && state.user.id === -2 && state.paidByHost && (!state.email.value || !state.email.valid)) return false
      if (ACCENT_REGEX.test(state.templateText) ? state.templateText.length > 140 : state.templateText.length > 320) return false
      // if onetime visitor and we want to send him sms, then the phone is mandatory
      if (state.user && state.user.id === -2 && state.sendSMS && (!state.phone.value || !state.phone.valid)) return false
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

    const beginsInlineMenu = <span className={styles.clickable} onClick={actions.beginsToNow}>{t([ 'newReservation', 'now' ])}</span>

    const endsInlineMenu = (<ButtonStack style="horizontal" divider={<span> | </span>}>
      <span className={`${state.durationDate ? styles.selected : styles.clickable}`} onClick={this.handleDuration} >{t([ 'newReservation', 'duration' ])}</span>
      <span className={`${!state.durationDate ? styles.selected : styles.clickable}`} onClick={this.handleDate} >{t([ 'newReservation', 'date' ])}</span>
    </ButtonStack>)

    const errorContent = (<div className={styles.floatCenter}>
      {t([ 'newReservation', 'fail' ])}: <br />
      { state.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={this.modalClick} type="confirm" />
    </div>)

    const getUserToSelect = () => {
      if (state.reservation && state.reservation.onetime) {
        return state.availableUsers.findIndex(user => user.id === -2)
      } else if (state.user && state.user.id === -1) {
        return userDropdown.users.findIndex(user => state.user && user.id === state.user.id && user.rights && JSON.stringify(user.rights) === JSON.stringify(state.user.rights))
      } else {
        return userDropdown.users.findIndex(user => state.user && user.id === state.user.id)
      }
    }

    const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1

    const renderLanguageButton = lang => {
      const selectLanguage = state.user.language ? state.user.language : state.language
      return (<RoundButton
        state={(selectLanguage === lang && 'selected') || ((onetime || state.user.language) && 'disabled')}
        content={lang.toUpperCase()}
        onClick={() => actions.setLanguage(lang)}
        type="action"
      />)
    }

    return (
      <PageBase>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error !== undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form onSubmit={this.toOverview} onBack={this.handleBack} submitable={isSubmitable()} onHighlight={this.hightlightInputs}>
                {!(state.user && (state.user.id < 0 || onetime)) && ((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) && // (state.user && state.user.id > 0) &&
                  <SearchField
                    editable={!ongoing}
                    placeholder={t([ 'newReservation', 'selectUser' ])}
                    content={userDropdown.users}
                    selected={getUserToSelect()}
                    highlight={state.highlight}
                    filter
                    buttons={userDropdown.buttons}
                  />
                }

                {state.user && state.user.id >= 0 &&
                  <div>
                    <div className={styles.languagesSelector}>
                      <h4 style={{ fontWeight: 'normal', margin: '0' }}>{t([ 'newReservation', 'languageSelector' ])}</h4>
                      {AVAILABLE_LANGUAGES.map(renderLanguageButton)}
                    </div>
                    <PatternInput
                      readOnly={onetime || (state.user && state.user.id > - 1)}
                      onChange={actions.setHostPhone}
                      label={t([ 'newReservation', 'phone' ])}
                      error={t([ 'signup_page', 'phoneInvalid' ])}
                      pattern="\+[\d]{2,4}[\d\s]{3,}"
                      value={state.user.id >= 0 ? state.user.phone : state.phone.value}
                      highlight={state.highlight && (state.user.id === -1 || (state.user.id === -2 && state.sendSMS && (!state.phone.value || !state.phone.valid)))}
                      align="left"
                    />
                    <PatternInput
                      readOnly={onetime || (state.user && state.user.id > - 1)}
                      onChange={actions.setHostEmail}
                      label={t([ 'newReservation', 'email' ])}
                      error={t([ 'signup_page', 'emailInvalid' ])}
                      pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                      value={(state.user.email)}
                      highlight={state.highlight && (state.user.id === -1 || (state.user.id === -2 && state.paidByHost && (!state.email.value || !state.email.valid)))}
                      align="left"
                    />
                  </div>
                }

                {state.user && state.user.id < 0 &&
                  <div>
                    <PatternInput
                      readOnly={onetime || (state.user && state.user.id > - 1)}
                      onChange={actions.setHostName}
                      label={t([ 'newReservation', state.user.id === -1 ? 'hostsName' : 'visitorsName' ])}
                      error={t([ 'signup_page', 'nameInvalid' ])}
                      pattern="^(?!\s*$).+"
                      value={state.name.value}
                      highlight={state.highlight}
                      align="left"
                    />
                    <div className={styles.languagesSelector}>
                      <h4 style={{ fontWeight: 'normal', margin: '0' }}>{t([ 'newReservation', 'languageSelector' ])}</h4>
                      {AVAILABLE_LANGUAGES.map(renderLanguageButton)}
                    </div>
                    <PatternInput
                      readOnly={onetime || (state.user && state.user.id > - 1)}
                      onChange={actions.setHostPhone}
                      label={t([ 'newReservation', state.user.id === -1 ? 'hostsPhone' : 'visitorsPhone' ])}
                      error={t([ 'signup_page', 'phoneInvalid' ])}
                      pattern="\+[\d]{2,4}[\d\s]{3,}"
                      value={state.user ? state.user.phone : state.phone.value}
                      highlight={state.highlight && (state.user.id === -1 || (state.user.id === -2 && state.sendSMS && (!state.phone.value || !state.phone.valid)))}
                      align="left"
                    />
                    <PatternInput
                      readOnly={onetime || (state.user && state.user.id > - 1)}
                      onChange={actions.setHostEmail}
                      label={t([ 'newReservation', state.user.id === -1 ? 'hostsEmail' : 'visitorsEmail' ])}
                      error={t([ 'signup_page', 'emailInvalid' ])}
                      pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                      value={(state.email.value)}
                      highlight={state.highlight && (state.user.id === -1 || (state.user.id === -2 && state.paidByHost && (!state.email.value || !state.email.valid)))}
                      align="left"
                    />
                    <Input
                      onChange={actions.setNote}
                      label={t([ 'newReservation', 'note' ])}
                      value={state.note}
                      align="left"
                    />
                  </div>
                }
                {(state.user && state.user.id === -2) && !state.email.valid && !state.phone.valid && <div className={styles.fillInContact}>
                  {t([ 'newReservation', 'fillInContact' ])}
                </div>
                }
                {state.user && (state.user.reservable_cars && state.user.reservable_cars.length === 0 ?
                  <Input
                    readOnly={ongoing}
                    onChange={actions.setCarLicencePlate}
                    value={state.carLicencePlate}
                    label={t([ 'newReservation', 'licencePlate' ])}
                    error={t([ 'newReservation', 'licencePlateInvalid' ])}
                    placeholder={t([ 'newReservation', 'licencePlatePlaceholder' ])}
                    type="text"
                    align="left"
                    highlight={state.highlight && state.user.id !== -2}
                  /> :
                  <Dropdown
                    editable={!ongoing}
                    label={t([ 'newReservation', 'selectCar' ])}
                    content={this.carDropdown()}
                    selected={state.user && state.user.reservable_cars && state.user.reservable_cars.findIndexById(state.car_id)}
                    style="reservation"
                    highlight={state.highlight}
                  />
                )}
                {state.user && ((state.email.valid && state.phone.valid && state.carLicencePlate) || state.user.id !== -1) &&
                  <Dropdown
                    editable={!ongoing}
                    label={t([ 'newReservation', 'selectGarage' ])}
                    content={this.garageDropdown()}
                    selected={state.user.availableGarages.findIndexById(state.garage && state.garage.id)}
                    style="reservation"
                    highlight={state.highlight}
                    placeholder={t([ 'newReservation', 'selectGarage' ])}
                  />
                }
                {state.user && state.user.availableClients && state.user.availableClients.length > 1 && state.garage &&
                  <Dropdown
                    editable={!ongoing}
                    label={t([ 'newReservation', 'selectClient' ])}
                    content={this.clientDropdown()}
                    selected={state.user.availableClients.findIndexById(state.client_id)}
                    style="reservation"
                    filter
                    placeholder={t([ 'newReservation', 'selectClient' ])}
                  />
                }
                {state.garage && state.garage.has_payment_gate && state.client_id && selectedPlace && selectedPlace.go_internal && <div>
                  <input
                    type="checkbox"
                    checked={state.paidByHost}
                    onChange={() => actions.setPaidByHost(!state.paidByHost)}
                  />
                  {t([ 'newReservation', 'paidByHost' ])}
                </div>
                }
                {state.client_id &&
                  <div className={styles.dateTimeContainer}>
                    <div className={styles.leftCollumn}>
                      <Dateinput
                        editable={!ongoing}
                        onBlur={actions.formatFrom}
                        onChange={actions.setFromDate}
                        label={t([ 'newReservation', 'begins' ])}
                        error={t([ 'newReservation', 'invalidaDate' ])}
                        value={moment(state.from, MOMENT_DATETIME_FORMAT).format(MOMENT_DATE_FORMAT)}
                        inlineMenu={beginsInlineMenu}
                      />
                      <TimeInput
                        editable={!ongoing}
                        onBlur={actions.formatFrom}
                        onChange={actions.setFromTime}
                        label={t([ 'newReservation', 'begins' ])}
                        error={t([ 'newReservation', 'invalidaDate' ])}
                        value={moment(state.from, MOMENT_DATETIME_FORMAT).format(MOMENT_TIME_FORMAT)}
                        inlineMenu={beginsInlineMenu}
                      />
                    </div>
                    <div className={styles.middleCollumn} >
                      <i className="fa fa-arrow-right" aria-hidden="true" />
                    </div>
                    <div className={styles.rightCcollumn}>
                      <Dateinput
                        editable={!ongoing}
                        onBlur={actions.formatTo}
                        onChange={actions.setToDate}
                        label={t([ 'newReservation', 'ends' ])}
                        error={t([ 'newReservation', 'invalidaDate' ])}
                        value={moment(state.to, MOMENT_DATETIME_FORMAT).format(MOMENT_DATE_FORMAT)}
                        inlineMenu={beginsInlineMenu}
                      />
                      <TimeInput
                        editable={!ongoing}
                        onBlur={actions.formatTo}
                        onChange={actions.setToTime}
                        label={t([ 'newReservation', 'ends' ])}
                        error={t([ 'newReservation', 'invalidaDate' ])}
                        value={moment(state.to, MOMENT_DATETIME_FORMAT).format(MOMENT_TIME_FORMAT)}
                        inlineMenu={beginsInlineMenu}
                      />
                    </div>
                  </div>
                }
                {state.client_id && state.durationDate &&
                  <Input
                    onChange={actions.durationChange}
                    label={t([ 'newReservation', 'duration' ])}
                    error={t([ 'newReservation', 'invalidaValue' ])}
                    inlineMenu={endsInlineMenu}
                    value={String(moment.duration(moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT))).asHours())}
                    type="number"
                    min={0.25}
                    step={0.25}
                    align="left"
                  />
                }

                {state.client_id && state.reservation === undefined &&
                  <div className={`${styles.recurringForm} ${overMonth && styles.hidden}`}>
                    <span className={`${styles.rule} ${!state.useRecurring && styles.disabled}`} onClick={this.showRecurring}>
                      {state.recurringRule ? describeRule(state.recurringRule) : t([ 'recurringReservation', 'repeat' ])}
                    </span>
                    <RoundButton content={<i className="fa fa-repeat" aria-hidden="true" />} onClick={this.showRecurring} type="action" size="small" />
                    <Recurring
                      show={state.showRecurring}
                      rule={state.recurringRule}
                      onSubmit={actions.setRecurringRule}
                      showDays={moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'days') < 1}
                      showWeeks={moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'weeks') < 1}
                    />
                  </div>
                }
                {state.client_id &&
                  <div>
                    <Uneditable label={t([ 'newReservation', 'place' ])} value={placeLabel()} />
                    <Uneditable label={t([ 'newReservation', 'price' ])} value={state.client_id && !state.paidByHost ? t([ 'newReservation', 'onClientsExpenses' ]) : state.price || ''} />
                  </div>
                }

                {state.client_id && state.user &&
                  state.user.availableClients.findById(state.client_id) &&
                  state.user.availableClients.findById(state.client_id).has_sms_api_token &&
                  state.user.availableClients.findById(state.client_id).is_sms_api_token_active &&
                  state.user.availableClients.findById(state.client_id).is_secretary &&
                  <div>
                    <div className={styles.sendSmsCheckbox} onClick={() => actions.setSendSms(!state.sendSMS)}>
                      <input type="checkbox" checked={state.sendSMS} align="left" />
                      {t([ 'newReservation', 'sendSms' ])}
                    </div>
                    {state.sendSMS &&
                      <div className={styles.smsTemplates}>
                        <Dropdown
                          label={t([ 'newReservation', 'selectTemplate' ])}
                          content={state.user.availableClients.findById(state.client_id).sms_templates.map((template, index) => ({
                            label:   template.name,
                            onClick: () => actions.setSelectedTemplate(index, template.template)
                          }))}
                          selected={state.selectedTemplate}
                          style="reservation"
                        />
                        <div className={styles.textLabel}>
                          <label>{t([ 'newReservation', 'smsText' ])}</label>
                          <span className={styles.removeDiacritics} onClick={actions.removeDiacritics}>{t([ 'newReservation', 'removeDiacritics' ])}</span>
                        </div>
                        <textarea value={state.templateText} onChange={this.onTextAreaChange} />
                        <div className={state.highlight && state.templateText.length > (ACCENT_REGEX.test(state.templateText) ? 140 : 320) && styles.redText}>
                          {state.templateText.length}/{ACCENT_REGEX.test(state.templateText) ? 140 : 320}
                          {t([ 'newReservation', 'character' ])}
                        </div>
                      </div>
                    }
                  </div>
                }
              </Form>
            </div>
          </div>

          <div className={styles.rightCollumn}>
            {state.loading ?
              <div className={styles.loading}>{t([ 'newReservation', 'loadingGarage' ])}</div> :
              <GarageLayout
                floors={state.garage ? state.garage.floors.map(highlightSelected) : []}
                // floors={[]}
                onPlaceClick={ongoing ? () => {} : this.handlePlaceClick}
                showEmptyFloors={false}
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
