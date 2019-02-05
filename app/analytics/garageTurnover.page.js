import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Chart } from 'react-google-charts'

import PageBase  from '../_shared/containers/pageBase/PageBase'
import TabMenu   from '../_shared/components/tabMenu/TabMenu'
import TabButton from '../_shared/components/buttons/TabButton'
import Table     from '../_shared/components/table/Table'
import Loading   from '../_shared/components/loading/Loading'
import DateInput from '../_shared/components/input/DateInput'

import { t }                       from '../_shared/modules/localization/localization'
import * as analyticsGarageActions from '../_shared/actions/analytics.garage.actions'

import styles from './garageTurnover.page.scss'


class GarageTurnoverPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initGarageTurnover()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initGarageTurnover()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const shorttermHandleFrom = (value, valid) => valid && actions.setFrom(value)
    const shorttermHandleTo = (value, valid) => valid && actions.setTo(value)

    const { chartData, tableData, schema } = actions.dataToArray(
      actions.stateToData(),
      [ [ t([ 'analytics', 'turnover' ]) ], [ t([ 'analytics', 'reservations' ]) ] ],
      [ { key: 0, title: t([ 'analytics', 'period' ]), comparator: 'string', sort: 'asc', representer: o => <strong>{o}</strong> } ]
    )

    const filters = [
      <TabButton label={t([ 'occupancy', 'month' ])} onClick={() => actions.monthClick()} state={state.period === 'month' && 'selected'} />,
      <TabButton label={t([ 'occupancy', 'week' ])} onClick={() => actions.weekClick()} state={state.period === 'week' && 'selected'} />
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
          {chartData.length === 1 ?
            <h3>{t([ 'analytics', 'noData' ])}</h3> :
            <Chart
              chartType="ComboChart"
              data={chartData}
              options={{
                vAxis:      { title: t([ 'analytics', 'turnover' ]), format: `# ${actions.currency()}` },
                hAxis:      { title: state.period === 'month' ? t([ 'analytics', 'month' ]) : t([ 'analytics', 'week' ]) },
                seriesType: 'bars',
                series:     { 1: { type: 'line' } }
              }}
              graph_id="ComboChart"
              width="100%"
              height="400px"
            />}

          <Table schema={schema} data={tableData} searchBox={false} />

          <div className={styles.bottomMargin} />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.analyticsGarage, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(analyticsGarageActions, dispatch) })
)(GarageTurnoverPage)
