import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Chart } from 'react-google-charts'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout'

import { t, getLanguage } from '../_shared/modules/localization/localization'

import * as dashboardActions from '../_shared/actions/dashboard.actions'

import './dashboard.noHash.page.css'
import styles from './dashboard.page.scss'


class DashboardPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  constructor(props) {
    super(props)
    this.onWindowResize = this.onWindowResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, true)
    this.props.actions.initDashboard()
    this.props.pageBase.garage && this.props.actions.initGarage()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initGarage()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, true)
  }

  onWindowResize() {
    this.forceUpdate()
  }

  render() {
    const { state, pageBase } = this.props

    const prepareNews = news => (<div className={styles.news}>
      {news.url ?
        <a href={news.url}><div dangerouslySetInnerHTML={{ __html: news.label }} /></a> :
        <div dangerouslySetInnerHTML={{ __html: news.label }} />
      }
      <div className={styles.newsTime}>
        <span>{moment(news.created_at).format('DD.MM. HH:mm')}</span>
      </div>
    </div>)

    const emptyOccupied = { used: 0, free: 0, unused: 0 }
    const occupied = state.garage ? state.garage.floors.reduce((acc, floor) => {
      return floor.places.reduce((acc, place) => {
        const reservation = place.group
        const contract = state.garage.contracts
          .filter(contract => moment().isBetween(moment(contract.from), moment(contract.to)))
          .find(contract => { return contract.places.find(p => p.id === place.id) !== undefined })

        if (reservation) { // if is occupied by a car then is used
          acc.used ++
        }else if (contract) { // not occupied by the car but has contract then is free
          acc.free ++
        } else { // no contract or current reservation then is unused
          acc.unused ++
        }
        return acc
      }, acc)
    }, emptyOccupied) : emptyOccupied

    return (
      <PageBase>
        {pageBase.garages.length === 0 ?
          <iframe scrolling="auto" className={styles.iframe} src={`https://gama.park-it-direct.com/${getLanguage()}/pid-dashboard`} /> :
          <div className={styles.container}>
            <div>
              <div>
                <h2 className={styles.h2}>{t([ 'dashboard', 'statistics' ])}</h2>

                <div className={styles.section}>
                  <Chart
                    chartType="PieChart"
                    chartTitle="DonutChart"
                    data={[
                      [ t([ 'dashboard', 'statistics' ]), t([ 'dashboard', 'units' ], { count: 1 }) ],
                      [ t([ 'dashboard', 'used' ]), occupied.used ],
                      [ t([ 'dashboard', 'free' ]), occupied.free ],
                      [ t([ 'dashboard', 'unused' ]), occupied.unused ]
                    ]}
                    options={{
                      chartArea: {
                        top:    10,
                        height: '85%',
                        width:  '95%'
                      },
                      legend: {
                        textStyle: {
                          fontSize: 14
                        },
                        position: 'bottom'
                      },
                      slices: [
                        { color: '#e63237' }, // red
                        { color: '#83bb26' }, // green
                        { color: '#cacaca' } // lightGray collor
                      ],
                      tooltip: {
                        textStyle: {
                          fontSize: 24,
                          bold:     true
                        },
                        isHtml: true
                      },
                      pieHole:      0.6,
                      pieSliceText: 'value'
                    }}
                    graph_id="PieChart"
                    width="100%"
                    height="400px"
                  />
                </div>

              </div>

              {state.news.length > 0 && <div>
                <h2 className={styles.h2}>{t([ 'dashboard', 'news' ])}</h2>
                <div className={styles.section}>
                  {state.news
                    .sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)))
                    .map(prepareNews)
                  }
                </div>
              </div>}
            </div>

            <div>
              <h2 className={styles.h2}>{t([ 'dashboard', 'garage' ])}</h2>
              <GarageLayout floors={state.garage ? state.garage.floors : []} showEmptyFloors unfold />
            </div>
          </div>
        }
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.dashboard, pageBase: state.pageBase }),
  dispatch => ({
    actions: bindActionCreators(dashboardActions, dispatch)
  })
)(DashboardPage)
