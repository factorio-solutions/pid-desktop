import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import moment from 'moment'

import CallToActionButton from '../buttons/CallToActionButton'
import Loading            from '../loading/Loading'
import Place              from './Place'

import detectIE from '../../helpers/internetExplorer'
import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

export const DAY = 1
export const WEEK_DAYS = 7
export const MONTH_DAYS = 30
const WIDTH_OF_PLACE_CELL = 63 // px

const MAX_COUNT_OF_RESERVATIONS_TO_CALCULATE_SPACE_AROUND = 200

const isIe = detectIE()

export default class OccupancyOverview extends PureComponent {
  static propTypes = {
    places:             PropTypes.array.isRequired,
    from:               PropTypes.object,
    duration:           PropTypes.string,
    resetClientClick:   PropTypes.func,
    loading:            PropTypes.bool,
    showDetails:        PropTypes.bool,
    onReservationClick: PropTypes.func,
    currentUser:        PropTypes.object,
    setNewReservation:  PropTypes.func,
    reservationsCount:  PropTypes.number
  }

  constructor(props) {
    super(props)
    this.onWindowResize = this.onWindowResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, true)
    this.onWindowResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, true)
  }

  onWindowResize() {
    this.container.style['max-height'] = (Math.max(document.documentElement.clientHeight, window.innerHeight || 780) - 230) + 'px'
    this.forceUpdate()
  }

  renderDates = () => {
    const { from, duration } = this.props
    const dates = new Array(duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS)

    for (let index = 0; index < dates.length; index += 1) {
      const date = from.clone().add(index, 'days')
      dates[index] = duration === 'month'
        ? (
          <td
            key={`d-${index}`}
            className={`${styles.center} ${styles.bold} ${styles.monthDate}`}
            colSpan={2}
          >
            {date.format('DD.')}
            <br />
            {date.format('MM.')}
          </td>
        )
        : (
          <td
            key={`d-${index}`}
            className={`${styles.center} ${styles.bold} ${styles.weekDate}`}
            colSpan={duration === 'day' ? 24 : 2}
          >
            {date.format('ddd')}
            {duration !== 'day' && <br />}
            {date.format('DD.MM.')}
          </td>
        )
    }

    return (
      <tr className={duration !== 'day' && styles.bottomBorder}>
        <td className={styles.placePadding}>{t([ 'occupancy', 'places' ])}</td>
        {dates}
      </tr>
    )
  }

  renderBody = renderTextInReservation => {
    const {
      places, loading, resetClientClick, showDetails, duration, from, onReservationClick, currentUser, setNewReservation
    } = this.props
    if (places.length === 0 && loading) { // show loading when loading
      return (
        <tr>
          <td colSpan="100%" className={styles.center}>
            <Loading show={loading} />
          </td>
        </tr>
      )
    }

    if (places.length === 0) { // show filter reset when not loading anymore but no places avaibalbe
      return (
        <tr>
          <td colSpan="100%" className={styles.center}>
            <div>
              {t([ 'occupancy', 'noClientPlaces' ])}
            </div>
            <div>
              <CallToActionButton
                onClick={resetClientClick}
                label={t([ 'occupancy', 'resetFilter' ])}
              />
            </div>
          </td>
        </tr>
      )
    }

    const sorter = (a, b) => { // will sort place according to floors then labels
      if (a.floor < b.floor) return -1
      if (a.floor > b.floor) return 1
      if (parseInt(a.label, 10) < parseInt(b.label, 10)) return -1
      if (parseInt(a.label, 10) > parseInt(b.label, 10)) return 1
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    }

    const tBodyWidth = (this.tbody ? this.tbody.childNodes[0].getBoundingClientRect().width : 300)
    const rowWidth = (tBodyWidth - WIDTH_OF_PLACE_CELL)
    const nowLinePosition = moment().diff(from, duration, true) * rowWidth

    return places.sort(sorter).map(place => (
      <Place
        key={place.id}
        showDetails={showDetails}
        place={place}
        duration={duration}
        from={from}
        now={nowLinePosition}
        onReservationClick={onReservationClick}
        currentUser={currentUser}
        setNewReservation={setNewReservation}
        renderTextInReservation={renderTextInReservation}
        isIe={isIe}
      />
    ))
  }

  render() {
    const {
      duration, reservationsCount
    } = this.props

    console.log(reservationsCount)

    return (
      <div>
        <table className={`${styles.table} ${styles.fixedHeader}`}>
          <thead ref={thead => { this.thead = thead }}>
            {this.renderDates()}
            {duration === 'day' && (
              <tr className={`${styles.center} ${styles.bottomBorder}`}>
                <td />
                <td colSpan="2" />
                <td colSpan="2">3:00</td>
                <td colSpan="1" />
                <td colSpan="2" className={styles.bold}>6:00</td>
                <td colSpan="1" />
                <td colSpan="2">9:00</td>
                <td colSpan="1" />
                <td colSpan="2" className={styles.bold}>12:00</td>
                <td colSpan="1" />
                <td colSpan="2">15:00</td>
                <td colSpan="1" />
                <td colSpan="2" className={styles.bold}>18:00</td>
                <td colSpan="1" />
                <td colSpan="2">21:00</td>
                <td colSpan="2" />
              </tr>
            )}
          </thead>
        </table>
        <div className={styles.tableDiv} ref={o => { this.container = o }}>
          <table className={styles.table}>
            <tbody ref={tbody => { this.tbody = tbody }}>
              {this.renderBody(reservationsCount >= MAX_COUNT_OF_RESERVATIONS_TO_CALCULATE_SPACE_AROUND)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
