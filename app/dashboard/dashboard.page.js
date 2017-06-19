import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import { Chart }                       from 'react-google-charts'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout2'
import Table        from '../_shared/components/table/Table'

import * as nav              from '../_shared/helpers/navigation'
import { t }                 from '../_shared/modules/localization/localization'
import * as dashboardActions         from '../_shared/actions/dashboard.actions'
import * as garageActions            from '../_shared/actions/garage.actions'
import * as analyticsActions         from '../_shared/actions/analytics.actions'
import * as adminActivityLogsActions from '../_shared/actions/admin.activityLog.actions'
import * as pageBaseActions          from'../_shared/actions/pageBase.actions'


import styles from './dashboard.page.scss'


export class DashboardPage extends Component {
  static propTypes = {
    state:            PropTypes.object,
    pageBase:         PropTypes.object,
    analytics:        PropTypes.object,
    garage:           PropTypes.object,
    logs:           PropTypes.object,
    actions:          PropTypes.object,
    garageActions:    PropTypes.object,
    analyticsActions: PropTypes.object,
    logsActions:      PropTypes.object,
    pageBaseActions:  PropTypes.object
  }

  onWindowResize(){
    console.log('Resize dashboard');
    this.forceUpdate()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize.bind(this), true);
  }

  componentDidMount () {
    window.addEventListener('resize', this.onWindowResize.bind(this), true);
    this.props.actions.initDashboard()
    this.props.pageBase.garage && this.props.garageActions.initGarage()
    this.props.pageBase.garage && this.props.analyticsActions.initGarageTurnover()
    this.props.pageBase.garage && this.props.logsActions.initLogs()
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.garageActions.initGarage()
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.analyticsActions.initGarageTurnover()
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.logsActions.initLogs()
  }

  render() {
    const { state, pageBase, analytics, garage, logs, actions, garageActions, analyticsActions, logsActions, pageBaseActions } = this.props

    const preparePlaces = (floor) => {
      floor.places.map((place) => {
        const reservation = place.reservations.find(reservation => moment(state.time).isBetween(moment(reservation.begins_at), moment(reservation.ends_at)))
        if (reservation) {
          place.group = reservation.id
        } else {
          place.group = undefined
        }
        place.tooltip = <table className={styles.tooltip}><tbody>
          <tr><td>{t(['garages','reservationId'])}</td><td>{reservation && reservation.id}</td></tr>
          <tr><td>{t(['garages','driver'])}</td><td>{reservation && reservation.user.full_name}</td></tr>
          <tr><td>{t(['garages','type'])}</td><td>{reservation && (reservation.client ? t(['reservations','host']) : t(['reservations','visitor']))}</td></tr>
          <tr><td>{t(['garages','period'])}</td><td>{reservation && moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')+' - '+moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
          <tr><td>{t(['garages','licencePlate'])}</td><td>{reservation && reservation.car.licence_plate}</td></tr>
        </tbody></table>
        return place
      })
      return floor
    }

    const prepareNews = news => <div className={styles.news} href={news.url}>{news.label} <span>{moment(news.created_at).format("DD.MM. HH:mm")}</span></div>

    const logScheme = [ { key: 'full_name',  title: t(['activityLog', 'name']),      comparator: 'string', sort: 'asc' }
                      , { key: 'model',      title: t(['activityLog', 'subject']),   comparator: 'string' }
                      , { key: 'action',     title: t(['activityLog', 'action']),    comparator: 'string' }
                      , { key: 'created_at', title: t(['activityLog', 'createdAt']), comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.')}  <br/> {moment(o).format('H:mm')}</span> }
                      ]

    const emptyOccupied = {total:0, free:0, visitor:0, visitorOccupied: 0, longterm:0, longtermOccupied:0}
    const occupied = garage.garage ? garage.garage.floors.reduce((acc, floor)=> {
      return floor.places.reduce((acc, place)=>{
        const reservation = place.reservations.find(reservation => moment(state.time).isBetween(moment(reservation.begins_at), moment(reservation.ends_at)))
        const contract = garage.garage.contracts
          .filter(contract => moment().isBetween(moment(contract.from), moment(contract.to)))
          .find((contract) => { return contract.places.find(p => p.id === place.id) !== undefined })

        if (contract) { // than place has contract
          acc.longterm ++
          reservation !== undefined && acc.longtermOccupied++
        } else {
          place.pricing && acc.visitor ++ // needs to have a pricing to be for visitors
          place.pricing && reservation !== undefined && acc.visitorOccupied++
        }
        reservation === undefined && acc.free++
        acc.total++

        return acc
      }, acc)
    }, emptyOccupied) : emptyOccupied

    // GARAGE TURNOVER
    const getProperty = (created_at) => {
      return `${analytics.period === 'month' ? moment(created_at).month()+1 : moment(created_at).week()}/${moment(created_at).year()}`
    }

    const addProperty = (acc, property) => {
      if (!acc.hasOwnProperty(property)) {
        acc[property] = {reservations: [], contracts: []}
      }
      return acc
    }

    let chartData = analytics.reservations.reduce((acc, reservation) => {
      const property = getProperty(reservation.created_at)
      acc = addProperty(acc, property)
      acc[property].reservations.push(reservation)

      return acc
    }, {})

    let chartDataArray = []
    for (var key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        chartDataArray.push({...chartData[key], date:key})
      }
    }

    const average = chartDataArray.reduce((sum, interval) => {
      return sum + interval.reservations.reduce((sum, res) => sum + res.price, 0)
    }, 0) / chartDataArray.length

    chartDataArray = chartDataArray.sort((a,b)=>a.date > b.date).reduce((arr, interval) => {
      arr.push([interval.date, interval.reservations.reduce((sum, res) => sum + res.price, 0), average])
      return arr
    }, [[analytics.period === 'month'? t(['analytics', 'month']) : t(['analytics', 'week']), t(['analytics', 'reservations']), t(['analytics', 'average'])]])

    return (
      <PageBase>
        <div className={styles.container}>
          <div>
            <GarageLayout floors={garage.garage ? garage.garage.floors.map(preparePlaces) : []} showEmptyFloors={true} unfold={true}/>
          </div>
          <div>
            {state.news.length > 0 && [<h2>{t(['dashboard','news'])}</h2>,
            <div>{state.news.map(prepareNews)}</div>]}

            {logs.logs.length > 0 && [<h2 className={styles.pointer} onClick={()=>{nav.to(`/${pageBase.garage}/admin/activityLog`)}}>{t(['dashboard','latestActivity'])}</h2>,
            <Table schema={logScheme} data={logs.logs.filter((log, index) => index < 5 )} />]}

            <div className={styles.title}>
              <h2>{t(['dashboard','currentState'])}</h2>
              <span>{t(['dashboard','occupiedTotal'])}</span>
            </div>
            <div>
              <div>{t(['dashboard','longterm'])}<span className={styles.right}>{occupied.longtermOccupied}/{occupied.longterm}</span></div>
              <div>{t(['dashboard','visitors'])}<span className={styles.right}>{occupied.visitorOccupied}/{occupied.visitor}</span></div>
              <div>{t(['dashboard','free'])}<span className={styles.right}>{occupied.free}</span></div>
              <div>{t(['dashboard','total'])}<span className={styles.right}>{occupied.total}</span></div>
            </div>

            <h2 className={styles.pointer} onClick={()=>{pageBaseActions.analyticsClick()}}>{t(['dashboard','financeOverview'])}</h2>
            {chartDataArray.length == 1 ?
            <h3>{t(['analytics', 'noData'])}</h3> :
            <Chart
              chartType="ComboChart"
              data={chartDataArray}
              options={{
                vAxis: {title: analytics.reservations.length ? analytics.reservations[0].currency.symbol : ""},
                hAxis: {title: analytics.period === 'month'? t(['analytics', 'month']) : t(['analytics', 'week'])},
                seriesType: 'bars',
                series: {1: {type: 'line'}}
              }}
              graph_id="ComboChart"
              width="100%"
              height="400px"
            />}
          </div>
        </div>

      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.dashboard, pageBase:state.pageBase, analytics: state.analytics, garage: state.garage, logs: state.adminActivityLog }),
  dispatch => ({ actions: bindActionCreators(dashboardActions, dispatch)
               , garageActions: bindActionCreators(garageActions, dispatch)
               , analyticsActions: bindActionCreators(analyticsActions, dispatch)
               , logsActions: bindActionCreators(adminActivityLogsActions, dispatch)
               , pageBaseActions: bindActionCreators(pageBaseActions, dispatch)
               })
)(DashboardPage)
