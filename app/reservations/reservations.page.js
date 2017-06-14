import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Table            from '../_shared/components/table/Table'
import RoundButton      from '../_shared/components/buttons/RoundButton'
import ButtonStack      from '../_shared/components/buttonStack/ButtonStack'
// import TextButton       from '../_shared/components/buttons/TextButton'
import CardViewLayout   from '../_shared/components/cardView/CardViewLayout'
import ReservationCard  from '../_shared/components/cardView/ReservationCard'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as reservationActions  from '../_shared/actions/reservations.actions'

import styles from './reservations.page.scss'


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

    const schema = [ { key: 'name',          title: t(['reservations','name']),         comparator: 'string', sort: 'asc' }
                   , { key: 'client',        title: t(['reservations','client']),       comparator: 'string' }
                   , { key: 'licence_plate', title: t(['reservations','licencePlate']), comparator: 'string' }
                   , { key: 'type',          title: t(['reservations','type']),         comparator: 'string',  representer: o => <i className={`fa ${o==='visitor' ? 'fa-credit-card' : o === 'guest' ? 'fa-suitcase' : 'fa-home'}`} aria-hidden="true"></i> }
                   , { key: 'state',         title: t(['reservations','state']),        comparator: 'boolean', representer: o => <i className={`fa ${o ? 'fa-check-circle' : 'fa-question-circle'} ${o ? styles.green : styles.yellow}`} aria-hidden="true"></i> }
                   , { key: 'garage',        title: t(['reservations','garage']),       comparator: 'string' }
                   , { key: 'place',         title: t(['reservations','place']),
                       comparator: (type, aRow, bRow) => {
                         const a = aRow.garagefloorName+" / "+aRow.name
                         const b = bRow.garagefloorName+" / "+bRow.name
                         return a.toLowerCase()<b.toLowerCase() ? (type=='asc'?-1:1) : (a.toLowerCase()>b.toLowerCase() ? (type=='asc'?1:-1) : 0)
                       }, representer: o => <strong className={styles.place}> {o.garagefloorName} / {o.name} </strong>}
                   , { key: 'from',          title: t(['reservations','from']),         comparator: 'date',    representer: o => <span>{ moment(o).format('ddd DD.MM.')}  <br/> {moment(o).format('H:mm')}</span> }
  		             , { key: 'to',            title: t(['reservations','to']),           comparator: 'date',    representer: o => <span>{ moment(o).format('ddd DD.MM.')} <br/> {moment(o).format('H:mm')}</span> }
                   ]

    const destroyClick   = (reservation) => { actions.destroyReservation(reservation.id) }
    const editClick      = (reservation) => { nav.to(`/reservations/${reservation.id}/edit`) }
    const downloadClick  = (id) => {actions.downloadInvoice(id)}
    const newReservation = () => { nav.to('/reservations/newReservation') }

    const data = state.reservations.map(function (reservation) {
      return { name: reservation.user.full_name
             , client: reservation.client && reservation.client.name
             , licence_plate: reservation.car && reservation.car.licence_plate
             , state: reservation.approved
             , type: reservation.case
             , from: reservation.begins_at
             , to: reservation.ends_at
            //  , disabled: !reservation.approved
             , garage: reservation.place.floor.garage.name
             , place: { garagefloorName: reservation.place.floor.label, name: reservation.place.label }
             , spoiler: <div className={styles.spoiler}>
                         {!reservation.approved && <div><b>{ reservation.client===null ? t(['reservations','reservationNotPayed']) : t(['reservations','reservationApproved'])}</b></div>}
                         <div className={styles.flex}>
                          <div>
                            <div>{reservation.user.email}</div>
                            <div>{reservation.user.phone}</div>
                          </div>
                          <div>
                          <div>{t(['reservations','createdAt'])} {reservation.created_at}</div>
                          <div>{t(['reservations','updatedAt'])} {reservation.updated_at}</div>
                          </div>
                          <div>
                            <span className={styles.floatRight}>
                              {reservation.client && moment(reservation.begins_at).isAfter(moment()) && <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{editClick(reservation)}} type='action'/>}
                              {!reservation.approved && reservation.client==null && <RoundButton content={t(['reservations','pay'])} onClick={()=>{actions.payReservation(reservation)}} type='action'/>}
                              {reservation.invoice_item && reservation.invoice_item.invoice && reservation.invoice_item.invoice.payed && <RoundButton content={<span className='fa fa-download' aria-hidden="true"></span>} onClick={()=>{downloadClick(reservation.invoice_item.invoice.id)}} type='action'/>}
                              {moment(reservation.begins_at).isAfter(moment()) && <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={()=>{destroyClick(reservation)}} type='remove' question={t(['reservations','removeReservationQuestion'])}/>}
                            </span>
                          </div>
                         </div>
                        </div>
             }
    })

    const prepareCards = (reservation, index) => {
      return <ReservationCard key={index} reservation={reservation} destroy={()=>{destroyClick(reservation)}} download={downloadClick} />
    }

    // const filters=  <div>
    //                   <ButtonStack divider={<span>|</span>} style='horizontal' >
    //                     <TextButton content={t(['pageBase','cardView'])} onClick={() => {actions.setTableView(false)}} state={!state.tableView && 'selected'}/>
    //                     <TextButton content={t(['pageBase','tableView'])} onClick={() => {actions.setTableView(true)}} state={state.tableView && 'selected'}/>
    //                   </ButtonStack>
    //                 </div>

    return (
      <PageBase>
        <div>
          {state.tableView ? <Table schema={schema} data={data} />
            : <CardViewLayout columns={3}>
                {state.reservations.map(prepareCards)}
              </CardViewLayout> }

          <div className={styles.centerDiv}>
            <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newReservation} type='action' size='big' />
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.reservations }),
  dispatch => ({ actions: bindActionCreators(reservationActions, dispatch) })
)(ReservationsPage)
