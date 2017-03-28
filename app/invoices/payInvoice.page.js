import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Form     from '../_shared/components/form/Form'

import styles               from './payInvoice.page.scss'
import * as nav             from '../_shared/helpers/navigation'
import { t }                from '../_shared/modules/localization/localization'
import * as invoicesActions from '../_shared/actions/invoices.actions'


export class PayInvoicePage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  constructor(props) {
    !props.location.query.hasOwnProperty('token') && props.state.invoices.find((invoice) => {
      return invoice.id == props.params.invoice_id
    }) === undefined && nav.back()
    super(props);
  }

  componentDidMount(){
    const { location, actions, params } = this.props
    if (location.query.hasOwnProperty('token')){
      location.query.success === 'true' ? actions.payInvoiceFinish(location.query.token) : actions.paymentUnsucessfull()
      params.client_id ? nav.to(`/clients/${params.client_id}/invoices`) : nav.to(`/accounts/${params.account_id}/invoices`)
    }
  }

  render() {
    const {state, actions} = this.props

    const invoice = this.props.state.invoices.find((invoice) => {
      return invoice.id == this.props.params.invoice_id
    })

    const onPayment = () => {
      actions.payInvoice(this.props.params.invoice_id)
    }

    const content = <div>
                      {invoice &&
                        <Form onSubmit={onPayment} onBack={()=>{nav.back()}} submitable={true}>
                        <table>
                          <tbody>
                            <tr>
                              <td><span className={styles.label}>{t(['invoices', 'invoiceDate'])}: </span></td>
                              <td><span>{moment(invoice.invoice_date).format('DD. MM. YYYY')}</span></td>
                            </tr>
                            <tr>
                              <td><span className={styles.label}>{t(['invoices', 'account'])}: </span></td>
                              <td><span>{invoice.account && invoice.account.name}</span></td>
                            </tr>
                            <tr>
                              <td><span className={styles.label}>{t(['invoices', 'ammount'])}: </span></td>
                              <td><span>{invoice.ammount + ' ' + invoice.currency.symbol}</span></td>
                            </tr>
                          </tbody>
                        </table>
                        </Form> }
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.invoices }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(PayInvoicePage)
