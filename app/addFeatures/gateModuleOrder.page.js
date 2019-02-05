import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Form     from '../_shared/components/form/Form'
import Input    from '../_shared/components/input/Input'

import styles                  from './gateModuleOrder.page.scss'
import * as nav                from '../_shared/helpers/navigation'
import { t }                   from '../_shared/modules/localization/localization'
import * as orderModuleActions from '../_shared/actions/gateModuleOrder.actions'


class GateModuleOrderPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    location: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { location, actions } = this.props
    if (location.query.hasOwnProperty('success')) {
      actions.paymentComplete(location.query.success === 'true')
    }
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => actions.submitOrder()

    const goBack = () => nav.to('/addFeatures')

    const checkSubmitable = () => {
      if (state.ammount < 1) return false
      if (state.address.name === '') return false
      if (state.address.line_1 === '') return false
      if (state.address.city === '') return false
      if (state.address.postal_code === '') return false
      if (state.address.country === '') return false

      if (!state.equalAddresses && state.invoice_address.name === '') return false
      if (!state.equalAddresses && state.invoice_address.line_1 === '') return false
      if (!state.equalAddresses && state.invoice_address.city === '') return false
      if (!state.equalAddresses && state.invoice_address.postal_code === '') return false
      if (!state.equalAddresses && state.invoice_address.country === '') return false

      return true
    }

    const hightlightInputs = () => actions.toggleHighlight()

    return (<PageBase>
      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
        <h2>{t([ 'orderGarageModule', 'garageModule' ])}</h2>
        <p>{t([ 'orderGarageModule', 'garageModuleDescription' ])}</p>
        <div className={styles.address}>
          <div>
            <Input
              onChange={actions.setAmount}
              label={t([ 'orderGarageModule', 'amount' ]) + ' *'}
              error={t([ 'orderGarageModule', 'amountInvalid' ])}
              value={state.amount}
              placeholder={t([ 'orderGarageModule', 'amountPlaceholder' ])}
              highlight={state.highlight}
              min="1"
              type="number"
            />
            <h2>{t([ 'orderGarageModule', 'shippingAddress' ])}</h2>
            <Input
              onChange={actions.setName}
              label={t([ 'addresses', 'name' ]) + ' *'}
              error={t([ 'newGarage', 'invalidName' ])}
              value={state.address.name}
              placeholder={t([ 'addresses', 'namePlaceholder' ])}
              highlight={state.highlight}
            />
            <Input
              onChange={actions.setLine1}
              label={t([ 'addresses', 'line1' ]) + ' *'}
              error={t([ 'newGarage', 'line1Invalid' ])}
              value={state.address.line_1}
              placeholder={t([ 'addresses', 'line1Placeholder' ])}
              highlight={state.highlight}
            />
            <Input
              onChange={actions.setLine2}
              label={t([ 'addresses', 'line2' ])}
              error={t([ 'addresses', 'line2Invalid' ])}
              value={state.address.line_2}
              placeholder={t([ 'addresses', 'line2Placeholder' ])}
            />
            <Input
              onChange={actions.setCity}
              label={t([ 'addresses', 'city' ]) + ' *'}
              error={t([ 'newGarage', 'invalidCity' ])}
              value={state.address.city}
              placeholder={t([ 'addresses', 'cityPlaceholder' ])}
              highlight={state.highlight}
            />
            <Input
              onChange={actions.setPostalCode}
              label={t([ 'addresses', 'postalCode' ]) + ' *'}
              error={t([ 'newGarage', 'invalidPostalCode' ])}
              value={state.address.postal_code}
              placeholder={t([ 'addresses', 'postalCodePlaceholder' ])}
              highlight={state.highlight}
            />
            <Input
              onChange={actions.setState}
              label={t([ 'addresses', 'state' ])}
              error={t([ 'newGarage', 'invalidCountry' ])}
              value={state.address.state}
              placeholder={t([ 'addresses', 'statePlaceholder' ])}
            />
            <Input
              onChange={actions.setCountry}
              label={t([ 'addresses', 'country' ]) + ' *'}
              error={t([ 'newGarage', 'invalidState' ])}
              value={state.address.country}
              placeholder={t([ 'addresses', 'countryPlaceholder' ])}
              highlight={state.highlight}
            />
          </div>

          <div>
            <div className={styles.checkbox}>
              <input type="checkbox" checked={state.equalAddresses} onChange={actions.toggleEqualAddresses} />
              <span onClick={actions.toggleEqualAddresses}> {t([ 'orderGarageModule', 'equalAddresses' ])} </span>
            </div>

            {!state.equalAddresses && <div>
              <h2>{t([ 'orderGarageModule', 'invoiceAddress' ])}</h2>
              <Input
                onChange={actions.setInvoiceName}
                label={t([ 'addresses', 'name' ]) + ' *'}
                error={t([ 'newGarage', 'invalidName' ])}
                value={state.invoice_address.name}
                placeholder={t([ 'addresses', 'namePlaceholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setInvoiceLine1}
                label={t([ 'addresses', 'line1' ]) + ' *'}
                error={t([ 'newGarage', 'line1Invalid' ])}
                value={state.invoice_address.line_1}
                placeholder={t([ 'addresses', 'line1Placeholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setInvoiceLine2}
                label={t([ 'addresses', 'line2' ])}
                error={t([ 'addresses', 'line2Invalid' ])}
                value={state.invoice_address.line_2}
                placeholder={t([ 'addresses', 'line2Placeholder' ])}
              />
              <Input
                onChange={actions.setInvoiceCity}
                label={t([ 'addresses', 'city' ]) + ' *'}
                error={t([ 'newGarage', 'invalidCity' ])}
                value={state.invoice_address.city}
                placeholder={t([ 'addresses', 'cityPlaceholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setInvoicePostalCode}
                label={t([ 'addresses', 'postalCode' ]) + ' *'}
                error={t([ 'newGarage', 'invalidPostalCode' ])}
                value={state.invoice_address.postal_code}
                placeholder={t([ 'addresses', 'postalCodePlaceholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setInvoiceState}
                label={t([ 'addresses', 'state' ])}
                error={t([ 'newGarage', 'invalidCountry' ])}
                value={state.invoice_address.state}
                placeholder={t([ 'addresses', 'statePlaceholder' ])}
              />
              <Input
                onChange={actions.setInvoiceCountry}
                label={t([ 'addresses', 'country' ]) + ' *'}
                error={t([ 'newGarage', 'invalidState' ])}
                value={state.invoice_address.country}
                placeholder={t([ 'addresses', 'countryPlaceholder' ])}
                highlight={state.highlight}
              />
            </div>}
          </div>
        </div>
      </Form>
    </PageBase>)
  }
}

export default connect(
  state => ({ state: state.gateModuleOrder }),
  dispatch => ({ actions: bindActionCreators(orderModuleActions, dispatch) })
)(GateModuleOrderPage)
