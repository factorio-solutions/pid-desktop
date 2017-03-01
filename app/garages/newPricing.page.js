import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase       from '../_shared/containers/pageBase/PageBase'
import Form           from '../_shared/components/form/Form'
import Dropdown       from '../_shared/components/dropdown/Dropdown'
import PatternInput   from '../_shared/components/input/PatternInput'

import * as newPricingActions   from '../_shared/actions/newPricing.actions'
import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'

import styles from './newPricing.page.scss'


export class NewPricingPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initPricing(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      actions.submitNewPricing(this.props.params.id)
    }

    const goBack = () => {
      nav.to(`/garages`)
    }

    const checkSubmitable = () => {
      if (state.name.value == undefined || state.name.value == ''|| !state.name.valid) return false
      // flat price or exponentiol price must be defined
      if ((state.flat_price.value == undefined || state.flat_price.value == ''|| !state.flat_price.valid) &
          (state.exponential_12h_price.value == undefined || state.exponential_12h_price.value == ''|| !state.exponential_12h_price.valid ||
          state.exponential_day_price.value == undefined || state.exponential_day_price.value == ''|| !state.exponential_day_price.valid ||
          state.exponential_week_price.value == undefined || state.exponential_week_price.value == ''|| !state.exponential_week_price.valid ||
          state.exponential_month_price.value == undefined || state.exponential_month_price.value == ''|| !state.exponential_month_price.valid)
        ) return false
      if (state.weekend_price.value != undefined && state.weekend_price.value != '' && !state.weekend_price.valid) return false
      if (state.selectedCurrency == undefined) return false

      return true
    }

    const currencies = () => {
      return state.currencies.map((currency, index) => {
        return { label: currency.code, onClick: actions.setSelectedCurrency.bind(this, index) }
      })
    }

    const content = <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                      <div>
                        <PatternInput onChange={actions.setName} label={t(['newPricing', 'name'])} error={t(['newPricing', 'invalidName'])} placeholder={t(['newPricing', 'namePlaceholder'])} value={state.name.value || ''}/>
                        <Dropdown label={t(['newPricing', 'selectCurrency'])} content={currencies()} style='light' selected={state.selectedCurrency}/>
                      </div>
                      <div>
                        <h2>{t(['newPricing', 'flatPrice'])}</h2>
                        <PatternInput onChange={actions.setFlatPrice} label={t(['newPricing', 'flatPrice'])} error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])} value={state.flat_price.value || ''}/>
                      </div>
                      <div>
                        <h2>{t(['newPricing', 'exponentialPrice'])}</h2>
                        <PatternInput onChange={actions.setExponential12hPrice}   label={t(['newPricing', '12hPrice'])}   error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])}   value={state.exponential_12h_price.value || ''}/>
                        <PatternInput onChange={actions.setExponentialDayPrice}   label={t(['newPricing', 'dayPrice'])}   error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])}   value={state.exponential_day_price.value || ''}/>
                        <PatternInput onChange={actions.setExponentialWeekPrice}  label={t(['newPricing', 'weekPrice'])}  error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'minPlaceholder'])}   value={state.exponential_week_price.value || ''}/>
                        <PatternInput onChange={actions.setExponentialMonthPrice} label={t(['newPricing', 'monthPrice'])} error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'decayPlaceholder'])} value={state.exponential_month_price.value || ''}/>
                      </div>

                      <div>
                        <h2>{t(['newPricing', 'weekendPrice'])}</h2>
                        <PatternInput onChange={actions.setWeekendPricing} label={t(['newPricing', 'weekendPrice'])} error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])} value={state.weekend_price.value || ''}/>
                      </div>
                    </Form>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.newPricing }),
  dispatch => ({ actions: bindActionCreators(newPricingActions, dispatch) })
)(NewPricingPage)
