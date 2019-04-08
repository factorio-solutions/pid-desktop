import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase from '../_shared/containers/pageBase/PageBase'
import TabMenu from '../_shared/components/tabMenu/TabMenu'
import TabButton from '../_shared/components/buttons/TabButton'
import PopupDatetimepicker from '../_shared/components/datetimepicker/PopupDatetimepicker'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout'
import Loading from '../_shared/components/loading/Loading'

import { t }              from '../_shared/modules/localization/localization'
import * as garageActions from '../_shared/actions/garage.actions'

import styles from './garage.page.scss'
import PlaceTooltip from './placeTooltip'


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
      <TabButton
        label={t([ 'garages', 'now' ])}
        onClick={actions.setNow}
        state={state.now && 'selected'}
      />,
      <div className={styles.inlineBlock}>
        <TabButton
          label={t([ 'garages', 'setDate' ])}
          onDisabledClick={onDateSelectorClick}
          onClick={onDateSelectorClick}
          state={!state.now && 'selected'}
        />
        <PopupDatetimepicker
          onSelect={actions.setTime}
          show={state.showSelector}
          flip
          okClick={() => actions.setSelector(false)}
          datetime={state.time}
        />
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
              .filter((group, index, arr) => arr.indexOf(group) === index) // unique values
              : undefined
            break
          case 'contracts':
            place.group = contracts.length ? contracts
              .map(contract => contract.id)
              .filter((group, index, arr) => arr.indexOf(group) === index)
              : undefined
            break
          case 'prices':
            place.group = (
              (place.contracts[0] && place.contracts[0].rent && place.contracts[0].rent.id + 'rent')
              || (place.pricing && place.pricing.id + 'price')
            )
            break
          case 'cars':
          case 'reservations':
            place.group = reservation ? reservation.id : undefined
            break
        }
        return place
      })

      floor.places.map(place => { // give places tooltips
        place.tooltip = (
          <PlaceTooltip
            garage={state.garage}
            place={place}
            selected={state.selected}
            time={state.time}
          />
        )
        return place
      })
      return floor
    }

    return (
      <PageBase>
        <TabMenu left={left} right={right} />
        <GarageLayout
          floors={state.garage ? state.garage.floors.map(preparePlaces) : []}
          showEmptyFloors
        />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.garage, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(garageActions, dispatch) })
)(GaragePage)
