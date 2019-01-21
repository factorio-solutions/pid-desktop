import PropTypes from 'prop-types'
import React from 'react'
import { t } from '../_shared/modules/localization/localization'

import styles from './notifications.page.scss'

const payedByTransform = payedBy => {
  switch (payedBy) {
    case 'user':
      return 'onUsersExpenses'

    case 'rent':
      return 'longtermRent'

    case 'client':
      return 'onClientsExpenses'

    default:
      return ''
  }
}

const reservationInfo = ({
  reservation: {
    userName,
    garageName,
    clientName,
    placeLabel,
    beginsAt,
    endsAt,
    price,
    currency,
    payedBy
  }
}) => (
  <table className={styles.reservationInfo}>
    <tbody>
      <tr>
        <td>
          <div><b>{t([ 'notifications', 'user' ])}</b>: {userName}</div>
        </td>
        <td>
          <div><b>{t([ 'occupancy', 'garage' ])}</b> {garageName}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div><b>{t([ 'garages', 'client' ])}</b> {clientName}</div>
        </td>
        <td>
          <div><b>{t([ 'occupancy', 'place' ])}</b> {placeLabel}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div><b>{t([ 'occupancy', 'from' ])}</b> {beginsAt}</div>
        </td>
        <td>
          <div><b>{t([ 'occupancy', 'to' ])}</b> {endsAt}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div><b>{t([ 'newReservation', 'price' ])}</b>: {`${price} ${currency}`}</div>
        </td>
        <td>
          <div><b>{t([ 'notifications', 'expensesOn' ])}</b> {payedBy ? t([ 'newReservation', payedByTransform(payedBy) ]) : ''}</div>
        </td>
      </tr>
    </tbody>
  </table>
)


reservationInfo.propTypes = {
  reservation: PropTypes.object
}

export default reservationInfo
