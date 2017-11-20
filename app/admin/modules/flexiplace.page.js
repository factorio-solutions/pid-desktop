import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/pageBase/PageBase'
import Form from '../../_shared/components/form/Form'
import Dropdown from '../../_shared/components/dropdown/Dropdown'
import PatternInput from '../../_shared/components/input/PatternInput'

import * as nav from '../../_shared/helpers/navigation'
import { t } from '../../_shared/modules/localization/localization'
import * as flexiplaceActions from '../../_shared/actions/admin.flexiplace.actions'

// import styles from './flexipage.scss'


class FlexiplacePage extends Component {
  static propTypes = {
    state:    PropTypes.object.isRequired,
    pageBase: PropTypes.object.isRequired,
    actions:  PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.actions.initPricings()
  }

  componentWillReceiveProps(nextProps) {
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initPricings()
  }

  render() {
    const { state, pageBase, actions } = this.props
    const { pricing } = state

    const goBack = () => { nav.to(`/${pageBase.garage}/admin/modules`) }
    const isSubmitable = () => {
      return pricing && (pricing.currency_id !== undefined &&
        ((pricing.flat_price !== undefined && pricing.flat_price !== '') ||
        (pricing.exponential_12h_price !== undefined && pricing.exponential_12h_price !== '' &&
        pricing.exponential_day_price !== undefined && pricing.exponential_day_price !== '' &&
        pricing.exponential_week_price !== undefined && pricing.exponential_week_price !== '' &&
        pricing.exponential_month_price !== undefined && pricing.exponential_month_price !== '')))
    }

    const currencies = state.currencies.map(currency => {
      const onClick = () => actions.setSelectedCurrency(currency.id)
      return { label: currency.code, onClick }
    })

    return (
      <PageBase>
        <Form onSubmit={actions.sumbitFlexi} submitable={isSubmitable()} onBack={goBack}>
          <div>
            <Dropdown label={t([ 'newPricing', 'selectCurrency' ])} content={currencies} style="light" selected={state.currencies.findIndexById(pricing && pricing.currency_id)} />
          </div>

          <div>
            <h2>{t([ 'newPricing', 'flatPrice' ])}</h2>
            <PatternInput
              onChange={actions.setFlatPrice}
              label={t([ 'newPricing', 'flatPrice' ])}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.flat_price) || ''}
            />
          </div>

          <div>
            <h2>{t([ 'newPricing', 'exponentialPrice' ])}</h2>
            <PatternInput
              onChange={actions.setExponential12hPrice}
              label={t([ 'newPricing', '12hPrice' ])}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.exponential_12h_price) || ''}
            />
            <PatternInput
              onChange={actions.setExponentialDayPrice}
              label={t([ 'newPricing', 'dayPrice' ])}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.exponential_day_price) || ''}
            />
            <PatternInput
              onChange={actions.setExponentialWeekPrice}
              label={t([ 'newPricing', 'weekPrice' ])}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'minPlaceholder' ])}
              value={(pricing && pricing.exponential_week_price) || ''}
            />
            <PatternInput
              onChange={actions.setExponentialMonthPrice}
              label={t([ 'newPricing', 'monthPrice' ])}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'decayPlaceholder' ])}
              value={(pricing && pricing.exponential_month_price) || ''}
            />
          </div>

          <div>
            <h2>{t([ 'newPricing', 'weekendPrice' ])}</h2>
            <PatternInput
              onChange={actions.setWeekendPricing}
              label={t([ 'newPricing', 'weekendPrice' ])}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.weekend_price) || ''}
            />
          </div>
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminFlexiplace, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(flexiplaceActions, dispatch) })
)(FlexiplacePage)
