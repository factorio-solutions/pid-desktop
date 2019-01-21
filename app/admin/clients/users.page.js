import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase from '../../_shared/containers/pageBase/PageBase'
import Table from '../../_shared/components/table/Table'
import RoundButton from '../../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import InvitationReminderButton from '../../_shared/components/buttons/InvitationReminderButton'
import TabButton from '../../_shared/components/buttons/TabButton'
import TabMenu     from '../../_shared/components/tabMenu/TabMenu'

import * as clientUserActions from '../../_shared/actions/clientUsers.actions'
import { setClient } from '../../_shared/actions/inviteUser.actions'
import * as nav from '../../_shared/helpers/navigation'
import { t } from '../../_shared/modules/localization/localization'

import styles from './users.page.scss'

class ClientUsersPage extends Component {
  static propTypes = {
    params:   PropTypes.object,
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }


  schemaPending = [
    {
      key:         'full_name',
      title:       t([ 'clientUsers', 'name' ]),
      comparator:  'string',
      representer: o => <strong>{o}</strong>,
      sort:        'asc'
    },
    { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
    { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' }
  ]

  componentDidMount() {
    const {
      actions: { initClientUsers },
      params: { client_id }
    } = this.props
    initClientUsers(client_id)
  }

  onRowSelect = data => {
    const {
      actions: { setSelectedId }
    } = this.props
    if (data) {
      setSelectedId(data.id)
    } else {
      setSelectedId(undefined)
    }
  }

  schema = () => {
    const { state } = this.props
    return [
      {
        key:         'full_name',
        title:       t([ 'clientUsers', 'name' ]),
        comparator:  'string',
        representer: o => (<strong>{o}</strong>),
        sort:        'asc'
      },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' },
      state.client && state.client.is_time_credit_active
        ? { key: 'timeCredit', title: t([ 'clientUsers', 'timeCredit' ]), comparator: 'string' }
        : {},
      {
        key:         'created_at',
        title:       t([ 'clientUsers', 'memberSince' ]),
        comparator:  'date',
        representer: o => {
          const date = moment(o)
          return (
            <span>
              {`${date.format('ddd DD.MM.YYYY')} ${moment(o).format('H:mm')}`}
            </span>
          )
        }
      }
    ]
  }

  addClientUserClick = () => {
    const {
      params: { client_id },
      actions: { setClient: setClientAction },
      pageBase: { garage }
    } = this.props
    setClientAction(+client_id)
    nav.to(`/${garage}/admin/users/invite`)
  }

  renderPendingSpoiler = user => {
    const {
      actions: destroyClientUser,
      params: client_id
    } = this.props
    const returnable = user.user
    const destroyClick = () => { destroyClientUser(client_id, user.user.id) }
    returnable.spoiler = (
      <div className={styles.float}>
        <InvitationReminderButton userId={user.user.id} clientId={parseInt(client_id, 10)} />
        <LabeledRoundButton
          label={t([ 'clientUsers', 'removeUser' ])}
          content={<span className="fa fa-times" aria-hidden="true" />}
          onClick={destroyClick}
          type="remove"
          question={t([ 'clientUsers', 'removeClientUser' ])}
        />
      </div>
    )
    return returnable
  }

  renderSpoiler = (clientUser, currentClientUser) => {
    const {
      actions,
      pageBase,
      params: { client_id }
    } = this.props
    const userId = clientUser.user.id

    const destroyClick = () => actions.destroyClientUser(client_id, userId)

    const secretaryPresetClick = () => actions.setSecretary(client_id, userId)
    const internalPresetClick = () => actions.setInternal(client_id, userId)

    const roles = [ 'admin', 'contact_person', 'secretary', 'host', 'internal' ]

    const mapRoleButtons = role => {
      const onClick = () => {
        actions.setClientUserRelation(client_id, userId, { [role]: !clientUser[role] })
      }

      return (
        <span
          className={clientUser[role] ? styles.boldText : styles.inactiveText}
          onClick={onClick}
          role="button"
          tabIndex="0"
        >
          {t([ 'clientUsers', role ])}
        </span>
      )
    }

    return (
      <div className={styles.spoiler}>
        <div className={styles.devider}>
          {roles.map(mapRoleButtons)
            .reduce((acc, value) => {
              return acc === null ? [ value ] : [ ...acc, '|', value ]
            }, null)}
        </div>
        <div>
          {t([ 'clientUsers', 'presetAs' ])}
          <span
            className={styles.clickable}
            onClick={internalPresetClick}
            role="button"
            tabIndex="0"
          >
            {t([ 'clientUsers', 'internal' ])}
          </span>
          |
          <span
            className={styles.clickable}
            onClick={secretaryPresetClick}
            role="button"
            tabIndex="0"
          >
            {t([ 'clientUsers', 'secretary' ])}
          </span>

          <div className={styles.float}>
            <LabeledRoundButton
              label={t([ 'clientUsers', 'removeUser' ])}
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={destroyClick}
              type="remove"
              question={t([ 'clientUsers', 'removeClientUser' ])}
              state={
                (
                  (pageBase.current_user
                  && pageBase.current_user.id !== userId
                  && currentClientUser
                  && !(currentClientUser.admin || currentClientUser.secretary)
                  )
                || clientUser.admin
                || (clientUser.contact_person && currentClientUser && currentClientUser.secretary)
                )
                && 'disabled'
              }
            />
          </div>
        </div>
      </div>
    )
  }

  getData = currentClientUser => {
    const { state: { users } } = this.props
    return users.map(clientUser => ({
      ...clientUser.user,
      timeCredit: `${clientUser.current_time_credit_amount} / ${clientUser.client.time_credit_amount_per_month}`,
      created_at: clientUser.created_at,
      spoiler:    this.renderSpoiler(clientUser, currentClientUser)
    }))
  }

  filters = () => {
    const {
      state: {
        clientName,
        filter
      },
      actions: {
        allClicked,
        pendingClicked
      }
    } = this.props
    return [
      <TabButton label={t([ 'clientUsers', 'confirmedUsers' ], { name: clientName })} onClick={() => { allClicked() }} state={filter === 'all' && 'selected'} />,
      <TabButton label={t([ 'clientUsers', 'pendingUsers' ])} onClick={() => { pendingClicked() }} state={filter === 'pending' && 'selected'} />
    ]
  }

  onBack = () => {
    const { pageBase: { garage } } = this.props
    nav.to(`/${garage}/admin/clients`)
  }

  render() {
    const {
      schemaPending,
      props: {
        state,
        pageBase
      }
    } = this

    const currentClientUser = state.users.find(user => pageBase.current_user ? user.user.id === pageBase.current_user.id : false)

    const data = this.getData(currentClientUser)
    return (
      <PageBase>
        <TabMenu left={this.filters()} />

        <div className={styles.tableContainer}>
          {state.filter === 'all'
            && (
              <Table
                schema={this.schema()}
                data={data}
                onRowSelect={this.onRowSelect}
                selectId={state.selectedId}
              />
            )
          }
          {state.filter === 'pending' && <Table schema={schemaPending} data={state.pending_users.map(this.renderPendingSpoiler)} />}
        </div>

        <div className={styles.backButton}>
          <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={this.onBack} />
        </div>
        <div className={styles.addButton}>
          <RoundButton
            content={<span className="fa fa-plus" aria-hidden="true" />}
            onClick={this.addClientUserClick}
            type="action"
            size="big"
            state={currentClientUser ? (currentClientUser.admin || currentClientUser.secretary || currentClientUser.internal) ? '' : 'disabled' : 'disabled'}
          />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.clientUsers, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...clientUserActions, setClient }, dispatch) })
)(ClientUsersPage)
