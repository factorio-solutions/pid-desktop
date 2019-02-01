import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import PaginatedTable     from '../_shared/components/table/PaginatedTable'
import RoundButton        from '../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../_shared/components/buttons/LabeledRoundButton'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'
import TabMenu            from '../_shared/components/tabMenu/TabMenu'
import TabButton          from '../_shared/components/buttons/TabButton'
import ReservationSpoiler from './reservationsPage/reservationSpoiler'
import ReservationNewNoteModal from './reservationsPage/modals/reservationNewNoteModal'
import ReservationInterruptionModal from './reservationsPage/modals/reservationIterruptinModal'

import reservationsTableScheme from './reservationsPage/resevationsTableScheme'

import * as nav from '../_shared/helpers/navigation'
import * as reservationActions from '../_shared/actions/reservations.actions'
import * as reservationInteruptionActions from '../_shared/actions/reservationInteruption.actions'
import { setRecurringReservationId, clearForm } from '../_shared/actions/newReservation.actions'
import { setCustomModal } from '../_shared/actions/pageBase.actions'
import { t } from '../_shared/modules/localization/localization'
import { GET_RESERVATIONS_PAGINATION_DESKTOP_QUERY } from '../_shared/queries/reservations.queries'

import styles from './reservations.page.scss'


class ReservationsPage extends Component {
  static propTypes = {
    state:               PropTypes.object,
    actions:             PropTypes.object,
    params:              PropTypes.object,
    interruption:        PropTypes.object,
    interruptionActions: PropTypes.object,
    newReservationState: PropTypes.object,
    currentUser:         PropTypes.object
  }

  destroyClick = reservation => {
    const { actions } = this.props

    if (
      reservation.recurring_reservation
      && reservation.recurring_reservation.relevant_count > 1
    ) {
      const destroyOne = () => {
        actions.setCustomModal()
        actions.destroyReservation(reservation.id)
      }
      const destroyAll = () => {
        actions.setCustomModal()
        actions.destroyRecurringReservations(reservation.recurring_reservation.id)
      }

      actions.setCustomModal(
        <div className={styles.destroyModal}>
          <CallToActionButton
            label={t([ 'reservations', 'destroyAllReservation' ], { count: 1 })}
            type="remove"
            onClick={destroyOne}
          />
          <CallToActionButton
            label={t(
              [ 'reservations', 'destroyAllReservation' ],
              { count: reservation.recurring_reservation.relevant_count }
            )}
            type="remove"
            onClick={destroyAll}
          />
          <RoundButton
            content={<i className="fa fa-chevron-left" aria-hidden="true" />}
            onClick={actions.setCustomModal}
          />
        </div>
      )
    } else {
      actions.destroyReservation(reservation.id)
    }
  }

  editClick = reservation => {
    const { actions } = this.props

    if (
      reservation.recurring_reservation
      && reservation.recurring_reservation.relevant_count > 1
    ) {
      const editOne = () => {
        actions.setCustomModal()
        actions.setRecurringReservationId()
        nav.to(`/reservations/${reservation.id}/edit`)
      }
      const editAll = () => {
        actions.setCustomModal()
        actions.setRecurringReservationId(reservation.recurring_reservation.id)
        nav.to(`/reservations/${reservation.id}/edit`)
      }

      actions.setCustomModal(
        <div className={styles.destroyModal}>
          <CallToActionButton
            label={t(
              [ 'reservations', 'updateAllReservation' ],
              { count: 1 }
            )}
            onClick={editOne}
          />
          <CallToActionButton
            label={t(
              [ 'reservations', 'updateAllReservation' ],
              { count: reservation.recurring_reservation.relevant_count }
            )}
            onClick={editAll}
          />
          <RoundButton
            content={<i className="fa fa-chevron-left" aria-hidden="true" />}
            onClick={actions.setCustomModal}
          />
        </div>
      )
    } else {
      nav.to(`/reservations/${reservation.id}/edit`)
    }
  }

  editNoteClick = reservation => {
    const { actions } = this.props

    actions.setNewNote(reservation.note)
    actions.setNewNoteReservation(reservation)
  }

  newReservation = () => {
    const { actions, newReservationState } = this.props
    if (
      newReservationState.reservation !== undefined
      || newReservationState.recurring_reservation_id !== undefined
    ) {
      actions.clearForm()
    }
    nav.to('/reservations/newReservation')
  }

