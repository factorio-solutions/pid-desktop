import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../../_shared/containers/pageBase/PageBase'
import GarageLayout from '../../_shared/components/garageLayout/GarageLayout'
import Form         from '../../_shared/components/form/Form'
import Dropdown     from '../../_shared/components/dropdown/Dropdown'
import PatternInput from '../../_shared/components/input/PatternInput'

import * as nav             from '../../_shared/helpers/navigation'
import { t }                from '../../_shared/modules/localization/localization'
import * as goInternalActions from '../../_shared/actions/admin.goInternal.actions'

import styles from './goPublic.page.scss'


class GoInternalPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initGoInternal()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initGoInternal()
  }

  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/modules`)

  render() {
    const { state, actions } = this.props

    const preparePlaces = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        available: true, // TODO: set unvavailable if is set to third party
        selected:  state.places.includes(place.id)
      }))
    })

    const currencies = () => state.currencies.map(currency => ({
      label:   currency.code,
      onClick: () => actions.setCurrencyId(currency.id)
    }))

    const isSubmitable = () => !state.places.length ||
      (state.currency_id &&
      ((state.flat_price.value) ||
      (state.exponential_12h_price.value &&
      state.exponential_day_price.value &&
      state.exponential_week_price.value &&
      state.exponential_month_price.value)))


    return (
      <PageBase>
        <div className={styles.flex}>
          <div className={styles.half}>
            <Form onSubmit={actions.submitGoInternal} submitable={isSubmitable()} onBack={this.goBack}>
              <div>
                <Dropdown
                  label={t([ 'newPricing', 'selectCurrency' ])}
                  content={currencies()}
                  style="light"
                  selected={state.currencies.findIndexById(state.currency_id)}
                />
              </div>
              <div>
                <h2>{t([ 'newPricing', 'flatPrice' ])}</h2>
                <PatternInput
                  onChange={actions.setFlatPrice}
                  label={t([ 'newPricing', 'flatPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
                  value={state.flat_price.value || ''}
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
                  value={state.exponential_12h_price.value || ''}
                />
                <PatternInput
                  onChange={actions.setExponentialDayPrice}
                  label={t([ 'newPricing', 'dayPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'maxPlaceholder' ])}
                  value={state.exponential_day_price.value || ''}
                />
                <PatternInput
                  onChange={actions.setExponentialWeekPrice}
                  label={t([ 'newPricing', 'weekPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'minPlaceholder' ])}
                  value={state.exponential_week_price.value || ''}
                />
                <PatternInput
                  onChange={actions.setExponentialMonthPrice}
                  label={t([ 'newPricing', 'monthPrice' ])}
                  error={t([ 'newPricing', 'invalidPrice' ])}
                  pattern="^[+]?\d+([,.]\d+)?$"
                  placeholder={t([ 'newPricing', 'decayPlaceholder' ])}
                  value={state.exponential_month_price.value || ''}
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
                  value={state.weekend_price.value || ''}
                />
              </div>
            </Form>
          </div>

          <div className={styles.half}>
            <GarageLayout
              floors={state.garage ? state.garage.floors.map(preparePlaces) : []}
              showEmptyFloors
              onPlaceClick={place => actions.togglePlace(place.id)}
            />
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminGoInternal, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(goInternalActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(GoInternalPage)