import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators, compose }          from 'redux'
import moment                          from 'moment'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Table              from '../../_shared/components/table/Table'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'

import * as clientActions from '../../_shared/actions/clients.actions'
import { setClient } from '../../_shared/actions/newContract.actions'
import { setClientId } from '../../_shared/actions/invoices.actions'
import { toAdminClients } from '../../_shared/actions/pageBase.actions'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'

import styles from './clients.page.scss'
import ClientSpoiler from './clientSpoiler'


class ClientsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { actions, pageBase } = this.props
    actions.initClients()
    pageBase.garage && actions.initGarageContracts()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    const { actions, pageBase } = this.props

    nextProps.pageBase.garage !== pageBase.garage && actions.initGarageContracts()
  }

  addClient = () => nav.to(`/${this.props.pageBase.garage}/admin/clients/newClient`)

  addContract = () => nav.to(`/${this.props.pageBase.garage}/admin/clients/newContract`)

  addSpoiler = client => {
    const { actions, pageBase } = this.props

    const currentContractsFilter = contract => moment().isBetween(moment(contract.from), moment(contract.to))
    const oldContractsFilter = contract => !currentContractsFilter(contract)

    const contractSum = (sum, contract) => {
      const startOfMonth = moment(contract.from) < moment().startOf('month') ? moment().startOf('month') : moment(contract.from)
      const endOfMonth = moment().endOf('month') < moment(contract.to) ? moment().endOf('month') : moment(contract.to)
      return sum + Math.round(contract.rent.price * contract.place_count * endOfMonth.diff(startOfMonth, 'days') / moment().daysInMonth())
    }

    const spoiler = (
      <ClientSpoiler
        client={client}
        garageId={pageBase.garage}
        isGarageAdmin={pageBase.isGarageAdmin}
        isGarageManager={pageBase.isGarageManager}
        currentContractsFilter={currentContractsFilter}
        oldContractsFilter={oldContractsFilter}
        setClientId={actions.setClientId}
        setClient={actions.setClient}
      />
    )

    return {
      ...client,
      spoiler,
      hasContract:   client.contracts && client.contracts.filter(currentContractsFilter).length > 0,
      monthly_total: client.contracts
        ? client.contracts
          .filter(currentContractsFilter)
          .reduce(contractSum, 0)
        + ' ' + (client.contracts.length ? client.contracts[0].rent.currency.symbol : '')
        : 0
    }
  }

  filterAttributes = client => {
    const newClient = { ...client }
    if (!(client.client_user && client.client_user.admin) || client.is_pending) {
      newClient.monthly_total = null
      newClient.all_invoices_paid = null
      newClient.token = null
      newClient.hasContract = null
    }

    return newClient
  }

  render() {
    const { state, pageBase } = this.props

    const schema = [
      {
        key:         'name',
        title:       t([ 'clients', 'name' ]),
        comparator:  'string',
        representer: o => <strong>{o}</strong>,
        sort:        'asc'
      },
      { key: 'token', title: t([ 'clients', 'token' ]), comparator: 'string' },
      {
        key:         'hasContract',
        title:       t([ 'clients', 'contract' ]),
        comparator:  'boolean',
        representer: o => o === null
          ? null
          : (
            <i
              className={`fa ${o ? 'fa-check-circle' : ' fa-exclamation-triangle'} ${o ? styles.green : styles.red}`}
              aria-hidden="true"
            />
          )
      },
      { key: 'place_count', title: t([ 'clients', 'places' ]), comparator: 'number' },
      { key: 'monthly_total', title: t([ 'clients', 'monthlyTotal' ]), comparator: 'string' },
      {
        key:         'all_invoices_paid',
        title:       t([ 'clients', 'invoices' ]),
        comparator:  'boolean',
        representer: o => o === null
          ? null
          : (
            <i
              className={`fa ${o ? 'fa-check-circle' : ' fa-exclamation-triangle'} ${o ? styles.green : styles.red}`}
              aria-hidden="true"
            />
          )
      },
      { key: 'user_count', title: t([ 'clients', 'users' ]), comparator: 'number' }
    ]


    // filter out client already present in state.clients
    const filterPresent = client => state.clients.find(c => c.id === client.id) === undefined

    return (
      <React.Fragment>
        <div className={styles.tableContainer}>
          <Table
            schema={schema}
            data={state.clients.concat(state.garageContracts.filter(filterPresent)).map(this.addSpoiler).map(this.filterAttributes)}
          />
        </div>

        <div className={styles.addButton}>
          <LabeledRoundButton
            content={<span className="fa fa-plus" aria-hidden="true" />}
            onClick={this.addClient}
            type="action"
            size="big"
            label={t([ 'clients', 'addClientLabel' ])}
          />
          {pageBase.isGarageAdmin && (
            <LabeledRoundButton
              content={(
                <span>
                  {'+'}
                  <span className="fa fa-file-text-o" aria-hidden="true" />
                </span>
              )}
              onClick={this.addContract}
              type="action"
              size="big"
              label={t([ 'clients', 'addContractLabel' ])}
            />
          )}
        </div>
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toAdminClients('clients')),
  connect(
    state => ({ state: state.clients, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators({ ...clientActions, setClient, setClientId }, dispatch) })
  )
)

export default enhancers(ClientsPage)
