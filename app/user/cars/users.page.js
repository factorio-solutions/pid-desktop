import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../../_shared/containers/pageBase/PageBase'
import Table        from '../../_shared/components/table/Table'
import RoundButton  from '../../_shared/components/buttons/RoundButton'

import * as carUserActions from '../../_shared/actions/carUsers.actions'
import { setCar }          from '../../_shared/actions/inviteUser.actions'
import * as nav            from '../../_shared/helpers/navigation'
import { t }               from '../../_shared/modules/localization/localization'

import styles from './users.page.scss'


export class CarUsersPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initCarUsers(this.props.params.id)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [ { key: 'full_name',   title: t(['clientUsers','name']),        comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'email',       title: t(['clientUsers','email']),       comparator: 'string' }
                   , { key: 'phone',       title: t(['clientUsers','phone']),       comparator: 'number' }
                   , { key: 'created_at',  title: t(['clientUsers','memberSince']), comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, }
                   ]

    const schemaPending = [ { key: 'full_name',  title: t(['clientUsers','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                          , { key: 'email', title: t(['clientUsers','email']), comparator: 'string' }
                          , { key: 'phone', title: t(['clientUsers','phone']), comparator: 'number' }
                          ]

    const addCarUserClick = () => {
      // todo set car in invite user form
      actions.setCar(this.props.params.id)
      nav.to(`/users/inviteUser`)
    }

    const onBack = () => {
      nav.to(`/profile`)
    }

    const renderPendingSpoiler = (user) => {
      let returnable = user.user
      const destroyClick = () => { actions.destroyCarUser(this.props.params.id, user.user.id ) }
      returnable.spoiler = <div className={styles.float}>
        <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyClick} type='remove' question={t(['clientUsers','removeClientUser'])}/>
      </div>
      return returnable
    }

    const renderSpoiler = (car_user) => {
      const destroyClick = () => { actions.destroyCarUser(this.props.params.id, car_user.user.id ) }
      const adminClick   = () => { actions.setCarUserRelation(this.props.params.id, car_user.user.id , {"admin": !car_user.admin}) }

      return( <div className={styles.spoiler}>
                <span className={car_user.admin ? styles.boldText : styles.inactiveText}  onClick={adminClick}>{t(['clientUsers','admin'])}</span>
                <div className={styles.float}>
                  <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyClick} type='remove' question={t(['clientUsers','removeClientUser'])} state={((pageBase.current_user.id !== car_user.user.id && !state.car.admin) || car_user.admin) && 'disabled'}/>
                </div>
              </div>
      )
    }

    const data = state.users.map((car_user) => {
      return { ...car_user.user, created_at: car_user.created_at, spoiler: renderSpoiler(car_user)}
    })

    return (
      <PageBase>
        <div>
          <Table schema={schema} data={data} />

          { state.pending_users.length > 0 && <div>
            <h2>{t(['clientUsers','pendingUsers'])}</h2>
            <Table schema={schemaPending} data={state.pending_users.map(renderPendingSpoiler)} />
          </div> }

          <div className={styles.addButton}>
            <div style={{float: "left"}}>
              <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={onBack} />
            </div>
            <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addCarUserClick} type='action' size='big' state={!state.car.admin && "disabled"}/>
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.carUsers, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...carUserActions, setCar}, dispatch) })
)(CarUsersPage)
