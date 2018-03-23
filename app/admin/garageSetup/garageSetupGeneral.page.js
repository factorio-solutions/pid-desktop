import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import Iban                            from 'iban'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import UploadButton       from '../../_shared/components/buttons/UploadButton'
import Form               from '../../_shared/components/form/Form'
import Input              from '../../_shared/components/input/Input'

import * as nav                        from '../../_shared/helpers/navigation'
import { t }                           from '../../_shared/modules/localization/localization'
import * as garageSetupActions         from '../../_shared/actions/garageSetup.actions'
import { defaultImage }                from '../../_shared/reducers/garageSetup.reducer'
import geocoder                        from '../../_shared/helpers/geocode'
import { PRESIGNE_GARAGE_IMAGE_QUERY } from '../../_shared/queries/garageSetup.queries'

import styles from './garageSetupGeneral.page.scss'


class GarageSetupGeneralPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    params:   PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    const { state, pageBase, actions } = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    this.props.params.id && pageBase.garage && actions.intiEditGarageGeneral(pageBase.garage)
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      const { state, actions } = this.props
      state.availableTarifs.length === 0 && actions.initTarif()
      nextProps.pageBase.garage && actions.intiEditGarageGeneral(nextProps.pageBase.garage)
    }
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      if (this.props.params.id) {
        actions.updateGarageGeneral(this.props.params.id, window.location.href)
      } else {
        nav.to('/addFeatures/garageSetup/floors')
      }
    }

    const goBack = () => {
      if (this.props.params.id) {
        nav.to(`/${this.props.params.id}/admin/garageSetup/general`)
      } else {
        nav.to('/addFeatures')
      }
    }
    const isIbanValid = iban => {
      const valid = Iban.isValid(iban)
      const pattern = valid ? undefined : '/(?=a)b/'
      if (state.ibanPattern !== pattern) {
        actions.setIbanPattern(pattern)
      }
    }

    const checkSubmitable = () => {
      if (state.dic && !state.ic) return false
      if (state.tarif_id === undefined) return false
      if (state.name === '') return false
      if (state.company === '') return false
      if (state.city === '') return false
      if (state.line_1 === '') return false
      if (state.postal_code === '') return false
      if (state.country === '') return false
      if (!Iban.isValid(state.iban)) return false
      return true
    }

    const hightlightInputs = () => { actions.toggleHighlight() }

    const geocode = () => {
      const onCoordinatesFound = (lat, lng) => {
        actions.setLat(lat)
        actions.setLng(lng)
      }
      geocoder(onCoordinatesFound, state.line_1, state.city, state.postal_code, state.country)
    }

    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
          <div className={styles.general}>
            <div className={styles.address}>
              <h2>{t([ 'newGarage', 'garageAddress' ])}</h2>
              <Input
                onChange={actions.setName}
                label={t([ 'newGarage', 'name' ])}
                error={t([ 'newGarage', 'invalidName' ])}
                value={state.name}
                placeholder={t([ 'newGarage', 'placeholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setIc}
                label={t([ 'newClient', 'IC' ])}
                error={t([ 'newClient', 'invalidIC' ])}
                value={state.ic}
                placeholder={t([ 'newClient', 'ICplaceholder' ])}
                highlight={state.dic && state.highlight}
                onBlur={actions.loadAddressFromIc}
              />
              <Input
                onChange={actions.setCompanyName}
                label={t([ 'newGarage', 'company' ])}
                error={t([ 'newGarage', 'invalidCompany' ])}
                value={state.company}
                placeholder={t([ 'newGarage', 'placeholderCompany' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setDic}
                label={t([ 'newClient', 'DIC' ])}
                error={t([ 'newClient', 'invalidDIC' ])}
                value={state.dic}
                placeholder={t([ 'newClient', 'DICplaceholder' ])}
              />
              <Input
                onChange={actions.setIban}
                label={t([ 'newClient', 'IBAN' ])}
                error={t([ 'newClient', 'invalidIBAN' ])}
                value={state.iban}
                placeholder={t([ 'newClient', 'IBANplaceholder' ])}
                highlight={state.highlight}
                pattern={state.ibanPattern}
                isValid={isIbanValid}
              />
              <div className={styles.checkbox}><input type="checkbox" checked={state.lpg} onChange={actions.toggleLPG} />
                <span onClick={actions.toggleLPG}>{t([ 'newGarage', 'lpgAllowed' ])}</span>
              </div>
              <Input
                onChange={actions.setLine1}
                onBlur={geocode}
                label={t([ 'newGarage', 'street' ])}
                error={t([ 'newGarage', 'invalidStreet' ])}
                value={state.line_1}
                placeholder={t([ 'newGarage', 'cityPlaceholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setLine2}
                onBlur={geocode}
                label={t([ 'addresses', 'line2' ])}
                error={t([ 'addresses', 'line2Invalid' ])}
                value={state.line_2}
                placeholder={t([ 'addresses', 'line2Placeholder' ])}
              />
              <Input
                onChange={actions.setCity}
                onBlur={geocode}
                label={t([ 'newGarage', 'city' ])}
                error={t([ 'newGarage', 'invalidCity' ])}
                value={state.city}
                placeholder={t([ 'newGarage', 'cityPlaceholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setPostalCode}
                onBlur={geocode}
                label={t([ 'newGarage', 'postalCode' ])}
                error={t([ 'newGarage', 'invalidPostalCode' ])}
                value={state.postal_code}
                placeholder={t([ 'newGarage', 'postalCodePlaceholder' ])}
                highlight={state.highlight}
              />
              <Input
                onChange={actions.setState}
                onBlur={geocode}
                label={t([ 'newGarage', 'state' ])}
                error={t([ 'newGarage', 'invalidCountry' ])}
                value={state.state}
                placeholder={t([ 'newGarage', 'statePlaceholder' ])}
              />
              <Input
                onChange={actions.setCountry}
                onBlur={geocode}
                label={t([ 'newGarage', 'country' ])}
                error={t([ 'newGarage', 'invalidState' ])}
                value={state.country}
                placeholder={t([ 'newGarage', 'countryPlaceholder' ])}
                highlight={state.highlight}
              />
              <div className={styles.inline}>
                <Input
                  style={styles.latLngInputWidth + ' ' + styles.rightMargin}
                  onChange={actions.setLat}
                  label={t([ 'newGarage', 'lat' ])}
                  error={t([ 'newGarage', 'invalidLat' ])}
                  value={state.lat}
                  placeholder={t([ 'newGarage', 'latPlaceholder' ])}
                />
                <Input
                  style={styles.latLngInputWidth}
                  onChange={actions.setLng}
                  label={t([ 'newGarage', 'lng' ])}
                  error={t([ 'newGarage', 'invalidLng' ])}
                  value={state.lng}
                  placeholder={t([ 'newGarage', 'lngPlaceholder' ])}
                />
              </div>
            </div>
            <div className={styles.imageSelector}>
              <h2>{t([ 'newGarage', 'garagePicture' ])}</h2>
              <img src={state.img} />
              <div>
                <UploadButton
                  label={t([ 'newGarage', 'addProfilePicture' ])}
                  type={state.img === defaultImage ? 'action' : 'confirm'}
                  onUpload={actions.setImage}
                  query={PRESIGNE_GARAGE_IMAGE_QUERY}
                />
              </div>
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
)(GarageSetupGeneralPage)
