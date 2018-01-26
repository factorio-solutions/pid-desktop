import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import { Chart }                       from 'react-google-charts'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import TabMenu      from '../_shared/components/tabMenu/TabMenu'
import TabButton    from '../_shared/components/buttons/TabButton'
import Table        from '../_shared/components/table/Table'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout'
import Loading      from '../_shared/components/loading/Loading'
import DateInput    from '../_shared/components/input/DateInput'

import { t }                       from '../_shared/modules/localization/localization'
import * as analyticsPlacesActions from '../_shared/actions/analytics.places.actions'

import styles from './places.page.scss'


class PlacesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }


  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initPlacesAnalytics()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initPlacesAnalytics()
  }

  render() {
    const { state, actions } = this.props

    const shorttermHandleFrom = (value, valid) => valid && actions.setFrom(value)
    const shorttermHandleTo = (value, valid) => valid && actions.setTo(value)

    const data = [
      [ t([ 'analytics', 'avgRevenue' ]) ],
      [ t([ 'analytics', 'avgTurnover' ]) ],
      [ t([ 'analytics', 'minRevenue' ]) ],
      [ t([ 'analytics', 'maxRevenue' ]) ]
    ]

    const schema = [
      { key: 0, title: t([ 'analytics', 'period' ]), comparator: 'string', sort: 'asc', representer: o => <strong>{o}</strong> }
    ]

    const chartData = [
      [
        t([ 'analytics', 'date' ]),
        t([ 'analytics', 'shortterm' ]),
        t([ 'analytics', 'average' ]),
        t([ 'analytics', 'longterm' ])
      ]
    ]

    state.garage && state.garage.statistics.forEach(obj => {
      schema.push({ key: schema.length, title: t([ 'analytics', 'shortterm' ]) + ' ' + obj.date, comparator: 'string' })
      schema.push({ key: schema.length, title: t([ 'analytics', 'longterm' ]) + ' ' + obj.date, comparator: 'string' })

      data[0].push((isFinite(obj.shortterm.turnover) ? obj.shortterm.turnover : 0) + ' ' + obj.shortterm.currency)
      data[0].push((isFinite(obj.longterm.turnover) ? obj.longterm.turnover : 0) + ' ' + obj.longterm.currency)
      data[1].push((isFinite(obj.shortterm.avgTurnover) ? obj.shortterm.avgTurnover : 0) + ' ' + obj.shortterm.currency)
      data[1].push((isFinite(obj.longterm.avgTurnover) ? obj.longterm.avgTurnover : 0) + ' ' + obj.longterm.currency)
      data[2].push((isFinite(obj.shortterm.minRevenue) ? obj.shortterm.minRevenue : 0) + ' ' + obj.shortterm.currency)
      data[2].push((isFinite(obj.longterm.minRevenue) ? obj.longterm.minRevenue : 0) + ' ' + obj.longterm.currency)
      data[3].push((isFinite(obj.shortterm.maxRevenue) ? obj.shortterm.maxRevenue : 0) + ' ' + obj.shortterm.currency)
      data[3].push((isFinite(obj.longterm.maxRevenue) ? obj.longterm.maxRevenue : 0) + ' ' + obj.longterm.currency)

      chartData.push([
        obj.date,
        (isFinite(obj.shortterm.avgTurnover) ? obj.shortterm.avgTurnover : 0),
        ((isFinite(obj.shortterm.avgTurnover) ? obj.shortterm.avgTurnover : 0) + (isFinite(obj.longterm.avgTurnover) ? obj.longterm.avgTurnover : 0)) / 2,
        (isFinite(obj.longterm.avgTurnover) ? obj.longterm.avgTurnover : 0)
      ])
    })

    const preparePlaces = floor => {
      return { ...floor,
        places: floor.places.map(place => ({
          ...place,
          heat:    place.averageRevenue,
          tooltip: <table className={styles.tooltip}>
            <tbody>
              <tr><td>{t([ 'analytics', 'avgRevenue' ])}</td><td>{place.averageRevenue} {actions.currency()}</td></tr>
              <tr><td>{t([ 'analytics', 'minRevenue' ])}</td><td>{isFinite(place.minRevenue) ? place.minRevenue : 0} {actions.currency()}</td></tr>
              <tr><td>{t([ 'analytics', 'maxRevenue' ])}</td><td>{isFinite(place.maxRevenue) ? place.maxRevenue : 0} {actions.currency()}</td></tr>
            </tbody>
          </table>
        }))
      }
    }

    const filters = [
      <TabButton label={t([ 'analytics', 'graph' ])} onClick={() => { actions.graphClick() }} state={state.display === 'graph' && 'selected'} />,
      <TabButton label={t([ 'analytics', 'heatmap' ])} onClick={() => { actions.heatmapClick() }} state={state.display === 'heatmap' && 'selected'} />
    ]

    const datePickers = [
      <Loading show={state.loading} />,
      <DateInput onChange={shorttermHandleFrom} label={t([ 'reservations', 'from' ])} value={state.from} style={styles.inline} flip />,
      <span className={styles.dash} />,
      <DateInput onChange={shorttermHandleTo} label={t([ 'reservations', 'to' ])} value={state.to} style={styles.inline} flip />
    ]


    return (
      <PageBase>
        <TabMenu left={filters} right={datePickers} />
        {state.display === 'graph' ? <div>
          <Chart
            chartType="ComboChart"
            data={chartData}
            options={{
              vAxis:      { title: t([ 'analytics', 'turnover' ]), format: `# ${actions.currency()}` },
              hAxis:      { title: t([ 'analytics', 'month' ]) },
              seriesType: 'bars'
            }}
            graph_id="ComboChart"
            width="100%"
            height="400px"
          />
          <Table schema={schema} data={data} searchBox={false} />
        </div> : <div>
          <GarageLayout floors={state.garage ? state.garage.floors.map(preparePlaces) : []} showEmptyFloors />
        </div>}
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.analyticsPlaces, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsPlacesActions, dispatch) })
)(PlacesPage)
