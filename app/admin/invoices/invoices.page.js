import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../../_shared/containers/pageBase/PageBase'
import Table        from '../../_shared/components/table/Table'
import RoundButton  from '../../_shared/components/buttons/RoundButton'
import ButtonStack  from '../../_shared/components/buttonStack/ButtonStack'
import TabButton    from '../../_shared/components/buttons/TabButton'
import TabMenu      from '../../_shared/components/tabMenu/TabMenu'
import Dropdown     from '../../_shared/components/dropdown/Dropdown'
import Input        from '../../_shared/components/input/Input'
import Form         from '../../_shared/components/form/Form'

import styles               from './invoices.page.scss'
import * as nav             from '../../_shared/helpers/navigation'
import { t }                from '../../_shared/modules/localization/localization'
import * as invoicesActions from '../../_shared/actions/invoices.actions'
import {  setCustomModal }  from '../../_shared/actions/pageBase.actions'


export class InvoicesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initInvoices(this.props.params.id)
  }

  render() {
    const {state, pageBase, actions} = this.props

    const schema = [ { key: 'invoice_number', title: t(['invoices','invoiceNumber']), comparator: 'integer', representer: o => <b>{o}</b>, sort: 'asc' }
                   , { key: 'invoice_date',   title: t(['invoices','invoiceDate']),   comparator: 'date',    representer: o => o ? moment(o).format('DD. MM. YYYY') : null }
                   , { key: 'due_date',       title: t(['invoices','dueDate']),       comparator: 'date',    representer: o => o ? moment(o).format('DD. MM. YYYY') : null }
                   , { key: 'garage_name',    title: t(['invoices','account']),       comparator: 'string',  representer: o => <b>{o}</b>}
                   , { key: 'client_name',    title: t(['invoices','client']),        comparator: 'string',  representer: o => <b>{o}</b>}
                   , { key: 'longterm_rent',  title: t(['invoices','type']),          comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-home' : 'fa-clock-o'}`} aria-hidden="true"></i>}
                   , { key: 'price',          title: t(['invoices','ammount']),       comparator: 'string'}
                   , { key: 'payed',          title: t(['invoices','paid']),          comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-exclamation-triangle'} ${o ? styles.green : styles.red}`} aria-hidden="true"></i> }
                   ]


     const invoiceData = state.invoices.filter(invoice => (state.garage_id===undefined && state.client_id===undefined) || invoice.account.garage.id === state.garage_id || invoice.client.id === state.client_id )
     .map((invoice) => {
       const customModal = <div>
         <Form submitable={true} onSubmit={()=>{actions.stornoInvoice(invoice.id, this.props.params.id)}} onBack={()=>{actions.setCustomModal(undefined)}} >
           {t(['invoices', 'cancelReason'])}
           <Input onChange={actions.setReason} label={t(['invoices', 'reason'])} error={t(['invoices', 'reasonInvalid'])} placeholder={t(['invoices', 'reasonPlaceholder'])} value={state.reason} type="text" />
         </Form>
       </div>
       invoice.garage_name = invoice.account && invoice.account.garage.name
       invoice.client_name = invoice.client && invoice.client.name
       invoice.price = invoice.ammount + ' ' + invoice.currency.symbol
       invoice.disabled = invoice.canceled
       invoice.spoiler = <div>
                          {invoice.canceled ? <div>
                            <b>{t(['invoices','invoiceCanceled'])} </b>
                            {invoice.subject}
                            <span className={styles.floatRight}>
                              <RoundButton content={<span className='fa fa-download' aria-hidden="true"></span>} onClick={()=>{actions.downloadInvoice(invoice.id)}} type='action'/>
                              <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{nav.to(`/${pageBase.garage}/admin/invoices/${invoice.id}/edit`)}} type='action'/>
                            </span>
                          </div> :
                          <div>
                            {t(['invoices','subject'])}:
                            {invoice.subject}
                            <span className={styles.floatRight}>
                              <RoundButton content={<span className='fa fa-download' aria-hidden="true"></span>} onClick={()=>{actions.downloadInvoice(invoice.id)}} type='action'/>
                              {!invoice.payed && !invoice.is_storno_invoice && (invoice.client.is_admin||invoice.client.is_secretary) && <RoundButton content={<span>{t(['invoices','pay'])}</span>}                      onClick={()=>{}}                                                                type='action'/>}
                              {!invoice.payed && !invoice.is_storno_invoice && invoice.account.garage.is_admin &&                        <RoundButton content={<span className='fa fa-bell-o' aria-hidden="true"></span>} onClick={()=>{actions.reminder(invoice.id)}}                                    type='action'/>}
                              {!invoice.payed && !invoice.is_storno_invoice && invoice.account.garage.is_admin &&                        <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>}  onClick={()=>{actions.invoicePayed(invoice.id, this.props.params.id)}}          type='remove' question={t(['invoices','invoicePayed'])}/>}
                              {!invoice.payed && !invoice.is_storno_invoice && invoice.account.garage.is_admin &&                        <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>}  onClick={()=>{actions.setCustomModal(customModal)}}                             type='remove' question={t(['invoices','stornoInvoice'])}/>}
                            </span>
                          </div>}
                      </div>
       return invoice
     })

    const filters = [ <TabButton label={t(['notifications', 'past'])}    onClick={() => {actions.setPast(true, this.props.params.id)}}  state={state.past && 'selected'}/>
                    , <TabButton label={t(['notifications', 'current'])} onClick={() => {actions.setPast(false, this.props.params.id)}} state={!state.past && 'selected'}/>
                    ]

    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.clients[index].id) }
      return state.clients.map((client, index) => {return {label: client.name, onClick: clientSelected.bind(this, index) }})
    }

    const garageDropdown = () => {
      const garageSelected = (index) => { actions.setGarageId(state.garages[index].id) }
      return state.garages.map((garage, index) => {return {label: garage.name, onClick: garageSelected.bind(this, index) }})
    }

    const clientSelector = <Dropdown label={t(['invoices', 'selectClient'])} content={clientDropdown()} style='tabDropdown' selected={state.clients.findIndex((client)=>{return client.id == state.client_id})}/>
    const garageSelector = <Dropdown label={t(['invoices', 'selectGarage'])} content={garageDropdown()} style='tabDropdown' selected={state.garages.findIndex((garage)=>{return garage.id == state.garage_id})}/>

    return (
      <PageBase>
        <TabMenu left={<div className={styles.dropdownsContainer}>{clientSelector} {garageSelector}</div>} right={filters}/>
        <Table schema={schema} data={invoiceData} />
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.invoices, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({...invoicesActions, setCustomModal}, dispatch) })
)(InvoicesPage)
