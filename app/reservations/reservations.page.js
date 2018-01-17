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
import Modal              from '../_shared/components/modal/Modal'

import * as nav                                 from '../_shared/helpers/navigation'
import * as reservationActions                  from '../_shared/actions/reservations.actions'
import * as reservationInteruptionActions       from '../_shared/actions/reservationInteruption.actions'
import { setRecurringReservationId, clearForm } from '../_shared/actions/newReservation.actions'
import { setCustomModal }                       from '../_shared/actions/pageBase.actions'
import { t }                                    from '../_shared/modules/localization/localization'
import { MOMENT_DATETIME_FORMAT }               from '../_shared/helpers/time'
import { GET_RESERVATIONS_PAGINATION_QUERY }    from '../_shared/queries/reservations.queries'

import styles from './reservations.page.scss'


class ReservationsPage extends Component {

  static propTypes = {
    state:               PropTypes.object,
    actions:             PropTypes.object,
    params:              PropTypes.object,
    interuption:         PropTypes.object,
    interuptionActions:  PropTypes.object,
    newReservationState: PropTypes.object
  }

  constructor(props) {
    super(props)
    !props.state.past && props.params.id && props.actions.togglePast()
  }

  render() {
    const { state, actions, interuption, interuptionActions, newReservationState } = this.props

    const schema = [
      { key: 'name', title: t([ 'reservations', 'name' ]), comparator: 'string', includes: 'user', orderBy: 'users.full_name' },
      { key: 'note', title: t([ 'newReservation', 'note' ]), comparator: 'string', orderBy: 'note' },
      { key: 'client', title: t([ 'reservations', 'client' ]), comparator: 'string', includes: 'client', orderBy: 'clients.name' },
      { key: 'licence_plate', title: t([ 'reservations', 'licencePlate' ]), comparator: 'string', includes: 'car', orderBy: 'cars.licence_plate' },
      { key:         'type',
        title:       t([ 'reservations', 'type' ]),
        comparator:  'string',
        representer: o => <i className={`fa ${o === 'visitor' ? 'fa-credit-card' : o === 'guest' ? 'fa-suitcase' : 'fa-home'}`} aria-hidden="true" />,
        orderBy:     'reservation_case',
        enum:        [ 'visitor', 'guest', 'internal' ]
      },
      { key:         'state',
        title:       t([ 'reservations', 'state' ]),
        comparator:  'boolean',
        representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-question-circle'} ${o ? styles.green : styles.yellow}`} aria-hidden="true" />,
        orderBy:     'approved',
        enum:        [ true, false ]
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

    const destroyClick = reservation => {
      if (reservation.recurring_reservation && reservation.recurring_reservation.relevant_count > 1) {
        actions.setCustomModal(<div className={styles.destroyModal}>
          <CallToActionButton
            label={t([ 'reservations', 'destroyAllReservation' ], { count: 1 })}
            type="remove"
            onClick={() => {
              actions.setCustomModal()
              actions.destroyReservation(reservation.id)
            }}
          />
          <CallToActionButton
            label={t([ 'reservations', 'destroyAllReservation' ], { count: reservation.recurring_reservation.relevant_count })}
            type="remove"
            onClick={() => {
              actions.setCustomModal()
              actions.destroyRecurringReservations(reservation.recurring_reservation.id)
            }}
          />
          <RoundButton content={<i className="fa fa-chevron-left" aria-hidden="true" />} onClick={actions.setCustomModal} />
        </div>)
      } else {
        actions.destroyReservation(reservation.id)
      }
    }

    const editClick = reservation => {
      if (reservation.recurring_reservation && reservation.recurring_reservation.relevant_count > 1) {
        actions.setCustomModal(<div className={styles.destroyModal}>
          <CallToActionButton
            label={t([ 'reservations', 'updateAllReservation' ], { count: 1 })}
            onClick={() => {
              actions.setCustomModal()
              actions.setRecurringReservationId(reservation.recurring_reservation.id)
              nav.to(`/reservations/${reservation.id}/edit`)
            }}
          />
          <CallToActionButton
            label={t([ 'reservations', 'updateAllReservation' ], { count: reservation.recurring_reservation.relevant_count })}
            onClick={() => {
              actions.setCustomModal()
              actions.setRecurringReservationId(reservation.recurring_reservation.id)
              nav.to(`/reservations/${reservation.id}/edit`)
            }}
          />
          <RoundButton content={<i className="fa fa-chevron-left" aria-hidden="true" />} onClick={actions.setCustomModal} />
        </div>)
      } else {
        nav.to(`/reservations/${reservation.id}/edit`)
      }
    }

    const downloadClick = id => actions.downloadInvoice(id)
    const newReservation = () => {
      (newReservationState.reservation !== undefined || newReservationState.recurring_reservation_id !== undefined) && actions.clearForm()
      nav.to('/reservations/newReservation')
    }
    const interuptClick = reservation => interuptionActions.setReservation(reservation)

    const reservationIteruptionModal = (<div>
      <Form onSubmit={interuptionActions.interuptReservation} onBack={interuptionActions.setReservation} submitable margin={false}>
        <h2>{t([ 'reservationInteruption', 'describtion' ])}</h2>
        <DatetimeInput
          onChange={interuptionActions.setFrom}
          label={t([ 'reservationInteruption', 'from' ])}
          error={t([ 'reservationInteruption', 'invalidaDate' ])}
          value={interuption.from}
        />
        <DatetimeInput
          onChange={interuptionActions.setTo}
          label={t([ 'reservationInteruption', 'to' ])}
          error={t([ 'reservationInteruption', 'invalidaDate' ])}
          value={interuption.to}
        />
      </Form>
    </div>)

    const transformData = data => data.reservations.map(reservation => ({
      id:            reservation.id,
      name:          reservation.user.full_name,
      note:          reservation.note,
      client:        reservation.client && reservation.client.name,
      licence_plate: reservation.car && reservation.car.licence_plate,
      state:         reservation.approved,
      type:          reservation.reservation_case,
      from:          reservation.begins_at,
      to:            reservation.ends_at,
      garage:        reservation.place.floor.garage.name,
      place:         reservation.place.floor.garage.flexiplace && moment(reservation.begins_at).isAfter(moment()) ?
        t([ 'reservations', 'flexiblePlace' ]) :
        `${reservation.place.floor.label} / ${reservation.place.label}`,
      spoiler:       (<div className={styles.spoiler}>
        {!reservation.approved && <div><b>{ reservation.client === null ? t([ 'reservations', 'reservationNotPayed' ]) : t([ 'reservations', 'reservationApproved' ])}</b></div>}
        <div className={styles.flex}>
          <div>
            <div>{reservation.user.email}</div>
            <div>{reservation.user.phone}</div>
          </div>
          <div>
            <div>{t([ 'reservations', 'createdAt' ])} {moment(reservation.created_at).format(MOMENT_DATETIME_FORMAT)}</div>
            <div>{t([ 'reservations', 'updatedAt' ])} {moment(reservation.updated_at).format(MOMENT_DATETIME_FORMAT)}</div>
          </div>
          <div>
            <span className={styles.floatRight}>
              {reservation.client && reservation.client.is_secretary && moment(reservation.ends_at).isAfter(moment()) &&
              <LabeledRoundButton
                label={t([ 'reservations', 'editReservation' ])}
                content={<span className="fa fa-pencil" aria-hidden="true" />}
                onClick={() => editClick(reservation)}
                type="action"
              />
              }
              {reservation.approved && reservation.client && moment(reservation.ends_at).isAfter(moment()) &&
              <LabeledRoundButton
                label={t([ 'reservations', 'interuptReservation' ])}
                content={<span className="fa fa-pause" aria-hidden="true" />}
                onClick={() => interuptClick(reservation)}
                type="action"
              />
              }
              {!reservation.approved && reservation.client === null &&
              <LabeledRoundButton
                label={t([ 'reservations', 'payReservation' ])}
                content={t([ 'reservations', 'pay' ])}
                onClick={() => { actions.payReservation(reservation) }}
                type="action"
              />
              }
              {reservation.invoice_item && reservation.invoice_item.invoice && reservation.invoice_item.invoice.payed &&
              <LabeledRoundButton
                label={t([ 'reservations', 'downloadInvoice' ])}
                content={<span className="fa fa-download" aria-hidden="true" />}
                onClick={() => { downloadClick(reservation.invoice_item.invoice.id) }}
                type="action"
              />
              }
              {moment(reservation.ends_at).isAfter(moment()) &&
              <LabeledRoundButton
                label={t([ 'reservations', moment(reservation.begins_at).isAfter(moment()) ? 'destroyReservation' : 'teminateEarly' ])}
                content={<span className="fa fa-times" aria-hidden="true" />}
                onClick={() => { moment(reservation.begins_at).isAfter(moment()) ? destroyClick(reservation) : interuptionActions.immediateReservationTermination(reservation) }}
                type="remove"
                question={t([ 'reservations', moment(reservation.begins_at).isAfter(moment()) ? 'removeReservationQuestion' : 'terminateEarlyQuestion' ])}
              />
              }
            </span>
          </div>
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
        <TabMenu left={filters} />
        <div className={styles.tableContainer}>
          <PaginatedTable
            query={GET_RESERVATIONS_PAGINATION_QUERY}
            parseMetadata={data => data.reservations_metadata}
            transformData={transformData}
            schema={schema}
            variables={{ past: state.past }}
            findId={parseInt(this.props.params.id, 10)}
          />
        </div>
        <div className={styles.centerDiv}>
          <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={newReservation} type="action" size="big" />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.reservations, interuption: state.reservationInteruption, newReservationState: state.newReservation }),
  dispatch => ({
    actions:            bindActionCreators({ ...reservationActions, setCustomModal, setRecurringReservationId, clearForm }, dispatch),
    interuptionActions: bindActionCreators(reservationInteruptionActions, dispatch)
  })
)(ReservationsPage)
