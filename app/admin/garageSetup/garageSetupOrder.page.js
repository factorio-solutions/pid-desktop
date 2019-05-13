import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Form               from '../../_shared/components/form/Form'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as garageSetupActions  from '../../_shared/actions/garageSetup.actions'
import { toAdminGarageSetup, toAddFeatures } from '../../_shared/actions/pageBase.actions'

import styles from './garageSetupGeneral.page.scss'


class GarageSetupOrderPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    match:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { state, match: { params }, actions } = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    if (params.id) {
      actions.intiEditGarageOrder(params.id)
    } else if (state.gates.length === 0) {
      this.goBack()
    }
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    const { pageBase } = this.props
    if (nextProps.pageBase.garage !== pageBase.garage) {
      const { state, actions } = this.props
      state.availableTarifs.length === 0 && actions.initTarif()
      nextProps.pageBase.garage && actions.intiEditGarageOrder(nextProps.pageBase.garage)
    }
  }

  goBack = () => {
    const { match: { params } } = this.props
    if (params.id) {
      nav.to(`/${params.id}/admin/garageSetup/gates`)
    } else {
      nav.to('/addFeatures/garageSetup/gates')
    }
  }

  readOnly = () => {
    const { pageBase } = this.props
    return pageBase.isGarageManager && !pageBase.isGarageAdmin
  }

  renderFormContent = readOnly => {
    const { state, actions } = this.props
    const addPlaceToOrder = place => !readOnly && actions.addToOrder(place.label)
    const makeButton = (label, index) => (
      <CallToActionButton
        label={label}
        state={readOnly && 'disabled'}
        onClick={() => actions.removeFromOrder(index)}
      />
    )

    const allFloors = state.floors
      .filter(floor => floor.label.length > 0 && floor.scheme.length > 0)
      .map(floor => ({
        ...floor,
        places: floor.places.map(place => ({
          ...place,
          available: !state.order.includes(place.label)
        }))
      }))

    return (
      <div className={styles.gates}>
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
      </div>
    )
  }

  submitForm = () => {
    const { match: { params }, actions } = this.props
    if (params.id) {
      actions.updateGarageOrder(params.id)
      nav.to(`/${params.id}/admin/garageSetup/legalDocuments`)
    } else {
      nav.to('/addFeatures/garageSetup/legalDocuments')
    }
  }

  render() {
    const { actions } = this.props
    const readOnly = this.readOnly()

    return (
      <React.Fragment>
        {readOnly
          ? this.renderFormContent(readOnly)
          : (
            <Form
              onSubmit={this.submitForm}
              submitable
              onBack={this.goBack}
              onHighlight={actions.toggleHighlight}
            >
              {this.renderFormContent(readOnly)}
            </Form>
          )
        }
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(() => {
    const { hash } = window.location
    const action = hash.includes('admin') ? toAdminGarageSetup : toAddFeatures

    return action('newGarageOrder')
  }),
  connect(
    state => ({ state: state.garageSetup, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) })
  )
)

export default enhancers(GarageSetupOrderPage)
