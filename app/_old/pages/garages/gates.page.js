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

import * as gatePlaceActions           from '../_shared/actions/garageGates.actions'
import {isInGroupables, isInGroupable} from '../_shared/actions/garageClients.actions'
import * as nav                        from '../_shared/helpers/navigation'
import { t }                           from '../_shared/modules/localization/localization'

import styles from './clients.page.scss'


export class GarageGatesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initGates(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const gateSchema = [ { key: 'label',         title: t(['garageManagement','selectGate']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                       , { key: 'place_count',  title: t(['garageManagement','places']),             comparator: 'number' }
                       ]

    const gateClick = (gate, index) => { gate ? actions.setGate(gate.id) : actions.setGate(undefined) }

    const onBack = () => { nav.to('/garages') }

    const floors = state.garage ? state.garage.floors.map((floor)=>{
      floor.places.map((place)=>{
        if (state.gate_id){ // gate selected - multiple gates can be assigned
          let inGates = isInGroupables(state, 'gates', place.id)
          place.group = undefined
          place.available = true
          place.selected = isInGroupable(state.gates.find(g => g.id==state.gate_id), place.id)
          place.tooltip = inGates.length && <div> {inGates.map(g => <div>{g.label}</div>)} </div>
        } else {
          place.group = undefined
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

                            <h2>{t(['garageManagement','gates'])}</h2>
                            <Table schema={gateSchema} data={state.gates} onRowSelect={gateClick} deselect={state.gate_id == undefined}/>
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
  state    => ({ state: state.garageGates }),
  dispatch => ({ actions: bindActionCreators(gatePlaceActions, dispatch) })
)(GarageGatesPage)
