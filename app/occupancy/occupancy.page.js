import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase          from '../_shared/containers/pageBase/PageBase'
import Dropdown          from '../_shared/components/dropdown/Dropdown'
import OccupancyOverview from '../_shared/components/occupancyOverview/OccupancyOverview'
import TabMenu           from '../_shared/components/tabMenu/TabMenu'
import TabButton         from '../_shared/components/buttons/TabButton'
import RoundButton       from '../_shared/components/buttons/RoundButton'
import IconWithCount     from '../_shared/components/iconWithCount/IconWithCount'
import Modal             from '../_shared/components/modal/Modal'
import Form              from '../_shared/components/form/Form'
import Loading           from '../_shared/components/loading/Loading'

import {
  getPlaces,
  getSelectedPlace,
  getInterval
} from './selectors/occupancy.selectors'

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
    currentUser:           PropTypes.object,
    actions:               PropTypes.object,
    newReservationActions: PropTypes.object,
    selectedPlace:         PropTypes.object,
    places:                PropTypes.object,
    interval:              PropTypes.object
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
    const { state, newReservationActions: newResActions, actions } = this.props
    newResActions.clearForm()
    nav.to('/reservations/newReservation')
    actions.unsetNewReservation()

    newResActions.setFrom(state.newReservation.from)
    newResActions.setTo(state.newReservation.to)
    newResActions.setPreferedGarageId(state.garage.id)
    newResActions.setPreferedPlaceId(state.newReservation.placeId)
  }

  render() {
    const {
      state, currentUser, actions, selectedPlace, places, interval
    } = this.props
    const { garage } = state

    const clientDropdown = () => {
      const clientSelected = index => actions.setClientId(state.clients[index].id)

      return state.clients.map((client, index) => ({
        label:       client.name,
        representer: o => (
          <span>
            {
              client.id
              && state.client_ids.includes(client.id)
              && <i className="fa fa-check" aria-hidden="true" />
            }
            {o}
          </span>
        ),
        onClick: () => clientSelected(index)
      }))
    }

    const filters = [
      <TabButton
        label={t([ 'newReservation', 'now' ])}
        onClick={this.setNow}
      />,
      <TabButton
        label={t([ 'occupancy', 'day' ])}
        onClick={actions.dayClick}
        state={state.duration === 'day' && 'selected'}
      />,
      <TabButton
        label={t([ 'occupancy', 'week' ])}
        onClick={actions.weekClick}
        state={state.duration === 'week' && 'selected'}
      />,
      <TabButton
        label={t([ 'occupancy', 'month' ])}
        onClick={actions.monthClick}
        state={state.duration === 'month' && 'selected'}
      />
    ]

    const clientSelector = [
      <Dropdown
        placeholder={t([ 'occupancy', 'selectClientClient' ])}
        content={clientDropdown()}
        style="tabDropdown"
        selected={state.clients.findIndex(client => client.id === state.client_ids[0])}
        filter
        icon={state.client_ids.length
          ? (
            <IconWithCount
              icon="fa fa-filter"
              count={state.client_ids.length}
              type="light"
            />
          )
          : undefined
        }
      />,
      <div className={styles.loading}>
        <Loading show={state.refetching} />
      </div>
    ]

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
                      {selectedPlace && selectedPlace.floor}
                      {'/'}
                      {selectedPlace && selectedPlace.label}
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
            places={places}
            from={state.from}
            showDetails={
              garage
              && (
                garage.user_garage
                && (
                  garage.user_garage.admin
                  || garage.user_garage.manager
                  || garage.user_garage.receptionist
                  || garage.user_garage.security
                )
              )
            }
            duration={state.duration}
            resetClientClick={actions.resetClientClick}
            loading={!state.garages.length || state.loading}
            onReservationClick={this.onReservationClick}
            currentUser={currentUser}
            setNewReservation={actions.setNewReservation}
            reservationsCount={interval && interval.reservations ? interval.reservations.length : 0}
          />
        </div>

        <div
          className={[
            styles.controlls,
            currentUser && !currentUser.hint && styles.rightOffset
          ].join(' ')}
        >
          <div>
            <RoundButton
              content={<span className="fa fa-chevron-left" aria-hidden="true" />}
              onClick={actions.subtract}
            />
          </div>
          <div className={`${styles.flex} ${styles.hideOnSmallDisplays}`}>
            <RoundButton
              content={t([ 'occupancy', 'dayShortcut' ])}
              onClick={actions.dayClick}
              state={state.duration === 'day' && 'selected'}
            />
            <RoundButton
              content={t([ 'occupancy', 'weekShortcut' ])}
              onClick={actions.weekClick}
              state={state.duration === 'week' && 'selected'}
            />
            <RoundButton
              content={t([ 'occupancy', 'monthShortcut' ])}
              onClick={actions.monthClick}
              state={state.duration === 'month' && 'selected'}
            />
          </div>
          <div>
            <RoundButton
              content={<span className="fa fa-chevron-right" aria-hidden="true" />}
              onClick={actions.add}
            />
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({
    state:         state.occupancy,
    currentUser:   state.pageBase.current_user,
    places:        getPlaces(state),
    selectedPlace: getSelectedPlace(state),
    interval:      getInterval(state)
  }),
  dispatch => ({
    actions:               bindActionCreators({ ...OccupancyActions, setPast }, dispatch),
    newReservationActions: bindActionCreators(newReservationActions, dispatch)
  })
)(OccupancyPage)
