import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout'
import Form               from '../../_shared/components/form/Form'

import * as nav               from '../../_shared/helpers/navigation'
import { t }                  from '../../_shared/modules/localization/localization'
import * as thirdPartyActions from '../../_shared/actions/admin.thirdPartyIntegration.actions'

import styles from './mrParkitIntegration.page.scss'


class MrParkitIntegrationPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initThirdPartyIntegration(window.location.hash.includes('3rdPartyIntegration') ? 'third_party' : 'mr_parkit')
  }

  onSubmit = () => {
    const { actions } = this.props

    window.location.hash.includes('3rdPartyIntegration') ?
      actions.submitThirdPartyIntegration() :
      actions.submitMrParkitIntegration()
  }

  onBack = () => nav.to(`/${this.props.pageBase.garage}/admin/modules`)

  render() {
    const { state, actions } = this.props

    const createPlaceButtons = (acc, floor) => floor.places.reduce((acc, place) =>
      state.places.includes(place.id) ?
        [ ...acc, <CallToActionButton label={place.label} onClick={() => actions.togglePlace(place.id)} /> ] :
        acc,
      acc
    )

    const preparePlaces = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        available: true,
        selected:  state.places.includes(place.id)
      }))
    })

    return (
      <PageBase>
        <div className={styles.flex}>
          <div className={styles.half}>
            <h2>{t([ 'modules', window.location.hash.includes('3rdPartyIntegration') ? 'selectPlacesFor3rdParty' : 'selectPlacesForMrParkit' ])}</h2>
            <Form onSubmit={this.onSubmit} submitable={state.places.length} onBack={this.onBack}>
              <div className={styles.places}>
                {state.places.length ?
                  state.garage && state.garage.floors.reduce(createPlaceButtons, []) :
                  <b className={state.highlight && styles.red}>{t([ 'newContract', 'noSelectedPlaces' ])}</b>
                }
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
  state => ({ state: state.adminThirdPartyIntegration, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(thirdPartyActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(MrParkitIntegrationPage)
