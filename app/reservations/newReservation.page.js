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
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.setInitialStore()
  }

  render () {
    const { state, actions } = this.props

    const handleBack       = () => { nav.to('/reservations') }
    const toOverview       = () => { nav.to('/reservations/newReservation/overview') }
    const handleDuration   = () => { actions.setDurationDate(true) }
    const handleDate       = () => { actions.setDurationDate(false) }
    const handlePlaceClick = (place) => { actions.setPlace(place) }
    const handleTo         = (value, valid) => { valid && actions.setTo(value) }
    const handleFrom       = (value, valid) => { valid && actions.setFrom(value) }

    const modalClick = () => {
      actions.setError(undefined)
      handleBack()
    }

    const userDropdown = () => {
      const userSelected = (index) => { actions.setUserId(state.availableUsers[index].id) }
      return state.availableUsers.map((user, index) => {
        return { label: user.full_name, onClick: userSelected.bind(this, index) }
      })
    }

    const garageDropdown = () => {
      const garageSelected = (index) => { actions.setGarageIndex(index) }
      return state.availableGarages.map((garage, index) => {
        return { label: garage.name, onClick: garageSelected.bind(this, index) }
      })
    }

    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.availableClients[index].id) }
      let clients = state.availableClients.map((client, index) => {
        return { label: client.name, onClick: clientSelected.bind(this, index) }
      })
      return clients
    }

    const carDropdown = () => {
      const carSelected = (index) => { actions.setCarId(state.availableCars[index].id) }
      return state.availableCars.map((car, index) => {
        return { label: car.model, onClick: carSelected.bind(this, index) }
      })
    }

    const isSubmitable = () => {
      if (state.car_id == undefined && state.carLicencePlate=='') return false
      if (state.from == '' || state.to == '') return false
      if (state.user_id && state.place_id) return true
    }

    const placeLabel = () => {
      const findPlace = (place) => {return place.id == state.place_id}
      const floor = state.garage && state.garage.floors.find((floor)=>{ return floor.places.find(findPlace)!=undefined })
      const place = floor && floor.places.find(findPlace)
      return floor && place ? `${floor.label} / ${place.label}` : ""
    }

    const highlightSelected = (floor) => {
      floor.places.map((place) => {
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

    const content = <div className={styles.parent}>
                      <Modal content={errorContent} show={state.error!=undefined} />
                      <div className={styles.leftCollumn}>
                        <div className={styles.padding}>
                          <Form onSubmit={toOverview} onBack={handleBack} submitable={isSubmitable()}>
                            {state.availableUsers.length>1 && <Dropdown label={t(['newReservation', 'selectUser'])}   content={userDropdown()}   selected={state.availableUsers.findIndex((user)=>{return user.id == state.user_id})}         style='light'/>}
                            <Dropdown label={t(['newReservation', 'selectGarage'])} content={garageDropdown()} selected={state.garageIndex}                                                                 style='light'/>
                            {state.availableClients.length>1 &&<Dropdown label={t(['newReservation', 'selectClient'])} content={clientDropdown()} selected={state.availableClients.findIndex((client)=>{return client.id == state.client_id})} style='light'/>}
                            {state.availableCars.length==0 ? <Input onChange={actions.setCarLicencePlate} value={state.carLicencePlate} label={t(['newReservation', 'licencePlate'])} error={t(['newReservation', 'licencePlateInvalid'])} placeholder={t(['newReservation', 'licencePlatePlaceholder'])} type='text' name='reservation[licence_plate]' align='center'/>
                                                           : <Dropdown label={t(['newReservation', 'selectCar'])}    content={carDropdown()}    selected={state.availableCars.findIndex((car)=>{return car.id == state.car_id})}             style='light'/>}

                            <DatetimeInput onChange={handleFrom} label={t(['newReservation', 'begins'])} error={t(['newReservation', 'invalidaDate'])} value={state.from} inlineMenu={beginsInlineMenu}/>
                            {state.durationDate ? <Input         onChange={actions.durationChange} label={t(['newReservation', 'duration'])} error={t(['newReservation', 'invalidaValue'])} inlineMenu={endsInlineMenu} value={String(moment.duration(moment(state.to, 'DD.MM.YYYY HH:mm').diff(moment(state.from, 'DD.MM.YYYY HH:mm'))).asHours())} type="number" min={0.25} step={0.25} align="right" />
                                                : <DatetimeInput onChange={handleTo}               label={t(['newReservation', 'ends'])}     error={t(['newReservation', 'invalidaDate'])}  inlineMenu={endsInlineMenu} value={state.to} />}
                            <Input value={placeLabel()} label={t(['newReservation', 'place'])} error={t(['newReservation', 'invalidPlace'])} type='text' name='reservation[place]' align='right' readOnly={true} inlineMenu={placeInlineMenu}/>
                            <Input value={state.client_id ? t(['newReservation', 'onClientsExpenses']) : state.price || ''}  label={t(['newReservation', 'price'])} type='text' name='reservation[price]' align='right' readOnly={true}/>
                          </Form>
                        </div>
                      </div>

                      <div className={styles.rightCollumn}>
                        {state.loading ? <div className={styles.loading}>{t(['newReservation', 'loadingGarage'])}</div>
                                       : state.garage && <GarageLayout floors={state.garage.floors.map(highlightSelected)} onPlaceClick={handlePlaceClick} showEmptyFloors={false}/>
                        }

                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.newReservation }),
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationPage)
