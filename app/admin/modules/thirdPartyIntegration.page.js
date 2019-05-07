import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose  } from 'redux'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout'
import Form               from '../../_shared/components/form/Form'

// import * as nav               from '../../_shared/helpers/navigation'
import { t }                  from '../../_shared/modules/localization/localization'
import * as thirdPartyActions from '../../_shared/actions/admin.thirdPartyIntegration.actions'
import { toAdminModules } from '../../_shared/actions/pageBase.actions'

import styles from './mrParkitIntegration.page.scss'


class ThirdPartyIntegrationPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initThirdPartyIntegration('third_party')
  }

  onSubmit = () => this.props.actions.submitThirdPartyIntegration()

  render() {
    const { state, actions } = this.props

    const createPlaceButtons = (acc, floor) => floor.places.reduce((acc, place) => state.places.includes(place.id)
      ? [ ...acc, <CallToActionButton label={place.label} onClick={() => actions.togglePlace(place.id)} /> ]
      : acc,
    acc)

    const preparePlaces = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        available: true,
        selected:  state.places.includes(place.id)
      }))
    })

    return (
      <div className={styles.flex}>
        <div className={styles.half}>
          <h2>{t([ 'modules', 'selectPlacesFor3rdParty' ])}</h2>
          <Form
            onSubmit={actions.submitThirdPartyIntegration}
            submitable={state.places.length}
            onHighlight={actions.toggleHighlight}
          >
            <div className={styles.places}>
              {state.places.length
                ? state.garage && state.garage.floors.reduce(createPlaceButtons, [])
                : (
                  <b className={state.highlight && styles.red}>
                    {t([ 'newContract', 'noSelectedPlaces' ])}
                  </b>
                )
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
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toAdminModules('garageMarketing')),
  connect(
    state => ({ state: state.adminThirdPartyIntegration, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators(thirdPartyActions, dispatch) })
  )
)

export default enhancers(ThirdPartyIntegrationPage)
