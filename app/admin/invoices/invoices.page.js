import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Table              from '../../_shared/components/table/Table'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import TabButton          from '../../_shared/components/buttons/TabButton'
import TabMenu            from '../../_shared/components/tabMenu/TabMenu'
import Dropdown           from '../../_shared/components/dropdown/Dropdown'
import Input              from '../../_shared/components/input/Input'
import Form               from '../../_shared/components/form/Form'
import Modal              from '../../_shared/components/modal/Modal'

import styles               from './invoices.page.scss'
import * as nav             from '../../_shared/helpers/navigation'
import { t }                from '../../_shared/modules/localization/localization'
import * as invoicesActions from '../../_shared/actions/invoices.actions'
import { valueAddedTax }    from '../../_shared/helpers/calculatePrice'


class InvoicesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initInvoices(this.props.params.id)
  }

  render() {
    const { state, pageBase, actions } = this.props

    const schema = [
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

    const invoiceData = state.invoices
     .filter(invoice => invoice.account.garage.id === pageBase.garage || pageBase.garages.find(garage => garage.garage.id === invoice.account.garage.id) === undefined)
     // display Invoices of selected garage and Invoices of my clients (those would otherwise be filtered by selected garage)
     .filter(invoice => state.client_id === undefined ? true : invoice.client.id === state.client_id)
     .map(invoice => ({
       ...invoice,
       garage_name: invoice.account && invoice.account.garage.name,
       client_name: invoice.client && invoice.client.name,
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
               onClick={() => actions.downloadInvoice(invoice.id)}
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
               onClick={() => actions.downloadInvoice(invoice.id)}
               type="action"
             />
             {!invoice.payed && !invoice.is_storno_invoice && (invoice.client.is_admin || invoice.client.is_secretary) &&
               <LabeledRoundButton label={t([ 'invoices', 'payInvoice' ])} content={<i className="fa fa-credit-card" aria-hidden="true" />} onClick={() => {}} type="action" />}
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
                 onClick={() => actions.invoicePayed(invoice.id, this.props.params.id)}
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
     }))

    const filters = [
      <TabButton label={t([ 'notifications', 'past' ])} onClick={() => actions.setPast(true, this.props.params.id)} state={state.past && 'selected'} />,
      <TabButton label={t([ 'notifications', 'current' ])} onClick={() => actions.setPast(false, this.props.params.id)} state={!state.past && 'selected'} />
    ]

    const clientDropdown = () => {
      const clientSelected = index => actions.setClientId(state.clients[index].id)
      return state.clients.map((client, index) => ({
        label:   client.name,
        order:   client.id === undefined && 1,
        onClick: () => clientSelected(index)
      }))
    }

    const clientSelector = <Dropdown label={t([ 'invoices', 'selectClient' ])} content={clientDropdown()} style="tabDropdown" selected={state.clients.findById(state.client_id)} />
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
        <TabMenu left={<div className={styles.dropdownsContainer}>{clientSelector}</div>} right={filters} />
        <Table schema={schema} data={invoiceData} returnFiltered={actions.setFilteredInvoices} />
        <div className={styles.actionButtons}>
          <LabeledRoundButton label={t([ 'invoices', 'donwloadExcel' ])} content={<span className="fa fa-file-excel-o" aria-hidden="true" />} onClick={actions.generateCsv} type="action" />
          <LabeledRoundButton label={t([ 'invoices', 'donwloadXlsx' ])} content={<span className="fa fa-file-excel-o" aria-hidden="true" />} onClick={actions.generateXlsx} type="action" />
          <LabeledRoundButton label={t([ 'invoices', 'donwloadInvoices' ])} content={<span className="fa fa-files-o" aria-hidden="true" />} onClick={actions.downloadZip} type="action" />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.invoices, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(InvoicesPage)
