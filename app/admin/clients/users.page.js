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
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initClientUsers(this.props.params.client_id)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [
      { key: 'full_name', title: t([ 'clientUsers', 'name' ]), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' },
      { key: 'created_at', title: t([ 'clientUsers', 'memberSince' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span> }
    ]

    const schemaPending = [
      { key: 'full_name', title: t([ 'clientUsers', 'name' ]), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' },
      { key: 'email', title: t([ 'clientUsers', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'clientUsers', 'phone' ]), comparator: 'number' }
    ]

    const currentClientUser = state.users.find(user => { return pageBase.current_user ? user.user.id === pageBase.current_user.id : false })

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
      const destroyClick = () => { actions.destroyClientUser(this.props.params.client_id, client_user.user.id) }

      const secretaryPresetClick = () => { actions.setSecretary(this.props.params.client_id, client_user.user.id) }
      const internalPresetClick = () => { actions.setInternal(this.props.params.client_id, client_user.user.id) }

      const adminClick = () => { actions.setClientUserRelation(this.props.params.client_id, client_user.user.id, { admin: !client_user.admin }) }
      const contactPersonClick = () => { actions.setClientUserRelation(this.props.params.client_id, client_user.user.id, { contact_person: !client_user.contact_person }) }
      const secretaryClick = () => { actions.setClientUserRelation(this.props.params.client_id, client_user.user.id, { secretary: !client_user.secretary }) }
      const hostClick = () => { actions.setClientUserRelation(this.props.params.client_id, client_user.user.id, { host: !client_user.host }) }
      const internalClick = () => { actions.setClientUserRelation(this.props.params.client_id, client_user.user.id, { internal: !client_user.internal }) }

      return (<div className={styles.spoiler}>
        <div className={styles.devider}>
          <span className={client_user.admin ? styles.boldText : styles.inactiveText} onClick={adminClick}>{t([ 'clientUsers', 'admin' ])}</span>|
          <span className={`${client_user.contact_person ? styles.boldText : styles.inactiveText}`} onClick={contactPersonClick}>{t([ 'clientUsers', 'contact_person' ])}</span>|
          <span className={`${client_user.secretary ? styles.boldText : styles.inactiveText}`} onClick={secretaryClick}>{t([ 'clientUsers', 'secretary' ])}</span>|
          <span className={`${client_user.host ? styles.boldText : styles.inactiveText}`} onClick={hostClick}>{t([ 'clientUsers', 'host' ])}</span>|
          <span className={`${client_user.internal ? styles.boldText : styles.inactiveText}`} onClick={internalClick}>{t([ 'clientUsers', 'internal' ])}</span>
        </div>
        <div>
          {t([ 'clientUsers', 'presetAs' ])}
          <span className={styles.clickable} onClick={internalPresetClick}>{t([ 'clientUsers', 'internal' ])}</span>|
          <span className={styles.clickable} onClick={secretaryPresetClick}>{t([ 'clientUsers', 'secretary' ])}</span>

          <div className={styles.float}>
            <LabeledRoundButton
              label={t([ 'clientUsers', 'removeUser' ])}
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={destroyClick}
              type="remove"
              question={t([ 'clientUsers', 'removeClientUser' ])}
              state={((pageBase.current_user && pageBase.current_user.id !== client_user.user.id && currentClientUser && !currentClientUser.admin) || client_user.admin) && 'disabled'}
            />
          </div>
        </div>
      </div>
      )
    }

    const data = state.users.map(client_user => ({ ...client_user.user, created_at: client_user.created_at, spoiler: renderSpoiler(client_user), key: client_user.user.id }))

    const filters = [
      <TabButton label={t([ 'clientUsers', 'confirmedUsers' ], { name: state.clientName })} onClick={() => { actions.allClicked() }} state={state.filter === 'all' && 'selected'} />,
      <TabButton label={t([ 'clientUsers', 'pendingUsers' ])} onClick={() => { actions.pendingClicked() }} state={state.filter === 'pending' && 'selected'} />
    ]

    return (
      <PageBase>
        <TabMenu left={filters} />
        {state.filter === 'all' && <Table schema={schema} data={data} />}
        {state.filter === 'pending' && <Table schema={schemaPending} data={state.pending_users.map(renderPendingSpoiler)} />}

        <div className={styles.addButton}>
          <div style={{ float: 'left' }}>
            <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={onBack} />
          </div>
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
