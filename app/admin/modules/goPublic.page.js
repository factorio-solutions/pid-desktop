import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../../_shared/containers/pageBase/PageBase'
import GarageLayout from '../../_shared/components/garageLayout/GarageLayout'
import Form         from '../../_shared/components/form/Form'
import Dropdown     from '../../_shared/components/dropdown/Dropdown'
import PatternInput     from '../../_shared/components/input/PatternInput'

import * as nav             from '../../_shared/helpers/navigation'
import { t }                from '../../_shared/modules/localization/localization'
import * as goPublicActions from '../../_shared/actions/admin.goPublic.actions'

import styles from './goPublic.page.scss'


class GoPublicPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initGoPublic()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initGoPublic()
  }

  render() {
    const { state, actions, pageBase } = this.props

    const preparePlaces = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        available: true,
        selected:  state.places.includes(place.id)
      }))
    })

    const currencies = () => state.currencies.map(currency => ({
      label:   currency.code,
      onClick: actions.setSelectedCurrency.bind(this, currency)
    }))

    const submitForm = () => actions.submitPricings()
    const goBack = () => nav.to(`/${pageBase.garage}/admin/modules`)
    const isSubmitable = () => {
      return state.garage && state.garage.floors.reduce((atLeastOnePricing, floor) => { // at least one pricing has to be complete to submit
        return floor.places.reduce((atLeastOnePricing, place) => {
          return atLeastOnePricing || (place.pricing !== null &&
            place.pricing.currency_id !== undefined &&
            ((place.pricing.flat_price !== undefined && place.pricing.flat_price !== '') ||
            (place.pricing.exponential_12h_price !== undefined && place.pricing.exponential_12h_price !== '' &&
            place.pricing.exponential_day_price !== undefined && place.pricing.exponential_day_price !== '' &&
            place.pricing.exponential_week_price !== undefined && place.pricing.exponential_week_price !== '' &&
            place.pricing.exponential_month_price !== undefined && place.pricing.exponential_month_price !== ''))
          )
        }, atLeastOnePricing)
      }, false)
    }

    const place = state.garage ? state.garage.floors.reduce((acc, floor) => {
      return [ ...acc, ...floor.places ]
    }, []).find(place => state.places.includes(place.id)) : undefined

    const pricing = place && place.pricing
    const selectedCurrency = pricing ? state.currencies.findIndex(c => pricing.currency_id === c.id) : -1

    return (
      <PageBase>
        <div className={styles.flex}>
          <div className={styles.half}>
            <Form onSubmit={submitForm} submitable={isSubmitable()} onBack={goBack}>
              {state.places.length === 0 && <div className={styles.dimmer}>{t([ 'newPricing', 'selectPlace' ])}</div>}
              <div>
                <Dropdown label={t([ 'newPricing', 'selectCurrency' ])} content={currencies()} style="light" selected={selectedCurrency} />
              </div>
              <div>
                <h2>{t([ 'newPricing', 'flatPrice' ])}</h2>
                <PatternInput
                  onChange={actions.setFlatPrice}
                  label={t([ 'newPricing', 'flatPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
                  value={pricing ? pricing.flat_price || '' : ''}
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
                  value={pricing ? pricing.exponential_12h_price || '' : ''}
                />
                <PatternInput
                  onChange={actions.setExponentialDayPrice}
                  label={t([ 'newPricing', 'dayPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
                  value={pricing ? pricing.exponential_day_price || '' : ''}
                />
                <PatternInput
                  onChange={actions.setExponentialWeekPrice}
                  label={t([ 'newPricing', 'weekPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'minPlaceholder' ])}
                  value={pricing ? pricing.exponential_week_price || '' : ''}
                />
                <PatternInput
                  onChange={actions.setExponentialMonthPrice}
                  label={t([ 'newPricing', 'monthPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'decayPlaceholder' ])}
                  value={pricing ? pricing.exponential_month_price || '' : ''}
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
                  value={pricing ? pricing.weekend_price || '' : ''}
                />
              </div>
            </Form>
          </div>

          <div className={styles.half}>
            <GarageLayout
              floors={state.garage ? state.garage.floors.map(preparePlaces) : []}
              showEmptyFloors
              onPlaceClick={place => { actions.togglePlace(place.id) }}
            />
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminGoPublic, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(goPublicActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(GoPublicPage)
