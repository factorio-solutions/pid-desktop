import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Table            from '../_shared/components/Table/Table'
import RoundButton      from '../_shared/components/buttons/RoundButton'
import ButtonStack      from '../_shared/components/buttonStack/ButtonStack'
import TextButton       from '../_shared/components/buttons/TextButton'
import CardViewLayout   from '../_shared/components/cardView/CardViewLayout'
import ReservationCard  from '../_shared/components/cardView/ReservationCard'


import styles from './reservations.page.scss'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as reservationActions  from '../_shared/actions/reservations.actions'


export class ReservationsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initReservations()
  }

  render() {
    const { state, actions } = this.props

    const schema = [ { key: 'name',   title: t(['reservations','name']),    comparator: 'string', representer: name => <strong> {name} </strong>, sort: 'asc' }
                   , { key: 'from',   title: t(['reservations','from']),    comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.')}  <br/> {moment(o).format('H:mm')}</span> }
  		             , { key: 'to',     title: t(['reservations','to']),      comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br/> {moment(o).format('H:mm')}</span> }
    	             , { key: 'garage', title: t(['reservations','garage']),  comparator: 'string' }
  		             , { key: 'place',  title: t(['reservations','place']),
                  		 comparator: (type, aRow, bRow) => {
                         const a = aRow.garagefloorName+" / "+aRow.name
                         const b = bRow.garagefloorName+" / "+bRow.name
                         return a.toLowerCase()<b.toLowerCase() ? (type=='asc'?-1:1) : (a.toLowerCase()>b.toLowerCase() ? (type=='asc'?1:-1) : 0)
                       }, representer: o => <strong className={styles.place}> {o.garagefloorName} / {o.name} </strong>}
                   ]

     const destroyClick = (reservation) => {
       actions.destroyReservation(reservation.id)
     }

    const data = state.reservations.map(function (reservation) {

      return { name: reservation.user.full_name
             , from: reservation.begins_at
             , to: reservation.ends_at
             , garage: reservation.place.floor.garage.name
             , place: { garagefloorName: reservation.place.floor.label, name: reservation.place.label }
             , spoiler: <div>
                          {`${reservation.creator.full_name}  |  ${reservation.creator.email}  |  ${moment(reservation.created_at).format('DD.MM. HH:mm')}`}
                          <span className={styles.floatRight}>
                            <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={()=>{destroyClick(reservation)}} type='remove' question={t(['reservations','removeReservationQuestion'])}/>
                          </span>
                        </div>
             }
    })

    const newReservation = () => {
      nav.to('/reservations/newReservation')
    }

    const prepareCards = (reservation, index) => {
      return <ReservationCard key={index} reservation={reservation} destroy={()=>{destroyClick(reservation)}} />
    }

    const content = <div>
                      {state.tableView ? <Table schema={schema} data={data} />
                        : <CardViewLayout columns={3}>
                            {state.reservations.map(prepareCards)}
                          </CardViewLayout> }

                      <div className={styles.centerDiv}>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newReservation} type='action' size='big' />
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
  const { reservations } = state
  return ({
    state: reservations
  })
}, dispatch => ({
  actions: bindActionCreators(reservationActions, dispatch)
}))(ReservationsPage)
