import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import { Chart }                       from 'react-google-charts'

import PageBase  from '../_shared/containers/pageBase/PageBase'
import TabMenu   from '../_shared/components/tabMenu/TabMenu'
import TabButton from '../_shared/components/buttons/TabButton'
import Table     from '../_shared/components/table/Table'
import DateInput from '../_shared/components/input/DateInput'
import Loading   from '../_shared/components/loading/Loading'

import { t }                             from '../_shared/modules/localization/localization'
import * as analyticsReservationsActions from '../_shared/actions/analytics.reservations.actions'

import styles from './reservations.page.scss'


class ReservationsAnalyticsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initReservationsAnalytics()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initReservationsAnalytics()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const shorttermHandleFrom = (value, valid) => valid && actions.setFrom(value)
    const shorttermHandleTo = (value, valid) => valid && actions.setTo(value)

    const data = [
      [ t([ 'analytics', 'turnover' ]) ],
      [ t([ 'analytics', state.filter === 'shortterm' ? 'reservationCount' : 'contractCount' ]) ]
    ]

    const schema = [
      { key: 0, title: t([ 'analytics', 'period' ]), comparator: 'string', sort: 'asc', representer: o => <strong>{o}</strong> }
    ]

    const tableData = state.filter === 'shortterm' ? actions.reservationsToData() : actions.contractsToData()

    tableData.forEach(o => {
      schema.push({ key: schema.length, title: actions.dateRemoveYear(o.date), comparator: 'string' })
      data[0].push(o.price + ' ' + actions.currency())
      data[1].push(state.filter === 'shortterm' ? o.reservations.length + '' : o.contracts.length + '')
    })

    const filters = [
      <TabButton label={t([ 'analytics', 'shortterm' ])} onClick={() => actions.shortTermClick()} state={state.filter === 'shortterm' && 'selected'} />,
      <TabButton label={t([ 'analytics', 'longterm' ])} onClick={() => actions.longTermClick()} state={state.filter === 'longterm' && 'selected'} />
    ]

    const datePickers = [
      <Loading show={state.loading} />,
      <DateInput onChange={shorttermHandleFrom} label={t([ 'reservations', 'from' ])} value={state.from} style={styles.inline} flip />,
      <span className={styles.dash} />,
      <DateInput onChange={shorttermHandleTo} label={t([ 'reservations', 'to' ])} value={state.to} style={styles.inline} flip />
    ]

    return (
      <PageBase>
        <div className={`${styles.analyticsContainer} ${pageBase.current_user && pageBase.current_user.hint && styles.shrink}`}>
          <TabMenu left={filters} right={datePickers} />
          <Chart
            chartType="ComboChart"
            data={actions.dataToArray(tableData)}
            options={{
              vAxes: {
                0: { title: t([ 'analytics', 'turnover' ]), format: `# ${actions.currency()}` },
                1: { title: t([ 'analytics', state.filter === 'shortterm' ? 'reservationCount' : 'contractCount' ]) }
              },
              hAxis:      { title: t([ 'analytics', 'date' ]) },
              seriesType: 'bars',
              series:     {
                0: { targetAxisIndex: 0 },
                1: { targetAxisIndex: 1, type: 'line' }
              }
            }}
            graph_id="ComboChart"
            width="100%"
            height="400px"
          />
          <Table schema={schema} data={data} searchBox={false} />

          <div className={styles.bottomMargin} />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.analyticsReservations, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsReservationsActions, dispatch) })
)(ReservationsAnalyticsPage)
