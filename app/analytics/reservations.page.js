import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import { Chart }                       from 'react-google-charts'

import PageBase      from '../_shared/containers/pageBase/PageBase'
import TabMenu       from '../_shared/components/tabMenu/TabMenu'
import TabButton     from '../_shared/components/buttons/TabButton'
import Table         from '../_shared/components/table/Table'
import DateInput from '../_shared/components/input/DateInput'

import * as nav                          from '../_shared/helpers/navigation'
import { t }                             from '../_shared/modules/localization/localization'
import * as analyticsReservationsActions from '../_shared/actions/analytics.reservations.actions'

import styles from './reservations.page.scss'


export class ReservationsAnalyticsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initReservationsAnalytics()
  }

  componentDidMount(){
    this.props.pageBase.garage && this.props.actions.initReservationsAnalytics()
  }

  render() {
    const { state, actions } = this.props

    const handleFrom = (value, valid) => {valid && actions.setFrom(value) }
    const handleTo   = (value, valid) => {valid && actions.setTo(value) }

    console.log(actions.reservationsToData());

    const data = [
      ['x', 'turnover', 'reservations'],
      ["A", 1000, 1],
      ["B", 2000, 2],
      ["C", 4000, 4],
      ["D", 8000, 6],
      ["E", 7000, 5],
      ["F", 7000, 7],
      ["G", 8000, 8],
      ["H", 4000, 4],
      ["I", 2000, 2],
      ["J", 3000, 3],
      ["K", 3000, 3],
      ["L", 3000, 2],
      ["M", 1000, 2],
      ["N", 1000, 1]
    ]

    const datePickers = [ <DateInput onChange={handleFrom} label={t(['reservations', 'from'])} value={state.from} style={styles.inline} />
                        , <span className={styles.dash}><b>-</b></span>
                        , <DateInput onChange={handleTo} label={t(['reservations', 'to'])} value={state.to} style={styles.inline} flip={true}/>
                        ]

    return (
      <PageBase>
        <TabMenu right={datePickers} style={styles.tabMenuHeight}/>
        <Chart
          chartType="ComboChart"
          data={data}
          options={{
            vAxis: {0: {title: 'kc' }, 1: {title: 'reservations' }},
            hAxis: {title: t(['analytics', 'date']) },
            seriesType: 'bars',
            series: {
              0:{targetAxisIndex:0},
              1:{targetAxisIndex:1, type:'line'},
            }
          }}
          graph_id="ComboChart"
          width="100%"
          height="400px"
        />
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.analyticsReservations, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsReservationsActions, dispatch) })
)(ReservationsAnalyticsPage)
