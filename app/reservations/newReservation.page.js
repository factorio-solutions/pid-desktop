import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase      from '../_shared/containers/pageBase/PageBase'
import Input         from '../_shared/components/input/Input'
import DatetimeInput from '../_shared/components/input/DatetimeInput'
import ButtonStack   from '../_shared/components/buttonStack/ButtonStack'
import RoundButton   from '../_shared/components/buttons/RoundButton'
import GarageLayout  from '../_shared/components/garageLayout/GarageLayout2'
import Dropdown      from '../_shared/components/dropdown/Dropdown'
import Form          from '../_shared/components/form/Form'
import Modal         from '../_shared/components/modal/Modal'

import * as newReservationActions from '../_shared/actions/newReservation.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'

import styles from './newReservation.page.scss'


export class NewReservationPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.setInitialStore(this.props.params.id)
  }

  render () {
    const { state, actions, pageBase } = this.props

    const ongoing          = state.reservation !== undefined && state.reservation.ongoing
    const handleBack       = () => { nav.to('/reservations') }
    const toOverview       = () => { this.props.params.id ? actions.submitReservation(+this.props.params.id) : nav.to('/reservations/newReservation/overview') }
    const handleDuration   = () => { actions.setDurationDate(true) }
    const handleDate       = () => { actions.setDurationDate(false) }
    const hightlightInputs = () => { actions.toggleHighlight() }
    const handlePlaceClick = (place) => { actions.setPlace(place) }
    const handleTo         = (value, valid) => { valid && actions.setTo(value) }
    const handleFrom       = (value, valid) => { valid && actions.setFrom(value) }

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
      const garageSelected = (index) => { actions.downloadGarage(state.user.availableGarages[index].id) }
      return state.user && state.user.availableGarages && state.user.availableGarages.map((garage, index) => {
        return { label: garage.name, onClick: garageSelected.bind(this, index) }
      }) || []
    }

    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.user.availableClients[index].id) }
      let clients = state.user.availableClients.map((client, index) => {
        return { label: client.name, onClick: clientSelected.bind(this, index) }
      }) || []
      return clients
    }

    const carDropdown = () => {
      const carSelected = (index) => { actions.setCarId(state.user.reservable_cars[index].id) }
      return state.user && state.user.reservable_cars && state.user.reservable_cars.map((car, index) => {
        return { label: car.name, onClick: carSelected.bind(this, index) }
      }) || []
    }

    const isSubmitable = () => {
      if (state.car_id == undefined && state.carLicencePlate=='') return false
      if (state.from == '' || state.to == '') return false
      return state.user && state.place_id
    }

    const placeLabel = () => {
      const findPlace = (place) => {return place.id == state.place_id}
      const floor = state.garage && state.garage.floors.find((floor)=>{ return floor.places.find(findPlace)!=undefined })
      const place = floor && floor.places.find(findPlace)
      return floor && place ? `${floor.label} / ${place.label}` : ""
    }

    const highlightSelected = (floor) => {
      floor.places.map((place) => {
        place.available = place.available // set place of edited reservation as available
        place.selected = place.id == state.place_id
        return place
      })
      return floor
    }

    const beginsInlineMenu = <span className={styles.clickable} onClick={actions.beginsToNow}>{t(['newReservation', 'now'])}</span>

    const endsInlineMenu =  <ButtonStack style='horizontal' divider={<span> | </span>}>
                              <span className={`${state.durationDate?styles.selected:styles.clickable}`}  onClick={handleDuration} >{t(['newReservation', 'duration'])}</span>
                              <span className={`${!state.durationDate?styles.selected:styles.clickable}`} onClick={handleDate}     >{t(['newReservation', 'date'])}</span>
                            </ButtonStack>

    const placeInlineMenu = <span className={styles.clickable} onClick={actions.autoSelectPlace}>{t(['newReservation', 'auto'])}</span>

    const errorContent = <div className={styles.floatCenter}>
                            {t(['newReservation', 'fail'])}: <br/>
                            { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

    return (
      <PageBase>
        <div className={styles.parent}>
          <Modal content={errorContent} show={state.error!=undefined} />

          <div className={styles.leftCollumn}>
            <div className={styles.padding}>
              <Form onSubmit={toOverview} onBack={handleBack} submitable={isSubmitable()} onHighlight={hightlightInputs}>
                {((state.user && pageBase.current_user && state.user.id !==  pageBase.current_user.id) || state.availableUsers.length>1) && <Dropdown editable={!ongoing} label={t(['newReservation', 'selectUser'])}   content={userDropdown()}   selected={state.availableUsers.findIndex((user)=>{return state.user && user.id == state.user.id})} style='reservation' highlight={state.highlight}/> }
                {state.user && <Dropdown editable={!ongoing} label={t(['newReservation', 'selectGarage'])} content={garageDropdown()} selected={state.user.availableGarages.findIndex((garage) => {return state.garage && garage.id === state.garage.id})} style='reservation' highlight={state.highlight}/>}
                {state.user && state.user.availableClients && state.user.availableClients.length>1 && <Dropdown editable={!ongoing} label={t(['newReservation', 'selectClient'])} content={clientDropdown()} selected={state.user.availableClients.findIndex((client)=>{return client.id == state.client_id})} style='reservation'/>}
                {state.user && (state.user.reservable_cars && state.user.reservable_cars.length==0 ? <Input readOnly={ongoing} onChange={actions.setCarLicencePlate} value={state.carLicencePlate} label={t(['newReservation', 'licencePlate'])} error={t(['newReservation', 'licencePlateInvalid'])} placeholder={t(['newReservation', 'licencePlatePlaceholder'])} type='text' name='reservation[licence_plate]' align='center' highlight={state.highlight}/>
                                               : <Dropdown editable={!ongoing} label={t(['newReservation', 'selectCar'])}    content={carDropdown()}    selected={state.user && state.user.reservable_cars && state.user.reservable_cars.findIndex((car)=>{return car.id == state.car_id})} style='reservation' highlight={state.highlight}/>)}

                <DatetimeInput onChange={handleFrom} label={t(['newReservation', 'begins'])} error={t(['newReservation', 'invalidaDate'])} value={state.from} inlineMenu={beginsInlineMenu} editable={!ongoing}/>
                {state.durationDate ? <Input         onChange={actions.durationChange} label={t(['newReservation', 'duration'])} error={t(['newReservation', 'invalidaValue'])} inlineMenu={endsInlineMenu} value={String(moment.duration(moment(state.to, 'DD.MM.YYYY HH:mm').diff(moment(state.from, 'DD.MM.YYYY HH:mm'))).asHours())} type="number" min={0.25} step={0.25} align="right" />
                                    : <DatetimeInput onChange={handleTo}               label={t(['newReservation', 'ends'])}     error={t(['newReservation', 'invalidaDate'])}  inlineMenu={endsInlineMenu} value={state.to} />}
                <Input value={placeLabel()} label={t(['newReservation', 'place'])} error={t(['newReservation', 'invalidPlace'])} type='text' name='reservation[place]' align='right' readOnly={ongoing} inlineMenu={placeInlineMenu}/>
                <Input value={state.client_id ? t(['newReservation', 'onClientsExpenses']) : state.price || ''}  label={t(['newReservation', 'price'])} type='text' name='reservation[price]' align='right' />
              </Form>
            </div>
          </div>

          <div className={styles.rightCollumn}>
            {state.loading ? <div className={styles.loading}>{t(['newReservation', 'loadingGarage'])}</div>
                           : state.garage && <GarageLayout floors={state.garage.floors.map(highlightSelected)} onPlaceClick={ongoing ? ()=>{} : handlePlaceClick} showEmptyFloors={false}/> }
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.newReservation, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationPage)
