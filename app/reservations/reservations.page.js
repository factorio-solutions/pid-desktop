import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import Table              from '../_shared/components/table/Table'
import RoundButton        from '../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../_shared/components/buttons/LabeledRoundButton'
import TabMenu            from '../_shared/components/tabMenu/TabMenu'
import TabButton          from '../_shared/components/buttons/TabButton'
import Form               from '../_shared/components/form/Form'
import DatetimeInput      from '../_shared/components/input/DatetimeInput'
import Modal              from '../_shared/components/modal/Modal'

import * as nav                           from '../_shared/helpers/navigation'
import * as reservationActions            from '../_shared/actions/reservations.actions'
import * as reservationInteruptionActions from '../_shared/actions/reservationInteruption.actions'
import { t }                              from '../_shared/modules/localization/localization'
import { MOMENT_DATETIME_FORMAT }         from '../_shared/helpers/time'

import styles from './reservations.page.scss'


export class ReservationsPage extends Component {
  static propTypes = {
    state:              PropTypes.object,
    actions:            PropTypes.object,
    interuption:        PropTypes.object,
    interuptionActions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initReservations()
  }

  render() {
    const { state, actions, interuption, interuptionActions } = this.props

    const schema = [
      { key: 'name', title: t([ 'reservations', 'name' ]), comparator: 'string', sort: 'asc' },
      { key: 'client', title: t([ 'reservations', 'client' ]), comparator: 'string' },
      { key: 'licence_plate', title: t([ 'reservations', 'licencePlate' ]), comparator: 'string' },
      { key:         'type',
        title:       t([ 'reservations', 'type' ]),
        comparator:  'string',
        representer: o => <i className={`fa ${o === 'visitor' ? 'fa-credit-card' : o === 'guest' ? 'fa-suitcase' : 'fa-home'}`} aria-hidden="true" />
      },
      { key:         'state',
        title:       t([ 'reservations', 'state' ]),
        comparator:  'boolean',
        representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-question-circle'} ${o ? styles.green : styles.yellow}`} aria-hidden="true" />
      },
      { key: 'garage', title: t([ 'reservations', 'garage' ]), comparator: 'string' },
      { key:        'place',
        title:      t([ 'reservations', 'place' ]),
        comparator: (type, aRow, bRow) => {
          const a = aRow.garagefloorName + ' / ' + aRow.name
          const b = bRow.garagefloorName + ' / ' + bRow.name
          return a.toLowerCase() < b.toLowerCase() ? (type === 'asc' ? -1 : 1) : (a.toLowerCase() > b.toLowerCase() ? (type === 'asc' ? 1 : -1) : 0)
        },
        representer: o => <strong className={styles.place}> {o.garagefloorName} / {o.name} </strong>
      },
      { key: 'from', title: t([ 'reservations', 'from' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span> },
      { key: 'to', title: t([ 'reservations', 'to' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br /> {moment(o).format('H:mm')}</span> }
    ]

    const destroyClick = reservation => actions.destroyReservation(reservation.id)
    const editClick = reservation => nav.to(`/reservations/${reservation.id}/edit`)
    const downloadClick = id => actions.downloadInvoice(id)
    const newReservation = () => nav.to('/reservations/newReservation')
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

    const data = state.reservations.map(reservation => ({
      name:          reservation.user.full_name,
      client:        reservation.client && reservation.client.name,
      licence_plate: reservation.car && reservation.car.licence_plate,
      state:         reservation.approved,
      type:          reservation.case,
      from:          reservation.begins_at,
      to:            reservation.ends_at,
      garage:        reservation.place.floor.garage.name,
      place:         { garagefloorName: reservation.place.floor.label, name: reservation.place.label },
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
              {reservation.client && moment(reservation.ends_at).isAfter(moment()) &&
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
              {moment(reservation.begins_at).isAfter(moment()) &&
              <LabeledRoundButton
                label={t([ 'reservations', 'destroyRservation' ])}
                content={<span className="fa fa-times" aria-hidden="true" />}
                onClick={() => { destroyClick(reservation) }}
                type="remove"
                question={t([ 'reservations', 'removeReservationQuestion' ])}
              />
              }
            </span>
          </div>
        </div>
      </div>)
    }))

    const filters = [ <TabButton label={t([ 'notifications', 'current' ])} onClick={actions.togglePast} state={!state.past && 'selected'} />,
      <TabButton label={t([ 'notifications', 'past' ])} onClick={actions.togglePast} state={state.past && 'selected'} />
    ]

    return (
      <PageBase>
        <Modal content={reservationIteruptionModal} show={interuption.reservation} />
        <TabMenu left={filters} />
        <div className={styles.tableContainer}>
          <Table schema={schema} data={data} />
        </div>
        <div className={styles.centerDiv}>
          <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={newReservation} type="action" size="big" />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.reservations, interuption: state.reservationInteruption }),
  dispatch => ({ actions: bindActionCreators(reservationActions, dispatch), interuptionActions: bindActionCreators(reservationInteruptionActions, dispatch) })
)(ReservationsPage)
