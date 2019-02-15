import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { t } from '../../_shared/modules/localization/localization'
import { MOMENT_DATETIME_FORMAT } from '../../_shared/helpers/time'
import { valueAddedTax }  from '../../_shared/helpers/calculatePrice'

import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'

import styles from '../reservations.page.scss'


const isInternal = reservation => (
  reservation.client
  && reservation.client.client_user
  && reservation.client.client_user.internal
)

const isSecretary = reservation => (
  reservation.client
  && reservation.client.client_user
  && reservation.client.client_user.secretary
)

const ownsReservation = (reservation, currentUser) => (
  currentUser && reservation.user.id === currentUser.id
)

const reservationSpoiler = ({
  reservation,
  currentUser,
  destroyReservation,
  editClick,
  editNoteClick,
  interruptClick,
  payReservation,
  downloadInvoice,
  terminateEarly
}) => {
  const garage = reservation.place && reservation.place.floor && reservation.place.floor.garage
  const canEdit = isSecretary(reservation)
  || (
    isInternal(reservation)
    && ownsReservation(reservation, currentUser)
    && reservation.reservation_case !== 'visitor'
  )
  return (
    <div className={styles.spoiler}>
      {!reservation.approved && (
        <div>
          <b>
            {reservation.client === null
              ? t([ 'reservations', 'reservationNotPayed' ])
              : t([ 'reservations', 'reservationApproved' ])
            }
          </b>
        </div>
      )}
      <div className={styles.flex}>
        <div>
          <div>
            {t([ 'reservations', 'createdAt' ])}
            {' '}
            {moment(reservation.created_at).format(MOMENT_DATETIME_FORMAT)}
            {' - '}
            {reservation.creator.email}
          </div>
          {reservation.deleted_at && (
            <div>
              {t([ 'reservations', 'deletedAt' ])}
              {' '}
              {moment(reservation.deleted_at).format(MOMENT_DATETIME_FORMAT)}
            </div>
          )}
        </div>
        {reservation.price > 0 && (
          <div>
            {valueAddedTax(
              reservation.price,
              garage
              && garage.dic
                ? reservation.place.floor.garage.vat
                : 0
            )}
            {' '}
            {reservation.currency.symbol}
          </div>
        )}
        {!reservation.deleted_at && (
          <div>
            <span className={styles.floatRight}>

              {canEdit // Internal can edit his reservations
                ? (
                  <LabeledRoundButton
                    label={t([ 'reservations', 'editReservation' ])}
                    content={<span className="fa fa-pencil" aria-hidden="true" />}
                    onClick={() => editClick(reservation)}
                    type="action"
                  />
                )
                : (
                  <LabeledRoundButton
                    label={t([ 'reservations', 'editNote' ])}
                    content={<span className="fa fa-pencil" aria-hidden="true" />}
                    onClick={() => editNoteClick(reservation)}
                    type="action"
                  />
                )
              }
              {
                canEdit
                && reservation.approved
                && reservation.client
                && moment(reservation.ends_at).isAfter(moment())
                && (
                  <LabeledRoundButton
                    label={t([ 'reservations', 'interuptReservation' ])}
                    content={<span className="fa fa-pause" aria-hidden="true" />}
                    onClick={() => interruptClick(reservation)}
                    type="action"
                  />
                )
              }
              {!reservation.approved && reservation.client === null && (
                <LabeledRoundButton
                  label={t([ 'reservations', 'payReservation' ])}
                  content={<i className="fa fa-credit-card" aria-hidden="true" />}
                  onClick={() => payReservation(reservation)}
                  type="action"
                />
              )}
              {reservation.invoices.length > 0 && (
                <LabeledRoundButton
                  label={t([ 'reservations', 'downloadInvoice' ])}
                  content={<span className="fa fa-download" aria-hidden="true" />}
                  onClick={() => downloadInvoice(reservation.invoices)}
                  type="action"
                />
              )}
              {
                canEdit
                && moment().isBetween(
                  moment(reservation.begins_at),
                  moment(reservation.ends_at)
                )
                  ? (
                    <LabeledRoundButton
                      label={t([ 'reservations', 'teminateEarly' ])}
                      content={<span className="fa fa-times" aria-hidden="true" />}
                      onClick={() => terminateEarly(reservation)}
                      type="remove"
                      question={t([ 'reservations', 'terminateEarlyQuestion' ])}
                    />
                  )
                  : (
                    <LabeledRoundButton
                      label={t([ 'reservations', 'destroyReservation' ])}
                      content={<span className="fa fa-times" aria-hidden="true" />}
                      onClick={() => destroyReservation(reservation)}
                      type="remove"
                      question={t([ 'reservations', 'removeReservationQuestion' ])}
                    />
                  )
              }
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

reservationSpoiler.propTypes = {
  reservation:        PropTypes.object,
  currentUser:        PropTypes.object,
  destroyReservation: PropTypes.func,
  editClick:          PropTypes.func,
  editNoteClick:      PropTypes.func,
  interruptClick:     PropTypes.func,
  payReservation:     PropTypes.func,
  downloadInvoice:    PropTypes.func,
  terminateEarly:     PropTypes.func
}

export default reservationSpoiler
