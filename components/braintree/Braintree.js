import React, { Component, PropTypes }  from 'react'
import braintree                        from 'braintree-web'

import { request } from '../../helpers/request'


<<<<<<< HEAD

export default class Braintree extends Component{
  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => { this.forceUpdate() })

    const paymentReceived = (payload) => {
      request((response)=>{console.log(response);}, "mutation Payment($nonce: String!) {payment(nonce: $nonce)}", {"nonce": payload.nonce})
    }

    braintree.setup(store.getState().pageBase.current_user.braintree_token, 'dropin', {
      container: this.refs.wrapper,
      onPaymentMethodReceived: paymentReceived,
      paypal: {
        button: {
          type: 'checkout'
        }
      }
    })

  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  render(){

    return(
      <form>
        <div ref="wrapper"></div>
        <input type="submit" value="Pay" />
      </form>
=======
export default class Braintree extends Component {
  static contextTypes = {
    token:     PropTypes.string,
    onPayment: PropTypes.func
  }

  componentDidMount() {
    braintree.setup(this.props.token, 'dropin', {
      container: this.refs.wrapper,
      onPaymentMethodReceived: this.props.onPayment,
      paypal: { button: { type: 'checkout' } }
    })
  }

  render(){
    return(
      <div ref="wrapper"></div>
>>>>>>> feature/new_api
    )
  }
}
