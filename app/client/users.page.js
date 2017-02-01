import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/Table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as clientUserActions   from '../_shared/actions/clientUsers.actions'
import { setClient }            from '../_shared/actions/inviteUser.actions'
import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'

import styles                          from './users.page.scss'


export class ClientUsersPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initClientUsers(this.props.params.id)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [ { key: 'full_name',        title: t(['clientUsers','name']),        comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'email',       title: t(['clientUsers','email']),       comparator: 'string' }
                   , { key: 'phone',       title: t(['clientUsers','phone']),       comparator: 'number' }
                   , { key: 'created_at',  title: t(['clientUsers','memberSince']), comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, }
                   ]

    const schemaPending = [ { key: 'full_name',  title: t(['clientUsers','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                          , { key: 'email', title: t(['clientUsers','email']), comparator: 'string' }
                          , { key: 'phone', title: t(['clientUsers','phone']), comparator: 'number' }
                          ]

    const isClientAdmin = state.users.filter((user) => {return user.can_manage}).findIndex((user)=>{return pageBase.current_user ? user.user.id == pageBase.current_user.id : false}) == -1

    const addClientUserClick = () => {
      actions.setClient(this.props.params.id)
      nav.to(`/users/inviteUser`)
    }

    const onBack = () => {
      nav.to(`/clients`)
    }

    const renderSpoiler = (client_user) => {
      const destroyClick = () => {
        actions.destroyClientUser(this.props.params.id, client_user.user.id )
      }

      const secretaryClick = () => {
        actions.setSecretary(this.props.params.id, client_user.user.id )
      }
      const internalClick = () => {
        actions.setInternal(this.props.params.id, client_user.user.id )
      }

      const canManageClick = () => {
        // actions.setClientUserRelation(this.props.params.id, client_user.user.id , {"can_manage": !client_user.can_create_own})
      }
      const canCreateOwnClick = () => {
        actions.setClientUserRelation(this.props.params.id, client_user.user.id , {"can_create_own": !client_user.can_create_own})
      }
      const canCreateInternalClick = () => {
        actions.setClientUserRelation(this.props.params.id, client_user.user.id , {"can_create_internal": !client_user.can_create_internal})
      }
      const isInternalClick = () => {
        actions.setClientUserRelation(this.props.params.id, client_user.user.id , {"is_internal": !client_user.is_internal})
      }

      return(<div className={styles.spoiler}>
          <div className={styles.devider}>
            <span className={client_user.can_manage ? styles.boldText : styles.inactiveText}  onClick={canManageClick}>{t(['clientUsers','isAdmin'])}</span>|
            <span className={`${client_user.can_create_own ? styles.boldText : styles.inactiveText}`} onClick={canCreateOwnClick}>{t(['clientUsers','canCreateOwn'])}</span>|
            <span className={`${client_user.can_create_internal ? styles.boldText : styles.inactiveText}`} onClick={canCreateInternalClick}>{t(['clientUsers','canCreateInternal'])}</span>|
            <span className={`${client_user.is_internal ? styles.boldText : styles.inactiveText}`} onClick={isInternalClick}>{t(['clientUsers','isInternal'])}</span>
          </div>
          <div>
            {t(['clientUsers','presetAs'])}
            <span className={styles.clickable} onClick={internalClick}>{t(['clientUsers','internal'])}</span>|
            <span className={styles.clickable} onClick={secretaryClick}>{t(['clientUsers','secretary'])}</span>

            <div className={styles.float}>
              <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyClick} type='remove' question={t(['clientUsers','removeClientUser'])} state={client_user.can_manage && 'disabled'}/>
            </div>
          </div>
        </div>
      )
    }

    const data = state.users.map((client_user) => {
      const { full_name, email, phone } = client_user.user
      return { full_name, email, phone, created_at: client_user.created_at, spoiler: renderSpoiler(client_user) }
    })

    const content = <div>
                      <Table schema={schema} data={data} />

                      { state.pending_users.length > 0 && <div>
                        <h2>{t(['clientUsers','pendingUsers'])}</h2>
                        <Table schema={schemaPending} data={state.pending_users.map((user) => { return user.user })} />
                      </div> }

                      <div className={styles.addButton}>
                        <div style={{float: "left"}}>
                          <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={onBack} />
                        </div>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addClientUserClick} type='action' size='big' state={isClientAdmin && "disabled"}/>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.clientUsers, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...clientUserActions, setClient }, dispatch) })
)(ClientUsersPage)
