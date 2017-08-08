import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import Form               from '../../_shared/components/form/Form'
import Dropdown           from '../../_shared/components/dropdown/Dropdown'
import Input              from '../../_shared/components/input/Input'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as garageSetupActions  from '../../_shared/actions/garageSetup.actions'
import { defaultImage }         from '../../_shared/reducers/garageSetup.reducer'

import styles from './garageSetupGeneral.page.scss'


export class GarageSetupGeneralPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount () {
    const { state, params, actions} = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    params.id && actions.intiEditGarageGeneral(params.id)
  }

  render() {
    const { state, actions } = this.props

    const handleFileSelect = (event)=>{
      var reader = new FileReader()
      reader.onload = (e) => { actions.setImage(e.target.result) }
      reader.readAsDataURL(event.target.files[0])
    }

    const submitForm = () => {
      if (this.props.params.id) {
        actions.updateGarageGeneral(this.props.params.id, window.location.href)
        // nav.to(`/${this.props.params.id}/admin/garageSetup/floors`)
      } else {
        nav.to( '/addFeatures/garageSetup/floors' )
      }
    }

    const goBack = () => {
      if (this.props.params.id) {
        // TODO: cancel changes
        nav.to(`/${this.props.params.id}/admin/garageSetup/general`)
      } else {
        nav.to( '/addFeatures' )
      }
    }

    const checkSubmitable = () => {
      // return true // todo: delete this
      if (state.tarif_id == undefined) return false
      if (state.name == "") return false
      if (state.city == "") return false
      if (state.line_1 == "") return false
      if (state.postal_code == "") return false
      if (state.country == "") return false

      return true
    }

    const hightlightInputs = () => { actions.toggleHighlight() }

    const handleErrorClick = () => {
      actions.setError(undefined)
      actions.clearForm()
      goBack()
    }

    const geocode = () => {
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address:`${state.line_1}, ${state.city}, ${state.postal_code}, ${state.country}` }, (results, status) => {
        if (status === 'OK') {
          actions.setLat( results[0].geometry.location.lat() )
          actions.setLng( results[0].geometry.location.lng() )
        } else {
          console.log(`Geocode was not successful on ${state.line_1}, ${state.city}, ${state.postal_code}, ${state.country} for the following reason: ` + status);
        }
      })
    }

    const tarifSelected = (index) => { actions.setTarif(state.availableTarifs[index].id) }
    const tarifDropdown = state.availableTarifs.map((tarif, index) => {return {label: `${t(['addFeatures',tarif.name])} - ${tarif.price} ${tarif.currency.symbol}`, onClick: tarifSelected.bind(this, index) }})


    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
          <div className={styles.general}>
            <div className={styles.address}>
              <h2>{t(['newGarage', 'garageAddress'])}</h2>
              <Dropdown label={t(['newGarage', 'selectTarif'])} content={tarifDropdown} style='light' selected={state.availableTarifs.findIndex((tarif)=>{return tarif.id == state.tarif_id})} highlight={state.highlight}/>
              <Input onChange={actions.setName}       label={t(['newGarage', 'name'])}       error={t(['newGarage', 'invalidName'])}        value={state.name}        placeholder={t(['newGarage', 'placeholder'])} highlight={state.highlight}/>
              <Input onChange={actions.setIc}         label={t(['newClient', 'IC'])}         error={t(['newClient', 'invalidIC'])}          value={state.ic}          placeholder={t(['newClient', 'ICplaceholder'])} />
              <Input onChange={actions.setDic}        label={t(['newClient', 'DIC'])}        error={t(['newClient', 'invalidDIC'])}         value={state.dic}         placeholder={t(['newClient', 'DICplaceholder'])} />
              <div className={styles.checkbox}><input type="checkbox" checked={state.lpg} onChange={actions.toggleLPG}/> <span onClick={actions.toggleLPG}> {t(['newGarage', 'lpgAllowed'])} </span></div>
              <Input onChange={actions.setLine1}      onBlur={()=>{geocode()}} label={t(['newGarage', 'street'])}     error={t(['newGarage', 'invalidStreet'])}      value={state.line_1}      placeholder={t(['newGarage', 'cityPlaceholder'])}       highlight={state.highlight}/>
              <Input onChange={actions.setLine2}      onBlur={()=>{geocode()}} label={t(['addresses', 'line2'])}      error={t(['addresses', 'line2Invalid'])}       value={state.line_2}      placeholder={t(['addresses', 'line2Placeholder'])}/>
              <Input onChange={actions.setCity}       onBlur={()=>{geocode()}} label={t(['newGarage', 'city'])}       error={t(['newGarage', 'invalidCity'])}        value={state.city}        placeholder={t(['newGarage', 'cityPlaceholder'])}       highlight={state.highlight}/>
              <Input onChange={actions.setPostalCode} onBlur={()=>{geocode()}} label={t(['newGarage', 'postalCode'])} error={t(['newGarage', 'invalidPostalCode'])}  value={state.postal_code} placeholder={t(['newGarage', 'postalCodePlaceholder'])} highlight={state.highlight}/>
              <Input onChange={actions.setState}      onBlur={()=>{geocode()}} label={t(['newGarage', 'state'])}      error={t(['newGarage', 'invalidCountry'])}     value={state.state}       placeholder={t(['newGarage', 'statePlaceholder'])} />
              <Input onChange={actions.setCountry}    onBlur={()=>{geocode()}} label={t(['newGarage', 'country'])}    error={t(['newGarage', 'invalidState'])}       value={state.country}     placeholder={t(['newGarage', 'countryPlaceholder'])}    highlight={state.highlight}/>
              <div className={styles.inline}>
                <Input style={styles.latLngInputWidth+" "+styles.rightMargin} onChange={actions.setLat} label={t(['newGarage', 'lat'])} error={t(['newGarage', 'invalidLat'])} value={state.lat} placeholder={t(['newGarage', 'latPlaceholder'])} />
                <Input style={styles.latLngInputWidth}                        onChange={actions.setLng} label={t(['newGarage', 'lng'])} error={t(['newGarage', 'invalidLng'])} value={state.lng} placeholder={t(['newGarage', 'lngPlaceholder'])} />
              </div>
            </div>
            <div className={styles.imageSelector}>
              <h2>{t(['newGarage', 'garagePicture'])}</h2>
              <img src={state.img}/>
              <div>
                <input type='file' ref='fileSelector' onChange={handleFileSelect}/>
                <RoundButton content={<span className='fa fa-file-text-o' aria-hidden="true"></span>} onClick={()=>{this.refs.fileSelector.click()}} type={state.img===defaultImage ? 'action' : 'confirm'} />
                {/*<CallToActionButton label={t(['newGarage', 'selectImage'])} onClick={()=>{this.refs.fileSelector.click()}} />*/}
              </div>
            </div>
          </div>
        </Form>
      </GarageSetupPage>
    )
  }
}

export default connect(
  state    => ({ state: state.garageSetup }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupGeneralPage)
