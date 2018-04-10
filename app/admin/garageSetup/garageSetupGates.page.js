import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form               from '../../_shared/components/form/Form'
import Input              from '../../_shared/components/input/Input'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as garageSetupActions  from '../../_shared/actions/garageSetup.actions'

import styles from './garageSetupGeneral.page.scss'


class GarageSetupGatesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    params:   PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { state, params, actions } = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    if (params.id) {
      actions.intiEditGarageGates(params.id)
    } else {
      const firstFloor = this.props.state.floors[0] // uncoment later
      if (firstFloor.label === '' || firstFloor.scheme === '') {
        this.goBack()
      } else {
        this.props.state.gates.length === 0 && this.props.actions.addGate() // will add gate with
      }
    }
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      const { state, actions } = this.props
      state.availableTarifs.length === 0 && actions.initTarif()
      nextProps.pageBase.garage && actions.intiEditGarageGates(nextProps.pageBase.garage)
    }
  }

  goBack = () => {
    if (this.props.params.id) {
      nav.to(`/${this.props.params.id}/admin/garageSetup/floors`)
    } else {
      nav.to('/addFeatures/garageSetup/floors')
    }
  }

  render() {
    const { state, actions } = this.props

    const allFloors = state.floors.filter(floor => {
      floor.places.map(place => ({
        ...place,
        available: false
      }))
      return floor.label.length > 0 && floor.scheme.length > 0
    })
    const hightlightInputs = () => actions.toggleHighlight()

    const submitForm = () => {
      if (this.props.params.id) {
        actions.updateGarageGates(this.props.params.id)
        nav.to(`/${this.props.params.id}/admin/garageSetup/order`)
      } else {
        nav.to('/addFeatures/garageSetup/order')
      }
    }

    const checkSubmitable = () => {
      if (!state.gates.reduce((acc, gate) => { return acc && (gate.phone === '' || /^\+?[\d,A-Z]{3,}$/.test(gate.phone)) }, true)) return false
      if (state.gates.find(gate => { return gate.label === '' || gate.address.line_1 === '' }) != undefined) return false

      return true
    }

    const prepareGates = (gate, index, arr) => {
      const handleGateLabelChange = value => { actions.changeGateLabel(value, index) }
      const handleGatePhoneChange = value => { actions.changeGatePhone(value, index) }
      const handleGatePlacesChange = value => { actions.changeGatePlaces(value, index) }
      const handleGateAddressLine1Change = value => { actions.changeGateAddressLine1(value, index) }
      // const handleGateAddressLine2Change = value => { actions.changeGateAddressLine2(value, index) }
      const handleGateAddressLat = value => { actions.changeGateAddressLat(value, index) }
      const handleGateAddressLng = value => { actions.changeGateAddressLng(value, index) }
      const removeGateRow = () => { actions.removeGate(index) }

      const getGateGPS = () => {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `${gate.address.line_1}, ${state.city}, ${state.postal_code}, ${state.country}` }, (results, status) => {
          if (status === 'OK') {
            actions.changeGateAddressLat(results[0].geometry.location.lat(), index)
            actions.changeGateAddressLng(results[0].geometry.location.lng(), index)
          } else {
            console.log(`Geocode was not successful on ${state.line_1}, ${state.city}, ${state.postal_code}, ${state.country} for the following reason: ` + status)
          }
        })
      }

      const removeGateButton = () => arr.length <= 1 ?
        null :
        <RoundButton
          content={<span className="fa fa-times" aria-hidden="true" />}
          onClick={removeGateRow}
          type="remove"
          question={t([ 'newGarage', 'removeGateRowQuestion' ])}
        />

      return (
        <div key={index}>
          <div className={styles.inline}>
            <Input
              style={styles.gatePhoneInputWidth + ' ' + styles.rightMargin}
              onChange={handleGateLabelChange}
              label={t([ 'newGarage', 'gateLabel' ], { index: index + 1 }) + (index !== arr.length - 1 ? ' *' : '')}
              error={t([ 'newGarage', 'invalidGateLabel' ])}
              value={gate.label}
              name={`gate${index}[label]`}
              placeholder={t([ 'newGarage', 'placeholderGateLabel' ])}
              highlight={state.highlight}
            />
            <Input
              style={styles.gatePhoneInputWidth}
              onChange={handleGatePhoneChange}
              label={t([ 'newGarage', 'gatePhone' ])}
              error={t([ 'newGarage', 'invalidGatePhone' ])}
              value={gate.phone}
              name={`gate${index}[phone]`}
              placeholder={t([ 'newGarage', 'placeholderGatePhone' ])}
              type="tel"
              pattern="\+?[\d,A-Z]{3,}"
            />
            {removeGateButton()}
          </div>
          <Input
            onChange={handleGatePlacesChange}
            label={t([ 'newGarage', 'places' ]) + (index !== arr.length - 1 ? ' *' : '')}
            error={t([ 'newGarage', 'invalidPlaces' ])}
            value={gate.places}
            placeholder={t([ 'newGarage', 'placesPlaceholder' ])}
            highlight={state.highlight}
            pattern="(\w+\s*)(\s*(,|-|/)\s*\w+)*"
          />
          <Input
            onChange={handleGateAddressLine1Change}
            label={t([ 'newGarage', 'street' ]) + (index !== arr.length - 1 ? ' *' : '')}
            error={t([ 'newGarage', 'invalidStreet' ])}
            value={gate.address.line_1}
            placeholder={t([ 'newGarage', 'streetPlaceholder' ])}
            highlight={state.highlight}
            onBlur={() => { getGateGPS() }}
          />
          <div className={styles.inline}>
            <Input
              style={styles.latLngInputWidth + ' ' + styles.rightMargin}
              onChange={handleGateAddressLat}
              label={t([ 'newGarage', 'lat' ])}
              error={t([ 'newGarage', 'invalidLat' ])}
              value={gate.address.lat}
              name="garage[lat]"
              placeholder={t([ 'newGarage', 'latPlaceholder' ])}
            />
            <Input
              style={styles.latLngInputWidth}
              onChange={handleGateAddressLng}
              label={t([ 'newGarage', 'lng' ])}
              error={t([ 'newGarage', 'invalidLng' ])}
              value={gate.address.lng}
              name="garage[lng]"
              placeholder={t([ 'newGarage', 'lngPlaceholder' ])}
            />
          </div>
        </div>
      )
    }


    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={this.goBack} onHighlight={hightlightInputs}>
          <div className={styles.gates}>
            <div className={styles.gatesForm}>
              <h2>{t([ 'newGarage', 'garageGates' ])}</h2>
              {state.gates.map(prepareGates)}
              <CallToActionButton label={t([ 'newGarage', 'addGate' ])} onClick={actions.addGate} />
            </div>
            <div className={styles.garageLayout}>
              <GarageLayout
                floors={allFloors}
                onPlaceClick={place => { console.log('place clicked', place) }}
                showEmptyFloors
              />
            </div>
          </div>
        </Form>
      </GarageSetupPage>
    )
  }
}

export default connect(
  state => ({ state: state.garageSetup, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupGatesPage)
