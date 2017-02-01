import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/Table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import GarageLayout from '../_shared/components/GarageLayout/GarageLayout'
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
    this.props.actions.initClients(this.props.params.id)
  }

  componentWillUnmount () {
    this.props.actions.resetForm()
  }

  render() {
    const { state, actions } = this.props

    const schema = [ { key: 'name',         title: t(['garageUsers','selectClient']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'place_count',  title: t(['garages','places']),             comparator: 'number' }
                   ]

    const handleFloorChange = (index) => {
      actions.setFloor(index)
      actions.preparePlaces()
    }

    const clientClick = (client, index) => {
      client ? actions.setClient(client.id) : actions.setClient(undefined)
    }

    const onBack     = () => { nav.to('/garages') }
    const handleFrom = (value) => { actions.setFrom(value) }
    const handleTo   = (value) => { actions.setTo(value) }

    const content = <div>
                      <div className={styles.parent}>

                        <div className={styles.leftCollumn}>
                          <div className={styles.padding}>
                            <div className={styles.datepicker}>
                              <DateInput onChange={handleFrom} label={t(['garageUsers', 'begins'])} error={t(['garageUsers', 'invalidaDate'])} value={state.from} />
                              <DateInput onChange={handleTo} label={t(['garageUsers', 'ends'])} error={t(['garageUsers', 'invalidaDate'])} value={state.to} showInf={true}/>
                            </div>
                            <Table schema={schema} data={state.clients} onRowSelect={clientClick}/>
                          </div>
                          <div className={styles.backButtonContainer}><RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/></div>
                        </div>
                        <div className={styles.rightCollumn}>
                        {state.client_id==undefined? "":
                        <GarageLayout
                          svg                   = {state.selectedFloor!=null ? state.garage.floors[state.selectedFloor].scheme : "<svg></svg>"}
                          floors                = {state.garage.floors.map( (f) => { return f.label } )}
                          onFloorClick          = {handleFloorChange}
                          onPlaceClick          = {actions.createConnection}
                          activeFloor           = {state.selectedFloor}
                          activePlaces          = {state.availableFloors[state.selectedFloor].client_places_interval}
                          availableFloorsPlaces = {state.availableFloors}
                          reservations          = {state.reservations}
                        />
                        }
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
