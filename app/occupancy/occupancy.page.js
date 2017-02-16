import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import * as nav               from '../_shared/helpers/navigation'
import * as OccupancyActions  from '../_shared/actions/occupancy.actions' // TODO:delete init Garage
import { t }                  from '../_shared/modules/localization/localization'

import PageBase               from '../_shared/containers/pageBase/PageBase'
import RoundButton            from '../_shared/components/buttons/RoundButton'
import Dropdown               from '../_shared/components/dropdown/Dropdown'
import OccupancyOverview      from '../_shared/components/occupancyOverview/OccupancyOverview'
import TextButton             from '../_shared/components/buttons/TextButton'
import ButtonStack            from '../_shared/components/buttonStack/ButtonStack'

import styles from './occupancy.page.scss'


export class OccupancyPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initOccupancy()
  }

  render() {
    const {state, actions} = this.props
    const garage = state.garage

    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.clients[index].id) }
      return state.clients.map((client, index) => {return {label: client.name, onClick: clientSelected.bind(this, index) }})
    }

    const garageDropdown = () => {
      const garageSelected = (index) => { actions.setGarageId(state.garages[index].id) }
      return state.garages.map((garage, index) => {return {label: garage.name, onClick: garageSelected.bind(this, index) }})
    }

    const preparePlaces = (places, floor) => {
      return places.concat(floor.places.map((place)=>{
        return { ...place
               , floor: floor.label
               , reservations: state.client_id ? place.reservations.filter((reservation) => {return state.client_id == reservation.client.id}) : place.reservations
               }
      }))
    }

    const filters = <div>
                      <ButtonStack divider={<span>|</span>} style='horizontal' >
                        <TextButton content={t(['occupancy', 'day'])} onClick={() => {actions.dayClick()}} state={state.duration=="day" && 'selected'}/>
                        <TextButton content={t(['occupancy', 'week'])} onClick={() => {actions.weekClick()}} state={state.duration=="week" && 'selected'}/>
                        <TextButton content={t(['occupancy', 'month'])} onClick={() => {actions.monthClick()}} state={state.duration=="month" && 'selected'}/>
                      </ButtonStack>
                    </div>

    const content = <div>
                      <div> <Dropdown label={t(['occupancy', 'selectGarage'])} content={garageDropdown()} style='light' selected={state.garages.findIndex((garage)=>{return garage.id == state.garage_id})}/> </div>
                      {/* <div className={styles.dropdownContainer}>
                        <Dropdown label={t(['occupancy', 'selectGarage'])} content={garageDropdown()} style='light' selected={state.garages.findIndex((garage)=>{return garage.id == state.garage_id})}/>
                        <Dropdown label={t(['occupancy', 'selectClientClient'])} content={clientDropdown()} style='light' selected={state.clients.findIndex((client)=>{return client.id == state.client_id})}/>
                      </div> */}
                      <OccupancyOverview places={garage ? garage.floors.reduce(preparePlaces, []) : []} from={state.from} duration={state.duration}
                          leftClick={actions.subtractDay} rightClick={actions.addDay} dayClick={actions.dayClick} weekClick={actions.weekClick} monthClick={actions.monthClick}/>
                    </div>

    return (
      <PageBase content={content} filters={filters} />
    )
  }
}

export default connect(
  state    => ({ state: state.occupancy }),
  dispatch => ({ actions: bindActionCreators(OccupancyActions, dispatch) })
)(OccupancyPage)
