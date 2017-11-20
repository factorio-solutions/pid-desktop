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
import GarageLayout  from '../_shared/components/garageLayout/GarageLayout2'
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
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.setInitialStore(this.props.params.id)
  }

  render() {
    const { state, actions, pageBase } = this.props

    const ongoing = state.reservation !== undefined && state.reservation.ongoing
    const handleBack = () => { nav.to('/reservations') }
    const toOverview = () => { this.props.params.id ? actions.submitReservation(+this.props.params.id) : nav.to('/reservations/newReservation/overview') }
    const handleDuration = () => { actions.setDurationDate(true) }
    const handleDate = () => { actions.setDurationDate(false) }
    const hightlightInputs = () => { actions.toggleHighlight() }
    const handlePlaceClick = place => { actions.setPlace(place) }
    const handleTo = (value, valid) => { valid && actions.setTo(value) }
    const handleFrom = (value, valid) => { valid && actions.setFrom(value) }

    const modalClick = () => {
      actions.setError(undefined)
      handleBack()
    }

    const userDropdown = () => {
      const userSelected = (index, a) => { actions.downloadUser(state.availableUsers[index].id) }
      return state.availableUsers.map((user, index) => {
        return { label: user.full_name, onClick: userSelected.bind(this, index) }
      }) || []
    }

    const garageDropdown = () => {
      const garageSelected = index => { actions.downloadGarage(state.user.availableGarages[index].id) }
      return state.user && state.user.availableGarages && state.user.availableGarages.map((garage, index) => {
        return { label: garage.name, onClick: garageSelected.bind(this, index) }
      }) || []
    }

    const clientDropdown = () => {
      const clientSelected = index => { actions.setClientId(state.user.availableClients[index].id) }
      const clients = state.user.availableClients.map((client, index) => {
        return { label: client.name, onClick: clientSelected.bind(this, index) }
      }) || []
      return clients
    }

    const carDropdown = () => {
      const carSelected = index => { actions.setCarId(state.user.reservable_cars[index].id) }
      return state.user && state.user.reservable_cars && state.user.reservable_cars.map((car, index) => {
        return { label: car.name, onClick: carSelected.bind(this, index) }
      }) || []
    }

    const isSubmitable = () => {
      if ((state.user && state.user.id === -1) && (!state.email.valid || !state.phone.valid || !state.name.valid)) return false
      if (state.car_id == undefined && state.carLicencePlate == '') return false
      if (state.from == '' || state.to == '') return false
      return state.user && state.place_id
    }

    const placeLabel = () => {
      const findPlace = place => { return place.id == state.place_id }
      const floor = state.garage && state.garage.floors.find(floor => { return floor.places.find(findPlace) != undefined })
      const place = floor && floor.places.find(findPlace)
      return floor && place ? `${floor.label} / ${place.label}` : ''
    }

    const highlightSelected = floor => {
      floor.places.map(place => {
        place.available = place.available // set place of edited reservation as available
        place.selected = place.id == state.place_id
        return place
      })
      return floor
    }

    const beginsInlineMenu = <span className={styles.clickable} onClick={actions.beginsToNow}>{t([ 'newReservation', 'now' ])}</span>

    const endsInlineMenu = (<ButtonStack style="horizontal" divider={<span> | </span>}>
      <span className={`${state.durationDate ? styles.selected : styles.clickable}`} onClick={handleDuration} >{t([ 'newReservation', 'duration' ])}</span>
      <span className={`${!state.durationDate ? styles.selected : styles.clickable}`} onClick={handleDate} >{t([ 'newReservation', 'date' ])}</span>
    </ButtonStack>)

    const placeInlineMenu = <span className={styles.clickable} onClick={actions.autoSelectPlace}>{t([ 'newReservation', 'auto' ])}</span>

    const errorContent = (<div className={styles.floatCenter}>
      {t([ 'newReservation', 'fail' ])}: <br />
      { state.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={modalClick} type="confirm" />
    </div>)

    const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1

    return (
      <PageBase>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error != undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form onSubmit={toOverview} onBack={handleBack} submitable={isSubmitable()} onHighlight={hightlightInputs}>
                {((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) && <Dropdown editable={!ongoing} label={t([ 'newReservation', 'selectUser' ])} content={userDropdown()} selected={state.availableUsers.findIndex(user => { return state.user && user.id == state.user.id })} style="reservation" highlight={state.highlight} /> }
                {state.user && state.user.id === -1 && <PatternInput onChange={actions.setHostName} label={t([ 'newReservation', 'hostsName' ])} error={t([ 'signup_page', 'nameInvalid' ])} pattern="^(?!\s*$).+" value={state.name.value} highlight={state.highlight} />}
                {state.user && state.user.id === -1 && <PatternInput onChange={actions.setHostPhone} label={t([ 'newReservation', 'hostsPhone' ])} error={t([ 'signup_page', 'phoneInvalid' ])} pattern="\+[\d]{2,4}[\d]{3,}" value={state.phone.value} highlight={state.highlight} />}
                {state.user && state.user.id === -1 && <PatternInput onChange={actions.setHostEmail} label={t([ 'newReservation', 'hostsEmail' ])} error={t([ 'signup_page', 'emailInvalid' ])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" value={state.email.value} highlight={state.highlight} />}

                {state.user && <Dropdown editable={!ongoing} label={t([ 'newReservation', 'selectGarage' ])} content={garageDropdown()} selected={state.user.availableGarages.findIndex(garage => { return state.garage && garage.id === state.garage.id })} style="reservation" highlight={state.highlight} />}
                {state.user && state.user.availableClients && state.user.availableClients.length > 1 && <Dropdown editable={!ongoing} label={t([ 'newReservation', 'selectClient' ])} content={clientDropdown()} selected={state.user.availableClients.findIndex(client => { return client.id == state.client_id })} style="reservation" />}
                {state.user && (state.user.reservable_cars && state.user.reservable_cars.length == 0 ? <Input readOnly={ongoing} onChange={actions.setCarLicencePlate} value={state.carLicencePlate} label={t([ 'newReservation', 'licencePlate' ])} error={t([ 'newReservation', 'licencePlateInvalid' ])} placeholder={t([ 'newReservation', 'licencePlatePlaceholder' ])} type="text" name="reservation[licence_plate]" align="center" highlight={state.highlight} />
                                               : <Dropdown editable={!ongoing} label={t([ 'newReservation', 'selectCar' ])} content={carDropdown()} selected={state.user && state.user.reservable_cars && state.user.reservable_cars.findIndex(car => { return car.id == state.car_id })} style="reservation" highlight={state.highlight} />)}

                <DatetimeInput onChange={handleFrom} label={t([ 'newReservation', 'begins' ])} error={t([ 'newReservation', 'invalidaDate' ])} value={state.from} inlineMenu={beginsInlineMenu} editable={!ongoing} />
                {state.durationDate ? <Input onChange={actions.durationChange} label={t([ 'newReservation', 'duration' ])} error={t([ 'newReservation', 'invalidaValue' ])} inlineMenu={endsInlineMenu} value={String(moment.duration(moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT))).asHours())} type="number" min={0.25} step={0.25} align="right" />
                                    : <DatetimeInput onChange={handleTo} label={t([ 'newReservation', 'ends' ])} error={t([ 'newReservation', 'invalidaDate' ])} inlineMenu={endsInlineMenu} value={state.to} />}
                {state.client_id && state.reservation === undefined && <div className={`${styles.recurringForm} ${overMonth && styles.hidden}`}>
                  <input type="checkbox" checked={state.useRecurring} onChange={actions.setUseRecurring} />
                  <span className={`${styles.rule} ${!state.useRecurring && styles.disabled}`} onClick={() => actions.setShowRecurring(true)}>{state.recurringRule ? describeRule(state.recurringRule) : t([ 'recurringReservation', 'repeat' ])}</span>
                  <Recurring
                    show={state.showRecurring}
                    rule={state.recurringRule}
                    onSubmit={actions.setRecurringRule}
                    showDays={moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'days') < 1}
                    showWeeks={moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'weeks') < 1}
                  />
                </div>}
                <Uneditable label={t([ 'newReservation', 'place' ])} value={placeLabel()} />
                <Uneditable label={t([ 'newReservation', 'price' ])} value={state.client_id ? t([ 'newReservation', 'onClientsExpenses' ]) : state.price || ''} />
              </Form>
            </div>
          </div>

          <div className={styles.rightCollumn}>
            {state.loading ? <div className={styles.loading}>{t([ 'newReservation', 'loadingGarage' ])}</div>
                           : state.garage && <GarageLayout floors={state.garage.floors.map(highlightSelected)} onPlaceClick={ongoing ? () => {} : handlePlaceClick} showEmptyFloors={false} /> }
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
