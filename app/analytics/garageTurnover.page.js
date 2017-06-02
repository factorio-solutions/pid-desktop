import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import { Chart }                       from 'react-google-charts';

import PageBase   from '../_shared/containers/pageBase/PageBase'
import TabMenu    from '../_shared/components/tabMenu/TabMenu'
import TabButton  from '../_shared/components/buttons/TabButton'

import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'
import * as analyticsActions    from '../_shared/actions/analytics.actions'

import styles from './garageTurnover.page.scss'


export class GarageTurnoverPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initGarageTurnover()
  }

  componentDidMount(){
    this.props.pageBase.garage && this.props.actions.initGarageTurnover()
  }

  render() {
    const { state, actions } = this.props

    const fromHandler = (event) => { actions.setFrom(event.target.value) }
    const toHandler   = (event) => { actions.setTo(event.target.value) }


    const getProperty = (created_at) => {
      return `${state.period === 'month' ? moment(created_at).month()+1 : moment(created_at).week()}/${moment(created_at).year()}`
    }

    const addProperty = (acc, property) => {
      if (!acc.hasOwnProperty(property)) {
        acc[property] = {reservations: [], contracts: []}
      }
      return acc
    }

    let chartData = state.reservations.reduce((acc, reservation) => {
      const property = getProperty(reservation.created_at)
      acc = addProperty(acc, property)
      acc[property].reservations.push(reservation)

      return acc
    }, {})

    // chartData = state.contracts.reduce((acc, contract) => {
    //   const property = getProperty(contract.created_at)
    //   acc = addProperty(acc, property)
    //   acc[property].contracts.push(contract)
    //
    //   return acc
    // }, chartData)

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
    }, [[state.period === 'month'? t(['analytics', 'month']) : t(['analytics', 'week']), t(['analytics', 'reservations']), t(['analytics', 'average'])]])

    const filters = [ <TabButton label={t(['occupancy', 'month'])} onClick={() => {actions.monthClick()}} state={state.period=="month" && 'selected'}/>
                    , <TabButton label={t(['occupancy', 'week'])}  onClick={() => {actions.weekClick()}}  state={state.period=="week" && 'selected'}/>
                    ]

    const datePickers = [ <input type='text' className={styles.dateSelector} value={state.from} onChange={fromHandler}/>
                        , <span><b>-</b></span>
                        , <input type='text' className={styles.dateSelector} value={state.to} onChange={toHandler}/>
                        ]

      console.log(chartDataArray.length == 1);



    return (
      <PageBase>
        <TabMenu left={filters} right={datePickers}/>
        {chartDataArray.length == 1 ?
        <h3>{t(['analytics', 'noData'])}</h3> :
        <Chart
          chartType="ComboChart"
          data={chartDataArray}
          options={{
            vAxis: {title: state.reservations.length ? state.reservations[0].currency.symbol : ""},
            hAxis: {title: state.period === 'month'? t(['analytics', 'month']) : t(['analytics', 'week'])},
            seriesType: 'bars',
            series: {1: {type: 'line'}}
          }}
          graph_id="ComboChart"
          width="100%"
          height="400px"
        />}
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.analytics, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsActions, dispatch) })
)(GarageTurnoverPage)
