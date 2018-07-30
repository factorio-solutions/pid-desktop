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
import IconWithCount     from '../_shared/components/iconWithCount/IconWithCount'
import Modal             from '../_shared/components/modal/Modal'
import Form              from '../_shared/components/form/Form'

import * as OccupancyActions      from '../_shared/actions/occupancy.actions'
import * as newReservationActions from '../_shared/actions/newReservation.actions'
import { setPast }                from '../_shared/actions/reservations.actions'
import { t }                      from '../_shared/modules/localization/localization'
import * as nav                   from '../_shared/helpers/navigation'

import styles from './occupancy.page.scss'

const UPDATE_EVERY_X_MINUTES = 3


class OccupancyPage extends Component {
  static propTypes = {
    state:                 PropTypes.object,
    pageBase:              PropTypes.object,
    actions:               PropTypes.object,
    newReservationActions: PropTypes.object
  }

  componentDidMount() {
    const { actions } = this.props
    actions.initOccupancy()
    this.timerID = setInterval(actions.loadGarage, UPDATE_EVERY_X_MINUTES * 60 * 1000)
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  onReservationClick = reservation => {
    this.props.actions.setPast(moment(reservation.ends_at).isBefore(moment()))
    nav.to(`/reservations/find/${reservation.id}`)
  }

  setNow = () => this.props.actions.setFrom(moment().startOf('day'))

  submitNewReservation = () => {
    const { state, newReservationActions } = this.props
    newReservationActions.clearForm()
    nav.to('/reservations/newReservation')
    this.props.actions.unsetNewReservation()

    newReservationActions.setFrom(state.newReservation.from)
    newReservationActions.setTo(state.newReservation.to)
    newReservationActions.setPreferedGarageId(state.garage.id)
    newReservationActions.setPreferedPlaceId(state.newReservation.placeId)
  }

  render() {
    const { state, pageBase, actions } = this.props
    const { garage } = state

    const clientDropdown = () => {
      const clientSelected = index => actions.setClientId(state.clients[index].id)

      return state.clients.map((client, index) => ({
        label:       client.name,
        representer: o => <span>{client.id && state.client_ids.includes(client.id) && <i className="fa fa-check" aria-hidden="true" />}{o}</span>,
        onClick:     () => clientSelected(index)
      }))
    }

    const preparePlaces = (places, floor) => {
      return places.concat(floor.occupancy_places
        .filter(place => !state.client_ids.length || place.contracts_in_interval.length)
        .map(place => ({
          ...place,
          floor:        floor.label,
          reservations: state.client_ids.length ?
            place.reservations_in_interval.filter(reservation => reservation.client && state.client_ids.includes(reservation.client.id)) :
            place.reservations_in_interval
        }))
      )
    }

    const filters = [
      <TabButton label={t([ 'newReservation', 'now' ])} onClick={this.setNow} />,
      <TabButton label={t([ 'occupancy', 'day' ])} onClick={actions.dayClick} state={state.duration === 'day' && 'selected'} />,
      <TabButton label={t([ 'occupancy', 'week' ])} onClick={actions.weekClick} state={state.duration === 'week' && 'selected'} />,
      <TabButton label={t([ 'occupancy', 'month' ])} onClick={actions.monthClick} state={state.duration === 'month' && 'selected'} />
    ]

    const clientSelector = (<Dropdown
      label={t([ 'occupancy', 'selectClientClient' ])}
      content={clientDropdown()}
      style="tabDropdown"
      selected={state.clients.findIndex(client => client.id === state.client_ids[0])}
      filter
      icon={ state.client_ids.length
        ? <IconWithCount
          icon="fa fa-filter"
          count={state.client_ids.length}
          type="light"
        />
        : undefined
      }
    />)

    const placeForNewReservation = garage &&
      state.newReservation &&
        garage.floors.reduce(preparePlaces, []).findById(state.newReservation.placeId)
    
    return (
      <PageBase>
        <Modal show={state.newReservation}>
          <Form
            onSubmit={this.submitNewReservation}
            onBack={actions.unsetNewReservation}
            submitable
          >
            {state.newReservation && [
              <h4>{t([ 'occupancy', 'createNewReservation' ])}</h4>,
              <table className={styles.newReservationTable}>
                <tbody>
                  <tr>
                    <td>{t([ 'occupancy', 'garage' ])}</td>
                    <td>{garage && garage.name}</td>
                  </tr>
                  <tr>
                    <td>{t([ 'occupancy', 'place' ])}</td>
                    <td>
                    {placeForNewReservation && placeForNewReservation.floor}/
                    {placeForNewReservation && placeForNewReservation.label}
                    </td>
                  </tr>
                  <tr>
                    <td>{t([ 'occupancy', 'from' ])}</td>
                    <td>{state.newReservation.from}</td>
                  </tr>
                  <tr>
                    <td>{t([ 'occupancy', 'to' ])}</td>
                    <td>{state.newReservation.to}</td>
                  </tr>
                </tbody>
              </table>
            ]}
          </Form>
        </Modal>

        <Modal show={state.reservationNotPossible}>
          <Form
            onSubmit={actions.unsetNewReservation}
            submitable
            center
          >
            {t([ 'occupancy', 'placeNotAvailable' ])}
          </Form>
        </Modal>

        <TabMenu right={filters} left={clientSelector} />
        <div className={styles.occupancies}>
          <h2>{garage && garage.name}</h2>
          <OccupancyOverview
            places={garage ? garage.floors.reduce(preparePlaces, []) : []}
            from={state.from}
            showDetails={garage && (garage.user_garage && (garage.user_garage.admin || garage.user_garage.manager || garage.user_garage.receptionist || garage.user_garage.security))}
            duration={state.duration}
            resetClientClick={actions.resetClientClick}
            loading={!state.garages.length || state.loading}
            onReservationClick={this.onReservationClick}
          />
        </div>

        <div className={`${styles.controlls} ${pageBase.current_user && !pageBase.current_user.hint && styles.rightOffset}`}>
          <div> <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={actions.subtract} /> </div>
          <div className={`${styles.flex} ${styles.hideOnSmallDisplays}`}>
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
  state => ({ state: state.occupancy, pageBase: state.pageBase }),
  dispatch => ({
    actions:               bindActionCreators({ ...OccupancyActions, setPast }, dispatch),
    newReservationActions: bindActionCreators(newReservationActions, dispatch)
  })
)(OccupancyPage)
