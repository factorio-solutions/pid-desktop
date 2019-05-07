import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import moment from 'moment'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Table              from '../../_shared/components/table/Table'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import TabMenu            from '../../_shared/components/tabMenu/TabMenu'
import TabButton          from '../../_shared/components/buttons/TabButton'

import * as nav    from '../../_shared/helpers/navigation'
import { t }       from '../../_shared/modules/localization/localization'

import * as usersActions from '../../_shared/actions/users.actions'
import { toAdminUsers } from '../../_shared/actions/pageBase.actions'

import styles from './users.page.scss'

const INACTIVE_AFTER = 60 // days


class UsersPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initUsers()
  }

  clientOnClick = id => nav.to(`/${this.props.pageBase.garage}/admin/clients/${id}/users`)

  carOnClick = id => nav.to(`/profile/cars/${id}/users`)

  toInviteUser = () => nav.to(`/${this.props.pageBase.garage}/admin/users/invite`)

  garageOnClick = id => { /* nav.to(`/${pageBase.garage}/admin/clients/${id}/users`) */ }

  render() {
    const { state, actions } = this.props

    const schema = [
      {
        key:         'full_name',
        title:       t([ 'users', 'username' ]),
        comparator:  'string',
        representer: o => (
          <strong>
            {' '}
            {o}
            {' '}
          </strong>
        ),
        sort: 'asc'
      },
      { key: 'email', title: t([ 'users', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'users', 'phone' ]), comparator: 'number' },
      {
        key:         'last_active',
        title:       t([ 'users', 'active' ]),
        comparator:  'date',
        representer: o => o
          ? moment().diff(moment(o), 'days') < INACTIVE_AFTER
            ? <i className={`fa fa-check-circle ${styles.green}`} aria-hidden="true" title={t([ 'users', 'active' ])} />
            : <i className={`fa fa-question-circle ${styles.yellow}`} aria-hidden="true" title={t([ 'users', 'notActive' ])} />
          : <i className={`fa fa-times-circle ${styles.red}`} aria-hidden="true" title={t([ 'users', 'notConfimed' ])} />
      }
    ]

    const createClientLink = (client, index) => (
      <li key={index} className={styles.clickable} onClick={() => { this.clientOnClick(client.id) }}>
        {client.name}
        {client.admin && <span>{t([ 'users', 'admin' ])}</span>}
        {client.contactPerson && <span>{t([ 'clientUsers', 'contact_person' ])}</span>}
        {client.secretary && <span>{t([ 'users', 'secretary' ])}</span>}
        {client.internal && <span>{t([ 'users', 'internal' ])}</span>}
        {client.host && <span>{t([ 'users', 'host' ])}</span>}
      </li>
    )

    const createCarLink = (car, index) => (
      <li key={index} className={styles.clickable} onClick={() => { this.carOnClick(car.id) }}>
        {' '}
        {car.model}
        {car.admin && <span>{t([ 'users', 'admin' ])}</span>}
        {car.driver && <span>{t([ 'clientUsers', 'driver' ])}</span>}
      </li>
    )

    const createGarageLink = (garage, index) => (
      <li key={index} className={styles.clickable} onClick={() => { this.garageOnClick(garage.id) }}>
        {garage.name}
        {garage.admin && <span>{t([ 'users', 'admin' ])}</span>}
        {garage.manager && <span>{t([ 'garageUsers', 'manager' ])}</span>}
        {garage.security && <span>{t([ 'users', 'security' ])}</span>}
        {garage.receptionist && <span>{t([ 'users', 'receptionist' ])}</span>}
      </li>
    )

    const usersData = (state.filter === 'all' ? state.users : state.pending).map(user => ({
      ...user,
      spoiler: state.filter === 'all'
        ? (
          <div className={styles.spoiler}>
            <div>
              {t([ 'users', 'memberOfClients' ])}
              <ul>
                {user.clients.map(createClientLink)}
              </ul>
            </div>
            <div>
              {t([ 'users', 'memberOfCars' ])}
              <ul>
                {user.cars.map(createCarLink)}
              </ul>
            </div>
            <div>
              {t([ 'users', 'memberOfGarages' ])}
              <ul>
                {user.garages.map(createGarageLink)}
              </ul>
            </div>
          </div>
        )
        : (
          <div>
            {t([ 'users', user.client && 'invitedToClient' || user.garage && 'invitedToGarage' || user.car && 'invitedToCar' ], { date: moment(user.created_at).format('DD.MM.YYYY HH:mm') })}
            {user.client && <b className={styles.pointer} onClick={() => { this.clientOnClick(user.client.id) }}>{user.client.name}</b>}
            {user.client && user.client.admin && <span className={styles.rights}>{t([ 'users', 'admin' ])}</span>}
            {user.client && user.client.contactPerson && <span className={styles.rights}>{t([ 'users', 'contactPerson' ])}</span>}
            {user.client && user.client.secretary && <span className={styles.rights}>{t([ 'users', 'secretary' ])}</span>}
            {user.client && user.client.internal && <span className={styles.rights}>{t([ 'users', 'internal' ])}</span>}
            {user.client && user.client.host && <span className={styles.rights}>{t([ 'users', 'host' ])}</span>}
            {user.garage && <b className={styles.pointer} onClick={() => { garageOnClick(user.garage.id) }}>{user.garage.name}</b>}
            {user.garage && user.garage.admin && <span className={styles.rights}>{t([ 'users', 'admin' ])}</span>}
            {user.garage && user.garage.manager && <span className={styles.rights}>{t([ 'users', 'manager' ])}</span>}
            {user.garage && user.garage.security && <span className={styles.rights}>{t([ 'users', 'security' ])}</span>}
            {user.garage && user.garage.receptionist && <span className={styles.rights}>{t([ 'users', 'receptionist' ])}</span>}
            {user.car && <b className={styles.pointer} onClick={() => { this.carOnClick(user.car.id) }}>{user.car.model}</b>}
            {user.car && user.car.admin && <span className={styles.rights}>{t([ 'users', 'admin' ])}</span>}
            {user.car && user.car.driver && <span className={styles.rights}>{t([ 'clientUsers', 'driver' ])}</span>}
          </div>
        )
    }))


    const filters = [
      <TabButton label={t([ 'users', 'allKnownUsers' ])} onClick={() => { actions.allClicked() }} state={state.filter === 'all' && 'selected'} />,
      <TabButton label={t([ 'users', 'pendingInvitations' ])} onClick={() => { actions.pendingClicked() }} state={state.filter === 'pending' && 'selected'} />
    ]

    return (
      <React.Fragment>
        <TabMenu left={filters} />
        <div className={styles.tableContainer}>
          <Table schema={schema} data={usersData} />
        </div>
        <div className={styles.addButton}>
          <LabeledRoundButton
            content={<span className="fa fa-plus" aria-hidden="true" />}
            onClick={this.toInviteUser}
            type="action"
            size="big"
            label={t([ 'users', 'addUser' ])}
          />
        </div>
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toAdminUsers('users')),
  connect(
    state => ({ state: state.users, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators(usersActions, dispatch) })
  )
)

export default enhancers(UsersPage)
