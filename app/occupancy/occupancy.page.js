<<<<<<< HEAD
import React, { Component, PropTypes } from 'react';
=======
import React, { Component, PropTypes } from 'react'
>>>>>>> feature/new_api
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

<<<<<<< HEAD
    const accountDropdown = () => {
      const accountSelected = (index) => {
        actions.setAccountId(state.accounts[index].id)
      }
      return state.accounts.map((account, index) => {return {label: account.name, onClick: accountSelected.bind(this, index) }})
    }

    const garageDropdown = () => {
        const garageSelected = (index) => {
          actions.setGarageId(state.garages[index].id)
        }
        return state.garages.map((garage, index) => {return {label: garage.name, onClick: garageSelected.bind(this, index) }})
=======
    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.clients[index].id) }
      return state.clients.map((client, index) => {return {label: client.name, onClick: clientSelected.bind(this, index) }})
    }

    const garageDropdown = () => {
      const garageSelected = (index) => { actions.setGarageId(state.garages[index].id) }
      return state.garages.map((garage, index) => {return {label: garage.name, onClick: garageSelected.bind(this, index) }})
>>>>>>> feature/new_api
    }

    const preparePlaces = (places, floor) => {
      return places.concat(floor.places.map((place)=>{
        return { ...place
               , floor: floor.label
<<<<<<< HEAD
               , reservations: state.account_id ? place.reservations.filter((reservation) => {return state.account_id == reservation.account.id}) : place.reservations
=======
               , reservations: state.client_id ? place.reservations.filter((reservation) => {return state.client_id == reservation.client.id}) : place.reservations
>>>>>>> feature/new_api
               }
      }))
    }

    const filters = <div>
<<<<<<< HEAD
      <ButtonStack divider={<span>|</span>} style='horizontal' >
        <TextButton content={t(['occupancy', 'week'])} onClick={() => {actions.weekClick()}} state={state.duration=="week" && 'selected'}/>
        <TextButton content={t(['occupancy', 'month'])} onClick={() => {actions.monthClick()}} state={state.duration=="month" && 'selected'}/>
      </ButtonStack>
    </div>

    const content = <div>
                      <div className={styles.dropdownContainer}>
                        <Dropdown label={t(['occupancy', 'selectGarage'])} content={garageDropdown()} style='light' selected={state.garages.findIndex((garage)=>{return garage.id == state.garage_id})}/>
                        <Dropdown label={t(['occupancy', 'selectClientAccount'])} content={accountDropdown()} style='light' selected={state.accounts.findIndex((account)=>{return account.id == state.account_id})}/>
                      </div>
                      <OccupancyOverview places={garage ? garage.floors.reduce(preparePlaces, []) : []} from={state.from} duration={state.duration}
                          leftClick={actions.subtractDay} rightClick={actions.addDay} weekClick={actions.weekClick} monthClick={actions.monthClick}/>
=======
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
>>>>>>> feature/new_api
                    </div>

    return (
      <PageBase content={content} filters={filters} />
    )
  }
}

<<<<<<< HEAD
export default connect(state => {
  const { occupancy } = state
  return ({
    state: occupancy
  })
}, dispatch => ({
  actions: bindActionCreators(OccupancyActions, dispatch)
}))(OccupancyPage)
=======
export default connect(
  state    => ({ state: state.occupancy }),
  dispatch => ({ actions: bindActionCreators(OccupancyActions, dispatch) })
)(OccupancyPage)
>>>>>>> feature/new_api
