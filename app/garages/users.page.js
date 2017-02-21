import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as garageUsersActions  from '../_shared/actions/garageUsers.actions'
import { setGarage }            from '../_shared/actions/inviteUser.actions'
import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'

import styles from './users.page.scss'


export class GarageUsersPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initGarageUsers(this.props.params.id)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [ { key: 'full_name',   title: t(['garageUsers','name']),        comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'email',       title: t(['garageUsers','email']),       comparator: 'string' }
                   , { key: 'phone',       title: t(['garageUsers','phone']),       comparator: 'number' }
                   , { key: 'created_at',  title: t(['garageUsers','memberSince']), comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, }
                   ]

    const schemaPending = [ { key: 'full_name',  title: t(['garageUsers','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                          , { key: 'email', title: t(['garageUsers','email']), comparator: 'string' }
                          , { key: 'phone', title: t(['garageUsers','phone']), comparator: 'number' }
                          ]

    const isGarageAdmin = state.users.filter((user) => {return user.admin}).findIndex((user)=>{return pageBase.current_user ? user.user.id == pageBase.current_user.id : false}) == -1

    const addGarageUserClick = () => {
      actions.setGarage(this.props.params.id)
      nav.to(`/users/inviteUser`)
    }

    const onBack = () => {
      nav.to(`/garages`)
    }

    const renderSpoiler = (garage_user) => {
      const destroyClick = () => {
        actions.destroyGarageUser(this.props.params.id, garage_user.user.id )
      }

      const adminClick = () => {
        actions.setGarageUserRelation(this.props.params.id, garage_user.user.id , {"admin": !garage_user.admin})
      }
      const receptionistClick = () => {
        actions.setGarageUserRelation(this.props.params.id, garage_user.user.id , {"receptionist": !garage_user.receptionist})
      }
      const securityClick = () => {
        actions.setGarageUserRelation(this.props.params.id, garage_user.user.id , {"security": !garage_user.security})
      }

      return(<div className={styles.spoiler}>
          <div className={styles.devider}>
            <span className={garage_user.admin ? styles.boldText : styles.inactiveText}             onClick={adminClick}>{t(['garageUsers','admin'])}</span>|
            <span className={`${garage_user.receptionist ? styles.boldText : styles.inactiveText}`} onClick={receptionistClick}>{t(['garageUsers','receptionist'])}</span>|
            <span className={`${garage_user.security ? styles.boldText : styles.inactiveText}`}     onClick={securityClick}>{t(['garageUsers','security'])}</span>
          </div>
          <div className={styles.float}>
            <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyClick} type='remove' question={t(['garageUsers','removeGarageUser'])} state={garage_user.admin && 'disabled'}/>
          </div>
        </div>
      )
    }

    const data = state.users.map((garage_user) => {
      const { full_name, email, phone } = garage_user.user
      return { full_name, email, phone, created_at: garage_user.created_at, spoiler: renderSpoiler(garage_user) }
    })
    
    const content = <div>
                      <Table schema={schema} data={data} />

                      { state.pending_users.length > 0 && <div>
                        <h2>{t(['garageUsers','pendingUsers'])}</h2>
                        <Table schema={schemaPending} data={state.pending_users.map((user) => { return user.user })} />
                      </div> }

                      <div className={styles.addButton}>
                        <div style={{float: "left"}}>
                          <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={onBack} />
                        </div>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addGarageUserClick} type='action' size='big' state={isGarageAdmin && "disabled"}/>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.garageUsers, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...garageUsersActions, setGarage }, dispatch) })
)(GarageUsersPage)
