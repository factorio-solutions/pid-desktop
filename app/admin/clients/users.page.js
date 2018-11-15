import React, { Component, PropTypes } from 'react'
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

  componentDidMount() {
    this.props.actions.initClientUsers(this.props.params.client_id)
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
      { key: 'full_name', title: t([ 'clientUsers', 'name' ]), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' },
      state.client && state.client.is_time_credit_active ?
        { key: 'timeCredit', title: t([ 'clientUsers', 'timeCredit' ]), comparator: 'string' } :
        {},
      { key: 'created_at', title: t([ 'clientUsers', 'memberSince' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span> }
    ].filter(o => o)

    const schemaPending = [
      { key: 'full_name', title: t([ 'clientUsers', 'name' ]), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' }
    ]

    const currentClientUser = state.users.find(user => pageBase.current_user ? user.user.id === pageBase.current_user.id : false)

    const addClientUserClick = () => {
      actions.setClient(+this.props.params.client_id)
      nav.to(`/${pageBase.garage}/admin/users/invite`)
    }

    const onBack = () => nav.to(`/${pageBase.garage}/admin/clients`)

    const renderPendingSpoiler = user => {
      const returnable = user.user
      const destroyClick = () => { actions.destroyClientUser(this.props.params.client_id, user.user.id) }
      returnable.spoiler = (<div className={styles.float}>
        <InvitationReminderButton userId={user.user.id} clientId={parseInt(this.props.params.client_id, 10)} />
        <LabeledRoundButton
          label={t([ 'clientUsers', 'removeUser' ])}
          content={<span className="fa fa-times" aria-hidden="true" />}
          onClick={destroyClick}
          type="remove"
          question={t([ 'clientUsers', 'removeClientUser' ])}
        />
      </div>)
      return returnable
    }

    const renderSpoiler = client_user => {
      const clientId = this.props.params.client_id
      const userId = client_user.user.id

      const onClicks = []
      const destroyClick = () => actions.destroyClientUser(clientId, userId)

      const secretaryPresetClick = () => actions.setSecretary(clientId, userId)
      const internalPresetClick = () => actions.setInternal(clientId, userId)

      onClicks.adminClick = () => actions.setClientUserRelation(clientId, userId, { admin: !client_user.admin })
      onClicks.contactPersonClick = () => actions.setClientUserRelation(clientId, userId, { contact_person: !client_user.contact_person })
      onClicks.secretaryClick = () => actions.setClientUserRelation(clientId, userId, { secretary: !client_user.secretary })
      onClicks.hostClick = () => actions.setClientUserRelation(clientId, userId, { host: !client_user.host })
      onClicks.internalClick = () => actions.setClientUserRelation(clientId, userId, { internal: !client_user.internal })

      const roles = [ 'admin', 'contact_person', 'secretary', 'host', 'internal' ]

      const mapRoleButtons = role => {
        const snakeToCamel = value => {
          return value.replace(/_\w/g, m => {
            return m[1].toUpperCase()
          })
        }

        return (
          <span
            className={client_user[role] ? styles.boldText : styles.inactiveText}
            onClick={onClicks[`${snakeToCamel(role)}Click`]}
            role="button"
            tabIndex="0"
          >
            {t([ 'clientUsers', role ])}
          </span>
        )
      }

      return (<div className={styles.spoiler}>
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
          </span>|
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
                ((pageBase.current_user &&
                  pageBase.current_user.id !== userId &&
                  currentClientUser &&
                  !(currentClientUser.admin || currentClientUser.secretary)
                 ) ||
                 client_user.admin ||
                 (client_user.contact_person && currentClientUser && currentClientUser.secretary)
                ) &&
                'disabled'
              }
            />
          </div>
        </div>
      </div>
      )
    }

    const data = state.users.map(client_user => ({
      ...client_user.user,
      timeCredit: client_user.current_time_credit_amount + ' / ' + client_user.client.time_credit_amount_per_month,
      created_at: client_user.created_at,
      spoiler:    renderSpoiler(client_user)
    }))

    const filters = [
      <TabButton label={t([ 'clientUsers', 'confirmedUsers' ], { name: state.clientName })} onClick={() => { actions.allClicked() }} state={state.filter === 'all' && 'selected'} />,
      <TabButton label={t([ 'clientUsers', 'pendingUsers' ])} onClick={() => { actions.pendingClicked() }} state={state.filter === 'pending' && 'selected'} />
    ]

    return (
      <PageBase>
        <TabMenu left={filters} />

        <div className={styles.tableContainer}>
          {state.filter === 'all' &&
            <Table
              schema={schema}
              data={data}
              onRowSelect={this.onRowSelect}
              selectId={state.selectedId}
            />
          }
          {state.filter === 'pending' && <Table schema={schemaPending} data={state.pending_users.map(renderPendingSpoiler)} />}
        </div>

        <div className={styles.backButton}>
          <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={onBack} />
        </div>
        <div className={styles.addButton}>
          <RoundButton
            content={<span className="fa fa-plus" aria-hidden="true" />}
            onClick={addClientUserClick}
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
