import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase                               from '../_shared/containers/pageBase/PageBase'
import TabMenu                                from '../_shared/components/tabMenu/TabMenu'
import TabButton                              from '../_shared/components/buttons/TabButton'
import PopupDatetimepicker                    from '../_shared/components/datetimepicker/PopupDatetimepicker'
import GarageLayout, { assignColorsToGroups } from '../_shared/components/garageLayout/GarageLayout'

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

  selectFactory = tab => () => this.props.actions.setSelected(tab)

  tabFactory = tab => (<TabButton
    label={t([ 'garages', tab ])}
    onClick={this.selectFactory(tab)}
    state={this.props.state.selected === tab && 'selected'}
  />)

  render() {
    const { state, actions } = this.props

    const onDateSelectorClick = () => actions.setSelector(true)

    const left = [ 'clients', 'contracts', 'reservations', 'prices', 'cars' ].map(this.tabFactory)

    const right = [
      <TabButton label={t([ 'garages', 'now' ])} onClick={actions.setNow} state={state.now && 'selected'} />,
      <div className={styles.inlineBlock}>
        <TabButton label={t([ 'garages', 'setDate' ])} onDisabledClick={onDateSelectorClick} onClick={onDateSelectorClick} state={!state.now && 'selected'} />
        <PopupDatetimepicker onSelect={actions.setTime} show={state.showSelector} flip okClick={() => actions.setSelector(false)} datetime={state.time} />
      </div>
    ]

    const preparePlaces = floor => {
      floor.places.map(place => { // give places groups
        const contracts = state.garage.contracts
          .filter(contract => moment(state.time).isBetween(moment(contract.from), moment(contract.to)))
          .filter(contract => contract.places.find(p => p.id === place.id) !== undefined)
        const reservation = place.reservations[0]

        switch (state.selected) {
          case 'clients':
            place.group = contracts.length ? contracts
              .map(contract => contract.client.id)
              .filter((group, index, arr) => arr.indexOf(group) === index) : // unique values
              undefined
            break
          case 'contracts':
            place.group = contracts.length ? contracts
              .map(contract => contract.id)
              .filter((group, index, arr) => arr.indexOf(group) === index) :
              undefined
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

      floor.places.map(place => { // give places tooltips
        const contracts = state.garage.contracts
          .filter(contract => moment(state.time).isBetween(moment(contract.from), moment(contract.to)))
          .filter(contract => contract.places.find(p => p.id === place.id) !== undefined)
        const reservation = place.reservations[0]
        const calculatePrice = price => valueAddedTax(price, state.garage.dic ? state.garage.vat : 0)
        const assignedColors = state.garage && assignColorsToGroups(state.garage.floors)

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
                    {contracts.length > 0 && contracts
                      .map(contract => contract.client)
                      .filter((client, index, arr) => arr.findIndexById(client.id) === index)
                      .map(client => [
                        state.selected === 'clients' && <span className={styles.circle}><i className="fa fa-circle" aria-hidden="true" style={{ color: assignedColors[client.id] }} /></span>,
                        <span>{client.name}</span>,
                        reservation && reservation.client && reservation.client.id === client.id && <span>({t([ 'reservations', 'host' ])})</span>,
                        <span>,</span>
                      ].filter(o => o))
                    }
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
                  <td>{contracts.length > 0 && contracts.map(contract => [ state.selected === 'contracts' &&
                  <span className={styles.circle}><i className="fa fa-circle" aria-hidden="true" style={{ color: assignedColors[contract.id] }} /></span>,
                    <span>{contract.name},</span>
                  ])}</td>
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
        </div>)
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
