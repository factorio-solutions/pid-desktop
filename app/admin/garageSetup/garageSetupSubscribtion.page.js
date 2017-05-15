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

    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={true} onBack={goBack} onHighlight={hightlightInputs}>
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
              <div>{t(['newGarage', 'bookingPage'])}</div>
              <div className={styles.checkbox}><input type="checkbox" checked={state.bookingPage} onChange={actions.toggleBookingPage}/> <span onClick={actions.toggleBookingPage}> {bookingPagePrice} {tarifSelected && tarifSelected.currency.symbol} {t(['newGarage', 'perMonth'])}</span></div>
            </div>
            <div className={styles.row}>
              <div>{t(['newGarage', 'price'])}</div>
              <div>
                {countMonthlyPrice()} {tarifSelected && tarifSelected.currency.symbol} {t(['newGarage', 'perMonth'])}
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