import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase            from '../_shared/containers/pageBase/PageBase'
import TabMenu             from '../_shared/components/tabMenu/TabMenu'
import TabButton           from '../_shared/components/buttons/TabButton'
import PopupDatetimepicker from '../_shared/components/datetimepicker/PopupDatetimepicker'
import GarageLayout        from '../_shared/components/garageLayout/GarageLayout'

import { t }              from '../_shared/modules/localization/localization'
import * as garageActions from '../_shared/actions/garage.actions'
import { valueAddedTax }  from '../_shared/helpers/calculatePrice'

import styles from './garage.page.scss'


class GaragePage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initGarage()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initGarage()
  }

  render() {
    const { state, actions } = this.props

    const left = [
      <TabButton label={t([ 'garages', 'clients' ])} onClick={() => { actions.setSelected('clients') }} state={state.selected === 'clients' && 'selected'} />,
      <TabButton label={t([ 'garages', 'contracts' ])} onClick={() => { actions.setSelected('contracts') }} state={state.selected === 'contracts' && 'selected'} />,
      <TabButton label={t([ 'garages', 'reservations' ])} onClick={() => { actions.setSelected('reservations') }} state={state.selected === 'reservations' && 'selected'} />,
      <TabButton label={t([ 'garages', 'prices' ])} onClick={() => { actions.setSelected('prices') }} state={state.selected === 'prices' && 'selected'} />,
      <TabButton label={t([ 'garages', 'cars' ])} onClick={() => { actions.setSelected('cars') }} state={state.selected === 'cars' && 'selected'} />
    ]

    const right = [
      <TabButton label={t([ 'garages', 'now' ])} onClick={actions.setNow} state={state.now && 'selected'} />,
      <div style={{ display: 'inline-block' }}>
        <TabButton label={t([ 'garages', 'setDate' ])} onClick={() => { actions.setSelector(true) }} state={!state.now && 'selected'} />
        <PopupDatetimepicker onSelect={actions.setTime} show={state.showSelector} flip okClick={() => { actions.setSelector(false) }} datetime={state.time} />
      </div>
    ]

    const preparePlaces = floor => {
      floor.places.map(place => {
        const contracts = state.garage.contracts
          .filter(contract => moment(state.time).isBetween(moment(contract.from), moment(contract.to)))
          .filter(contract => contract.places.find(p => p.id === place.id) !== undefined)
        const reservation = place.reservations[0] // .find(reservation => moment(state.time).isBetween(moment(reservation.begins_at), moment(reservation.ends_at)))
        const calculatePrice = price => valueAddedTax(price, state.garage.dic ? state.garage.vat : 0)

        place.tooltip = (<div className={styles.tooltip}>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>{t([ 'garages', 'reservationId' ])}</td>
                  <td>{reservation && reservation.id}</td>
                </tr>
                <tr>
                  <td>{t([ 'garages', 'driver' ])}</td>
                  <td>{reservation && reservation.user.full_name}</td>
                </tr>
                <tr>
                  <td>{t([ 'garages', 'client' ])}</td>
                  <td>
                    {contracts.length > 0 && contracts.map(contract =>
                      `${contract.client.name}
                      ${reservation && reservation.client && reservation.client.id === contract.client.id ?
                        `(${t([ 'reservations', 'host' ])})` :
                        ''
                      }`).join(', ')}
                    {reservation && !reservation.client && `(${t([ 'reservations', 'visitor' ])})`}
                  </td>
                </tr>
                <tr>
                  <td>{t([ 'garages', 'period' ])}</td>
                  <td className={styles.flex}>
                    {reservation && [
                      <div>{moment(reservation.begins_at).format('DD.MM.YYYY')} <br /> {moment(reservation.begins_at).format('HH:mm')}</div>,
                      <div className={styles.dash}>-</div>,
                      <div>{moment(reservation.ends_at).format('DD.MM.YYYY')} <br /> {moment(reservation.ends_at).format('HH:mm')}</div>
                    ]}
                  </td>
                </tr>
                <tr>
                  <td>{t([ 'garages', 'licencePlate' ])}</td>
                  <td>{reservation && reservation.car.licence_plate}</td>
                </tr>
                <tr>
                  <td>{t([ 'garages', 'contract' ])}</td>
                  <td>{contracts.length > 0 && contracts.map(contract => contract.name).join(', ')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {(place.contracts[0] || place.pricing) && <div className={styles.optional}>
            <table>
              <tbody>
                <tr>
                  <td>{t([ 'garages', 'priceType' ])}</td>
                  <td>{place.contracts[0] ? t([ 'garages', 'longterm' ]) : place.pricing ? t([ 'garages', 'shortterm' ]) : ''}</td>
                </tr>
                {place.contracts[0] && place.contracts[0].rent && <tr>
                  <td>{t([ 'garages', 'pricePerSpot' ])}</td>
                  <td>{calculatePrice(place.contracts[0].rent.price) + ' ' + place.contracts[0].rent.currency.symbol}</td>
                </tr>}
                {!place.contracts[0] && place.pricing && place.pricing.flat_price && <tr>
                  <td>{t([ 'garages', 'flatPrice' ])}</td>
                  <td>{calculatePrice(place.pricing.flat_price) + ' ' + place.pricing.currency.symbol}</td>
                </tr>}
                {!place.contracts[0] && place.pricing && place.pricing.exponential_12h_price && <tr>
                  <td>{t([ 'garages', '12HourPrice' ])}</td>
                  <td>{calculatePrice(place.pricing.exponential_12h_price) + ' ' + place.pricing.currency.symbol}</td>
                </tr>}
                {!place.contracts[0] && place.pricing && place.pricing.exponential_day_price && <tr>
                  <td>{t([ 'garages', 'dayPrice' ])}</td>
                  <td>{calculatePrice(place.pricing.exponential_day_price) + ' ' + place.pricing.currency.symbol}</td>
                </tr>}
                {!place.contracts[0] && place.pricing && place.pricing.exponential_week_price && <tr>
                  <td>{t([ 'garages', 'weekPrice' ])}</td>
                  <td>{calculatePrice(place.pricing.exponential_week_price) + ' ' + place.pricing.currency.symbol}</td>
                </tr>}
                {!place.contracts[0] && place.pricing && place.pricing.exponential_month_price && <tr>
                  <td>{t([ 'garages', 'monthPrice' ])}</td>
                  <td>{calculatePrice(place.pricing.exponential_month_price) + ' ' + place.pricing.currency.symbol}</td>
                </tr>}
                {!place.contracts[0] && place.pricing && place.pricing.weekend_price && <tr>
                  <td>{t([ 'garages', 'weekendPrice' ])}</td>
                  <td>{calculatePrice(place.pricing.weekend_price) + ' ' + place.pricing.currency.symbol}</td>
                </tr>}
              </tbody>
            </table>
          </div>}
        </div>
      )

        switch (state.selected) {
          case 'clients':
            place.group = contracts[0] ? contracts[0].client.id : undefined
            break
          case 'contracts':
            place.group = contracts[0] ? contracts[0].id : undefined
            break
          case 'prices':
            place.group = place.contracts[0] && place.contracts[0].rent && place.contracts[0].rent.id + 'rent' || place.pricing && place.pricing.id + 'price'
            break
          case 'cars':
          case 'reservations':
            place.group = reservation ? reservation.id : undefined
            break
        }

        return place
      })
      return floor
    }

    return (
      <PageBase>
        <TabMenu left={left} right={right} />
        <GarageLayout floors={state.garage ? state.garage.floors.map(preparePlaces) : []} showEmptyFloors />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.garage, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(garageActions, dispatch) })
)(GaragePage)
