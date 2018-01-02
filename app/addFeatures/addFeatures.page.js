import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'
import FeatureCard        from '../_shared/components/featureCard/FeatureCard'

import * as nav                                          from '../_shared/helpers/navigation'
import { t }                                             from '../_shared/modules/localization/localization'
import * as addFeaturesActions                           from '../_shared/actions/addFeatures.actions'
import { gsmModulePrice, layoutPrice, bookingPagePrice } from '../_shared/reducers/garageSetup.reducer'

import styles from './addFeatures.page.scss'


// export const automationAndAccess
// export const Integrations
// export const custom

class AddFeaturesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount() {
    this.props.state.tarifs.length === 0 && this.props.actions.initTarifs()
  }

  render() {
    const {state, pageBase, actions} = this.props

    const longtermClick     = () => { actions.tarifSelected(1) }
    const automationClick   = () => { actions.tarifSelected(2) }
    const integrationClick  = () => { actions.tarifSelected(3) }
    const customClick       = () => { location.href='mailto:support@park-it-direct.com' }
    const bookingPageClick  = () => { console.log('bookingClick');}
    const gateModuleClick   = () => { nav.to('/addFeatures/gateModuleOrder') }
    const accountClick      = () => { nav.to('/accounts/newAccount') }
    const clientClick       = () => { nav.to(`/${pageBase.garage}/admin/clients/newClient`) }


    const automationTarif = state.tarifs.find((tarif)=>{return tarif.name == 'Automation'})
    const integrationTarif = state.tarifs.find((tarif)=>{return tarif.name == 'Integration'})

    return (<PageBase>
      <div>
        <h2>{t(['addFeatures', 'ImGarageOwner'])}</h2>

        <div className={styles.pricings}>
          <FeatureCard {...addFeaturesActions.prepareLongTermOrPersonal()} onClick={longtermClick} />

          <FeatureCard {...addFeaturesActions.prepareAutomationAndAccess(state)} onClick={automationClick} />

          <FeatureCard {...addFeaturesActions.prepareIntegrations(state)} onClick={integrationClick} />

          <FeatureCard {...addFeaturesActions.prepareCustom()} />
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

          <FeatureCard {...addFeaturesActions.prepareGateModule()} onClick={gateModuleClick} />
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
  state    => ({ state: state.addFeatures, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(addFeaturesActions, dispatch) })
)(AddFeaturesPage)
