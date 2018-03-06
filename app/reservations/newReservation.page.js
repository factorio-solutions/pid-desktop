import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase      from '../_shared/containers/pageBase/PageBase'
import Input         from '../_shared/components/input/Input'
import PatternInput  from '../_shared/components/input/PatternInput'
import Uneditable    from '../_shared/components/input/Uneditable'
import DatetimeInput from '../_shared/components/input/DatetimeInput'
import ButtonStack   from '../_shared/components/buttonStack/ButtonStack'
import RoundButton   from '../_shared/components/buttons/RoundButton'
import GarageLayout  from '../_shared/components/garageLayout/GarageLayout'
import Dropdown      from '../_shared/components/dropdown/Dropdown'
import Form          from '../_shared/components/form/Form'
import Modal         from '../_shared/components/modal/Modal'
import Recurring     from '../_shared/components/recurring/Recurring'

import * as newReservationActions from '../_shared/actions/newReservation.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'
import describeRule               from '../_shared/helpers/recurringRuleToDescribtion'
import { MOMENT_DATETIME_FORMAT } from '../_shared/helpers/time'

import styles from './newReservation.page.scss'


class NewReservationPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    params:   PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.setInitialStore(this.props.params.id)
  }

  userDropdown = () => this.props.state.availableUsers.map((user, index) => ({
    label: user.full_name,
    order: user.id === this.props.pageBase.current_user.id ?
      1 :
      user.id === -1 ?
        2 :
        user.id === -2 ?
          3 :
          undefined,
    onClick: () => this.props.actions.downloadUser(this.props.state.availableUsers[index].id)
  }))

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

  toOverview = () => this.props.params.id ?
    this.props.actions.submitReservation(+this.props.params.id) :
    nav.to('/reservations/newReservation/overview')

  handleDuration = () => this.props.actions.setDurationDate(true)

  handleDate = () => this.props.actions.setDurationDate(false)

  handlePlaceClick = place => this.props.actions.setPlace(place)

  hightlightInputs = () => this.props.actions.toggleHighlight()

  showRecurring = () => this.props.actions.setShowRecurring(true)

  modalClick = () => {
    this.props.actions.setError(undefined)
    this.handleBack()
  }

  render() {
    const { state, actions, pageBase } = this.props

    const ongoing = state.reservation !== undefined && state.reservation.ongoing

    const freePlaces = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.free_places ], []) : []

    const isSubmitable = () => {
      if ((state.user && state.user.id === -1) && (!state.email.valid || !state.phone.valid || !state.name.valid)) return false
      if ((state.user && state.user.id === -2) && (!state.client_id || !state.name.valid)) return false
      if (state.car_id === undefined && state.carLicencePlate === '' && (state.user && state.user.id !== -2)) return false
      if (state.from === '' || state.to === '') return false
      return state.user && (state.place_id || (state.garage && state.garage.flexiplace && freePlaces.length))
    }

    const placeLabel = () => {
      if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
        return freePlaces.length ? t([ 'newReservation', 'flexiblePlaceSelected' ]) : t([ 'newReservation', 'No available places' ])
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

    // const placeInlineMenu = <span className={styles.clickable} onClick={actions.autoSelectPlace}>{t([ 'newReservation', 'auto' ])}</span>

    const errorContent = (<div className={styles.floatCenter}>
      {t([ 'newReservation', 'fail' ])}: <br />
      { state.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={this.modalClick} type="confirm" />
    </div>)

    const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1

    return (
      <PageBase>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error !== undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form onSubmit={this.toOverview} onBack={this.handleBack} submitable={isSubmitable()} onHighlight={this.hightlightInputs}>
                {((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) &&
                  <Dropdown
                    editable={!ongoing}
                    label={t([ 'newReservation', 'selectUser' ])}
                    content={this.userDropdown()}
                    selected={state.availableUsers.findIndex(user => state.user && user.id === state.user.id)}
                    style="reservation"
                    highlight={state.highlight}
                    filter
                  />
                }
                <Input
                  onChange={actions.setNote}
                  label={t([ 'newReservation', 'note' ])}
                  value={state.note}
                  align="center"
                />

                {state.user && state.user.id < 0 &&
                  <PatternInput
                    onChange={actions.setHostName}
                    label={t([ 'newReservation', state.user.id === -1 ? 'hostsName' : 'visitorsName' ])}
                    error={t([ 'signup_page', 'nameInvalid' ])}
                    pattern="^(?!\s*$).+"
                    value={state.name.value}
                    highlight={state.highlight}
                  />
                }
                {state.user && state.user.id < 0 &&
                  <PatternInput
                    onChange={actions.setHostPhone}
                    label={t([ 'newReservation', state.user.id === -1 ? 'hostsPhone' : 'visitorsPhone' ])}
                    error={t([ 'signup_page', 'phoneInvalid' ])}
                    pattern="\+[\d]{2,4}[\d]{3,}"
                    value={state.phone.value}
                    highlight={state.highlight && state.user.id === -1}
                  />
                }
                {state.user && state.user.id < 0 &&
                  <PatternInput
                    onChange={actions.setHostEmail}
                    label={t([ 'newReservation', state.user.id === -1 ? 'hostsEmail' : 'visitorsEmail' ])}
                    error={t([ 'signup_page', 'emailInvalid' ])}
                    pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                    value={state.email.value}
                    highlight={state.highlight && state.user.id === -1}
                  />
                }
                {(state.user && state.user.id === -2) && !state.email.valid && !state.phone.valid && <div className={styles.fillInContact}>
                  {t([ 'newReservation', 'fillInContact' ])}
                </div>
                }

                {state.user &&
                  <Dropdown
                    editable={!ongoing}
                    label={t([ 'newReservation', 'selectGarage' ])}
                    content={this.garageDropdown()}
                    selected={state.user.availableGarages.findIndexById(state.garage && state.garage.id)}
                    style="reservation"
                    highlight={state.highlight}
                  />
                }
                {state.user && state.user.availableClients && state.user.availableClients.length > 1 &&
                  <Dropdown
                    editable={!ongoing}
                    label={t([ 'newReservation', 'selectClient' ])}
                    content={this.clientDropdown()}
                    selected={state.user.availableClients.findIndexById(state.client_id)}
                    style="reservation"
                    filter
                  />
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
                    align="center"
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

                <DatetimeInput
                  editable={!ongoing}
                  onBlur={actions.formatFrom}
                  onChange={actions.setFrom}
                  label={t([ 'newReservation', 'begins' ])}
                  error={t([ 'newReservation', 'invalidaDate' ])}
                  value={state.from}
                  inlineMenu={beginsInlineMenu}
                />
                {state.durationDate ?
                  <Input
                    onChange={actions.durationChange}
                    label={t([ 'newReservation', 'duration' ])}
                    error={t([ 'newReservation', 'invalidaValue' ])}
                    inlineMenu={endsInlineMenu}
                    value={String(moment.duration(moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT))).asHours())}
                    type="number"
                    min={0.25}
                    step={0.25}
                    align="right"
                  /> :
                  <DatetimeInput
                    onBlur={actions.formatTo}
                    onChange={actions.setTo}
                    label={t([ 'newReservation', 'ends' ])}
                    error={t([ 'newReservation', 'invalidaDate' ])}
                    value={state.to}
                    inlineMenu={endsInlineMenu}
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

                <Uneditable label={t([ 'newReservation', 'place' ])} value={placeLabel()} />
                <Uneditable label={t([ 'newReservation', 'price' ])} value={state.client_id ? t([ 'newReservation', 'onClientsExpenses' ]) : state.price || ''} />
              </Form>
            </div>
          </div>

          <div className={styles.rightCollumn}>
            {state.loading ?
              <div className={styles.loading}>{t([ 'newReservation', 'loadingGarage' ])}</div> :
              state.garage && <GarageLayout
                floors={state.garage.floors.map(highlightSelected)}
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
