import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase              from '../../_shared/containers/pageBase/PageBase'
import LabeledRoundButton    from '../../_shared/components/buttons/LabeledRoundButton'
import TabButton             from '../../_shared/components/buttons/TabButton'
import TabMenu               from '../../_shared/components/tabMenu/TabMenu'
import Dropdown              from '../../_shared/components/dropdown/Dropdown'
import Input                 from '../../_shared/components/input/Input'
import Form                  from '../../_shared/components/form/Form'
import Modal                 from '../../_shared/components/modal/Modal'
import Invoices              from './tabs/invoices'
import SimplifiedTaxReceipts from './tabs/simplifiedTaxReceipts'
import CanceledInvoices      from './tabs/canceledInvoices'

import * as nav             from '../../_shared/helpers/navigation'
import { t }                from '../../_shared/modules/localization/localization'
import * as invoicesActions from '../../_shared/actions/invoices.actions'
import { valueAddedTax }    from '../../_shared/helpers/calculatePrice'

import styles from './invoices.page.scss'


export const createSchema = () => [
  { key: 'invoice_number', title: t([ 'invoices', 'invoiceNumber' ]), comparator: 'number', representer: o => <b>{o}</b>, sort: 'desc' },
  { key: 'invoice_date', title: t([ 'invoices', 'invoiceDate' ]), comparator: 'date', representer: o => o ? moment(o).format('DD. MM. YYYY') : null },
  { key: 'due_date', title: t([ 'invoices', 'dueDate' ]), comparator: 'date', representer: o => o ? moment(o).format('DD. MM. YYYY') : null },
  { key: 'client_name', title: t([ 'invoices', 'client' ]), comparator: 'string', representer: o => <b>{o}</b> },
  { key: 'longterm_rent', title: t([ 'invoices', 'type' ]), comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-home' : 'fa-clock-o'}`} aria-hidden="true" /> },
  { key: 'subject', title: t([ 'invoices', 'subject' ]), comparator: 'string', representer: o => o.length > 20 ? o.substring(0, 20) + '...' : o },
  { key: 'price', title: t([ 'invoices', 'ammount' ]), comparator: 'string' },
  { key:         'payed',
    title:       t([ 'invoices', 'paid' ]),
    comparator:  'boolean',
    representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-exclamation-triangle'} ${o ? styles.green : styles.red}`} aria-hidden="true" />
  }
]

export const filterByClient = (invoice, clientId) => clientId === undefined ? true : invoice.client.id === clientId

export const prepareInvoice = (invoice, actions, pageBase) => ({
  ...invoice,
  garage_name: invoice.account && invoice.account.garage.name,
  client_name: invoice.client && invoice.client.name,
  user_name:   invoice.user && invoice.user.full_name,
  price:       valueAddedTax(invoice.ammount, invoice.vat) + ' ' + invoice.currency.symbol,
  disabled:    invoice.canceled,
  spoiler:     (<div>
    {invoice.canceled ? <div>
      <b>{t([ 'invoices', 'invoiceCanceled' ])} </b>
      {invoice.subject}
      <span className={styles.floatRight}>
        <LabeledRoundButton
          label={t([ 'invoices', 'downloadInvoice' ])}
          content={<span className="fa fa-download" aria-hidden="true" />}
          onClick={() => actions.downloadInvoice(invoice.id, invoice.invoice_number)}
          type="action"
        />
        <LabeledRoundButton
          label={t([ 'invoices', 'editInvoice' ])}
          content={<span className="fa fa-pencil" aria-hidden="true" />}
          onClick={() => nav.to(`/${pageBase.garage}/admin/invoices/${invoice.id}/edit`)}
          type="action"
        />
      </span>
    </div> :
    <div>
      {t([ 'invoices', 'subject' ])}:
      {invoice.subject}
      <span className={styles.floatRight}>
        <LabeledRoundButton
          label={t([ 'invoices', 'downloadInvoice' ])}
          content={<span className="fa fa-download" aria-hidden="true" />}
          onClick={() => actions.downloadInvoice(invoice.id, invoice.invoice_number)}
          type="action"
        />
        {!invoice.payed && ((!invoice.is_storno_invoice && invoice.client && invoice.client.client_user &&
        (invoice.client.client_user.admin || invoice.client.client_user.secretary)) ||
          (invoice.payer_type === 'User' && invoice.invoice_item && invoice.invoice_item.invoiceable_type === 'Reservation'
          && invoice.user.id === pageBase.current_user.id))
        &&
          <LabeledRoundButton
            label={t([ 'invoices', 'payInvoice' ])}
            content={<i className="fa fa-credit-card" aria-hidden="true" />}
            onClick={() => actions.payInvoice(invoice.id)}
            type="action"
          />}
        {!invoice.payed && !invoice.is_storno_invoice && invoice.account.garage.is_admin &&
          <LabeledRoundButton
            label={t([ 'invoices', 'sendReminder' ])}
            content={<span className="fa fa-bell-o" aria-hidden="true" />}
            onClick={() => actions.reminder(invoice.id)}
            type="action"
          />}
        {!invoice.payed && !invoice.is_storno_invoice && invoice.account.garage.is_admin &&
          <LabeledRoundButton
            label={t([ 'invoices', 'invoicePaidLabel' ])}
            content={<span className="fa fa-check" aria-hidden="true" />}
            onClick={() => actions.invoicePayed(invoice.id, pageBase.garage)}
            type="remove"
            question={t([ 'invoices', 'invoicePaid' ])}
          />}
        {!invoice.payed && !invoice.is_storno_invoice && invoice.account.garage.is_admin &&
          <LabeledRoundButton
            label={t([ 'invoices', 'invoiceIncorect' ])}
            content={<span className="fa fa-times" aria-hidden="true" />}
            onClick={() => actions.toggleReason(invoice.id)}
            type="remove"
            question={t([ 'invoices', 'stornoInvoice' ])}
          />}
      </span>
    </div>}
  </div>)
})

const INVOICE_TABS = [
  { id:      'invoices',
    content: <Invoices />
  },
  { id:      'simplifiedTaxReceipts',
    content: <SimplifiedTaxReceipts />
  },
  { id:      'canceledInvoices',
    content: <CanceledInvoices />
  }
]

class InvoicesPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    params:  PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: INVOICE_TABS[0].id
    }
  }

  componentDidMount() {
    this.props.actions.initInvoices(this.props.params.id)
  }

  clientSelected = client => this.props.actions.setClientId(client.id)

  prepareTabs = tab => (<TabButton
    label={t([ 'invoices', tab.id ])}
    onClick={() => this.setState({
      ...this.state,
      selected: tab.id
    })}
    state={this.state.selected === tab.id && 'selected'}
  />)

  render() {
    const { state, actions } = this.props

    const clientDropdown = () => {
      return state.clients.map(client => ({
        label:   client.name,
        order:   client.id === undefined && 1,
        onClick: () => this.clientSelected(client)
      }))
    }

    const filters = [
      <TabButton label={t([ 'notifications', 'past' ])} onClick={() => actions.setPast(true)} state={state.past && 'selected'} />,
      <TabButton label={t([ 'notifications', 'current' ])} onClick={() => actions.setPast(false)} state={!state.past && 'selected'} />,
      <div className={styles.dropdownsContainer}>
        <Dropdown
          placeholder={t([ 'invoices', 'selectClient' ])}
          content={clientDropdown()}
          selected={state.clients.findIndexById(state.client_id)}
          style="tabDropdown"
        />
      </div>
    ]

    const customModal = (<div>
      <Form
        submitable={state.reason !== '' && state.reason !== undefined}
        onSubmit={() => actions.stornoInvoice(state.invoice_id, this.props.params.id)}
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
    </div>)

    return (
      <PageBase>
        <Modal content={customModal} show={state.showModal} />
        <TabMenu left={INVOICE_TABS.map(this.prepareTabs)} right={filters} />

        {INVOICE_TABS.findById(this.state.selected).content}
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.invoices, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(InvoicesPage)
