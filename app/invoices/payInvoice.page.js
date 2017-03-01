import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Braintree    from '../_shared/components/braintree/Braintree'
import RoundButton  from '../_shared/components/buttons/RoundButton'
// import ButtonStack  from '../_shared/components/buttonStack/ButtonStack'
// import TextButton   from '../_shared/components/buttons/TextButton'

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
    props.state.invoices.find((invoice) => {
      return invoice.id == props.params.invoice_id
    }) === undefined && nav.back()
    super(props);
  }

  componentDidMount(){
    this.props.actions.payInit()
  }

  render() {
    const {state, actions} = this.props

    const invoice = this.props.state.invoices.find((invoice) => {
      return invoice.id == this.props.params.invoice_id
    })

    const formOnSubmit = (evt) => {
      evt.preventDefault()
      return false
    }

    const onPayment = (payload) => {
      actions.payInvoice(this.props.params.invoice_id, payload)
    }

    const content = <div>
                      {invoice &&
                        <div>
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

                        <form className={styles.form} onSubmit={formOnSubmit}>
                          {state.braintree_token ? <Braintree token={state.braintree_token} onPayment={onPayment}/> : <div className={styles.loading}>LOADING...</div>}
                          <div className={styles.floatLeft}>
                            <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={()=>{nav.back()}}/>
                          </div>
                          <div className={styles.floatRight}>
                            <button className={`${styles.submitButton} ${state.braintree_token == undefined && styles.disabled}`} type="submit"> <span className='fa fa-check' aria-hidden="true"></span> </button>
                          </div>
                        </form>
                        </div>
                      }
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
