import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import moment                           from 'moment'

import PageBase      from '../_shared/containers/pageBase/PageBase'
import Input         from '../_shared/components/input/Input'
import DatetimeInput from '../_shared/components/input/DatetimeInput'
import ButtonStack   from '../_shared/components/buttonStack/ButtonStack'
import RoundButton   from '../_shared/components/buttons/RoundButton'
import GarageLayout  from '../_shared/components/GarageLayout/GarageLayout'
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

    const handleDuration  = () => { actions.setDruationDate(true) }
    const handleDate      = () => { actions.setDruationDate(false) }
    const handleTo        = (value, valid) => { valid && actions.setTo(value) }
    const handleFrom      = (value, valid) => { valid && actions.setFrom(value) }
    const userSelected    = (index) => { actions.setUser(state.availableUsers[index].id) }
    const handleBack      = () => { nav.to('/reservations') }

    const modalClick = () => {
      actions.setError(undefined)
      handleBack()
    }

    const garageDropdown = () => {
      return state.availableGarages.map((garage, index) => {
        return { label: garage.name, onClick: actions.handleGarageChange.bind(this, index) }
      })
    }

    const userDropdown = () => {
      return state.availableUsers.map((user, index) => {
        return { label: user.full_name, onClick: userSelected.bind(this, index) }
      })
    }

    const activePlaces = () => {
      if (state.place_id == -1) return []
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


    const beginsInlineMenu = <span className={styles.clickable} onClick={actions.setTimeToNo}>{t(['newReservation', 'now'])}</span>

    const endsInlineMenu =  <ButtonStack style='horizontal' divider={<span> | </span>}>
                              <span className={`${state.durationDate?styles.selected:styles.clickable}`} onClick={handleDuration}>{t(['newReservation', 'duration'])}</span>
                              <span className={`${!state.durationDate?styles.selected:styles.clickable}`} onClick={handleDate}>{t(['newReservation', 'date'])}</span>
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
                          <Form onSubmit={actions.submitForm} onBack={handleBack} submitable={isSubmitable()}>
                            <Dropdown label={t(['newReservation', 'selectUser'])} content={userDropdown()} style='light' selected={state.availableUsers.findIndex((user)=>{return user.id == state.user_id})}/>
                            <Dropdown label={t(['newReservation', 'selectGarage'])} content={garageDropdown()} style='light' selected={state.availableGarages.findIndex((garage)=>{return garage.id == state.garage_id})}/>
                            <DatetimeInput onChange={handleFrom} label={t(['newReservation', 'begins'])} error={t(['newReservation', 'invalidaDate'])} value={state.from} inlineMenu={beginsInlineMenu}/>
                            <DatetimeInput style={state.durationDate?styles.hidden:''} onChange={handleTo} label={t(['newReservation', 'ends'])} error={t(['newReservation', 'invalidaDate'])} value={state.to} inlineMenu={endsInlineMenu} />
                            <Input style={!state.durationDate?styles.hidden:''} align='right' inlineMenu={endsInlineMenu} label={t(['newReservation', 'duration'])} error={t(['newReservation', 'invalidaValue'])}  type="number" min={0.5} step={0.5} value={String(moment.duration(moment(state.to, 'DD.MM.YYYY HH:mm').diff(moment(state.from, 'DD.MM.YYYY HH:mm'))).asHours())} onChange={actions.durationChange} />
                            <Input label={t(['newReservation', 'place'])} error={t(['newReservation', 'invalidPlace'])} type='text' name='reservation[place]' align='right' value={state.autoSelectPlace?'AUTO':placeLabel()} readOnly={true} inlineMenu={placeInlineMenu}/>
                          </Form>
                        </div>
                      </div>

                      <div className={styles.rightCollumn}>
                        <GarageLayout
                          svg                   = {(state.garage_id == -1 || state.floor_id == -1) ? "" : state.availableFloors[state.availableFloors.findIndex((floor)=>{return floor.id == state.floor_id})].scheme}
                          floors                = {state.availableFloors.map((f) => {return f.label})}
                          onFloorClick          = {actions.handleFloorChange}
                          onPlaceClick          = {actions.changePlace}
                          availableFloorsPlaces = {state.availableFloors}
                          activeFloor           = {activeFloor()}
                          activePlaces          = {activePlaces()}
                        />
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
