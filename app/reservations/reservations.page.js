import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import PaginatedTable     from '../_shared/components/table/PaginatedTable'
import RoundButton        from '../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../_shared/components/buttons/LabeledRoundButton'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'
import TabMenu            from '../_shared/components/tabMenu/TabMenu'
import TabButton          from '../_shared/components/buttons/TabButton'
import Form               from '../_shared/components/form/Form'
import DatetimeInput      from '../_shared/components/input/DatetimeInput'
import Input              from '../_shared/components/input/Input'
import Modal              from '../_shared/components/modal/Modal'
import { valueAddedTax }  from '../_shared/helpers/calculatePrice'

import * as nav                                      from '../_shared/helpers/navigation'
import * as reservationActions                       from '../_shared/actions/reservations.actions'
import * as reservationInteruptionActions            from '../_shared/actions/reservationInteruption.actions'
import { setRecurringReservationId, clearForm }      from '../_shared/actions/newReservation.actions'
import { setCustomModal }                            from '../_shared/actions/pageBase.actions'
import { t }                                         from '../_shared/modules/localization/localization'
import { MOMENT_DATETIME_FORMAT }                    from '../_shared/helpers/time'
import { GET_RESERVATIONS_PAGINATION_DESKTOP_QUERY } from '../_shared/queries/reservations.queries'

import styles from './reservations.page.scss'


class ReservationsPage extends Component {

  static propTypes = {
    state:               PropTypes.object,
    actions:             PropTypes.object,
    params:              PropTypes.object,
    interuption:         PropTypes.object,
    interuptionActions:  PropTypes.object,
    newReservationState: PropTypes.object,
    pageBase:            PropTypes.object
  }

  destroyClick = reservation => {
    const { actions } = this.props

    if (reservation.recurring_reservation && reservation.recurring_reservation.relevant_count > 1) {
      const destroyOne = () => {
        actions.setCustomModal()
        actions.destroyReservation(reservation.id)
      }
      const destroyAll = () => {
        actions.setCustomModal()
        actions.destroyRecurringReservations(reservation.recurring_reservation.id)
      }

      actions.setCustomModal(<div className={styles.destroyModal}>
        <CallToActionButton label={t([ 'reservations', 'destroyAllReservation' ], { count: 1 })} type="remove" onClick={destroyOne} />
        <CallToActionButton label={t([ 'reservations', 'destroyAllReservation' ], { count: reservation.recurring_reservation.relevant_count })} type="remove" onClick={destroyAll} />
        <RoundButton content={<i className="fa fa-chevron-left" aria-hidden="true" />} onClick={actions.setCustomModal} />
      </div>)
    } else {
      actions.destroyReservation(reservation.id)
    }
  }

