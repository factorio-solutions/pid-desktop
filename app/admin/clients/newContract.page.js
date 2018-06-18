import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import GarageLayout       from '../../_shared/components/garageLayout/GarageLayout'
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

import styles from './newContract.page.scss'


class NewContractPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    params:   PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    (this.props.params.contract_id || this.props.pageBase.garage) && this.props.actions.initContract(this.props.params.contract_id)
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.eraseForm()
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initContract(this.props.params.contract_id)
  }

  checkSubmitable = () => {
    const { state } = this.props
    if (state.client_id === undefined) return false
    if (state.from === undefined || state.from === '') return false
    if (state.places.length === 0) return false
    if ((!state.newRent && state.rent === undefined) || (state.rent && state.rent.id === undefined)) return false
    if (state.newRent && (state.price === undefined || state.price <= 0 || state.currency_id === undefined)) return false

    return true
  }

  handleFrom = (value, valid) => valid && this.props.actions.setFrom(value)

  handleTo = (value, valid) => valid && this.props.actions.setTo(value)

  submitForm = () => this.checkSubmitable() && this.props.actions.submitNewContract(this.props.params.contract_id)

  goBack = () => {
    this.props.actions.eraseForm()
    nav.to(`/${this.props.pageBase.garage}/admin/clients`)
  }

  prepareClients = client => ({ label: client.name, onClick: () => this.props.actions.setClient(client.id) })

  prepareCurrencies = currency => ({ label: currency.code, onClick: () => this.props.actions.setCurrency(currency.id) })

  prepareRents = rent => ({ label: rent.name, onClick: () => this.props.actions.setRent(rent) })

  currentContractsFilter = contract => moment().isBetween(moment(contract.from), moment(contract.to))

  render() {
    const { state, actions } = this.props

    const selectedClient = state.client_id ? state.clients.findIndex(c => state.client_id === c.id) : -1
    const selectedCurrency = state.currency_id ? state.currencies.findIndex(currency => state.currency_id === currency.id) : -1
    const selectedRent = state.rent ? state.rents.findIndex(rent => state.rent.id === rent.id) : -1

    const makeButton = (place, index) => <CallToActionButton label={place.label} onClick={() => { state.garage && state.garage.is_admin && actions.removePlace(index) }} />

    const placeSelected = floor => ({
      ...floor,
      places: floor.places.map(place => ({
        ...place,
        group:    place.contracts.filter(this.currentContractsFilter).map(contract => contract.id),
        selected: (state.places.find(selectedPlace => selectedPlace.id === place.id) !== undefined),
        tooltip:  (<table className={styles.tooltip}>
          <tbody>
            <tr>
              <td>{t([ 'newContract', 'place' ])}</td>
              <td>{place.label}</td>
            </tr>
            <tr>
              <td>{t([ 'newContract', 'usedBy' ])}</td>
              <td>
                {state.garage.is_public && place.pricing && !place.contracts.length ?
                  t([ 'newContract', 'goPublic' ]) :
                  place.contracts
                    .filter(this.currentContractsFilter)
                    .map(contract => contract.client.name)
                    .filter((group, index, arr) => arr.indexOf(group) === index)
                    .join(', ')
                }
              </td>
            </tr>
            <tr>
              <td>{t([ 'newContract', 'rentyType' ])}</td>
              <td>
                {place.contracts.length ?
                  t([ 'newContract', 'longterm' ]) :
                  place.pricing ?
                    t([ 'newContract', 'shortterm' ]) :
                    ''
                }
              </td>
            </tr>
            <tr>
              <td>{t([ 'newContract', 'longtermPrice' ])}</td>
              <td>{
                place.contracts
                  .map(contract => `${contract.rent.price} ${contract.rent.currency.symbol}`)
                  .filter((group, index, arr) => arr.indexOf(group) === index)
                  .join(', ')
              }
              </td>
            </tr>
            <tr>
              <td>{t([ 'newContract', 'shorttermPrice' ])}</td>
              <td>
                <table className={styles.tooltip}>
                  <tbody>
                    {place.pricing && [
                      place.pricing.exponential_12h_price && [ t([ 'garages', '12HourPrice' ]), `${place.pricing.exponential_12h_price} ${place.pricing.currency.symbol}` ],
                      place.pricing.exponential_day_price && [ t([ 'garages', 'dayPrice' ]), `${place.pricing.exponential_day_price} ${place.pricing.currency.symbol}` ],
                      place.pricing.exponential_week_price && [ t([ 'garages', 'weekPrice' ]), `${place.pricing.exponential_week_price} ${place.pricing.currency.symbol}` ],
                      place.pricing.exponential_month_price && [ t([ 'garages', 'monthPrice' ]), `${place.pricing.exponential_month_price} ${place.pricing.currency.symbol}` ],
                      place.pricing.flat_price && [ t([ 'garages', 'flatPrice' ]), `${place.pricing.flat_price} ${place.pricing.currency.symbol}` ],
                      place.pricing.weekend_price && [ t([ 'garages', 'weekendPrice' ]), `${place.pricing.weekend_price} ${place.pricing.currency.symbol}` ]
                    ].filter(o => o).reduce((arr, o) => [ ...arr, <tr><td>{o[0]}</td><td>{o[1]}</td></tr> ], [])}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>)
      }))
    })

    return (
      <PageBase>
        <div className={styles.flex}>
          <div>
            <Form onSubmit={state.garage && state.garage.is_admin ? this.submitForm : this.goBack} submitable={this.checkSubmitable()} onBack={this.goBack} onHighlight={actions.toggleHighlight}>
              <h2>{state.garage && `${state.garage.is_admin ? t([ 'newContract', state.contract_id ? 'edit' : 'description' ]) : t([ 'newContract', 'yourContract' ])} ${state.garage.name}`}</h2>
              { state.garage && state.garage.is_admin && (state.addClient ?
                <div className={styles.twoButtons}>
                  <PatternInput
                    onChange={actions.setClientToken}
                    label={t([ 'newContract', 'selectClient' ]) + ' *'}
                    error={t([ 'newContract', 'invalidToken' ])}
                    type="text"
                    placeholder={t([ 'newContract', 'tokenPlaceholder' ])}
                    value={state.client_token ? state.client_token : ''}
                    highlight={state.highlight}
                  />
                  <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={actions.addClient} type="confirm" />
                  <RoundButton content={<i className="fa fa-times" aria-hidden="true" />} onClick={actions.toggleAddClient} type="remove" />
                </div> :
                <div className={styles.oneButton}>
                  <Dropdown label={t([ 'newContract', 'selectClient' ]) + ' *'} content={state.clients.map(this.prepareClients)} style="light" selected={selectedClient} highlight={state.highlight} />
                  <RoundButton content={<i className="fa fa-plus" aria-hidden="true" />} onClick={actions.toggleAddClient} type="action" />
                </div>)
              }

              <div>
                <div>{t([ 'newContract', 'selectedPlaces' ]) + ' *'}</div>
                {state.places.length ? state.places.map(makeButton) : <b className={state.highlight && styles.red}>{t([ 'newContract', 'noSelectedPlaces' ])}</b>}
              </div>

              { state.garage && (state.garage.is_admin ? (state.newRent ?
                <div className={styles.oneButton}>
                  <Input
                    onChange={actions.setContractPrice}
                    label={t([ 'newContract', 'contractPrice' ]) + ' *'}
                    error={t([ 'newContract', 'priceInvalid' ])}
                    type="number"
                    placeholder={t([ 'newContract', 'pricePlaceholder' ])}
                    value={state.price ? state.price : ''}
                    min={0}
                    highlight={state.highlight}
                  />
                  <Dropdown
                    label={t([ 'newContract', 'selectCurrency' ]) + ' *'}
                    content={state.currencies.map(this.prepareCurrencies)}
                    style="light"
                    selected={selectedCurrency}
                    highlight={state.highlight}
                  />
                  <RoundButton content={<i className="fa fa-times" aria-hidden="true" />} onClick={actions.toggleNewRent} type="remove" />
                </div> :
                <div className={styles.oneButton}>
                  <Dropdown label={t([ 'newContract', 'selectRent' ])} content={state.rents.map(this.prepareRents)} style="light" selected={selectedRent} highlight={state.highlight} />
                  <RoundButton content={<i className="fa fa-plus" aria-hidden="true" />} onClick={actions.toggleNewRent} type="action" />
                </div>) :
                <div> {t([ 'newContract', 'placePrice' ])} {state.rent && `${Math.round(state.rent.price * 10) / 10} ${state.rent.currency.symbol}`} </div>)
              }
              {state.garage && state.garage.is_admin ?
              [ <DatetimeInput onChange={this.handleFrom} label={t([ 'newReservation', 'begins' ])} error={t([ 'newReservation', 'invalidaDate' ])} value={state.from} highlight={state.highlight} />,
                state.indefinitly ? null : <DatetimeInput onChange={this.handleTo} label={t([ 'newReservation', 'ends' ])} value={state.to} />,
                <div className={styles.checkbox}>
                  <input type="checkbox" checked={state.indefinitly} onClick={actions.toggleIndefinitly} />
                  <span onClick={actions.toggleIndefinitly}>{t([ 'newContract', 'indefinitContract' ])}</span>
                </div>,
                <div>
                  <Input
                    type="number"
                    label={`${t([ 'newContract', 'securityInterval' ])} ${t([ 'newContract', 'inMinutes' ])}`}
                    error={t([ 'newContract', 'securityIntervalInvalid' ])}
                    placeholder="15"
                    min={0}
                    max={60}
                    step={1}
                    highlight={state.highlight}
                    onChange={actions.setSecurityInterval}
                    value={state.securityInterval || '0'}
                  />
                </div>
              ] :
              <div>
                <p>{t([ 'newReservation', 'begins' ])}: {state.from}</p>
                <p>{t([ 'newReservation', 'ends' ])}: {state.indefinitly ? t([ 'newContract', 'indefinite' ]) : state.to}</p>
                <p>{t([ 'newContract', 'securityInterval' ])}: {state.securityInterval}</p>
              </div>
              }
            </Form>
          </div>

          <div>
            <GarageLayout floors={state.garage ? state.garage.floors.map(placeSelected) : []} showEmptyFloors onPlaceClick={state.garage && state.garage.is_admin ? actions.selectPlace : () => {}} />
          </div>
        </div>
      </PageBase>
    )
  }
}


export default connect(
  state => ({ state: state.newContract, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(newContractActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(NewContractPage)
