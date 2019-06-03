import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import moment from 'moment'

import CallToActionButton from '../buttons/CallToActionButton'
import Loading            from '../loading/Loading'
import Place              from './Place'

import detectIE from '../../helpers/internetExplorer'
import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

const DAY = 1
const WEEK_DAYS = 7
const MONTH_DAYS = 30

const DAY_DURATION_CELLS_PER_DAY = 24
const OTHER_DURATION_CELLS_PER_DAY = 2

const MAX_POSITIVE_TABLE_MARGIN = 40 // px
const MAX_POSSIBLE_TABLE_MARGIN = 59 // px

const MAX_COUNT_OF_RESERVATIONS_TO_CALCULATE_SPACE_AROUND = 200
const isIe = detectIE()

export const WIDTH_OF_PLACE_LABEL_CELL = 62 // px

export const windowLength = duration => {
  return duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS
}

export const cellsPerDay = duration => {
  return duration === 'day' ? DAY_DURATION_CELLS_PER_DAY : OTHER_DURATION_CELLS_PER_DAY
}

export const cellDuration = duration => {
  const hoursInDay = 24
  return hoursInDay / cellsPerDay(duration)
}

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
    this.changeTableMargin = this.changeTableMargin.bind(this)
    this.tableMargin = null

    this.renderDates = React.memo(this.renderDates)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, true)
    this.onWindowResize()
  }

  componentWillUpdate(newProps) {
    const { duration } = this.props
    const { duration: newDuration } = newProps
    if (newDuration !== duration) {
      this.changeTableMargin(newDuration)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, true)
  }

  onWindowResize() {
    const { duration } = this.props
    this.container.style['max-height'] = (Math.max(document.documentElement.clientHeight, window.innerHeight || 780) - 230) + 'px'
    this.changeTableMargin(duration)
    this.forceUpdate()
  }

  changeTableMargin(duration) {
    if (this.table && this.tableDiv) {
      const { width } = this.table.children[0].children[0].getBoundingClientRect()
      let margin = this.tableMargin || 0
      margin = (
        (width - WIDTH_OF_PLACE_LABEL_CELL + margin)
        % (windowLength(duration) * cellsPerDay(duration))
      )
      if (margin > MAX_POSITIVE_TABLE_MARGIN) {
        margin -= MAX_POSSIBLE_TABLE_MARGIN
      }
      // HACK: I do not know why there has to be - 1.
      this.tableMargin = margin - 1
      this.tableDiv.style['margin-left'] = margin + 'px'
    }
  }

  renderDates = ({ from, duration }) => {
    const dates = new Array(duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS)
      .fill('')
      .map((_, index) => {
        const date = from.clone().add(index, 'days')
        return duration === 'month'
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
              colSpan={cellsPerDay(duration)}
            >
              {date.format('ddd')}
              {duration !== 'day' && <br />}
              {date.format('DD.MM.')}
            </td>
          )
      })

    return (
      <tr className={duration !== 'day' && styles.bottomBorder}>
        <td className={styles.placePadding}>{t([ 'occupancy', 'places' ])}</td>
        {dates}
      </tr>
    )
  }

  renderBody = ({ renderTextInReservation }) => {
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
    const rowWidth = (tBodyWidth - WIDTH_OF_PLACE_LABEL_CELL)
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
      from, duration, reservationsCount
    } = this.props

    const Dates = this.renderDates
    const Body = this.renderBody

    return (
      <div
        ref={ref => this.tableDiv = ref}
      >
        <table className={`${styles.table} ${styles.fixedHeader}`}>
          <thead ref={thead => { this.thead = thead }}>
            <Dates from={from} duration={duration} />
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
          <table
            className={styles.table}
            ref={ref => this.table = ref}
          >
            <tbody ref={tbody => { this.tbody = tbody }}>
              <Body
                renderTextInReservation={reservationsCount >= MAX_COUNT_OF_RESERVATIONS_TO_CALCULATE_SPACE_AROUND}
              />
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