  editClick = reservation => {
    const { actions } = this.props

    if (reservation.recurring_reservation && reservation.recurring_reservation.relevant_count > 1) {
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

      actions.setCustomModal(<div className={styles.destroyModal}>
        <CallToActionButton label={t([ 'reservations', 'updateAllReservation' ], { count: 1 })} onClick={editOne} />
        <CallToActionButton label={t([ 'reservations', 'updateAllReservation' ], { count: reservation.recurring_reservation.relevant_count })} onClick={editAll} />
        <RoundButton content={<i className="fa fa-chevron-left" aria-hidden="true" />} onClick={actions.setCustomModal} />
      </div>)
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
    if (newReservationState.reservation !== undefined || newReservationState.recurring_reservation_id !== undefined) actions.clearForm()
    nav.to('/reservations/newReservation')
  }

  // downloadClick = ids => this.props.actions.downloadInvoice(ids)

  interuptClick = reservation => this.props.interuptionActions.setReservation(reservation)


  render() {
    const { state, actions, interuption, interuptionActions, pageBase } = this.props

    const schema = [
      { key: 'name', title: t([ 'reservations', 'name' ]), comparator: 'string', includes: 'user', orderBy: 'users.full_name' },
      { key: 'note', title: t([ 'newReservation', 'note' ]), comparator: 'string', orderBy: 'note' },
      { key: 'client', title: t([ 'reservations', 'client' ]), comparator: 'string', includes: 'client', orderBy: 'clients.name' },
      { key: 'licence_plate', title: t([ 'reservations', 'licencePlate' ]), comparator: 'string', includes: 'car', orderBy: 'cars.licence_plate' },
      { key:         'type',
        title:       t([ 'reservations', 'type' ]),
        comparator:  'string',
        representer: o => <i className={`fa ${o === 'mr_parkit' ? 'fa-rss' : o === 'visitor' ? 'fa-credit-card' : o === 'guest' ? 'fa-suitcase' : 'fa-home'}`} aria-hidden="true" />,
        orderBy:     'reservation_case',
        enum:        [ 'visitor', 'guest', 'internal', 'mr_parkit' ]
      },
      { key:         'state',
        title:       t([ 'reservations', 'state' ]),
        comparator:  'boolean',
        representer: o => <i
          className={`fa
            ${o === undefined
              ? 'fa-times-circle'
              : o
                ? 'fa-check-circle'
                : 'fa-question-circle'}
            ${o === undefined
              ? styles.red
              : o
                ? styles.green
                : styles.yellow
          }`}
          aria-hidden="true"
        />,
        orderBy: 'approved',
        enum:    [ true, false ]
      },
      { key: 'garage', title: t([ 'reservations', 'garage' ]), comparator: 'string', includes: 'place floor garage', orderBy: 'garages.name' },
      { key:         'place',
        title:       t([ 'reservations', 'place' ]),
        comparator:  'string',
        representer: o => <strong className={styles.place}> {o} </strong>,
        includes:    'place',
        orderBy:     'places.label'
      },
      { key:         'from',
        title:       t([ 'reservations', 'from' ]),
        comparator:  'date',
        representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span>,
        orderBy:     'begins_at',
        sort:        'asc' },
      { key: 'to', title: t([ 'reservations', 'to' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span>, orderBy: 'ends_at' }
    ]

    const reservationIteruptionModal = (<div>
      <Form onSubmit={interuptionActions.interuptReservation} onBack={interuptionActions.setReservation} submitable margin={false} modal>
        <h2>{t([ 'reservationInteruption', 'describtion' ])}</h2>
        <DatetimeInput
          onChange={interuptionActions.setFrom}
          label={t([ 'reservationInteruption', 'from' ])}
          error={t([ 'reservationInteruption', 'invalidaDate' ])}
          value={interuption.from}
          onBlur={interuptionActions.formatFrom}
        />
        <DatetimeInput
          onChange={interuptionActions.setTo}
          label={t([ 'reservationInteruption', 'to' ])}
          error={t([ 'reservationInteruption', 'invalidaDate' ])}
          value={interuption.to}
          onBlur={interuptionActions.formatTo}
        />
      </Form>
    </div>)

    const reservationNewNoteModal = (<Form onSubmit={actions.editReservationNote} onBack={actions.setNewNoteReservation} submitable margin={false} modal>
      <Input
        onChange={actions.setNewNote}
        label={t([ 'reservations', 'newNote' ])}
        value={state.newNote}
        align="center"
      />
    </Form>)

    const reservationTransformation = reservation => ({
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
      garage:        reservation.place.floor.garage.name,
      place:         reservation.place.floor.garage.flexiplace && moment(reservation.begins_at).isAfter(moment()) ?
        t([ 'reservations', 'flexiblePlace' ]) :
        `${reservation.place.floor.label} / ${reservation.place.label}`
    })

    const transformData = data => data.reservations.map(reservation => ({
      ...reservationTransformation(reservation),
      history:        reservation.history.map(reservationTransformation),
      record_updates: reservation.record_updates,
      spoiler:        (<div className={styles.spoiler}>
        {!reservation.approved && <div><b>{ reservation.client === null ? t([ 'reservations', 'reservationNotPayed' ]) : t([ 'reservations', 'reservationApproved' ])}</b></div>}
        <div className={styles.flex}>
          <div>
            <div>
              {t([ 'reservations', 'createdAt' ])} {moment(reservation.created_at).format(MOMENT_DATETIME_FORMAT)} - {reservation.creator.email}
            </div>
            {reservation.deleted_at && <div>
              {t([ 'reservations', 'deletedAt' ])} {moment(reservation.deleted_at).format(MOMENT_DATETIME_FORMAT)}
            </div>}
          </div>
          {reservation.price > 0 && <div>
            {valueAddedTax(reservation.price, reservation.place.floor.garage.dic ? reservation.place.floor.garage.vat : 0)} {reservation.currency.symbol}
          </div>}
          {!reservation.deleted_at && <div>
            <span className={styles.floatRight}>
              {reservation.client &&
              (reservation.client.client_user.secretary ||
              (reservation.client.client_user.internal && reservation.user.id === pageBase.current_user.id)) ? // Internal can edit his reservations
                <LabeledRoundButton
                  label={t([ 'reservations', 'editReservation' ])}
                  content={<span className="fa fa-pencil" aria-hidden="true" />}
                  onClick={() => this.editClick(reservation)}
                  type="action"
                /> :
                <LabeledRoundButton
                  label={t([ 'reservations', 'editNote' ])}
                  content={<span className="fa fa-pencil" aria-hidden="true" />}
                  onClick={() => this.editNoteClick(reservation)}
                  type="action"
                />
              }
              {reservation.approved && reservation.client && moment(reservation.ends_at).isAfter(moment()) &&
                <LabeledRoundButton
                  label={t([ 'reservations', 'interuptReservation' ])}
                  content={<span className="fa fa-pause" aria-hidden="true" />}
                  onClick={() => this.interuptClick(reservation)}
                  type="action"
                />
              }
              {!reservation.approved && reservation.client === null &&
                <LabeledRoundButton
                  label={t([ 'reservations', 'payReservation' ])}
                  content={<i className="fa fa-credit-card" aria-hidden="true" />}
                  onClick={() => actions.payReservation(reservation)}
                  type="action"
                />
              }
              {reservation.invoices.length > 0 &&
                <LabeledRoundButton
                  label={t([ 'reservations', 'downloadInvoice' ])}
                  content={<span className="fa fa-download" aria-hidden="true" />}
                  onClick={() => actions.downloadInvoice(reservation.invoices.map(invoice => invoice.id))}
                  type="action"
                />
              }
              {moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) ?
                <LabeledRoundButton
                  label={t([ 'reservations', 'teminateEarly' ])}
                  content={<span className="fa fa-times" aria-hidden="true" />}
                  onClick={() => interuptionActions.immediateReservationTermination(reservation)}
                  type="remove"
                  question={t([ 'reservations', 'terminateEarlyQuestion' ])}
                /> :
                <LabeledRoundButton
                  label={t([ 'reservations', 'destroyReservation' ])}
                  content={<span className="fa fa-times" aria-hidden="true" />}
                  onClick={() => this.destroyClick(reservation)}
                  type="remove"
                  question={t([ 'reservations', 'removeReservationQuestion' ])}
                />
              }
            </span>
          </div>}
        </div>
      </div>)
    }))


    const filters = [
      <TabButton label={t([ 'notifications', 'current' ])} onClick={actions.togglePast} state={!state.past && 'selected'} />,
      <TabButton label={t([ 'notifications', 'past' ])} onClick={actions.togglePast} state={state.past && 'selected'} />
    ]

    return (
      <PageBase>
        <Modal content={reservationIteruptionModal} show={interuption.reservation} />
        <Modal content={reservationNewNoteModal} show={state.newNoteReservation} />
        <TabMenu left={filters} />
        <div className={styles.tableContainer}>
          <PaginatedTable
            query={GET_RESERVATIONS_PAGINATION_DESKTOP_QUERY}
            parseMetadata={data => data.reservations_metadata}
            transformData={transformData}
            schema={schema}
            variables={{ past: state.past }}
            findId={parseInt(this.props.params.id, 10)}
          />
        </div>
        <div className={styles.centerDiv}>
          <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={this.newReservation} type="action" size="big" />
          <LabeledRoundButton
            content={<span className="fa fa-times" aria-hidden="true" />}
            onClick={() => nav.to('/reservations/bulkRemoval')}
            type="remove"
            question="No message"
          />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.reservations, interuption: state.reservationInteruption, newReservationState: state.newReservation, pageBase: state.pageBase }),
  dispatch => ({
    actions:            bindActionCreators({ ...reservationActions, setCustomModal, setRecurringReservationId, clearForm }, dispatch),
    interuptionActions: bindActionCreators(reservationInteruptionActions, dispatch)
  })
)(ReservationsPage)
