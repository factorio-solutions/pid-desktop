import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form               from '../../_shared/components/form/Form'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as garageSetupActions  from '../../_shared/actions/garageSetup.actions'

import styles from './garageSetupGeneral.page.scss'


class GarageSetupOrderPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    params:   PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { state, params, actions } = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    if (params.id) {
      actions.intiEditGarageOrder(params.id)
    } else if (state.gates.length === 0) {
      this.goBack()
    }
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      const { state, actions } = this.props
      state.availableTarifs.length === 0 && actions.initTarif()
      nextProps.pageBase.garage && actions.intiEditGarageOrder(nextProps.pageBase.garage)
    }
  }

  goBack = () => {
    if (this.props.params.id) {
      nav.to(`/${this.props.params.id}/admin/garageSetup/gates`)
    } else {
      nav.to('/addFeatures/garageSetup/gates')
    }
  }

  render() {
    const { state, pageBase, actions } = this.props
    const readOnly = pageBase.isGarageManager && !pageBase.isGarageAdmin

    const addPlaceToOrder = place => !readOnly && actions.addToOrder(place.label)
    const makeButton = (label, index) => <CallToActionButton label={label} state={readOnly && 'disabled'} onClick={() => actions.removeFromOrder(index)} />

    const allFloors = state.floors
    .filter(floor => floor.label.length > 0 && floor.scheme.length > 0)
    .map(floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        available: !state.order.includes(place.label)
      }))
    }))


    const submitForm = () => {
      if (this.props.params.id) {
        actions.updateGarageOrder(this.props.params.id)
        nav.to(`/${this.props.params.id}/admin/garageSetup/legalDocuments`)
      } else {
        nav.to('/addFeatures/garageSetup/legalDocuments')
      }
    }

    const formContent = (<div className={styles.gates}>
      <div className={styles.gatesForm}>
        <h2>{t([ 'newGarage', 'placePriority' ])}</h2>
        <p>{t([ 'newGarage', 'placePriorityDescription' ])}</p>
        <p>
          {state.order.length > 0 && t([ 'newGarage', 'highestPriority' ])}
          {state.order.map(makeButton)}
        </p>
      </div>
      <div className={styles.garageLayout}>
        <GarageLayout
          floors={allFloors}
          onPlaceClick={addPlaceToOrder}
          showEmptyFloors
        />
      </div>
    </div>)

    return (
      <GarageSetupPage>
        {readOnly ?
          formContent :
          <Form onSubmit={submitForm} submitable onBack={this.goBack} onHighlight={actions.toggleHighlight}>
            {formContent}
          </Form>
        }
      </GarageSetupPage>
    )
  }
}

export default connect(
  state => ({ state: state.garageSetup, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupOrderPage)
