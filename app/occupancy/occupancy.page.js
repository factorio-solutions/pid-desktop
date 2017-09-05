import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import * as nav               from '../_shared/helpers/navigation'
import * as OccupancyActions  from '../_shared/actions/occupancy.actions' // TODO:delete init Garage
import { t }                  from '../_shared/modules/localization/localization'

import PageBase               from '../_shared/containers/pageBase/PageBase'
import RoundButton            from '../_shared/components/buttons/RoundButton'
import Dropdown               from '../_shared/components/dropdown/Dropdown'
import OccupancyOverview      from '../_shared/components/occupancyOverview/OccupancyOverview'
import TabMenu                from '../_shared/components/tabMenu/TabMenu'
import TabButton              from '../_shared/components/buttons/TabButton'
// import TextButton             from '../_shared/components/buttons/TextButton'
import ButtonStack            from '../_shared/components/buttonStack/ButtonStack'

import styles from './occupancy.page.scss'


export class OccupancyPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.pageBase.garage && this.props.actions.initOccupancy()
  }

  componentWillReceiveProps(nextProps){
    // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.loadGarage()
  }

  render() {
    const {state, actions} = this.props
    const garage = state.garage

    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.clients[index].id) }
      return state.clients.map((client, index) => {return {label: client.name, onClick: clientSelected.bind(this, index) }})
    }

    const preparePlaces = (places, floor) => {
      return places.concat(floor.places.map((place)=>{
        return { ...place
               , floor: floor.label
               , reservations: state.client_id ? place.reservations_in_interval.filter((reservation) => {return reservation.client && state.client_id == reservation.client.id}) : place.reservations_in_interval
               }
      }))
    }

    const filters = [ <TabButton label={t(['occupancy', 'day'])}   onClick={() => {actions.dayClick()}}   state={state.duration=="day" && 'selected'}/>
                    , <TabButton label={t(['occupancy', 'week'])}  onClick={() => {actions.weekClick()}}  state={state.duration=="week" && 'selected'}/>
                    , <TabButton label={t(['occupancy', 'month'])} onClick={() => {actions.monthClick()}} state={state.duration=="month" && 'selected'}/>
                    ]

    const clientSelector = <Dropdown label={t(['occupancy', 'selectClientClient'])} content={clientDropdown()} style='tabDropdown' selected={state.clients.findIndex((client)=>{return client.id == state.client_id})}/>

    return (
      <PageBase>
        <div>
          <TabMenu right={filters} left={clientSelector}/>
           <OccupancyOverview
              places={garage ? garage.floors.reduce(preparePlaces, []) : []}
              from={state.from}
              duration={state.duration}
              leftClick={actions.subtract}
              rightClick={actions.add}
              dayClick={actions.dayClick}
              weekClick={actions.weekClick}
              monthClick={actions.monthClick}/>
         </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.occupancy, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(OccupancyActions, dispatch) })
)(OccupancyPage)
