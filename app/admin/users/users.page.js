import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase    from '../../_shared/containers/pageBase/PageBase'
import Table       from '../../_shared/components/table/Table'
import RoundButton from '../../_shared/components/buttons/RoundButton'
import TabMenu     from '../../_shared/components/tabMenu/TabMenu'
import TabButton   from '../../_shared/components/buttons/TabButton'

import * as nav    from '../../_shared/helpers/navigation'
import { t }       from '../../_shared/modules/localization/localization'
import { request } from '../../_shared/helpers/request'

import * as usersActions from '../../_shared/actions/users.actions'

import styles from './users.page.scss'


class UsersPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initUsers()
  }

  render() {
    const {state, pageBase, actions} = this.props

    const schema = [ { key: 'full_name',    title: t(['users','username']),     comparator: 'string', representer: o => <strong> {o} </strong>, sort: 'asc' }
                   , { key: 'email',        title: t(['users','email']),        comparator: 'string' }
                   , { key: 'phone',        title: t(['users','phone']),        comparator: 'number' }
                  //  , { key: 'memberSince',  title: t(['users','memberSince']),  comparator: 'date',   representer: o => o ? o.format('ddd DD.MM.') : null }
                   , { key: 'last_active',  title: t(['users','active']),       comparator: 'date',   representer: o => moment(o).add(1, 'month').diff(moment()) > 0 ? <i className={`fa fa-check-circle ${styles.green}`} aria-hidden="true"/> : <i className={`fa fa-question-circle ${styles.yellow}`} aria-hidden="true" /> }
                   ]

    const clientOnClick = (id) => {nav.to(`/${pageBase.garage}/admin/clients/${id}/users`)}
    const createClientLink = (client, index) => {
      const onClick = () => {nav.to(`/${pageBase.garage}/admin/clients/${client.id}/users`)}
      return <li key={index} className={styles.clickable} onClick={() => {clientOnClick(client.id)}}> {client.name}
        {client.admin     && <span>{t(['users', 'admin'])}</span>}
        {client.secretary && <span>{t(['users', 'secretary'])}</span>}
        {client.internal  && <span>{t(['users', 'internal'])}</span>}
        {client.host      && <span>{t(['users', 'host'])}</span>}
      </li>
    }

    const carOnClick = (id) => {nav.to(`/profile/cars/${id}/users`)}
    const createCarLink = (car, index) => {
      const onClick = () => {nav.to(`/profile/cars/${car.id}/users`)}
      return <li key={index} className={styles.clickable} onClick={() => {carOnClick(car.id)}}> {car.model}
        {car.admin     && <span>{t(['users', 'admin'])}</span>}
      </li>
    }

    const garageOnClick = (id) => { /*nav.to(`/${pageBase.garage}/admin/clients/${id}/users`)*/ }
    const createGarageLink = (garage, index) => {
      return <li key={index} className={styles.clickable} onClick={()=>{garageOnClick(garage.id)}}>{garage.name}
        {garage.admin         && <span>{t(['users', 'admin'])}</span>}
        {garage.security      && <span>{t(['users', 'security'])}</span>}
        {garage.receptionist  && <span>{t(['users', 'receptionist'])}</span>}
      </li>
    }

    const usersData = (state.filter == 'all' ? state.users : state.pending ).map((user) => {
      // user.memberSince = user.clients.length == 0 ? null : user.clients.reduce((max, client)=> { return moment(client.created_at).diff(max) < 0 ? moment(client.created_at) : max}, moment(moment()))
      user.spoiler = state.filter == 'all'? <div className={styles.spoiler}>
        <div>
          {t(['users','memberOfClients'])}
          <ul>
            {user.clients.map(createClientLink)}
          </ul>
        </div>
        <div>
          {t(['users','memberOfCars'])}
          <ul>
            {user.cars.map(createCarLink)}
          </ul>
        </div>
        <div>
          {t(['users','memberOfGarages'])}
          <ul>
            {user.garages.map(createGarageLink)}
          </ul>
        </div>
      </div> :
      <div>
        {t(['users', user.client && 'invitedToClient' || user.garage && 'invitedToGarage' || user.car && 'invitedToCar'], {date: moment(user.created_at).format('DD.MM.YYYY HH:mm')})}
        {user.client && <b className={styles.pointer} onClick={()=>{clientOnClick(user.client.id)}}>{user.client.name}</b>}
        {user.client && user.client.admin     && <span className={styles.rights}>{t(['users', 'admin'])}</span>}
        {user.client && user.client.secretary && <span className={styles.rights}>{t(['users', 'secretary'])}</span>}
        {user.client && user.client.internal  && <span className={styles.rights}>{t(['users', 'internal'])}</span>}
        {user.client && user.client.host      && <span className={styles.rights}>{t(['users', 'host'])}</span>}
        {user.garage && <b className={styles.pointer} onClick={()=>{garageOnClick(user.garage.id)}}>{user.garage.name}</b>}
        {user.garage && user.garage.admin         && <span className={styles.rights}>{t(['users', 'admin'])}</span>}
        {user.garage && user.garage.security      && <span className={styles.rights}>{t(['users', 'security'])}</span>}
        {user.garage && user.garage.receptionist  && <span className={styles.rights}>{t(['users', 'receptionist'])}</span>}
        {user.car    && <b className={styles.pointer} onClick={()=>{carOnClick(user.car.id)}}>{user.car.model}</b>}
        {user.car    && user.car.admin && <span className={styles.rights}>{t(['users', 'admin'])}</span>}
      </div>
      return user
    })

    const toInviteUser = () => {
      nav.to(`/${pageBase.garage}/admin/users/invite`)
    }

    const filters = [ <TabButton label={t(['users', 'allKnownUsers'])}      onClick={() => {actions.allClicked()}}     state={state.filter=="all" && 'selected'}/>
                    , <TabButton label={t(['users', 'pendingInvitations'])} onClick={() => {actions.pendingClicked()}} state={state.filter=="pending" && 'selected'}/>
                    ]

    return (
      <PageBase>
        <TabMenu left={filters}/>
        <div className={styles.tableContainer}>
          <Table schema={schema} data={usersData} />
        </div>
        <div className={styles.addButton}>
          <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={toInviteUser} type='action' size='big'/>
        </div>
      </PageBase>
    );
  }
}

export default connect(
  state    => ({ state: state.users, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(usersActions, dispatch) })
)(UsersPage)
