import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form               from '../../_shared/components/form/Form'
import Dropdown           from '../../_shared/components/dropdown/Dropdown'
import Input              from '../../_shared/components/input/Input'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import * as nav                                        from '../../_shared/helpers/navigation'
import { t }                                           from '../../_shared/modules/localization/localization'
import * as garageSetupActions                         from '../../_shared/actions/garageSetup.actions'
import {gsmModulePrice, layoutPrice, bookingPagePrice} from '../../_shared/reducers/garageSetup.reducer'
import styles from './garageSetupGeneral.page.scss'


export class GarageSetupSubscribtionPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  goBack = () => {
    if (this.props.params.id) {
      // TODO: cancel changes
      nav.to(`/${this.props.params.id}/admin/garageSetup/order`)
    } else {
      nav.to( '/addFeatures/garageSetup/order' )
    }
  }

  componentDidMount(){
    const { state, actions } = this.props

    if (state.gates.length === 0 || state.tarif_id === undefined){
      this.goBack()
    } else {
      state.gsm_line_1 === ''      && actions.setGsmLine1(state.line_1)
      state.gsm_line_2 === ''      && actions.setGsmLine2(state.line_2)
      state.gsm_city === ''        && actions.setGsmCity(state.city)
      state.gsm_postal_code === '' && actions.setGsmPostalCode(state.postal_code)
      state.gsm_state === ''       && actions.setGsmState(state.state)
      state.gsm_country === ''     && actions.setGsmCountry(state.country)
    }
  }

  render() {
    const { state, actions } = this.props

    const onTarifSelected = (index) => { actions.setTarif(state.availableTarifs[index].id) }
    const tarifSelected = state.availableTarifs.find(tarif => state.tarif_id === tarif.id)
    const tarifDropdown = state.availableTarifs.map((tarif, index) => {return {label: `${t(['addFeatures',tarif.name])} - ${tarif.price} ${tarif.currency.symbol}`, onClick: onTarifSelected.bind(this, index) }})
    const goBack = () => { this.goBack() }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const submitForm = () => {
      actions.submitGarage()
    }

    const countPlaces = () => {
      return state.floors.reduce((placeCount, floor) => {
        return placeCount + floor.places.length
      }, 0)
    }

    const countMonthlyPrice = () => {
      return tarifSelected ? (tarifSelected.price * countPlaces() + (state.bookingPage? bookingPagePrice : 0 )) : 0
    }

    const countNowPrice = () => {
      return (state.gsmModules * gsmModulePrice) + (state.orderLayout  ? layoutPrice * state.floors.length : 0)
    }

    const checkSubmitable = () => {
      if(state.gsmModules < 1) return true // no modules, no address needed
      if (state.gsm_name === '' || state.gsm_name === undefined) return false
      if (state.gsm_line_1 === '' || state.gsm_line_1 === undefined) return false
      if (state.gsm_city === '' || state.gsm_city === undefined) return false
      if (state.gsm_postal_code === '' || state.gsm_postal_code === undefined) return false
      if (state.gsm_country === '' || state.gsm_country === undefined) return false
    }

    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={checkSubmitable} onBack={goBack} onHighlight={hightlightInputs}>
          <div className={styles.subscribtion}>
            <h2>{t(['newGarage', 'subscribtion'])}</h2>
            <div className={styles.row}>
              <div>{t(['newGarage', 'tarif'])}</div>
              <div><Dropdown label={t(['newGarage', 'selectTarif'])} content={tarifDropdown} style='light' selected={state.availableTarifs.findIndex((tarif)=>{return tarif.id == state.tarif_id})} highlight={state.highlight}/></div>
            </div>
            <div className={styles.row}>
              <div>{t(['newGarage', 'summaryPlace'])}</div>
              <div>{countPlaces()}</div>
            </div>
            <div className={styles.row}>
              <div>{state.gsmModules} {t(['newGarage', 'gsmModulesCount'], {count: state.gsmModules})}:</div>
              <div className={styles.checkbox}>{state.gsmModules * gsmModulePrice} {tarifSelected && tarifSelected.currency.symbol}</div>
            </div>
            <div className={styles.row}>
              <div>{t(['newGarage', 'customLayout'])}</div>
              <div className={styles.checkbox}><input type="checkbox" checked={state.orderLayout} onChange={actions.toggleOrderLayout}/> <span onClick={actions.toggleOrderLayout}> {layoutPrice} {tarifSelected && tarifSelected.currency.symbol} {t(['newGarage', 'perLevel'])}</span></div>
            </div>
            <div className={styles.row}>
              <div>{t(['newGarage', 'bookingPage'])}</div>
              <div className={styles.checkbox}><input type="checkbox" checked={state.bookingPage} onChange={actions.toggleBookingPage}/> <span onClick={actions.toggleBookingPage}> {bookingPagePrice} {tarifSelected && tarifSelected.currency.symbol} {t(['newGarage', 'perMonth'])}</span></div>
            </div>
            { state.gsmModules > 0 && <div className={styles.row}>
              <div>{t(['newGarage', 'gsmModuleShippingAddress'])}</div>
              <div>
                <Input onChange={actions.setGsmName}       label={t(['newGarage', 'gsmName'])}    error={t(['newGarage', 'gsmNameInvalid'])}     value={state.gsm_name}        placeholder={t(['newGarage', 'gsmNamePlaceholder'])}    highlight={state.highlight}/>
                <Input onChange={actions.setGsmLine1}      label={t(['newGarage', 'street'])}     error={t(['newGarage', 'invalidStreet'])}      value={state.gsm_line_1}      placeholder={t(['newGarage', 'cityPlaceholder'])}       highlight={state.highlight}/>
                <Input onChange={actions.setGsmLine2}      label={t(['addresses', 'line2'])}      error={t(['addresses', 'line2Invalid'])}       value={state.gsm_line_2}      placeholder={t(['addresses', 'line2Placeholder'])}/>
                <Input onChange={actions.setGsmCity}       label={t(['newGarage', 'city'])}       error={t(['newGarage', 'invalidCity'])}        value={state.gsm_city}        placeholder={t(['newGarage', 'cityPlaceholder'])}       highlight={state.highlight}/>
                <Input onChange={actions.setGsmPostalCode} label={t(['newGarage', 'postalCode'])} error={t(['newGarage', 'invalidPostalCode'])}  value={state.gsm_postal_code} placeholder={t(['newGarage', 'postalCodePlaceholder'])} highlight={state.highlight}/>
                <Input onChange={actions.setGsmState}      label={t(['newGarage', 'state'])}      error={t(['newGarage', 'invalidCountry'])}     value={state.gsm_state}       placeholder={t(['newGarage', 'statePlaceholder'])} />
                <Input onChange={actions.setGsmCountry}    label={t(['newGarage', 'country'])}    error={t(['newGarage', 'invalidState'])}       value={state.gsm_country}     placeholder={t(['newGarage', 'countryPlaceholder'])}    highlight={state.highlight}/>
              </div>
            </div>}
            <div className={styles.row}>
              <div>{t(['newGarage', 'price'])}</div>
              <div>
                {countMonthlyPrice()} {tarifSelected && tarifSelected.currency.symbol} {t(['newGarage', 'perMonth'])}
                { countNowPrice()!=0 && ` + ${countNowPrice()} ${tarifSelected && tarifSelected.currency.symbol} ${t(['newGarage', 'now'])}`}
              </div>
            </div>
            {state.tarif_id === 1 && <p className={styles.marketing}>
              {t(['newGarage', 'betterTarifMarketing'])}
            </p>}
          </div>
        </Form>
      </GarageSetupPage>
    )
  }
}

export default connect(
  state    => ({ state: state.garageSetup }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupSubscribtionPage)
