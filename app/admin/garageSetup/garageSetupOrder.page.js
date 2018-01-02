import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form               from '../../_shared/components/form/Form'
// import Input              from '../../_shared/components/input/Input'
// import RoundButton        from '../../_shared/components/buttons/RoundButton'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout2      from '../../_shared/components/garageLayout/GarageLayout2'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as garageSetupActions  from '../../_shared/actions/garageSetup.actions'

import styles from './garageSetupGeneral.page.scss'


class GarageSetupOrderPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  goBack = () => {
    if (this.props.params.id) {
      // TODO: cancel changes
      nav.to(`/${this.props.params.id}/admin/garageSetup/gates`)
    } else {
      nav.to( '/addFeatures/garageSetup/gates' )
    }
  }

  componentDidMount(){
    const { state, params, actions} = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    if (params.id){
      actions.intiEditGarageOrder(params.id)
    } else {
      if (state.gates.length === 0){
        this.goBack()
      }
    }
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    if (nextProps.pageBase.garage != this.props.pageBase.garage){
      const { state, actions} = this.props
      state.availableTarifs.length === 0 && actions.initTarif()
      nextProps.pageBase.garage && actions.intiEditGarageOrder(nextProps.pageBase.garage)
    }
  }

  render() {
    const { state, actions } = this.props

    const goBack           = () => { this.goBack() }
    const hightlightInputs = () => { actions.toggleHighlight() }
    const addPlaceToOrder  = (place) => { actions.addToOrder(place.label) }
    const makeButton       = (label, index) => <CallToActionButton label={label} onClick={() => {actions.removeFromOrder(index)}}/>

    const allFloors = state.floors.filter((floor)=>{
      floor.places.map(place => {
        place.available = !state.order.includes(place.label)
        return place
      })
      return floor.label.length > 0 && floor.scheme.length > 0
    })

    const submitForm = () => {
      if (this.props.params.id) {
        actions.updateGarageOrder(this.props.params.id)
      } else {
        nav.to( '/addFeatures/garageSetup/subscribtion' )
      }
    }


    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={true} onBack={goBack} onHighlight={hightlightInputs}>
          <div className={styles.gates}>
            <div className={styles.gatesForm}>
              <h2>{t(['newGarage', 'placePriority'])}</h2>
              <p>{t(['newGarage', 'placePriorityDescription'])}</p>
              <p>
                {state.order.length > 0 && t(['newGarage', 'highestPriority'])}
                {state.order.map(makeButton)}
              </p>
            </div>
            <div className={styles.garageLayout}>
              <GarageLayout2
                floors={allFloors}
                onPlaceClick = {addPlaceToOrder}
                showEmptyFloors = {true}
              />
            </div>
          </div>
        </Form>
      </GarageSetupPage>
    )
  }
}

export default connect(
  state    => ({ state: state.garageSetup, pageBase: state.pageBase }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupOrderPage)
