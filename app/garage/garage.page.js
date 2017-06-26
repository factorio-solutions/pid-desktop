import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase            from '../_shared/containers/pageBase/PageBase'
import TabMenu             from '../_shared/components/tabMenu/TabMenu'
import TabButton           from '../_shared/components/buttons/TabButton'
import PopupDatetimepicker from '../_shared/components/datetimepicker/PopupDatetimepicker'
import GarageLayout        from '../_shared/components/garageLayout/GarageLayout2'

import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as garageActions from '../_shared/actions/garage.actions'

import styles from './garage.page.scss'


export class GaragePage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount () {
    this.props.pageBase.garage && this.props.actions.initGarage()
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initGarage()
  }

  render() {
    const { state, actions } = this.props

    const left = [ <TabButton label={t(['garages', 'clients'])}      onClick={() => {actions.setSelected("clients")}}      state={state.selected=="clients" && 'selected'}/>
                 , <TabButton label={t(['garages', 'contracts'])}    onClick={() => {actions.setSelected("contracts")}}    state={state.selected=="contracts" && 'selected'}/>
                 , <TabButton label={t(['garages', 'reservations'])} onClick={() => {actions.setSelected("reservations")}} state={state.selected=="reservations" && 'selected'}/>
                 , <TabButton label={t(['garages', 'prices'])}       onClick={() => {actions.setSelected("prices")}}       state={state.selected=="prices" && 'selected'}/>
                 , <TabButton label={t(['garages', 'cars'])}         onClick={() => {actions.setSelected("cars")}}         state={state.selected=="cars" && 'selected'}/>
                 ]

    const right = [ <TabButton label={t(['garages', 'now'])} onClick={actions.setTimeToNow} state={state.now && 'selected'}/>
                  , <div style={{display:'inline-block'}}>
                      <TabButton label={t(['garages', 'setDate'])} onClick={() => {actions.setSelector(true)}} state={!state.now && 'selected'}/>
                      <PopupDatetimepicker onSelect={actions.setTimeTo}  show={state.showSelector} flip={true} okClick={() => {actions.setSelector(false)}} datetime={state.time}/>
                    </div>
                  ]

    const preparePlaces = (floor) => {
      floor.places.map((place) => {
        const contract = state.garage.contracts
          .filter(contract => moment(state.time).isBetween(moment(contract.from), moment(contract.to)))
          .find((contract) => { return contract.places.find(p => p.id === place.id) !== undefined })
        const reservation = place.reservations.find(reservation => moment(state.time).isBetween(moment(reservation.begins_at), moment(reservation.ends_at)))
        switch (state.selected) {
          case 'clients':
            if (contract) {
              place.group = contract.client.id
            } else {
              place.group = undefined
            }
            break;
          case 'contracts':
            if (contract) {
              place.group = contract.id
            } else {
              place.group = undefined
            }
            break;

          case 'prices':
            place.group = place.contracts[0] && place.contracts[0].rent && place.contracts[0].rent.id+'rent' || place.pricing && place.pricing.id+'price'
            break;

          case 'cars':
          case 'reservations':
            if (reservation) {
              place.group = reservation.id
            } else {
              place.group = undefined
            }
            break;
        }
        place.tooltip = <table className={styles.tooltip}><tbody>
          <tr><td>{t(['garages','client'])}</td><td>{contract && contract.client.name}</td></tr>
          <tr><td>{t(['garages','contract'])}</td><td>{contract && contract.name}</td></tr>
          <tr><td>{t(['garages','priceType'])}</td><td>{place.contracts[0] ? t(['garages','longterm']) : place.pricing ? t(['garages','shortterm']) : ""}</td></tr>
          <tr><td>{t(['garages','pricePerSpot'])}</td><td>{place.contracts[0] && place.contracts[0].rent ? place.contracts[0].rent.price+' '+place.contracts[0].rent.currency.symbol : ""}</td></tr>
          <tr><td>{t(['garages','12HourPrice'])}</td><td>{place.pricing  && place.pricing.exponential_12h_price   ? place.pricing.exponential_12h_price+' '+place.pricing.currency.symbol   : ""}</td></tr>
          <tr><td>{t(['garages','dayPrice'])}</td><td>{place.pricing     && place.pricing.exponential_day_price   ? place.pricing.exponential_day_price+' '+place.pricing.currency.symbol   : ""}</td></tr>
          <tr><td>{t(['garages','weekPrice'])}</td><td>{place.pricing    && place.pricing.exponential_week_price  ? place.pricing.exponential_week_price+' '+place.pricing.currency.symbol  : ""}</td></tr>
          <tr><td>{t(['garages','monthPrice'])}</td><td>{place.pricing   && place.pricing.exponential_month_price ? place.pricing.exponential_month_price+' '+place.pricing.currency.symbol : ""}</td></tr>
          <tr><td>{t(['garages','weekendPrice'])}</td><td>{place.pricing && place.pricing.weekend_price           ? place.pricing.weekend_price+' '+place.pricing.currency.symbol           : ""}</td></tr>
          <tr><td>{t(['garages','flatPrice'])}</td><td>{place.pricing    && place.pricing.flat_price              ? place.pricing.flat_price+' '+place.pricing.currency.symbol              : ""}</td></tr>
          <tr><td>{t(['garages','reservationId'])}</td><td>{reservation && reservation.id}</td></tr>
          <tr><td>{t(['garages','driver'])}</td><td>{reservation && reservation.user.full_name}</td></tr>
          <tr><td>{t(['garages','type'])}</td><td>{reservation && (reservation.client ? t(['reservations','host']) : t(['reservations','visitor']))}</td></tr>
          <tr><td>{t(['garages','period'])}</td><td>{reservation && moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')+' - '+moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
          <tr><td>{t(['garages','licencePlate'])}</td><td>{reservation && reservation.car.licence_plate}</td></tr>
        </tbody></table>
        return place
      })
      return floor
    }

    return (
      <PageBase>
        <TabMenu left={left} right={right} />
        <GarageLayout floors={state.garage ? state.garage.floors.map(preparePlaces) : []} showEmptyFloors={true}/>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.garage, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(garageActions, dispatch) })
)(GaragePage)
