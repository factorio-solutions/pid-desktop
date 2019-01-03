import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import ModulesPageBase from './components/modulesPageBase'
import Form            from '../../_shared/components/form/Form'
import Dropdown        from '../../_shared/components/dropdown/Dropdown'
import PatternInput    from '../../_shared/components/input/PatternInput'

import { t }                  from '../../_shared/modules/localization/localization'
import * as flexiplaceActions from '../../_shared/actions/admin.flexiplace.actions'

import styles from './flexiplace.page.scss'


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
    const { state, actions } = this.props
    const { pricing } = state

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
      <ModulesPageBase>
        <Form
          onSubmit={actions.sumbitFlexi}
          submitable={isSubmitable()}
          onHighlight={actions.toggleHighlight}
        >
          <div>
            <Dropdown
              placeholder={t([ 'newPricing', 'selectCurrency' ]) + ' *'}
              content={currencies}
              style="light"
              selected={state.currencies.findIndexById(pricing && pricing.currency_id)}
            />
          </div>

          <div>
            <h2>{t([ 'newPricing', 'flatPrice' ])}</h2>
            <PatternInput
              onChange={actions.setFlatPrice}
              label={t([ 'newPricing', 'flatPrice' ])}
              label={`
                ${t([ 'newPricing', 'flatPrice' ])}
                ${((pricing && pricing.exponential_12h_price) ||
                  (pricing && pricing.exponential_day_price) ||
                  (pricing && pricing.exponential_week_price) ||
                  (pricing && pricing.exponential_month_price)) ?
                  '' : ' *'
                }`
              }
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.flat_price) || ''}
              highlight={state.highlight &&
                !((pricing && pricing.exponential_12h_price) ||
                (pricing && pricing.exponential_day_price) ||
                (pricing && pricing.exponential_week_price) ||
                (pricing && pricing.exponential_month_price))
              }
            />
          </div>

          <div>
            <h2>{t([ 'newPricing', 'exponentialPrice' ])}</h2>
            <PatternInput
              onChange={actions.setExponential12hPrice}
              label={`${t([ 'newPricing', '12hPrice' ])} ${pricing && pricing.flat_price ? '' : ' *'}`}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.exponential_12h_price) || ''}
              highlight={ state.highlight && pricing && !pricing.flat_price }
            />
            <PatternInput
              onChange={actions.setExponentialDayPrice}
              label={`${t([ 'newPricing', 'dayPrice' ])} ${pricing && pricing.flat_price ? '' : ' *'}`}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
              value={(pricing && pricing.exponential_day_price) || ''}
              highlight={ state.highlight && pricing && !pricing.flat_price }
            />
            <PatternInput
              onChange={actions.setExponentialWeekPrice}
              label={`${t([ 'newPricing', 'weekPrice' ])} ${pricing && pricing.flat_price ? '' : ' *'}`}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'minPlaceholder' ])}
              value={(pricing && pricing.exponential_week_price) || ''}
              highlight={ state.highlight && pricing && !pricing.flat_price }
            />
            <PatternInput
              onChange={actions.setExponentialMonthPrice}
              label={`${t([ 'newPricing', 'monthPrice' ])} ${pricing && pricing.flat_price ? '' : ' *'}`}
              error={t([ 'newPricing', 'invalidPrice' ])}
              pattern="^[+]?\d+([,.]\d+)?$"
              placeholder={t([ 'newPricing', 'decayPlaceholder' ])}
              value={(pricing && pricing.exponential_month_price) || ''}
              highlight={ state.highlight && pricing && !pricing.flat_price }
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

        <div className={styles.bottomMargin} />
      </ModulesPageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminFlexiplace, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(flexiplaceActions, dispatch) })
)(FlexiplacePage)
