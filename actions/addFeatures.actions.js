import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'
import { t }       from '../modules/localization/localization'

import { setTarif, clearForm }   from './garageSetup.actions'
import { GET_TARIFS } from '../queries/addFeatures.queries'

import { gsmModulePrice } from '../reducers/garageSetup.reducer'


export const ADD_FEATURES_SET_TARIFS = "ADD_FEATURES_SET_TARIFS"


export function setTarifs(value){
  return { type: ADD_FEATURES_SET_TARIFS
         , value
         }
}


export function initTarifs(){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setTarifs(response.data.tarifs))
    }

    request(onSuccess, GET_TARIFS)
  }
}

export function tarifSelected (id){
  return (dispatch, getState) => {
    // getState().garageSetup.id && 
    dispatch(clearForm())
    dispatch(setTarif(id))
    nav.to('/addFeatures/garageSetup/general')
  }
}

export function prepareLongTermOrPersonal () {
  return { title: t(['addFeatures', 'LongTerm'])
         , items: [ t(['addFeatures', 'canAddGarage'])
                  , t(['addFeatures', 'users'])
                  , t(['addFeatures', 'reservations'])
                  , t(['addFeatures', 'saveContracts'])
                  , t(['addFeatures', 'hosts'])
                  , t(['addFeatures', 'occupancy'])
                  , t(['addFeatures', 'notifications'])
                  ]
         , buttonLabel: t(['addFeatures', 'free'])
         }
}

export function prepareAutomationAndAccess (state) {
  const automationTarif = state.tarifs.find((tarif)=>{return tarif.name == 'Automation'})
  return { title: t(['addFeatures', 'Automation'])
         , items: [ t(['addFeatures', 'LongTerm'])+' +'
                  , t(['addFeatures', 'accessFeature'])
                  , t(['addFeatures', 'acceptPayments'])
                  , t(['addFeatures', 'issueTracking'])
                  , t(['addFeatures', 'visitors'])
                  , t(['addFeatures', 'security'])
                  , t(['addFeatures', 'analytics'])
                  ]
         , buttonLabel: <span>{automationTarif && automationTarif.price} {automationTarif && automationTarif.currency.symbol} {t(['addFeatures', 'perSpot'])}{t(['addFeatures', 'perMonth'])}</span>
         }
}

export function prepareIntegrations (state) {
  const integrationTarif = state.tarifs.find((tarif)=>{return tarif.name == 'Integration'})
  return { title: t(['addFeatures', 'Integration'])
         , items: [ t(['addFeatures', 'Automation'])
                  , t(['addFeatures', '3rdParty'])
                  , t(['addFeatures', 'advancedAnalytics'])
                  ]
         , buttonLabel: <span>{integrationTarif && integrationTarif.price} {integrationTarif && integrationTarif.currency.symbol} {t(['addFeatures', 'perSpot'])}{t(['addFeatures', 'perMonth'])}</span>
         }
}

export function prepareCustom () {
  return { title: t(['addFeatures', 'custom'])
         , items: [ t(['addFeatures', 'customDesc']) ]
         , buttonLabel: t(['addFeatures', 'customPrice'])
         , onClick: () => { location.href='mailto:support@park-it-direct.com' }
         }
}

export function prepareGateModule() {
  return { title: t(['addFeatures', 'gateModule'])
         , items: [ t(['addFeatures', 'openGate']) ]
         , buttonLabel: <span>{gsmModulePrice} Kč</span>
         }
}
