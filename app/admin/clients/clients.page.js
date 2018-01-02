import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import Table       from '../../_shared/components/table/Table'
import RoundButton from '../../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import PageBase    from '../../_shared/containers/pageBase/PageBase'

import * as clientActions         from '../../_shared/actions/clients.actions'
import { setClient }              from '../../_shared/actions/newContract.actions'
import { setClientId }            from '../../_shared/actions/invoices.actions'
import { t }                      from '../../_shared/modules/localization/localization'
import * as nav                   from '../../_shared/helpers/navigation'
import { MOMENT_DATETIME_FORMAT } from '../../_shared/helpers/time'

import styles from './clients.page.scss'


class ClientsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initClients()
    this.props.pageBase.garage && this.props.actions.initGarageContracts()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initGarageContracts()
  }

  render() {
    const { actions, state, pageBase } = this.props

    const schema = [
      { key: 'name', title: t([ 'clients', 'name' ]), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' },
      { key: 'token', title: t([ 'clients', 'token' ]), comparator: 'string' },
      { key: 'hasContract', title: t([ 'clients', 'contract' ]), comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-check-circle' : ' fa-exclamation-triangle'} ${o ? styles.green : styles.red}`} aria-hidden="true" /> },
      { key: 'place_count', title: t([ 'clients', 'places' ]), comparator: 'number' },
      { key: 'monthly_total', title: t([ 'clients', 'monthlyTotal' ]), comparator: 'string' },
      { key: 'all_invoices_paid', title: t([ 'clients', 'invoices' ]), comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-check-circle' : ' fa-exclamation-triangle'} ${o ? styles.green : styles.red}`} aria-hidden="true" /> },
      { key: 'user_count', title: t([ 'clients', 'users' ]), comparator: 'number' }
    ]

    const addClient = () => nav.to(`/${pageBase.garage}/admin/clients/newClient`)
    const addContract = () => nav.to(`/${pageBase.garage}/admin/clients/newContract`)

    const addSpoiler = client => {
      const toClient = () => nav.to(`/${pageBase.garage}/admin/clients/${client.id}/users`)
      const toEditClient = () => nav.to(`/${pageBase.garage}/admin/clients/${client.id}/edit`)
      const toInvoices = () => {
        nav.to(`/${pageBase.garage}/admin/invoices`)
        actions.setClientId(client.id)
      }
      const toNewContract = () => {
        nav.to(`/${pageBase.garage}/admin/clients/newContract`)
        actions.setClient(client.id)
      }
      const prepareContractButton = contract => {
        const onContractClick = () => nav.to(`/${pageBase.garage}/admin/clients/${contract.id}/editContract`)
        return <div className={styles.contract} onClick={onContractClick}>{contract.name}</div>
      }
      const prepareContactPersons = (acc, user, index, arr) => {
        acc.push(<span><b>{user.full_name}</b></span>)
        if (arr.length - 1 !== index) acc.push(<span>, </span>)
        return acc
      }
      const currentContracts = contract => moment().isBetween(moment(contract.from), moment(contract.to))
      const contractSum = (sum, contract) => {
        const startOfMonth = moment(contract.from) < moment().startOf('month') ? moment().startOf('month') : moment(contract.from)
        const endOfMonth = moment().endOf('month') < moment(contract.to) ? moment().endOf('month') : moment(contract.to)
        return sum + Math.round(contract.rent.price * contract.place_count * endOfMonth.diff(startOfMonth, 'days') / moment().daysInMonth())
      }

      const spoiler = (<div className={styles.spoiler}>
        <div>
          {t([ 'clients', 'contactPerson' ])}: {client.contact_persons.reduce(prepareContactPersons, [])}
          <br />
          {t([ 'clients', 'createdAt' ])}: {moment(client.created_at).format(MOMENT_DATETIME_FORMAT)}
        </div>
        <div>
          {client.contracts && client.contracts.map(prepareContractButton)}
        </div>
        <div>
          <LabeledRoundButton label={t([ 'clients', 'createAgreement' ])} content={<span>+<span className="fa fa-file-text-o" aria-hidden="true" /></span>} onClick={toNewContract} type="action" state={!pageBase.isGarageAdmin && 'disabled'} />
          <LabeledRoundButton label={t([ 'clients', 'goToInvoices' ])} content={<span className="fa fa-files-o" aria-hidden="true" />} onClick={toInvoices} type={'action'} />
          <LabeledRoundButton label={t([ 'clients', 'editClient' ])} content={<span className="fa fa-pencil" aria-hidden="true" />} onClick={toEditClient} type="action" state={client.admin ? '' : 'disabled'} />
          <LabeledRoundButton label={t([ 'clients', 'goToUsers' ])} content={<span className="fa fa-child" aria-hidden="true" />} onClick={toClient} type={client.userOfClient ? 'action' : 'disabled'} />
        </div>
      </div>)

      return { ...client,
        spoiler,
        hasContract:   client.contracts && client.contracts.filter(currentContracts).length > 0,
        monthly_total: client.contracts ? client.contracts.filter(currentContracts).reduce(contractSum, 0) + ' ' + (client.contracts.length ? client.contracts[0].rent.currency.symbol : '') : 0
      }
    }

    const filterPresent = client => state.clients.find(c => c.id === client.id) === undefined // filter out client already present in state.clients

    return (
      <PageBase>
        <div className={styles.tableContainer}>
          <Table schema={schema} data={state.clients.concat(state.garageContracts.filter(filterPresent)).map(addSpoiler)} />
        </div>
        <div className={styles.addButton}>
          <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={addClient} type="action" size="big" />
          {pageBase.isGarageAdmin && <RoundButton content={<span>+<span className="fa fa-file-text-o" aria-hidden="true" /></span>} onClick={addContract} type="action" size="big" />}
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.clients, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...clientActions, setClient, setClientId }, dispatch) })
)(ClientsPage)
