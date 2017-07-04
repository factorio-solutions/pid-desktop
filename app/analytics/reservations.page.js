import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import { Chart }                       from 'react-google-charts'

import PageBase from '../_shared/containers/pageBase/PageBase'

import * as nav                          from '../_shared/helpers/navigation'
import { t }                             from '../_shared/modules/localization/localization'
import * as analyticsReservationsActions from '../_shared/actions/analytics.reservations.actions'

import styles from './reservations.page.scss'


export class ReservationsAnalyticsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }


  render() {
    const { state, actions } = this.props

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


    return (
      <PageBase>
        ReservationsAnalyticsPage page
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
