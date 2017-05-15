import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase        from '../_shared/containers/pageBase/PageBase'
// import RoundTextButton from '../_shared/components/buttons/RoundTextButton'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'

import styles                                            from './addFeatures.page.scss'
import * as nav                                          from '../_shared/helpers/navigation'
import { t }                                             from '../_shared/modules/localization/localization'
import * as addFeaturesActions                           from '../_shared/actions/addFeatures.actions'
import { gsmModulePrice, layoutPrice, bookingPagePrice } from '../_shared/reducers/garageSetup.reducer'


export class AddFeaturesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initTarifs()
  }

  render() {
    const {state, actions} = this.props

    const longtermClick     = () => { actions.tarifSelected(1) }
    const automationClick   = () => { actions.tarifSelected(2) }
    const integrationClick  = () => { actions.tarifSelected(3) }
    const customClick       = () => { location.href='mailto:support@park-it-direct.com' }
    const bookingPageClick  = () => { console.log('bookingClick');}
    const gateModuleClick   = () => { nav.to('/addFeatures/gateModuleOrder') }
    const accountClick      = () => { nav.to('/accounts/newAccount') }
    const clientClick       = () => { nav.to('/clients/newClient') }

    const automationTarif = state.tarifs.find((tarif)=>{return tarif.name == 'Automation'})
    const integrationTarif = state.tarifs.find((tarif)=>{return tarif.name == 'Integration'})

    return (<PageBase>
      <div>
        <h2>{t(['addFeatures', 'ImGarageOwner'])}</h2>
        <div className={styles.pricings}>
          <div className={styles.pricing} onClick={longtermClick}>
            <h3>{t(['addFeatures', 'LongTerm'])}</h3>
            <ul className={styles.points}>
              <li>{t(['addFeatures', 'canAddGarage'])}</li>
              <li>{t(['addFeatures', 'users'])}</li>
              <li>{t(['addFeatures', 'reservations'])}</li>
              <li>{t(['addFeatures', 'saveContracts'])}</li>
              <li>{t(['addFeatures', 'hosts'])}</li>
              <li>{t(['addFeatures', 'occupancy'])}</li>
              <li>{t(['addFeatures', 'notifications'])}</li>
            </ul>
            <div className={styles.button}>
              <CallToActionButton onClick={longtermClick} label={t(['addFeatures', 'free'])} type="action" />
            </div>
          </div>

          <div className={styles.pricing} onClick={automationClick}>
            <h3>{t(['addFeatures', 'Automation'])}</h3>
            <ul className={styles.points}>
              <li>{t(['addFeatures', 'LongTerm'])} +</li>
              <li>{t(['addFeatures', 'accessFeature'])}</li>
              <li>{t(['addFeatures', 'acceptPayments'])}</li>
              <li>{t(['addFeatures', 'issueTracking'])}</li>
              <li>{t(['addFeatures', 'visitors'])}</li>
              <li>{t(['addFeatures', 'security'])}</li>
              <li>{t(['addFeatures', 'analytics'])}</li>
            </ul>
            <div className={styles.button}>
              <CallToActionButton onClick={automationClick} label={<span>{automationTarif && automationTarif.price} {automationTarif && automationTarif.currency.symbol} {t(['addFeatures', 'perSpot'])}{t(['addFeatures', 'perMonth'])}</span>} type="action" />
            </div>
          </div>

          <div className={styles.pricing} onClick={integrationClick}>
            <h3>{t(['addFeatures', 'Integration'])}</h3>
            <ul className={styles.points}>
              <li>{t(['addFeatures', 'Automation'])} +</li>
              <li>{t(['addFeatures', '3rdParty'])}</li>
              <li>{t(['addFeatures', 'advancedAnalytics'])}</li>
            </ul>
            <div className={styles.button}>
              <CallToActionButton onClick={integrationClick} label={<span>{integrationTarif && integrationTarif.price} {integrationTarif && integrationTarif.currency.symbol} {t(['addFeatures', 'perSpot'])}{t(['addFeatures', 'perMonth'])}</span>} type="action" />
            </div>
          </div>

          <div className={styles.pricing} onClick={customClick}>
            <h3>{t(['addFeatures', 'custom'])}</h3>
            <ul className={styles.points}>
              <li>{t(['addFeatures', 'customDesc'])}</li>
            </ul>
            <div className={styles.button}>
              <CallToActionButton onClick={customClick} label={t(['addFeatures', 'customPrice'])} type="action" />
            </div>
          </div>
        </div>


        <h2>{t(['addFeatures', 'additionalGoods'])}</h2>
        <div className={styles.pricings}>
          {/*<div className={styles.pricing} onClick={bookingPageClick}>
            <h3>{t(['addFeatures', 'bookingPage'])}</h3>
            <ul className={styles.points}>
              <li>{t(['addFeatures', 'advertisement'])}</li>
            </ul>
            <div className={styles.button}>
              <CallToActionButton onClick={bookingPageClick} label={<span>{bookingPagePrice} Kč {t(['addFeatures', 'perMonth'])}</span>} type="disabled" />
            </div>
          </div>*/}

          <div className={styles.pricing} onClick={gateModuleClick}>
            <h3>{t(['addFeatures', 'gateModule'])}</h3>
            <ul className={styles.points}>
              <li>{t(['addFeatures', 'openGate'])}</li>
            </ul>
            <div className={styles.button}>
              <CallToActionButton onClick={gateModuleClick} label={<span>{gsmModulePrice} Kč</span>} type="disabled" />
            </div>
          </div>
        </div>


        {/*<h2>{t(['addFeatures', 'IdontHaveAccout'])}</h2>
        <div className={styles.pricings}>
          <div className={styles.pricing} onClick={accountClick}>
            <h3>{t(['addFeatures', 'createAccount'])}</h3>
            <ul className={styles.points} />
            <div className={styles.button}>
              <CallToActionButton onClick={accountClick} label={t(['addFeatures', 'createAccount'])} type="action" />
            </div>
          </div>
        </div>*/}


        <h2>{t(['addFeatures', 'IamGarageClient'])}</h2>
        <div className={styles.pricings}>
          <div className={styles.pricing} onClick={clientClick}>
            <h3>{t(['addFeatures', 'createClient'])}</h3>
            <ul className={styles.points} />
            <div className={styles.button}>
              <CallToActionButton onClick={clientClick} label={t(['addFeatures', 'createClient'])} type="action" />
            </div>
          </div>
        </div>
      </div>
    </PageBase>)
  }
}

export default connect(
  state    => ({ state: state.addFeatures }),
  dispatch => ({ actions: bindActionCreators(addFeaturesActions, dispatch) })
)(AddFeaturesPage)
