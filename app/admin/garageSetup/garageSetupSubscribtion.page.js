import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form               from '../../_shared/components/form/Form'
import Dropdown           from '../../_shared/components/dropdown/Dropdown'
import Input              from '../../_shared/components/input/Input'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import * as nav                                        from '../../_shared/helpers/navigation'
import { t }                                           from '../../_shared/modules/localization/localization'
import * as garageSetupActions                         from '../../_shared/actions/garageSetup.actions'
import { gsmModulePrice, layoutPrice, bookingPagePrice } from '../../_shared/reducers/garageSetup.reducer'
import styles from './garageSetupGeneral.page.scss'


class GarageSetupSubscribtionPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    params:  PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    const { state } = this.props
    if (state.gates.length === 0 || state.tarif_id === undefined) {
      this.goBack()
    }
  }

  goBack = () => {
    if (this.props.params.id) {
      nav.to(`/${this.props.params.id}/admin/garageSetup/order`)
    } else {
      nav.to('/addFeatures/garageSetup/order')
    }
  }

  render() {
    const { state, actions } = this.props

    const onTarifSelected = index => actions.setTarif(state.availableTarifs[index].id)
    const hightlightInputs = () => actions.toggleHighlight()
    const submitForm = () => actions.submitGarage()
    const tarifSelected = state.availableTarifs.find(tarif => state.tarif_id === tarif.id)
    const tarifDropdown = state.availableTarifs.map((tarif, index) => ({
      label:   `${t([ 'addFeatures', tarif.name ])} - ${tarif.price} ${tarif.currency.symbol}`,
      onClick: onTarifSelected.bind(this, index)
    }))

    const countPlaces = () => state.floors.reduce((placeCount, floor) => placeCount + floor.places.length, 0)
    const countMonthlyPrice = () => tarifSelected ? (tarifSelected.price * countPlaces() + (state.bookingPage ? bookingPagePrice : 0)) : 0

    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable onBack={this.goBack} onHighlight={hightlightInputs}>
          <div className={styles.subscribtion}>
            <h2>{t([ 'newGarage', 'subscribtion' ])}</h2>
            <div className={styles.row}>
              <div>{t([ 'newGarage', 'tarif' ])}</div>
              <div>
                <Dropdown
                  placeholder={t([ 'newGarage', 'selectTarif' ])}
                  content={tarifDropdown}
                  style="light"
                  selected={state.availableTarifs.findIndex(tarif => tarif.id === state.tarif_id)}
                  highlight={state.highlight}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div>{t([ 'newGarage', 'summaryPlace' ])}</div>
              <div>{countPlaces()}</div>
            </div>
            <div className={styles.row}>
              <div>{t([ 'newGarage', 'bookingPage' ])}</div>
              <div className={styles.checkbox}>
                <input type="checkbox" checked={state.bookingPage} onChange={actions.toggleBookingPage} />
                <span onClick={actions.toggleBookingPage}>
                  {bookingPagePrice} {tarifSelected && tarifSelected.currency.symbol} {t([ 'newGarage', 'perMonth' ])}
                </span>
              </div>
            </div>
            <div className={styles.row}>
              <div>{t([ 'newGarage', 'price' ])}</div>
              <div>
                {countMonthlyPrice()} {tarifSelected && tarifSelected.currency.symbol} {t([ 'newGarage', 'perMonth' ])}
              </div>
            </div>
            {state.tarif_id === 1 && <p className={styles.marketing}>
              {t([ 'newGarage', 'betterTarifMarketing' ])}
            </p>}
          </div>
        </Form>
      </GarageSetupPage>
    )
  }
}

export default connect(
  state => ({ state: state.garageSetup }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupSubscribtionPage)
