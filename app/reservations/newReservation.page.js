import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase      from '../_shared/containers/pageBase/PageBase'
import Input         from '../_shared/components/input/Input'
import DatetimeInput from '../_shared/components/input/DatetimeInput'
import ButtonStack   from '../_shared/components/buttonStack/ButtonStack'
import RoundButton   from '../_shared/components/buttons/RoundButton'
<<<<<<< HEAD
import GarageLayout  from '../_shared/components/GarageLayout/GarageLayout'
=======
import GarageLayout  from '../_shared/components/garageLayout/GarageLayout2'
>>>>>>> feature/new_api
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
<<<<<<< HEAD

    const handleNow = () => {
      actions.setTimeToNow()
    }
    const handleDuration = () => {
      actions.setDruationDate(true)
    }
    const handleDate = () => {
      actions.setDruationDate(false)
    }
    const handleAuto = () => {
      actions.autoSelectPlace()
    }

    const handleBack = () => {
      nav.to('/reservations')
    }
    const handleConfirm = () => {
      actions.submitForm()
    }

    const handleFloorClick = ( index ) => {
      actions.handleFloorChange(index)
    }
    const handlePlaceClick = ( place ) => {
      actions.changePlace(place)
    }

    const handleTo = (value, valid) => {
      valid && actions.setTo(value)
    }
    const handleFrom = (value, valid) => {
      valid && actions.setFrom(value)
    }
    const handleDurationChange = (value) => {
      actions.durationChange(value)
    }

    const beginsInlineMenu = <span className={styles.clickable} onClick={handleNow}>{t(['newReservation', 'now'])}</span>

    const endsInlineMenu =  <ButtonStack style='horizontal' divider={<span> | </span>}>
                              <span className={`${state.durationDate?styles.selected:styles.clickable}`} onClick={handleDuration}>{t(['newReservation', 'duration'])}</span>
                              <span className={`${!state.durationDate?styles.selected:styles.clickable}`} onClick={handleDate}>{t(['newReservation', 'date'])}</span>
                            </ButtonStack>

    const placeInlineMenu = <span className={styles.clickable} onClick={handleAuto}>{t(['newReservation', 'auto'])}</span>

    const garageSelected = (index) => {
      actions.handleGarageChange(index)
    }

    const garageDropdown = () => {
      var garages = []
      state.availableGarages.forEach(function(garage, index ){
        garages.push({label: garage.name, onClick: garageSelected.bind(this, index) })
      })
      return garages
    }

    const userSelected = (index) => {
      actions.setUser(state.availableUsers[index].id)
    }

    const userDropdown = () => {
      var users = []
      state.availableUsers.forEach(function(user, index ){
        users.push({label: user.full_name, onClick: userSelected.bind(this, index) })
      })
      return users
    }

    const floorLabels = () => {
      var floors = []
      state.availableFloors.forEach(function (floor) {
        floors.push(floor.label)
      })
      return floors
    }

    const activePlaces = () => {
      if (state.place_id == -1){
        return []
      }
      return [state.availableFloors[activeFloor()]==undefined ? -1 : state.availableFloors[activeFloor()].free_places.find((place) => {return place.id == state.place_id})]
    }

    const placeLabel = () => {

      var place = [].concat.apply([], state.availableFloors.map(function(floor){return floor.free_places})).find((place) => {return place.id == state.place_id})
      var floor = place ? state.availableFloors.find((floor) => {return floor.id == place.floor_id}) : undefined
      return floor ? `${floor.label} / ${place.label}` : ""
    }

    const activeFloor = () => {
      return state.availableFloors.findIndex((floor)=>{return floor.id == state.floor_id})
    }

    const isSubmitable = () => {
      return state.user_id != -1
      && state.creator_id != -1
      && state.account_id != -1
      && state.place_id != -1
      && state.from != ''
      && state.to != ''
    }

    const modalClick = () => {
      actions.setError(undefined)
      handleBack()
    }
