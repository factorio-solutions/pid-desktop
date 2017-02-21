import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import update                          from 'react-addons-update'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout2'
import DateInput    from '../_shared/components/input/DateInput'

import * as clientPlaceActions from '../_shared/actions/garageClients.actions'
import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'

import styles from './clients.page.scss'


export class GarageClientsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.state.new_client_id ? this.props.actions.setNewClientId(undefined) : this.props.actions.initClients(this.props.params.id)
  }

  // componentWillUnmount () {
  //   this.props.actions.resetForm()
  // }

  render() {
    const { state, actions } = this.props

    const clientSchema = [ { key: 'name',         title: t(['garageManagement','selectClient']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                         , { key: 'place_count',  title: t(['garageManagement','places']),             comparator: 'number' }
                         ]
    const gateSchema = [ { key: 'label',         title: t(['garageManagement','selectGate']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                       , { key: 'place_count',  title: t(['garageManagement','places']),             comparator: 'number' }
                       ]
    const pricingSchema = [ { key: 'name',         title: t(['garageManagement','selectPricing']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                          , { key: 'place_count',  title: t(['garageManagement','places']),             comparator: 'number' }
                          ]
    const rentSchema = [ { key: 'name',         title: t(['garageManagement','selectRent']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                       , { key: 'place_count',  title: t(['garageManagement','places']),             comparator: 'number' }
                       ]


    const clientClick  = (client, index)  => { client  ? actions.setClient(client.id)   : actions.setClient(undefined) }
    const gateClick    = (gate, index)    => { gate    ? actions.setGate(gate.id)       : actions.setGate(undefined) }
    const pricingClick = (pricing, index) => { pricing ? actions.setPricing(pricing.id) : actions.setPricing(undefined) }
    const rentClick    = (rent, index)    => { rent    ? actions.setRent(rent.id)       : actions.setRent(undefined) }

    const onBack     = () => { nav.to('/garages') }
    const onAddClient = () => { nav.to(`/garages/${this.props.params.id}/clients/addClient`)}

    const isInGroupables = (group, place_id) => { // will check array of groupables for place, retuns array of groupables selected place is attached to
      return state[group].filter((groupable) => {
        return groupable.groups.find((group) => {
          return group.place_id === place_id
        })
      })
    }

    const isInGroupable = (groupable, place_id) => { // will return true if place find in groupable.groups, false otherwise
      return groupable && groupable.groups.find(g => g.place_id == place_id) != undefined
    }

    const floors = state.garage ? state.garage.floors.map((floor)=>{
      floor.places.map((place)=>{
        if (state.client_id || state.pricing_id || state.rent_id){ // price or rent or client selected - only one can be assigned at a time
          let groupable = state.clients.find(c => c.id==state.client_id) || state.pricings.find(p => p.id==state.pricing_id) || state.rents.find(r => r.id==state.rent_id)
          let inGroupables = isInGroupables(state.client_id && 'clients' || state.pricing_id && 'pricings' || state.rent_id && 'rents', place.id)
          place.selected = isInGroupable(groupable, place.id)
          // for client is only available if has rent
          place.available = state.client_id ? inGroupables.length === 0  && isInGroupables('rents', place.id).length > 0 || isInGroupable(groupable, place.id) && isInGroupables('rents', place.id).length > 0
                                            : inGroupables.length === 0 || isInGroupable(groupable, place.id)
          place.tooltip = inGroupables.length && <div> {inGroupables.map(g => <div>{g.label || g.name}</div>)} </div>
        }
        else if (state.gate_id){ // gate selected - multiple gates can be assigned
          let inGates = isInGroupables('gates', place.id)
          place.available = true
          place.selected = isInGroupable(state.gates.find(g => g.id==state.gate_id), place.id)
          place.tooltip = inGates.length && <div> {inGates.map(g => <div>{g.label}</div>)} </div>
        } else {
          place.available = false
          place.selected = false
          place.tooltip = undefined
        }
        return place
      })
      return floor
    }) : []

    const content = <div>
                      <div className={styles.parent}>

                        <div className={styles.leftCollumn}>
                          <div className={styles.padding}>
                            <h2>
                              {t(['garageManagement','clients'])}
                              <RoundButton content={<span className="fa fa-plus" aria-hidden="true"></span>} onClick={onAddClient} type='action'/>
                            </h2>
                            <Table schema={clientSchema} data={state.clients} onRowSelect={clientClick} deselect={state.client_id == undefined}/>
                            <h2>{t(['garageManagement','gates'])}</h2>
                            <Table schema={gateSchema} data={state.gates} onRowSelect={gateClick} deselect={state.gate_id == undefined}/>
                            <h2>{t(['garageManagement','pricing'])}</h2>
                            <Table schema={pricingSchema} data={state.pricings} onRowSelect={pricingClick} deselect={state.pricing_id == undefined}/>
                            <h2>{t(['garageManagement','rent'])}</h2>
                            <Table schema={rentSchema} data={state.rents} onRowSelect={rentClick} deselect={state.rent_id == undefined}/>
                            {/* <div className={styles.datepicker}>
                              <DateInput onChange={handleFrom} label={t(['garageUsers', 'begins'])} error={t(['garageUsers', 'invalidaDate'])} value={state.from} />
                              <DateInput onChange={handleTo} label={t(['garageUsers', 'ends'])} error={t(['garageUsers', 'invalidaDate'])} value={state.to} showInf={true}/>
                            </div> */}
                          </div>
                          <div className={styles.backButtonContainer}><RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/></div>
                        </div>
                        <div className={styles.rightCollumn}>
                        <GarageLayout
                          floors = {floors}
                          onPlaceClick = {actions.createConnection}
                          showEmptyFloors = {true}
                        />
                        </div>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.garageClients }),
  dispatch => ({ actions: bindActionCreators(clientPlaceActions, dispatch) })
)(GarageClientsPage)
