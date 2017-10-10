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
import DatetimeInput      from '../../_shared/components/input/DatetimeInput'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as newContractActions  from '../../_shared/actions/newContract.actions'
import { MOMENT_DATETIME_FORMAT } from '../../_shared/helpers/time'

import styles from './newContract.page.scss'


class NewContractPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.eraseForm()
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initContract( this.props.params.contract_id )
  }

  componentDidMount(){
    (this.props.params.contract_id || this.props.pageBase.garage) && this.props.actions.initContract( this.props.params.contract_id )
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
      return { label: rent.name, onClick: actions.setRent.bind(this, rent) }
    }

    const selectedClient = state.client_id ? state.clients.findIndex(c => state.client_id === c.id) : -1
    const selectedCurrency = state.currency_id ? state.currencies.findIndex(currency => state.currency_id === currency.id) : -1
    const selectedRent = state.rent ? state.rents.findIndex(rent => state.rent.id === rent.id) : -1

    const makeButton = (place, index) => <CallToActionButton label={place.label} onClick={() => {state.garage && state.garage.is_admin && actions.removePlace(index)}}/>

    const placeSelected = (floor) => {
      floor.places.map((place) => {
        place.selected = (state.places.find(selectedPlace => selectedPlace.id === place.id) !== undefined)
        return place
      })
      return floor
    }

    const handleFrom = (value, valid) => { valid && actions.setFrom(value) }
    const handleTo   = (value, valid) => { valid && actions.setTo(value) }

    const checkSubmitable = () => {
      if (state.client_id === undefined) return false
      if (state.from === undefined||state.from === '') return false
      if (state.places.length == 0) return false
      if ((!state.newRent && state.rent === undefined) || (state.rent && state.rent.id === undefined)) return false
      if (state.newRent && (state.price === undefined || state.price <= 0 || state.currency_id === undefined)) return false

      return true
    }

    return (
      <PageBase>
        <div className={styles.flex}>
          <div className={styles.half}>
            <Form onSubmit={state.garage && state.garage.is_admin ? submitForm : goBack} submitable={checkSubmitable()} onBack={goBack} onHighlight={actions.toggleHighlight}>
              <h2>{state.garage && `${state.garage.is_admin ? t(['newContract', state.contract_id ? 'edit' : 'description']) : t(['newContract', 'yourContract'])} ${state.garage.name}`}</h2>
              { state.garage && state.garage.is_admin && (state.addClient ?
                <div className={styles.twoButtons}>
                  <PatternInput onChange={actions.setClientToken} label={t(['newContract', 'selectClient'])} error={t(['newContract', 'invalidToken'])} type='text' placeholder={t(['newContract', 'tokenPlaceholder'])} value={state.client_token ? state.client_token : ''} highlight={state.highlight}/>
                  <RoundButton content={<i className='fa fa-check' aria-hidden="true"></i>} onClick={actions.addClient} type='confirm'/>
                  <RoundButton content={<i className='fa fa-times' aria-hidden="true"></i>} onClick={actions.toggleAddClient} type='remove'/>
                </div> :
                <div className={styles.oneButton}>
                  <Dropdown label={t(['newContract', 'selectClient'])} content={state.clients.map(prepareClients)} style='light' selected={selectedClient} highlight={state.highlight}/>
                  <RoundButton content={<i className='fa fa-plus' aria-hidden="true"></i>} onClick={actions.toggleAddClient} type='action'/>
                </div>)
              }

              <div>
                <div>{t(['newContract', 'selectedPlaces'])}</div>
                {state.places.length ? state.places.map(makeButton) : <b className={state.highlight && styles.red}>{t(['newContract', 'noSelectedPlaces'])}</b>}
              </div>

              { state.garage && (state.garage.is_admin ? (state.newRent ?
                <div className={styles.oneButton}>
                  <Input onChange={actions.setContractPrice} label={t(['newContract', 'contractPrice'])} error={t(['newContract', 'priceInvalid'])} type='number' placeholder={t(['newContract', 'pricePlaceholder'])} value={state.price ? state.price : ''} min={0} highlight={state.highlight}/>
                  <Dropdown label={t(['newContract', 'selectCurrency'])} content={state.currencies.map(prepareCurrencies)} style='light' selected={selectedCurrency} highlight={state.highlight}/>
                  <RoundButton content={<i className='fa fa-times' aria-hidden="true"></i>} onClick={actions.toggleNewRent} type='remove'/>
                </div> :
                <div className={styles.oneButton}>
                  <Dropdown label={t(['newContract', 'selectRent'])} content={state.rents.map(prepareRents)} style='light' selected={selectedRent} highlight={state.highlight}/>
                  <RoundButton content={<i className='fa fa-plus' aria-hidden="true"></i>} onClick={actions.toggleNewRent} type='action'/>
                </div>) :
                <div> {t(['newContract', 'placePrice'])} {state.rent && `${Math.round(state.rent.price * 10) / 10} ${state.rent.currency.symbol}`} </div> )
              }
              {state.garage && state.garage.is_admin ?
                [ <DatetimeInput onChange={handleFrom} label={t(['newReservation', 'begins'])} error={t(['newReservation', 'invalidaDate'])} value={state.from} highlight={state.highlight} />
                , state.indefinitly ? null : <DatetimeInput onChange={handleTo}   label={t(['newReservation', 'ends'])}   value={state.to} />
                , <div className={styles.checkbox}>
                  <input type="checkbox" checked={state.indefinitly} onClick={actions.toggleIndefinitly}/>
                  <span onClick={actions.toggleIndefinitly}>{t(['newContract', 'indefinitContract'])}</span>
                </div>
                ] :
                <div>
                  <p>{t(['newReservation', 'begins'])}: {state.from}</p>
                  <p>{t(['newReservation', 'ends'])}: {state.indefinitly ? t(['newContract', 'indefinite']) : state.to}</p>
                </div>
              }
            </Form>
          </div>

          <div className={styles.half}>
            <GarageLayout floors={state.garage ? state.garage.floors.map(placeSelected) : []} showEmptyFloors={true} onPlaceClick={state.garage && state.garage.is_admin ? actions.selectPlace : ()=>{}}/>
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
