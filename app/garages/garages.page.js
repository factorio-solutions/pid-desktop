import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import update                          from 'react-addons-update'

import PageBase       from '../_shared/containers/pageBase/PageBase'
import Table          from '../_shared/components/table/Table'
import RoundButton    from '../_shared/components/buttons/RoundButton'
import ButtonStack    from '../_shared/components/buttonStack/ButtonStack'
import TextButton     from '../_shared/components/buttons/TextButton'
import CardViewLayout from '../_shared/components/cardView/CardViewLayout'
import GarageCard     from '../_shared/components/cardView/GarageCard'

import * as garagesActions    from '../_shared/actions/garages.actions'
import * as newGarageActions  from '../_shared/actions/newGarage.actions'
import * as pageBaseActions   from '../_shared/actions/pageBase.actions'
import * as occupancyActions  from '../_shared/actions/occupancy.actions'
import * as nav               from '../_shared/helpers/navigation'
import { t }                  from '../_shared/modules/localization/localization'

import styles from './garages.page.scss'


export class GaragesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object,
    newGarage:    PropTypes.object,
    pageBase:    PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initGarages()
  }

  render() {
    const { state, actions, newGarage, pageBase } = this.props

    const schema = [ { key: 'name',         title: t(['garages','name']),     comparator: 'string', representer: o => <strong> {o} </strong>, sort: 'asc' }
                   , { key: 'address',      title: t(['garages','address']),  comparator: 'string' }
                   , { key: 'place_count',  title: t(['garages','places']),   comparator: 'number' }
                   ]
    const pricingSchema = [ { key: 'name',         title: t(['garages','pricingName']), comparator: 'string', sort: 'asc' }
                          , { key: 'packages',     title: t(['garages','packages']),     comparator: 'string' }
                          , { key: 'place_count',  title: t(['garages','places']),      comparator: 'string' }
                          ]
    const rentSchema = [ { key: 'name',         title: t(['garages','rentName']), comparator: 'string', sort: 'asc' }
                       , { key: 'price',        title: t(['garages','price']),    comparator: 'string' }
                       , { key: 'place_count',  title: t(['garages','places']),   comparator: 'string' }
                       ]

    const garageClick = (garage) => {
      actions.setGarageId(garage.id)
      nav.to(`/occupancy`)
    }

    const newGarageClick = () => {
      newGarage.id != undefined && actions.clearForm()
      nav.to("/garages/newGarage")
    }

    const newPricingClick = () => { nav.to("/garages/pricings/newPricing") }
    const newRentClick = () => { nav.to("/garages/rents/newRent") }

    const editClick    = (garage) => { nav.to(`/garages/${garage.id}/newGarage`) }
    const destroyClick = (garage) => { actions.destroyGarage(garage.id) }
    const toClient     = (garage) => { nav.to(`/garages/${garage.id}/clients`) }
    const toMarketing  = (garage) => { nav.to(`/garages/${garage.id}/marketing`) }
    const toUsers      = (garage) => { nav.to(`/garages/${garage.id}/users`) }
    const editPricing  = (id)  => { nav.to(`/garages/pricings/${id}/edit`) }
    const editRent     = (id)  => { nav.to(`/garages/rents/${id}/edit`) }

    const prepareCards = (garage, index) => {
      return <GarageCard key={index} garage={garage} occupancy={()=>{garageClick(garage)}} edit={()=>{editClick(garage)}} client={()=>{toClient(garage)}} marketing={()=>{toMarketing(garage)}} />
    }

    const addSpoiler = (garage, index)=>{
      var spoiler = <div>
        <span>{t(['garages','created'])} {moment(garage.created_at).format('ddd DD.MM.YYYY HH:mm')}</span>
        <span className={styles.floatRight}>
          <RoundButton content={<span className='fa fa-eye' aria-hidden="true"></span>} onClick={()=>{garageClick(garage)}} type='action'/>
          <RoundButton content={<span className='fa fa-rocket' aria-hidden="true"></span>} onClick={()=>{toMarketing(garage)}} type='action'/>
          <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{editClick(garage)}} type='action'/>
          <RoundButton content={<span className='fa fa-users' aria-hidden="true"></span>} onClick={()=>{toClient(garage)}} type='action'/>
          <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={()=>{toUsers(garage)}} type='action'/>
          {/*<RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={()=>{destroyClick(garage)}} type='remove' state='disabled' question={t(['garages', 'removeGarageQuestion'])}/>*/}
        </span>
      </div>

      return update(garage, {spoiler:{$set: spoiler}, address: {$set: garage.address?[garage.address.line_1, garage.address.line_2, garage.address.city, garage.address.postal_code, garage.address.state, garage.address.country].filter((o)=>{return o != undefined}).join(', '):''}})
    }

    const preparePricing = (pricing, index) => {
      let spoiler = <div>
        <span className={styles.floatRight}>
          <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{editPricing(pricing.id)}} type='action'/>
        </span>
      </div>

      let packages = pricing.flat_price != null ? t(['newPricing','flatPrice']) + `: ${pricing.flat_price} ${pricing.currency.symbol}` : t(['newPricing','exponentialPrice']) + `: ${pricing.exponential_12h_price} - ${pricing.exponential_day_price} - ${pricing.exponential_week_price} - ${pricing.exponential_month_price} ${pricing.currency.symbol}`
      let weekends = pricing.weekend_price == null ? '' : `, ${t(['newPricing','weekendPrice'])}: ${pricing.weekend_price} ${pricing.currency.symbol}`

      return update(pricing, {spoiler:{$set: spoiler}, packages: {$set: packages + weekends}, place_count: {$set: pricing.place_count+''}})
    }

    const prepareRent = (rent, index) => {
      let spoiler = <div>
        <span className={styles.floatRight}>
          <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{editRent(rent.id)}} type='action'/>
        </span>
      </div>

      return update(rent, {spoiler:{$set: spoiler}, price: {$set: `${rent.price} ${rent.currency.symbol}`}, place_count: {$set: rent.place_count+''}})
    }

    const content = <div>
                      <div>
                        {state.tableView ? <Table schema={schema} data={state.garages.map(addSpoiler)} />
                          : <CardViewLayout columns={2}>
                              {state.garages.map(prepareCards)}
                            </CardViewLayout> }
                        <div className={styles.centerDiv}>
                          <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newGarageClick} type='action' size='big' />
                        </div>
                      </div>

                      {pageBase.current_user && pageBase.current_user.garage_admin &&
                        <div>
                          <h2>{t(['garages','reservationsPricing'])}</h2>
                          <Table schema={pricingSchema} data={state.pricings.map(preparePricing)} />
                          <div className={styles.centerDiv}>
                            <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newPricingClick} type='action' size='big' />
                          </div>
                        </div>
                      }

                      {pageBase.current_user && pageBase.current_user.garage_admin &&
                        <div>
                          <h2>{t(['garages','placeRent'])}</h2>
                          <Table schema={rentSchema} data={state.rents.map(prepareRent)} />
                          <div className={styles.centerDiv}>
                            <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newRentClick} type='action' size='big' />
                          </div>
                        </div>
                      }
                    </div>


    const filters= <div>
            <ButtonStack divider={<span>|</span>} style='horizontal' >
              <TextButton content={t(['pageBase','cardView'])} onClick={() => {actions.setTableView(false)}} state={!state.tableView && 'selected'}/>
              <TextButton content={t(['pageBase','tableView'])} onClick={() => {actions.setTableView(true)}} state={state.tableView && 'selected'}/>
            </ButtonStack>
          </div>

    return (
      <PageBase content={content} filters={filters} />
    )
  }
}

export default connect(
  state    => ({ state: state.garages, newGarage: state.newGarage, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(Object.assign({}, garagesActions, newGarageActions, pageBaseActions, occupancyActions), dispatch) })
)(GaragesPage)
