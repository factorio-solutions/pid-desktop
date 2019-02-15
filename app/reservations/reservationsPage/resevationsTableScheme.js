import React from 'react'
import moment from 'moment'

import styles from '../reservations.page.scss'


export default [
  {
    key:        'name',
    title:      [ 'reservations', 'name' ],
    comparator: 'string',
    includes:   'user',
    orderBy:    'users.full_name'
  },
  {
    key:        'note',
    title:      [ 'newReservation', 'note' ],
    comparator: 'string',
    orderBy:    'note'
  },
  {
    key:        'client',
    title:      [ 'reservations', 'client' ],
    comparator: 'string',
    includes:   'client',
    orderBy:    'clients.name'
  },
  {
    key:        'licence_plate',
    title:      [ 'reservations', 'licencePlate' ],
    comparator: 'string',
    includes:   'car',
    orderBy:    'cars.licence_plate'
  },
  {
    key:         'type',
    title:       [ 'reservations', 'type' ],
    comparator:  'string',
    representer: o => (
      <i
        className={`fa ${o === 'mr_parkit'
          ? 'fa-rss'
          : o === 'visitor'
            ? 'fa-credit-card'
            : o === 'guest'
              ? 'fa-suitcase'
              : 'fa-home'
        }`}
        aria-hidden="true"
      />
    ),
    orderBy: 'reservation_case',
    enum:    [ 'visitor', 'guest', 'internal', 'mr_parkit' ]
  },
  {
    key:         'state',
    title:       [ 'reservations', 'state' ],
    comparator:  'boolean',
    representer: o => (
      <i
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
      />
    ),
    orderBy: 'approved',
    enum:    [ true, false ]
  },
  {
    key:        'garage',
    title:      [ 'reservations', 'garage' ],
    comparator: 'string',
    includes:   'place floor garage',
    orderBy:    'garages.name'
  },
  {
    key:         'place',
    title:       [ 'reservations', 'place' ],
    comparator:  'string',
    representer: o => (
      <strong className={styles.place}>
        {o}
      </strong>
    ),
    includes: 'place',
    orderBy:  'places.label'
  },
  {
    key:         'from',
    title:       [ 'reservations', 'from' ],
    comparator:  'date',
    representer: o => (
      <span>
        {moment(o).format('ddd DD.MM.')}
        {' '}
        <br />
        {' '}
        {moment(o).format('H:mm')}
      </span>
    ),
    orderBy: 'begins_at',
    sort:    'asc'
  },
  {
    key:         'to',
    title:       [ 'reservations', 'to' ],
    comparator:  'date',
    representer: o => (
      <span>
        { moment(o).format('ddd DD.MM.')}
        <br />
        {' '}
        {moment(o).format('H:mm')}
      </span>
    ),
    orderBy: 'ends_at'
  }
]
