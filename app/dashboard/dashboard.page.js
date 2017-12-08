import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import { Chart }                       from 'react-google-charts'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout2'
import Table        from '../_shared/components/table/Table'

import * as nav from '../_shared/helpers/navigation'
import { t, getLanguage }    from '../_shared/modules/localization/localization'

import * as dashboardActions         from '../_shared/actions/dashboard.actions'
import * as analyticsActions         from '../_shared/actions/analytics.garage.actions'
import * as adminActivityLogsActions from '../_shared/actions/admin.activityLog.actions'
import * as pageBaseActions          from '../_shared/actions/pageBase.actions'


import styles from './dashboard.page.scss'


class DashboardPage extends Component {
  static propTypes = {
    state:            PropTypes.object,
    pageBase:         PropTypes.object,
    analytics:        PropTypes.object,
    logs:             PropTypes.object,
    actions:          PropTypes.object,
    analyticsActions: PropTypes.object,
    logsActions:      PropTypes.object,
    pageBaseActions:  PropTypes.object
  }

  constructor(props) {
    super(props)
    this.onWindowResize = this.onWindowResize.bind(this)
  }


  onWindowResize() {
    this.forceUpdate()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, true)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, true)
    this.props.actions.initDashboard()
    this.props.pageBase.garage && this.props.actions.initGarage()
    this.props.pageBase.garage && this.props.analyticsActions.initGarageTurnover()
    this.props.pageBase.garage && this.props.logsActions.initLogs()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !==  this.props.pageBase.garage && this.props.actions.initGarage()
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.analyticsActions.initGarageTurnover()
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.logsActions.initLogs()
  }

  render() {
    const { state, pageBase, analytics, logs, actions, analyticsActions, logsActions, pageBaseActions } = this.props

    const prepareNews = news => (<div className={styles.news}>
      { news.url ? <a href={news.url}><div dangerouslySetInnerHTML={{ __html: news.label }} /></a> : <div dangerouslySetInnerHTML={{ __html: news.label }} />}
      <span>{moment(news.created_at).format('DD.MM. HH:mm')}</span>
    </div>)

    const logScheme = [ { key: 'full_name', title: t([ 'activityLog', 'name' ]), comparator: 'string', sort: 'asc' },
                       { key: 'model', title: t([ 'activityLog', 'subject' ]), comparator: 'string' },
                       { key: 'action', title: t([ 'activityLog', 'action' ]), comparator: 'string' },
                       { key: 'created_at', title: t([ 'activityLog', 'createdAt' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.')}            <br /> {moment(o).format('H:mm')}</span> }
    ]

    const emptyOccupied = { total: 0, free: 0, visitor: 0, visitorOccupied: 0, longterm: 0, longtermOccupied: 0 }
    const occupied = state.garage ? state.garage.floors.reduce((acc, floor) => {
      return floor.places.reduce((acc, place) => {
        const reservation = place.group
        const contract = state.garage.contracts
          .filter(contract => moment().isBetween(moment(contract.from), moment(contract.to)))
          .find(contract => { return contract.places.find(p => p.id === place.id) !== undefined })

        if (contract) { // than place has contract
          acc.longterm ++
          reservation !== undefined && acc.longtermOccupied++
        } else {
          place.pricing && acc.visitor ++ // needs to have a pricing to be for visitors
          place.pricing && reservation !== undefined && acc.visitorOccupied++
        }
        reservation === undefined && contract === undefined && acc.free++
        acc.total++

        return acc
      }, acc)
    }, emptyOccupied) : emptyOccupied

    // GARAGE TURNOVER
    const { chartData } = analyticsActions.dataToArray(analyticsActions.stateToData())

    return (
      <PageBase>
        {pageBase.garages.length === 0 ?
          <iframe scrolling="auto" className={styles.iframe} src={`https://gama.park-it-direct.com/${getLanguage()}/pid-dashboard`} /> :
          <div className={styles.container}>
            <div>
              <GarageLayout floors={state.garage ? state.garage.floors : []} showEmptyFloors unfold />
            </div>
            <div>
              {state.news.length > 0 && [ <h2>{t([ 'dashboard', 'news' ])}</h2>,
                <div>{state.news.map(prepareNews)}</div> ]}

              {logs.logs.length > 0 && [ <h2 className={styles.pointer} onClick={() => { nav.to(`/${pageBase.garage}/admin/activityLog`) }}>{t([ 'dashboard', 'latestActivity' ])}</h2>,
                <Table schema={logScheme} data={logs.logs.filter((log, index) => index < 5)} /> ]}

              <div className={styles.title}>
                <h2>{t([ 'dashboard', 'currentState' ])}</h2>
                <span>{t([ 'dashboard', 'occupiedTotal' ])}</span>
              </div>
              <div>
                <div>{t([ 'dashboard', 'longterm' ])}<span className={styles.right}>{occupied.longtermOccupied}/{occupied.longterm}</span></div>
                <div>{t([ 'dashboard', 'visitors' ])}<span className={styles.right}>{occupied.visitorOccupied}/{occupied.visitor}</span></div>
                <div>{t([ 'dashboard', 'free' ])}<span className={styles.right}>{occupied.free}</span></div>
                <div>{t([ 'dashboard', 'total' ])}<span className={styles.right}>{occupied.total}</span></div>
              </div>

              <h2 className={styles.pointer} onClick={() => { pageBaseActions.analyticsClick() }}>{t([ 'dashboard', 'financeOverview' ])}</h2>
              {chartData.length == 1 ?
                <h3>{t([ 'analytics', 'noData' ])}</h3> :
                <Chart
                  chartType="ComboChart"
                  data={chartData}
                  options={{
                    vAxis:      { title: analyticsActions.currency() },
                    hAxis:      { title: analytics.period === 'month' ? t([ 'analytics', 'month' ]) : t([ 'analytics', 'week' ]) },
                    seriesType: 'bars',
                    series:     { 1: { type: 'line' } }
                  }}
                  graph_id="ComboChart"
                  width="100%"
                  height="400px"
                />}
            </div>
          </div>
        }
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.dashboard, pageBase: state.pageBase, analytics: state.analyticsGarage, logs: state.adminActivityLog }),
  dispatch => ({ actions:          bindActionCreators(dashboardActions, dispatch),
    analyticsActions: bindActionCreators(analyticsActions, dispatch),
    logsActions:      bindActionCreators(adminActivityLogsActions, dispatch),
    pageBaseActions:  bindActionCreators(pageBaseActions, dispatch)
  })
)(DashboardPage)