  reservationTransformation = reservation => {
    const { place } = reservation
    const garage = place && place.floor && place.floor.garage

    let placeLabel = '-'
    if (garage) {
      placeLabel = garage.flexiplace && moment(reservation.begins_at).isAfter(moment())
        ? t([ 'reservations', 'flexiblePlace' ])
        : `${reservation.place.floor.label} / ${reservation.place.label}`
    }
    return {
      id:            reservation.id,
      name:          reservation.user && reservation.user.full_name,
      note:          reservation.note,
      client:        reservation.client && reservation.client.name,
      licence_plate: reservation.car && reservation.car.licence_plate,
      state:         reservation.deleted_at ? undefined : reservation.approved,
      type:          reservation.reservation_case,
      from:          reservation.begins_at,
      to:            reservation.ends_at,
      deleted_at:    reservation.deleted_at,
      garage:        garage ? garage.name : '-',
      place:         placeLabel
    }
  }

  // downloadClick = ids => this.props.actions.downloadInvoice(ids)

  transformData = data => {
    const { actions, currentUser, interruptionActions } = this.props
    return data.reservations.map(reservation => ({
      ...this.reservationTransformation(reservation),
      history:        reservation.history.map(this.reservationTransformation),
      record_updates: reservation.record_updates,
      spoiler:        (
        <ReservationSpoiler
          reservation={reservation}
          currentUser={currentUser}
          destroyReservation={this.destroyClick}
          editClick={this.editClick}
          editNoteClick={this.editNoteClick}
          interruptClick={this.interruptClick}
          payReservation={actions.payReservation}
          downloadInvoice={actions.downloadInvoice}
          terminateEarly={interruptionActions.immediateReservationTermination}
        />
      )
    }))
  }

  interruptClick = reservation => this.props.interruptionActions.setReservation(reservation)

  render() {
    const {
      state, actions, interruption, interruptionActions
    } = this.props

    const filters = [
      <TabButton
        label={t([ 'notifications', 'current' ])}
        onClick={actions.togglePast}
        state={!state.past && 'selected'}
      />,
      <TabButton
        label={t([ 'notifications', 'past' ])}
        onClick={actions.togglePast}
        state={state.past && 'selected'}
      />
    ]

    return (
      <PageBase>
        <ReservationNewNoteModal
          editReservationNote={actions.editReservationNote}
          setNewNoteReservation={actions.setNewNoteReservation}
          newNote={state.newNote}
          setNewNote={actions.setNewNote}
          showModal={state.newNoteReservation}
        />
        <ReservationInterruptionModal
          from={interruption.from}
          to={interruption.to}
          interruptReservation={interruptionActions.interuptReservation}
          setReservation={interruptionActions.setReservation}
          setFrom={interruptionActions.setFrom}
          setTo={interruptionActions.setTo}
          formatFrom={interruptionActions.formatFrom}
          formatTo={interruptionActions.formatTo}
          showModal={interruption.reservation}
        />
        <TabMenu left={filters} />
        <div className={styles.tableContainer}>
          <PaginatedTable
            query={GET_RESERVATIONS_PAGINATION_DESKTOP_QUERY}
            parseMetadata={data => data.reservations_metadata}
            transformData={this.transformData}
            schema={reservationsTableScheme}
            variables={{ past: state.past }}
            findId={parseInt(this.props.params.id, 10)}
            storeState={actions.setState}
            state={state.tableState}
          />
        </div>
        <div className={styles.centerDiv}>
          <LabeledRoundButton
            content={<span className="fa fa-plus" aria-hidden="true" />}
            onClick={this.newReservation}
            type="action"
            size="big"
            label={t([ 'reservations', 'createReservationLabel' ])}
          />
          <LabeledRoundButton
            content={<span className="fa fa-times" aria-hidden="true" />}
            onClick={() => nav.to('/reservations/bulkRemoval')}
            type="remove"
            question="No message"
            label={t([ 'reservations', 'bulkRemovalLabel' ])}
          />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({
    state:               state.reservations,
    interruption:        state.reservationInteruption,
    newReservationState: state.newReservation,
    currentUser:         state.pageBase.current_user
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...reservationActions,
      setCustomModal,
      setRecurringReservationId,
      clearForm
    }, dispatch),
    interruptionActions: bindActionCreators(reservationInteruptionActions, dispatch)
  })
)(ReservationsPage)
