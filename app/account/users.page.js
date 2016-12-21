import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/Table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as accountUserActions  from '../_shared/actions/accountUsers.actions'
import { setAccount }           from '../_shared/actions/inviteUser.actions'
import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'

import styles                          from './users.page.scss'


export class AccountUsersPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initAccountUsers(this.props.params.id)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [ { key: 'full_name',        title: t(['accountUsers','name']),        comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'email',       title: t(['accountUsers','email']),       comparator: 'string' }
                   , { key: 'phone',       title: t(['accountUsers','phone']),       comparator: 'number' }
                   , { key: 'created_at',  title: t(['accountUsers','memberSince']), comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, }
                   ]

    const schemaPending = [ { key: 'full_name',  title: t(['accountUsers','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                          , { key: 'email', title: t(['accountUsers','email']), comparator: 'string' }
                          , { key: 'phone', title: t(['accountUsers','phone']), comparator: 'number' }
                          ]

    const isAccountAdmin = state.users.filter((user) => {return user.can_manage}).findIndex((user)=>{return pageBase.current_user ? user.user.id == pageBase.current_user.id : false}) == -1

    const addAccountUserClick = () => {
      actions.setAccount(this.props.params.id)
      nav.to(`/users/inviteUser`)
    }

    const onBack = () => {
      nav.to(`/accounts`)
    }

    const renderSpoiler = (account_user) => {
      const destroyClick = () => {
        actions.destroyAccountUser(this.props.params.id, account_user.user.id )
      }

      const secretaryClick = () => {
        actions.setSecretary(this.props.params.id, account_user.user.id )
      }
      const internalClick = () => {
        actions.setInternal(this.props.params.id, account_user.user.id )
      }

      const canManageClick = () => {
        // actions.setAccountUserRelation(this.props.params.id, account_user.user.id , {"can_manage": !account_user.can_create_own})
      }
      const canCreateOwnClick = () => {
        actions.setAccountUserRelation(this.props.params.id, account_user.user.id , {"can_create_own": !account_user.can_create_own})
      }
      const canCreateInternalClick = () => {
        actions.setAccountUserRelation(this.props.params.id, account_user.user.id , {"can_create_internal": !account_user.can_create_internal})
      }
      const isInternalClick = () => {
        actions.setAccountUserRelation(this.props.params.id, account_user.user.id , {"is_internal": !account_user.is_internal})
      }

      return(<div className={styles.spoiler}>
          <div className={styles.devider}>
            <span className={account_user.can_manage ? styles.boldText : styles.inactiveText}  onClick={canManageClick}>{t(['accountUsers','isAdmin'])}</span>|
            <span className={`${account_user.can_create_own ? styles.boldText : styles.inactiveText}`} onClick={canCreateOwnClick}>{t(['accountUsers','canCreateOwn'])}</span>|
            <span className={`${account_user.can_create_internal ? styles.boldText : styles.inactiveText}`} onClick={canCreateInternalClick}>{t(['accountUsers','canCreateInternal'])}</span>|
            <span className={`${account_user.is_internal ? styles.boldText : styles.inactiveText}`} onClick={isInternalClick}>{t(['accountUsers','isInternal'])}</span>
          </div>
          <div>
            {t(['accountUsers','presetAs'])}
            <span className={styles.clickable} onClick={internalClick}>{t(['accountUsers','internal'])}</span>|
            <span className={styles.clickable} onClick={secretaryClick}>{t(['accountUsers','secretary'])}</span>

            <div className={styles.float}>
              <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyClick} type='remove' question={t(['accountUsers','removeAccountUser'])} state={account_user.can_manage && 'disabled'}/>
            </div>
          </div>
        </div>
      )
    }

    const data = state.users.map((account_user) => {
      const { full_name, email, phone } = account_user.user
      return { full_name, email, phone, created_at: account_user.created_at, spoiler: renderSpoiler(account_user) }
    })

    const content = <div>
                      <Table schema={schema} data={data} />

                      { state.pending_users.length > 0 && <div>
                        <h2>{t(['accountUsers','pendingUsers'])}</h2>
                        <Table schema={schemaPending} data={state.pending_users.map((user) => { return user.user })} />
                      </div> }

                      <div className={styles.addButton}>
                        <div style={{float: "left"}}>
                          <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={onBack} />
                        </div>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addAccountUserClick} type='action' size='big' state={isAccountAdmin && "disabled"}/>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.accountUsers, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...accountUserActions, setAccount }, dispatch) })
)(AccountUsersPage)
