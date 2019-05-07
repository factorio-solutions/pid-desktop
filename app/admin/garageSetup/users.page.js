import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import moment from 'moment'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Table                    from '../../_shared/components/table/Table'
import LabeledRoundButton       from '../../_shared/components/buttons/LabeledRoundButton'
import InvitationReminderButton from '../../_shared/components/buttons/InvitationReminderButton'

import * as garageUsersActions from '../../_shared/actions/garageUsers.actions'
import { setGarage }           from '../../_shared/actions/inviteUser.actions'
import { toAdminGarageSetup }           from '../../_shared/actions/pageBase.actions'
import * as nav                from '../../_shared/helpers/navigation'
import { t }                   from '../../_shared/modules/localization/localization'

import styles from './users.page.scss'


class GarageUsersPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    match:    PropTypes.object
  }

  componentDidMount() {
    const { match: { params }, actions } = this.props
    actions.initGarageUsers(params.id)
  }


  componentWillReceiveProps(nextProps) { // load garage if id changed
    const { pageBase, actions } = this.props
    if (nextProps.pageBase.garage !== pageBase.garage) {
      nextProps.pageBase.garage && actions.initGarageUsers(nextProps.pageBase.garage)
    }
  }

  onRowSelect = data => {
    const { actions } = this.props
    if (data) {
      actions.setSelectedId(data.id)
    } else {
      actions.setSelectedId(undefined)
    }
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [
      {
        key:         'full_name',
        title:       t([ 'garageUsers', 'name' ]),
        comparator:  'string',
        representer: o => <strong>{o}</strong>,
        sort:        'asc'
      },
      { key: 'email', title: t([ 'garageUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'garageUsers', 'phone' ]), comparator: 'number' },
      {
        key:         'created_at',
        title:       t([ 'garageUsers', 'memberSince' ]),
        comparator:  'date',
        representer: o => (
          <span>
            {moment(o).format('ddd DD.MM.YYYY')}
            {' '}
            {moment(o).format('H:mm')}
          </span>
        )
      }
    ]

    const schemaPending = [
      {
        key:         'full_name',
        title:       t([ 'garageUsers', 'name' ]),
        comparator:  'string',
        representer: o => <strong>{o}</strong>,
        sort:        'asc'
      },
      { key: 'email', title: t([ 'garageUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'garageUsers', 'phone' ]), comparator: 'number' }
    ]

    const isGarageAdmin = state.users.filter(user => user.admin).findIndex(user => pageBase.current_user ? user.user.id === pageBase.current_user.id : false) === -1

    const addGarageUserClick = () => {
      actions.setGarage(pageBase.garage)
      nav.to(`/${pageBase.garage}/admin/users/invite`)
    }

    const renderPendingSpoiler = user => {
      const returnable = user.user
      const destroyClick = () => { actions.destroyGarageUser(pageBase.garage, user.user.id) }
      returnable.spoiler = (
        <div className={styles.float}>
          <InvitationReminderButton
            userId={user.user.id}
            garageId={parseInt(pageBase.garage, 10)}
          />
          <LabeledRoundButton
            label={t([ 'garageUsers', 'removeUser' ])}
            content={<span className="fa fa-times" aria-hidden="true" />}
            onClick={destroyClick}
            type="remove"
            question={t([ 'garageUsers', 'removeGarageUser' ])}
          />
        </div>
      )
      return returnable
    }

    const renderSpoiler = garage_user => {
      const destroyClick = () => {
        actions.destroyGarageUser(pageBase.garage, garage_user.user.id)
      }

      const roles = [ 'admin', 'manager', 'receptionist', 'security' ]

      const mapRoleButtons = role => {
        const onClick = () => {
          actions.setGarageUserRelation(pageBase.garage, garage_user.user.id, { [role]: !garage_user[role] })
        }

        return (
          <span
            className={garage_user[role] ? styles.boldText : styles.inactiveText}
            onClick={onClick}
            role="button"
            tabIndex="0"
          >
            {t([ 'garageUsers', role ])}
          </span>
        )
      }

      return (
        <div className={styles.spoiler}>
          <div className={styles.devider}>
            {
              roles.map(mapRoleButtons)
                .reduce((acc, value) => {
                  return acc === null ? [ value ] : [ ...acc, '|', value ]
                }, null)
            }
          </div>
          <div className={styles.float}>
            <LabeledRoundButton
              label={t([ 'garageUsers', 'removeUser' ])}
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={destroyClick}
              type="remove"
              question={t([ 'garageUsers', 'removeGarageUser' ])}
              state={((pageBase.current_user.id !== garage_user.user.id && isGarageAdmin) || garage_user.admin) && 'disabled'}
            />
          </div>
        </div>
      )
    }

    const data = state.users.sort((a, b) => { return a.user.id - b.user.id }).map(garage_user => { // sort - data order has to stay the same
      const {
        id, full_name, email, phone
      } = garage_user.user
      return {
        id, full_name, email, phone, created_at: garage_user.created_at, spoiler:    renderSpoiler(garage_user)
      }
    })

    return (
      <React.Fragment>
        <Table
          schema={schema}
          data={data}
          onRowSelect={this.onRowSelect}
          selectId={state.selectedId}
        />

        {state.pending_users.length > 0 && (
          <div>
            <h2>{t([ 'garageUsers', 'pendingUsers' ])}</h2>
            <Table
              schema={schemaPending}
              data={state.pending_users.map(renderPendingSpoiler)}
            />
          </div>
        )}

        <div className={styles.addButton}>
          <LabeledRoundButton
            content={<span className="fa fa-plus" aria-hidden="true" />}
            onClick={addGarageUserClick}
            type="action"
            size="big"
            state={isGarageAdmin && 'disabled'}
            label={t([ 'garageUsers', 'addUser' ])}
          />
        </div>
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toAdminGarageSetup('garageGarageUsers')),
  connect(
    state => ({ state: state.garageUsers, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators({ ...garageUsersActions, setGarage }, dispatch) })
  )
)

export default enhancers(GarageUsersPage)
