import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import update                          from 'react-addons-update'

import PageBase       from '../_shared/containers/pageBase/PageBase'
import Table          from '../_shared/components/Table/Table'
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
    newGarage:    PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initGarages()
  }

  render() {
    const { state, actions, newGarage } = this.props

    const schema = [ { key: 'name',         title: t(['garages','name']),     comparator: 'string', representer: o => <strong> {o} </strong>, sort: 'asc' }
                   , { key: 'address',      title: t(['garages','address']),  comparator: 'string' }
                   , { key: 'place_count',  title: t(['garages','places']),   comparator: 'number' }
                   ]

   const garageClick = (garage) => {
     actions.setGarageId(garage.id)
     nav.to(`/occupancy`)
   }
   const editClick = (garage) => {
     nav.to(`/garages/${garage.id}/newGarage`)
   }
   const toAccount = (garage) => {
     nav.to(`/garages/${garage.id}/accounts`)
     actions.setHorizontalSelected(1)
   }
   const destroyClick = (garage) => {
     actions.destroyGarage(garage.id)
   }

    const addSpoiler = (garage, index)=>{
      var spoiler = <div>
        <span>{t(['garages','created'])} {moment(garage.created_at).format('ddd DD.MM.YYYY HH:mm')}</span>
        <span className={styles.floatRight}>
          <RoundButton content={<span className='fa fa-eye' aria-hidden="true"></span>} onClick={()=>{garageClick(garage)}} type='action'/>
          <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{editClick(garage)}} type='action'/>
          <RoundButton content={<span className='fa fa-users' aria-hidden="true"></span>} onClick={()=>{toAccount(garage)}} type='action'/>
          {/*<RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={()=>{destroyClick(garage)}} type='remove' state='disabled' question={t(['garages', 'removeGarageQuestion'])}/>*/}
        </span>
      </div>


      return update(garage, {spoiler:{$set: spoiler}})
    }

    const newGarageClick = () => {
      newGarage.id != undefined && actions.clearForm()
      nav.to("/garages/newGarage")
    }


    const prepareCards = (garage, index) => {
      return <GarageCard key={index} garage={garage} occupancy={()=>{garageClick(garage)}} edit={()=>{editClick(garage)}} account={()=>{toAccount(garage)}} />
    }

    const content = <div>
                      {state.tableView ? <Table schema={schema} data={state.garages.map(addSpoiler)} />
                        : <CardViewLayout columns={2}>
                            {state.garages.map(prepareCards)}
                          </CardViewLayout> }
                      <div className={styles.centerDiv}>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newGarageClick} type='action' size='big' />
                      </div>
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


export default connect(state => {
  const { garages, newGarage } = state
  return ({
    state: garages,
    newGarage: newGarage
  })
}, dispatch => ({
  actions: bindActionCreators(Object.assign({}, garagesActions, newGarageActions, pageBaseActions, occupancyActions), dispatch)
}))(GaragesPage)