=======
    // console.log(state);

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
>>>>>>> feature/new_api

    const errorContent = <div className={styles.floatCenter}>
                            {t(['newReservation', 'fail'])}: <br/>
                            { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

    const content = <div className={styles.parent}>
                      <Modal content={errorContent} show={state.error!=undefined} />
                      <div className={styles.leftCollumn}>
                        <div className={styles.padding}>
<<<<<<< HEAD
                          <Form onSubmit={handleConfirm} onBack={handleBack} submitable={isSubmitable()}>
                            <Dropdown label={t(['newReservation', 'selectUser'])} content={userDropdown()} style='light' selected={state.availableUsers.findIndex((user)=>{return user.id == state.user_id})}/>
                            <Dropdown label={t(['newReservation', 'selectGarage'])} content={garageDropdown()} style='light' selected={state.availableGarages.findIndex((garage)=>{return garage.id == state.garage_id})}/>
                            <DatetimeInput onChange={handleFrom} label={t(['newReservation', 'begins'])} error={t(['newReservation', 'invalidaDate'])} value={state.from} inlineMenu={beginsInlineMenu}/>
                            <DatetimeInput style={state.durationDate?styles.hidden:''} onChange={handleTo} label={t(['newReservation', 'ends'])} error={t(['newReservation', 'invalidaDate'])} value={state.to} inlineMenu={endsInlineMenu} />
                            {/* <Input onChange={handleFrom} label={t(['newReservation', 'begins'])} error={t(['newReservation', 'invalidaDate'])} type='datetime-local' name='reservation[from]' align='right' value={state.from} inlineMenu={beginsInlineMenu}/>
                            <Input style={state.durationDate?styles.hidden:''} onChange={handleTo} label={t(['newReservation', 'ends'])} error={t(['newReservation', 'invalidaDate'])} type='datetime-local' name='reservation[to]' align='right' value={state.to} inlineMenu={endsInlineMenu} />*/}
                            <Input style={!state.durationDate?styles.hidden:''} align='right' inlineMenu={endsInlineMenu} label={t(['newReservation', 'duration'])} error={t(['newReservation', 'invalidaValue'])}  type="number" min={0.5} step={0.5} value={String(moment.duration(moment(state.to, 'DD.MM.YYYY HH:mm').diff(moment(state.from, 'DD.MM.YYYY HH:mm'))).asHours())} onChange={handleDurationChange} />
                            <Input label={t(['newReservation', 'place'])} error={t(['newReservation', 'invalidPlace'])} type='text' name='reservation[place]' align='right' value={state.autoSelectPlace?'AUTO':placeLabel()} readOnly={true} inlineMenu={placeInlineMenu}/>
                          </Form>
                        </div>
                      </div>
                      <div className={styles.rightCollumn}>
                        <GarageLayout
                          svg={(state.garage_id == -1 || state.floor_id == -1) ? "" : state.availableFloors[state.availableFloors.findIndex((floor)=>{return floor.id == state.floor_id})].scheme}
                          floors={floorLabels()}
                          onFloorClick={handleFloorClick}
                          onPlaceClick={handlePlaceClick}
                          availableFloorsPlaces={state.availableFloors}
                          activeFloor={activeFloor()}
                          activePlaces={activePlaces()}
                        />
=======
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
                        {state.garage && <GarageLayout floors={state.garage.floors.map(highlightSelected)} onPlaceClick={handlePlaceClick} showEmptyFloors={false}/> }
>>>>>>> feature/new_api
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

<<<<<<< HEAD

export default connect(state => {
  const { newReservation } = state
  return ({
    state: newReservation
  })
}, dispatch => ({
  actions: bindActionCreators(newReservationActions, dispatch)
}))(NewReservationPage)
=======
export default connect(
  state    => ({ state: state.newReservation }),
  dispatch => ({ actions: bindActionCreators(newReservationActions, dispatch) })
)(NewReservationPage)
>>>>>>> feature/new_api
