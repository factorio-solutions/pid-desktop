import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase    from '../../_shared/containers/pageBase/PageBase'
import Table       from '../../_shared/components/table/Table'
import RoundButton from '../../_shared/components/buttons/RoundButton'

import * as nav    from '../../_shared/helpers/navigation'
import { t }       from '../../_shared/modules/localization/localization'
import { request } from '../../_shared/helpers/request'

import * as usersActions from '../../_shared/actions/users.actions'

import styles from './users.page.scss'


export class UsersPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initUsers()
  }

  render() {
    const {state, actions} = this.props

    const schema = [ { key: 'full_name',    title: t(['users','username']),     comparator: 'string', representer: o => <strong> {o} </strong>, sort: 'asc' }
                   , { key: 'email',        title: t(['users','email']),        comparator: 'string' }
                   , { key: 'phone',        title: t(['users','phone']),        comparator: 'number' }
                   , { key: 'memberSince',  title: t(['users','memberSince']),  comparator: 'date',   representer: o => o ? o.format('ddd DD.MM.') : null }
                   , { key: 'last_active',  title: t(['users','active']),       comparator: 'date',   representer: o => moment(o).add(1, 'month').diff(moment()) > 0 ? <i className="fa fa-check" aria-hidden="true"></i> : null }
                   ]

    const createClientLink = (client, index, arr) => {
      const onClick = () => {nav.to(`/clients/${client.id}/users`)}
      var name = arr.length-1 == index ? client.name : client.name +", "
      return <span key={index} className={styles.clickable} onClick={onClick}> {name} </span>
    }

    const usersData = state.users.map((user) => {
      user.disabled = user.pending
      user.memberSince = user.clients.length == 0 ? null : user.clients.reduce((max, client)=> { return moment(client.created_at).diff(max) < 0 ? moment(client.created_at) : max}, moment(moment()))
      if (!user.pending) user.spoiler = <div>
          member of <br/>
          {user.clients.map(createClientLink)}
       </div>
      return user
    })

    const toInviteUser = () => {
      nav.to('/users/inviteUser')
    }

    const content = <div>
      <Table schema={schema} data={usersData} />
      <div className={styles.addButton}>
        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={toInviteUser} type='action' size='big'/>
      </div>
    </div>

    return (
      <PageBase content={content} />
    );
  }
}

export default connect(state => {
  const { users } = state
  return ({
    state: users
  })
}, dispatch => ({
  actions: bindActionCreators(usersActions, dispatch)
}))(UsersPage)
