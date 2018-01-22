import React from 'react'
import moment from 'moment'

import { t } from '../../modules/localization/localization'
import { MOMENT_DATETIME_FORMAT } from '../../helpers/time'

import styles from './TableRow.scss'


export default function UpdatedAtTableRow({ data }) {
  return (<tr className={`${styles.tr} ${styles.updated}`}>
    <td colSpan="100%">
      { data && t([ 'reservations', 'updatedAt' ])} { data && [
        data.created_at && moment(data.created_at).format(MOMENT_DATETIME_FORMAT),
        data.user.email || data.user.full_name
      ].filter(o => o).join(' - ')}
    </td>
  </tr>)
}
