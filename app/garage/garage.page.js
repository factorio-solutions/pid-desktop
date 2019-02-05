import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase            from '../_shared/containers/pageBase/PageBase'
import TabMenu             from '../_shared/components/tabMenu/TabMenu'
import TabButton           from '../_shared/components/buttons/TabButton'
import PopupDatetimepicker from '../_shared/components/datetimepicker/PopupDatetimepicker'
import GarageLayout        from '../_shared/components/garageLayout/GarageLayout'
import Loading             from '../_shared/components/loading/Loading'
import GaragePlaceTooltip  from './garage.placeTooltip'

import { t }              from '../_shared/modules/localization/localization'
import * as garageActions from '../_shared/actions/garage.actions'

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

  tabFactory = tab => (
    <TabButton
      label={t([ 'garages', tab ])}
      onClick={this.selectFactory(tab)}
      state={this.props.state.selected === tab && 'selected'}
    />
  )

  preparePlaces = floor => {
    const {
      state: {
        garage, time, selected
      }
    } = this.props
    const newPlaces = floor.places.map(place => { // give places groups
      const newPlace = { ...place }
      const contracts = garage.contracts
        .filter(contract => moment(time).isBetween(moment(contract.from), moment(contract.to)))
        .filter(contract => contract.places.find(p => p.id === place.id) !== undefined)
      const reservation = place.reservations[0]

      switch (selected) {
        case 'clients':
          newPlace.group = contracts.length
            ? contracts
              .map(contract => contract.client.id)
              .filter((group, index, arr) => arr.indexOf(group) === index) // unique values
            : undefined
          break
        case 'contracts':
          newPlace.group = contracts.length
            ? contracts
              .map(contract => contract.id)
              .filter((group, index, arr) => arr.indexOf(group) === index)
            : undefined
          break
        case 'prices':
          newPlace.group = (
            (
              place.contracts[0]
              && place.contracts[0].rent
              && place.contracts[0].rent.id + 'rent'
            )
            || (place.pricing && place.pricing.id + 'price')
          )
          break
        case 'cars':
        case 'reservations':
          newPlace.group = reservation ? reservation.id : undefined
          break
      }
      newPlace.tooltip = (
        <GaragePlaceTooltip
          garage={garage}
          place={place}
          reservation={reservation}
          contracts={contracts}
          selected={selected}
        />
      )
      return newPlace
    })
    return {
      ...floor,
      places: newPlaces
    }
  }

  render() {
    const { state, actions } = this.props

    const onDateSelectorClick = () => actions.setSelector(true)

    const left = [ 'clients', 'contracts', 'reservations', 'prices', 'cars' ]
      .map(this.tabFactory)
      .concat(
        <div className={styles.loading}>
          <Loading show={state.loading} />
        </div>
      )

    const right = [
      <TabButton label={t([ 'garages', 'now' ])} onClick={actions.setNow} state={state.now && 'selected'} />,
      <div className={styles.inlineBlock}>
        <TabButton label={t([ 'garages', 'setDate' ])} onDisabledClick={onDateSelectorClick} onClick={onDateSelectorClick} state={!state.now && 'selected'} />
        <PopupDatetimepicker onSelect={actions.setTime} show={state.showSelector} flip okClick={() => actions.setSelector(false)} datetime={state.time} />
      </div>
    ]

    return (
      <PageBase>
        <TabMenu left={left} right={right} />
        <GarageLayout floors={state.garage ? state.garage.floors.map(this.preparePlaces) : []} showEmptyFloors />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.garage, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(garageActions, dispatch) })
)(GaragePage)
