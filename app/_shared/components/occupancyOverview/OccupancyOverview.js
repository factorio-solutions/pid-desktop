import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import moment                          from 'moment'

import CallToActionButton from '../buttons/CallToActionButton'
import Loading            from '../loading/Loading'
import Place              from './Place'

import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

export const DAY = 1
export const WEEK_DAYS = 7
export const MONTH_DAYS = 30
const WIDTH_OF_PLACE_CELL = 63 // px


class OccupancyOverview extends Component {
  static propTypes = {
    places:             PropTypes.array.isRequired,
    from:               PropTypes.object,
    duration:           PropTypes.string,
    resetClientClick:   PropTypes.func,
    loading:            PropTypes.bool,
    showDetails:        PropTypes.bool,
    onReservationClick: PropTypes.func
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

  render() {
    const { places, duration, from, resetClientClick, loading, showDetails, onReservationClick } = this.props

    const prepareDates = () => (<tr className={duration !== 'day' && styles.bottomBorder}>
      <td className={styles.placePadding}>{t([ 'occupancy', 'places' ])}</td>
      {Array(...{ length: duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS }).map((d, index) => {
        const date = moment(from).add(index, 'days')
        return duration === 'month' ?
          <td key={`d-${index}`} className={`${styles.center} ${styles.bold}`} colSpan={2}> {date.format('DD.')} <br /> {date.format('MM.')} </td> :
          <td key={`d-${index}`} className={`${styles.center} ${styles.bold}`} colSpan={duration === 'day' ? 24 : 2}>{date.locale(moment.locale()).format('ddd')} {duration !== 'day' && <br />} {date.format('DD.MM.')} </td>
      })}
    </tr>)

    const prepareBody = () => {
      if (places.length === 0 && loading) { // show loading when loading
        return (<tr>
          <td colSpan="100%" className={styles.center}>
            <Loading show={loading} />
          </td>
        </tr>)
      }

      if (places.length === 0) { // show filter reset when not loading anymore but no places avaibalbe
        return (<tr >
          <td colSpan="100%" className={styles.center}>
            <div> {t([ 'occupancy', 'noClientPlaces' ])} </div>
            <div> <CallToActionButton onClick={resetClientClick} label={t([ 'occupancy', 'resetFilter' ])} /> </div>
          </td>
        </tr>)
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

      return places.sort(sorter).map(place => (<Place
        key={place.id}
        showDetails={showDetails}
        place={place}
        duration={duration}
        from={from}
        now={nowLinePosition}
        onReservationClick={onReservationClick}
      />))
    }

    return (
      <div>
        <table className={`${styles.table} ${styles.fixedHeader}`}>
          <thead ref={thead => { this.thead = thead }}>
            {prepareDates()}
            {duration === 'day' && <tr className={`${styles.center} ${styles.bottomBorder}`}>
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
            </tr>}
          </thead>
        </table>
        <div className={styles.tableDiv} ref={o => { this.container = o }}>
          <table className={styles.table}>
            <tbody ref={tbody => { this.tbody = tbody }}>
              {prepareBody()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default connect(
  () => ({}),
  () => ({})
)(OccupancyOverview)
