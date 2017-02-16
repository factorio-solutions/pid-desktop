import React, { Component, PropTypes }  from 'react'
import braintree                        from 'braintree-web'

import { request } from '../../helpers/request'


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
    )
  }
}
