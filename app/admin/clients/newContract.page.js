import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout2'
import Form               from '../../_shared/components/form/Form'
import Dropdown           from '../../_shared/components/dropdown/Dropdown'
import PatternInput       from '../../_shared/components/input/PatternInput'
import Input              from '../../_shared/components/input/Input'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as newContractActions  from '../../_shared/actions/newContract.actions'

import styles from './newContract.page.scss'


export class NewContractPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initContract( this.props.params.contract_id )
  }

  componentDidMount(){
    this.props.pageBase.garage && this.props.actions.initContract( this.props.params.contract_id )
  }

  render() {
    const { state, pageBase, actions } = this.props

    const submitForm = () => { checkSubmitable() && actions.submitNewContract(this.props.params.contract_id) }
    const goBack     = () => {
      actions.eraseForm()
      nav.to(`/${pageBase.garage}/admin/clients`)
    }

    const prepareClients = (client, index) => {
      return { label: client.name, onClick: actions.setClient.bind(this, client.id) }
    }

    const prepareCurrencies = (currency, index) => {
      return { label: currency.code, onClick: actions.setCurrency.bind(this, currency.id) }
    }

    const prepareRents = (rent, index) => {
      return { label: rent.name, onClick: actions.setRent.bind(this, rent.id) }
    }

    const selectedClient = state.client_id ? state.clients.findIndex(c => state.client_id === c.id) : -1
    const selectedCurrency = state.currency_id ? state.currencies.findIndex(currency => state.currency_id === currency.id) : -1
    const selectedRent = state.rent_id ? state.rents.findIndex(rent => state.rent_id === rent.id) : -1

    const makeButton = (place, index) => <CallToActionButton label={place.label} onClick={() => {actions.removePlace(index)}}/>

    const placeSelected = (floor) => {
      floor.places.map((place) => {
        place.available = place.noContract && (state.places.find(selectedPlace => selectedPlace.id === place.id) === undefined)
        return place
      })
      return floor
    }


    const checkSubmitable = () => {
      if (state.client_id === undefined) return false
      if (state.places.length == 0) return false
      if (!state.newRent && state.rent_id === undefined) return false
      if (state.newRent && (state.price === undefined || state.price <= 0 || state.currency_id === undefined)) return false

      return true
    }

    return (
      <PageBase>
        <div className={styles.flex}>
          <div className={styles.half}>
            <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
              <h2>{state.garage && `${t(['newContract', 'description'])} ${state.garage.name}`}</h2>
              {state.addClient ?
                <div className={styles.twoButtons}>
                  <PatternInput onChange={actions.setClientToken} label={t(['newContract', 'selectClient'])} error={t(['newContract', 'invalidToken'])} type='text' placeholder={t(['newContract', 'tokenPlaceholder'])} value={state.client_token ? state.client_token : ''}/>
                  <RoundButton content={<i className='fa fa-check' aria-hidden="true"></i>} onClick={actions.addClient} type='confirm'/>
                  <RoundButton content={<i className='fa fa-times' aria-hidden="true"></i>} onClick={actions.toggleAddClient} type='remove'/>
                </div> :
                <div className={styles.oneButton}>
                  <Dropdown label={t(['newContract', 'selectClient'])} content={state.clients.map(prepareClients)} style='light' selected={selectedClient}/>
                  <RoundButton content={<i className='fa fa-plus' aria-hidden="true"></i>} onClick={actions.toggleAddClient} type='action'/>
                </div> }
                <div>
                  <div>{t(['newContract', 'selectedPlaces'])}</div>
                  {state.places.length ? state.places.map(makeButton) : t(['newContract', 'noSelectedPlaces'])}
                </div>

                { state.newRent ?
                  <div className={styles.oneButton}>
                    <Input onChange={actions.setContractPrice} label={t(['newContract', 'contractPrice'])} error={t(['newContract', 'priceInvalid'])} type='number' placeholder={t(['newContract', 'pricePlaceholder'])} value={state.price ? state.price : ''} min={0}/>
                    <Dropdown label={t(['newContract', 'selectCurrency'])} content={state.currencies.map(prepareCurrencies)} style='light' selected={selectedCurrency}/>
                    <RoundButton content={<i className='fa fa-times' aria-hidden="true"></i>} onClick={actions.toggleNewRent} type='remove'/>
                  </div> :
                  <div className={styles.oneButton}>
                    <Dropdown label={t(['newContract', 'selectRent'])} content={state.rents.map(prepareRents)} style='light' selected={selectedRent}/>
                    <RoundButton content={<i className='fa fa-plus' aria-hidden="true"></i>} onClick={actions.toggleNewRent} type='action'/>
                  </div>}
              {/*<div>
                <h2>{t(['newPricing', 'flatPrice'])}</h2>
                <PatternInput onChange={actions.setFlatPrice} label={t(['newPricing', 'flatPrice'])} error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])} value={pricing ? pricing.flat_price||'' : ''}/>
              </div>
              <div>
                <h2>{t(['newPricing', 'exponentialPrice'])}</h2>
                <PatternInput onChange={actions.setExponential12hPrice}   label={t(['newPricing', '12hPrice'])}   error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])}   value={pricing ? pricing.exponential_12h_price||'' : ''}  />
                <PatternInput onChange={actions.setExponentialDayPrice}   label={t(['newPricing', 'dayPrice'])}   error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])}   value={pricing ? pricing.exponential_day_price||'' : ''}  />
                <PatternInput onChange={actions.setExponentialWeekPrice}  label={t(['newPricing', 'weekPrice'])}  error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'minPlaceholder'])}   value={pricing ? pricing.exponential_week_price||'' : ''} />
                <PatternInput onChange={actions.setExponentialMonthPrice} label={t(['newPricing', 'monthPrice'])} error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'decayPlaceholder'])} value={pricing ? pricing.exponential_month_price||'' : ''}/>
              </div>

              <div>
                <h2>{t(['newPricing', 'weekendPrice'])}</h2>
                <PatternInput onChange={actions.setWeekendPricing} label={t(['newPricing', 'weekendPrice'])} error={t(['newPricing', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newPricing', 'maxPlaceholder'])} value={pricing ? pricing.weekend_price||'' : ''}/>
              </div>*/}
            </Form>
          </div>

          <div className={styles.half}>
            <GarageLayout floors={state.garage ? state.garage.floors.map(placeSelected) : []} showEmptyFloors={true} onPlaceClick={actions.selectPlace}/>
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.newContract, pageBase: state.pageBase }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(newContractActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(NewContractPage)
