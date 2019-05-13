import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import moment from 'moment'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import InvoiceSpoiler        from './components/invoiceSpoiler'
import TabButton             from '../../_shared/components/buttons/TabButton'
import TabMenu               from '../../_shared/components/tabMenu/TabMenu'
import Dropdown              from '../../_shared/components/dropdown/Dropdown'
import Input                 from '../../_shared/components/input/Input'
import Form                  from '../../_shared/components/form/Form'
import Modal                 from '../../_shared/components/modal/Modal'
import Invoices              from './tabs/invoices'
import SimplifiedTaxReceipts from './tabs/simplifiedTaxReceipts'
import CanceledInvoices      from './tabs/canceledInvoices'

import { t }                from '../../_shared/modules/localization/localization'
import * as invoicesActions from '../../_shared/actions/invoices.actions'
import { toAdmin }          from '../../_shared/actions/pageBase.actions'
import { valueAddedTax }    from '../../_shared/helpers/calculatePrice'

import styles from './invoices.page.scss'


export const createSchema = () => [
  {
    key:         'invoice_number',
    title:       t([ 'invoices', 'invoiceNumber' ]),
    comparator:  'number',
    representer: o => <b>{o}</b>,
    sort:        'desc'
  },
  {
    key:         'invoice_date',
    title:       t([ 'invoices', 'invoiceDate' ]),
    comparator:  'date',
    representer: o => o ? moment(o).format('DD. MM. YYYY') : null
  },
  {
    key:         'due_date',
    title:       t([ 'invoices', 'dueDate' ]),
    comparator:  'date',
    representer: o => o ? moment(o).format('DD. MM. YYYY') : null
  },
  {
    key:         'client_name',
    title:       t([ 'invoices', 'client' ]),
    comparator:  'string',
    representer: o => <b>{o}</b>
  },
  {
    key:         'longterm_rent',
    title:       t([ 'invoices', 'type' ]),
    comparator:  'boolean',
    representer: o => <i className={`fa ${o ? 'fa-home' : 'fa-clock-o'}`} aria-hidden="true" />
  },
  {
    key:         'subject',
    title:       t([ 'invoices', 'subject' ]),
    comparator:  'string',
    representer: o => o.length > 20 ? o.substring(0, 20) + '...' : o
  },
  {
    key:        'price',
    title:      t([ 'invoices', 'ammount' ]),
    comparator: 'string'
  },
  {
    key:         'payed',
    title:       t([ 'invoices', 'paid' ]),
    comparator:  'boolean',
    representer: o => (
      <i
        className={`fa ${o
          ? 'fa-check-circle'
          : 'fa-exclamation-triangle'} ${o ? styles.green : styles.red}`}
        aria-hidden="true"
      />
    )
  }
]

export const filterByClient = (invoice, clientId) => (
  clientId === undefined
    ? true
    : invoice.client.id === clientId
)

export const prepareInvoice = (invoice, actions, pageBase) => ({
  ...invoice,
  garage_name: invoice.account && invoice.account.garage.name,
  client_name: invoice.client && invoice.client.name,
  user_name:   invoice.user && invoice.user.full_name,
  price:       valueAddedTax(invoice.ammount, invoice.vat) + ' ' + invoice.currency.symbol,
  disabled:    invoice.canceled,
  spoiler:     (
    <InvoiceSpoiler
      invoice={invoice}
      garage={pageBase.garage}
      currentUser={pageBase.currentUser}
      downloadInvoice={actions.downloadInvoice}
      payInvoice={actions.payInvoice}
      reminder={actions.reminder}
      invoicePayed={actions.invoicePayed}
      toggleReason={actions.toggleReason}
    />
  )
})

const INVOICE_TABS = [
  {
    id:      'invoices',
    content: <Invoices />
  },
  {
    id:      'simplifiedTaxReceipts',
    content: <SimplifiedTaxReceipts />
  },
  {
    id:      'canceledInvoices',
    content: <CanceledInvoices />
  }
]

class InvoicesPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    match:   PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: INVOICE_TABS[0].id
    }
  }

  componentDidMount() {
    const { match: { params }, actions } = this.props
    actions.initInvoices(params.id)
  }

  clientSelected = client => this.props.actions.setClientId(client.id)

  prepareTabs = tab => (
    <TabButton
      label={t([ 'invoices', tab.id ])}
      onClick={() => this.setState({
        ...this.state,
        selected: tab.id
      })}
      state={this.state.selected === tab.id && 'selected'}
    />
  )

  render() {
    const { state, actions, match: { params } } = this.props

    const clientDropdown = () => {
      return state.clients.map(client => ({
        label:   client.name,
        order:   client.id === undefined && 1,
        onClick: () => this.clientSelected(client)
      }))
    }

    const filters = [
      <TabButton
        label={t([ 'notifications', 'past' ])}
        onClick={() => actions.setPast(true)}
        state={state.past && 'selected'}
      />,
      <TabButton
        label={t([ 'notifications', 'current' ])}
        onClick={() => actions.setPast(false)}
        state={!state.past && 'selected'}
      />,
      <div className={styles.dropdownsContainer}>
        <Dropdown
          placeholder={t([ 'invoices', 'selectClient' ])}
          content={clientDropdown()}
          selected={state.clients.findIndexById(state.client_id)}
          style="tabDropdown"
        />
      </div>
    ]

    const customModal = (
      <Form
        submitable={state.reason !== '' && state.reason !== undefined}
        onSubmit={() => actions.stornoInvoice(state.invoice_id, params.id)}
        onBack={() => actions.toggleReason()}
        modal
      >
        {t([ 'invoices', 'cancelReason' ])}
        <Input
          onChange={actions.setReason}
          label={t([ 'invoices', 'reason' ])}
          error={t([ 'invoices', 'reasonInvalid' ])}
          placeholder={t([ 'invoices', 'reasonPlaceholder' ])}
          value={state.reason}
          type="text"
        />
      </Form>
    )

    return (
      <React.Fragment>
        <Modal content={customModal} show={state.showModal} />
        <TabMenu left={INVOICE_TABS.map(this.prepareTabs)} right={filters} />

        {INVOICE_TABS.findById(this.state.selected).content}
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toAdmin('invoices')),
  connect(
    state => ({ state: state.invoices, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
  )
)

export default enhancers(InvoicesPage)
