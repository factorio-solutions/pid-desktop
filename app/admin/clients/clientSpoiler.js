import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'

import { MOMENT_DATETIME_FORMAT } from '../../_shared/helpers/time'


import styles from './clients.page.scss'


function clientSpoiler({
  client,
  garageId,
  isGarageAdmin,
  isGarageManager,
  currentContractsFilter,
  oldContractsFilter,
  setClientId,
  setClient
}) {
  const toClient = () => nav.to(`/${garageId}/admin/clients/${client.id}/users`)
  const toEditClient = () => nav.to(`/${garageId}/admin/clients/${client.id}/edit`)
  const toClientModules = () => nav.to(`/${garageId}/admin/clients/${client.id}/modules/smsSettings`)
  const toInvoices = () => {
    nav.to(`/${garageId}/admin/invoices`)
    setClientId(client.id)
  }

  const toNewContract = () => {
    nav.to(`/${garageId}/admin/clients/newContract`)
    setClient(client.id)
  }

  const prepareContractButton = contract => {
    const onContractClick = () => nav.to(`/${garageId}/admin/clients/${contract.id}/editContract`)
    const canViewContract = (
      isGarageAdmin
      || isGarageManager
      || (
        client.client_user
        && client.client_user.admin
      )
    )
    const classNames = [
      styles.contract,
      !canViewContract ? styles.disabled : undefined
    ]
      .filter(name => name)
      .join(' ')

    return (
      <div
        className={classNames}
        onClick={canViewContract ? onContractClick : undefined}
      >
        {contract.name}
      </div>
    )
  }

  const prepareContactPersons = (acc, user, index, arr) => {
    acc.push(
      <span>
        <b>{user.full_name}</b>
        {' ('}
        {user.email}
        {', '}
        {user.phone}
        {')'}
      </span>
    )
    if (arr.length - 1 !== index) acc.push(<span>, </span>)
    return acc
  }


  const currentContracts = client.contracts ? client.contracts.filter(currentContractsFilter) : []
  const oldContracts = client.contracts ? client.contracts.filter(oldContractsFilter) : []

  const currentUserIsAdmin = client.client_user && client.client_user.admin && !client.client_user.pending
  return (
    <div className={styles.spoiler}>
      <div>
        {t([ 'clients', 'contactPerson' ])}
        {': '}
        {client.contact_persons.reduce(prepareContactPersons, [])}
        <br />
        {t([ 'clients', 'createdAt' ])}
        {': '}
        {moment(client.created_at).format(MOMENT_DATETIME_FORMAT)}
      </div>
      {(currentUserIsAdmin || isGarageAdmin || isGarageManager) && (
        <div>
          {currentContracts.length > 0 && <div>{t([ 'clients', 'currentAgreements' ])}</div>}
          {currentContracts.map(prepareContractButton)}
          {oldContracts.length > 0 && <div>{t([ 'clients', 'oldAgreements' ])}</div>}
          {oldContracts.map(prepareContractButton)}
        </div>
      )}
      <div>
        <LabeledRoundButton
          label={t([ 'clients', 'createAgreement' ])}
          content={(
            <span>
              {'+'}
              <span className="fa fa-file-text-o" aria-hidden="true" />
            </span>
          )}
          onClick={toNewContract}
          type="action"
          state={!isGarageAdmin && 'disabled'}
        />
        <LabeledRoundButton
          label={t([ 'clients', 'goToInvoices' ])}
          content={<span className="fa fa-files-o" aria-hidden="true" />}
          onClick={toInvoices}
          type="action"
          state={currentUserIsAdmin ? '' : 'disabled'}
        />
        <LabeledRoundButton
          label={t([ 'clients', 'editClient' ])}
          content={<span className="fa fa-pencil" aria-hidden="true" />}
          onClick={toEditClient}
          type="action"
          state={currentUserIsAdmin ? '' : 'disabled'}
        />
        <LabeledRoundButton
          label={t([ 'clients', 'modules' ])}
          content={<span className="icon-plugins" aria-hidden="true" />}
          onClick={toClientModules}
          type="action"
          state={currentUserIsAdmin ? '' : 'disabled'}
        />
        <LabeledRoundButton
          label={t([ 'clients', 'goToUsers' ])}
          content={<span className="fa fa-child" aria-hidden="true" />}
          onClick={client.userOfClient && toClient}
          type="action"
          state={client.userOfClient ? '' : 'disabled'}
        />
      </div>
    </div>
  )
}

clientSpoiler.propTypes = {
  client:                 PropTypes.object,
  garageId:               PropTypes.number,
  isGarageAdmin:          PropTypes.bool,
  isGarageManager:        PropTypes.bool,
  currentContractsFilter: PropTypes.func,
  oldContractsFilter:     PropTypes.func,
  setClientId:            PropTypes.func,
  setClient:              PropTypes.func
}

export default clientSpoiler
