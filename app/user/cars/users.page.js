import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase                 from '../../_shared/containers/pageBase/PageBase'
import Table                    from '../../_shared/components/table/Table'
import RoundButton              from '../../_shared/components/buttons/RoundButton'
import InvitationReminderButton from '../../_shared/components/buttons/InvitationReminderButton'
import LabeledRoundButton       from '../../_shared/components/buttons/LabeledRoundButton'

import * as carUserActions from '../../_shared/actions/carUsers.actions'
import { setCar }          from '../../_shared/actions/inviteUser.actions'
import * as nav            from '../../_shared/helpers/navigation'
import { t }               from '../../_shared/modules/localization/localization'

import styles from './users.page.scss'


class CarUsersPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    params:   PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initCarUsers(this.props.params.id)
  }

  onBack = () => nav.to('/profile')

  addCarUserClick = () => {
    this.props.actions.setCar(this.props.params.id)
    nav.to(`/${this.props.pageBase.garage}/admin/users/invite`)
  }


  render() {
    const { state, pageBase, actions } = this.props

    const schema = [
      {
        key:         'full_name', title:       t([ 'clientUsers', 'name' ]), comparator:  'string', representer: o => <strong>{o}</strong>, sort:        'asc'
      },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' },
      {
        key:         'created_at',
title:       t([ 'clientUsers', 'memberSince' ]),
comparator:  'date',
representer: o => (
          <span>
            { moment(o).format('ddd DD.MM.YYYY')}
            {' '}
            {moment(o).format('H:mm')}
          </span>
        )
      }
    ]

    const schemaPending = [
      {
        key:         'full_name', title:       t([ 'clientUsers', 'name' ]), comparator:  'string', representer: o => <strong>{o}</strong>, sort:        'asc'
      },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' }
    ]


    const renderPendingSpoiler = user => {
      const destroyClick = () => actions.destroyCarUser(this.props.params.id, user.user.id)
      return {
        ...user.user,
        spoiler: (
          <div className={styles.float}>
            <InvitationReminderButton userId={user.user.id} carId={parseInt(this.props.params.id, 10)} />
            <LabeledRoundButton
              label={t([ 'clientUsers', 'removeUser' ])}
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={destroyClick}
              type="remove"
              question={t([ 'clientUsers', 'removeClientUser' ])}
            />
          </div>
        )
      }
    }

    const renderSpoiler = car_user => {
      const destroyClick = () => actions.destroyCarUser(this.props.params.id, car_user.user.id)
      const adminClick = () => actions.setCarUserRelation(this.props.params.id, car_user.user.id, { admin: !car_user.admin })
      const driverClick = () => actions.setCarUserRelation(this.props.params.id, car_user.user.id, { driver: !car_user.driver })

      return (
        <div className={styles.spoiler}>
          <span className={car_user.admin ? styles.boldText : styles.inactiveText} onClick={adminClick}>{t([ 'carUsers', 'admin' ])}</span>
          {'|'}
          <span className={car_user.driver ? styles.boldText : styles.inactiveText} onClick={driverClick}>{t([ 'clientUsers', 'driver' ])}</span>
          <div className={styles.float}>
            <LabeledRoundButton
              label={t([ 'clientUsers', 'removeUser' ])}
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={destroyClick}
              type="remove"
              question={t([ 'clientUsers', 'removeClientUser' ])}
              state={((pageBase.current_user.id !== car_user.user.id && !state.car.admin) || car_user.admin) && 'disabled'}
            />
          </div>
        </div>
      )
    }

    const data = state.users.map(carUser => ({ ...carUser.user, created_at: carUser.created_at, spoiler: renderSpoiler(carUser) }))

    return (
      <PageBase>
        <div>
          <Table schema={schema} data={data} />

          {state.pending_users.length > 0 && (
            <div>
              <h2>{t([ 'clientUsers', 'pendingUsers' ])}</h2>
              <Table schema={schemaPending} data={state.pending_users.map(renderPendingSpoiler)} />
            </div>
          )}

          <div className={styles.addButton}>
            <div style={{ float: 'left' }}>
              <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={this.onBack} />
            </div>
            <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={this.addCarUserClick} type="action" size="big" state={!state.car.admin && 'disabled'} />
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.carUsers, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...carUserActions, setCar }, dispatch) })
)(CarUsersPage)
