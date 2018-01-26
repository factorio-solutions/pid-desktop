import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase          from '../_shared/containers/pageBase/PageBase'
import Dropdown          from '../_shared/components/dropdown/Dropdown'
import OccupancyOverview from '../_shared/components/occupancyOverview/OccupancyOverview'
import TabMenu           from '../_shared/components/tabMenu/TabMenu'
import TabButton         from '../_shared/components/buttons/TabButton'
import RoundButton       from '../_shared/components/buttons/RoundButton'

import * as OccupancyActions from '../_shared/actions/occupancy.actions'
import { togglePast }        from '../_shared/actions/reservations.actions'
import { t }                 from '../_shared/modules/localization/localization'
import * as nav              from '../_shared/helpers/navigation'

import styles from './occupancy.page.scss'


class OccupancyPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    reservations: PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initOccupancy()
  }

  onReservationClick = reservation => {
    nav.to(`/reservations/find/${reservation.id}`)
    !this.props.reservations.past && this.props.actions.togglePast()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const setNow = () => actions.setFrom(moment().startOf('day'))

    const clientDropdown = () => {
      const clientSelected = index => actions.setClientId(state.clients[index].id)

      return state.clients.map((client, index) => ({
        label:   <span>{client.id && state.client_ids.includes(client.id) && <i className="fa fa-check" aria-hidden="true" />}{client.name}</span>,
        onClick: () => clientSelected(index)
      }))
    }

    const preparePlaces = (places, floor) => {
      return places.concat(floor.occupancy_places
        .filter(place => !state.client_ids.length || place.contracts_in_interval.length)
        .map(place => {
          return { ...place,
            floor:        floor.label,
            reservations: state.client_ids.length ?
              place.reservations_in_interval.filter(reservation => { return reservation.client && state.client_ids.includes(reservation.client.id) }) :
              place.reservations_in_interval
          }
        }))
    }

    const filters = [
      <TabButton label={t([ 'newReservation', 'now' ])} onClick={setNow} />,
      <TabButton label={t([ 'occupancy', 'day' ])} onClick={actions.dayClick} state={state.duration === 'day' && 'selected'} />,
      <TabButton label={t([ 'occupancy', 'week' ])} onClick={actions.weekClick} state={state.duration === 'week' && 'selected'} />,
      <TabButton label={t([ 'occupancy', 'month' ])} onClick={actions.monthClick} state={state.duration === 'month' && 'selected'} />
    ]

    const clientSelector = (<Dropdown
      label={t([ 'occupancy', 'selectClientClient' ])}
      content={clientDropdown()}
      style="tabDropdown"
      selected={state.clients.findIndex(client => client.id === state.client_ids[0])}
    />)

    const renderOccupancy = garage => [
      <h2>{garage.name}</h2>,
      <OccupancyOverview
        places={garage ? garage.floors.reduce(preparePlaces, []) : []}
        from={state.from}
        showDetails={(garage.user_garage && garage.user_garage.admin) || (garage.user_garage && garage.user_garage.receptionist) || (garage.user_garage && garage.user_garage.security)}
        duration={state.duration}
        resetClientClick={actions.resetClientClick}
        loading={!state.garages.length || state.loading}
        onReservationClick={this.onReservationClick}
      />
    ]

    return (
      <PageBase>
        <TabMenu right={filters} left={clientSelector} />
        <div className={styles.occupancies}>
          {state.garages.map(renderOccupancy)}
        </div>

        <div className={`${styles.controlls} ${pageBase.current_user && !pageBase.current_user.hint && styles.rightOffset}`}>
          <div> <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={actions.subtract} /> </div>
          <div className={styles.flex}>
            <RoundButton content={t([ 'occupancy', 'dayShortcut' ])} onClick={actions.dayClick} state={state.duration === 'day' && 'selected'} />
            <RoundButton content={t([ 'occupancy', 'weekShortcut' ])} onClick={actions.weekClick} state={state.duration === 'week' && 'selected'} />
            <RoundButton content={t([ 'occupancy', 'monthShortcut' ])} onClick={actions.monthClick} state={state.duration === 'month' && 'selected'} />
          </div>
          <div> <RoundButton content={<span className="fa fa-chevron-right" aria-hidden="true" />} onClick={actions.add} /> </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.occupancy, pageBase: state.pageBase, reservations: state.reservations }),
  dispatch => ({ actions: bindActionCreators({ ...OccupancyActions, togglePast }, dispatch) })
)(OccupancyPage)
