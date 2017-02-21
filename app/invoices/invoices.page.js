import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import ButtonStack  from '../_shared/components/buttonStack/ButtonStack'
import TextButton   from '../_shared/components/buttons/TextButton'

import styles               from './invoices.page.scss'
import * as nav             from '../_shared/helpers/navigation'
import { t }                from '../_shared/modules/localization/localization'
import * as invoicesActions from '../_shared/actions/invoices.actions'


export class InvoicesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initAccounts(this.props.params.client_id, this.props.params.account_id)
  }

  render() {
    const {state, actions} = this.props

    const schema = [ { key: 'invoice_date', title: t(['invoices','invoiceDate']),                                                      comparator: 'date',    representer: o => o ? moment(o).format('DD. MM. YYYY') : null , sort: 'asc' }
                   , { key: 'due_date',     title: t(['invoices','dueDate']),                                                          comparator: 'date',    representer: o => o ? moment(o).format('DD. MM. YYYY') : null }
                   , { key: 'whom',         title: this.props.params.client_id ? t(['invoices','account']) : t(['invoices','client']), comparator: 'string' }
                   , { key: 'payed',        title: t(['invoices','payed']),                                                            comparator: 'boolean', representer: o => o ? <i className="fa fa-check" aria-hidden="true"></i> : <i className="fa fa-times" aria-hidden="true"></i> }
                   , { key: 'price',        title: t(['invoices','ammount']),                                                          comparator: 'string'}
                   ]

     const invoiceData = state.invoices.map((invoice) => {
       invoice.price = invoice.ammount + ' ' + invoice.currency.symbol
       invoice.whom = this.props.params.client_id ? invoice.account && invoice.account.name : invoice.client && invoice.client.name
       invoice.spoiler = <div>
                         {t(['invoices','subject'])} <br/>
                         {invoice.subject}
                         <span className={styles.floatRight}>
                           {this.props.params.client_id && !invoice.payed &&  <RoundButton content={<span>{t(['invoices','pay'])}</span>}                        onClick={()=>{actions.payInvoice(invoice.id)}}      type='action'/>}
                           {this.props.params.account_id && !invoice.payed && <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>}    onClick={()=>{actions.invoicePayed(invoice.id)}}    type='remove' question={t(['invoices','invoicePayed'])}/>}
                           {invoice.payed &&                                  <RoundButton content={<span className='fa fa-download' aria-hidden="true"></span>} onClick={()=>{actions.downloadInvoice(invoice.id)}} type='action'/>}
                           {this.props.params.account_id && !invoice.payed && <RoundButton content={<span className='fa fa-bell-o' aria-hidden="true"></span>}   onClick={()=>{actions.reminder(invoice.id)}}        type='action'/>}
                         </span>
                      </div>
       return invoice
     })


    const content = <div>
                      <Table schema={schema} data={invoiceData} />
                    </div>

    const filters= <div>
          <ButtonStack divider={<span>|</span>} style='horizontal' >
            <TextButton content={t(['notifications','past'])}    onClick={() => {actions.setPast(true); this.props.actions.initAccounts(this.props.params.client_id, this.props.params.account_id)}} state={state.past && 'selected'}/>
            <TextButton content={t(['notifications','current'])} onClick={() => {actions.setPast(false); this.props.actions.initAccounts(this.props.params.client_id, this.props.params.account_id)}} state={!state.past && 'selected'}/>
          </ButtonStack>
      </div>

    return (
      <PageBase content={content} filters={filters}/>
    )
  }
}

export default connect(
  state    => ({ state: state.invoices }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(InvoicesPage)
