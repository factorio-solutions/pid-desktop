import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import moment                          from 'moment'

import CallToActionButton from '../buttons/CallToActionButton'
import Tooltip            from '../tooltip/Tooltip'
import Loading            from '../loading/Loading'
import Place              from './Place'

import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

export const DAY = 1
export const WEEK_DAYS = 7
export const MONTH_DAYS = 30
const INIT_STATE = { content: '',
  mouseX:  0,
  mouseY:  0,
  visible: false
}
const WIDTH_OF_PLACE_CELL = 63 // px


class OccupancyOverview extends Component {
  static propTypes = {
    pageBase:           PropTypes.object,
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
    this.state = INIT_STATE

    this.onWindowResize = this.onWindowResize.bind(this)
    this.reservationOnMouseEnter = this.reservationOnMouseEnter.bind(this)
    this.reservationOnMouseLeave = this.reservationOnMouseLeave.bind(this)
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

  reservationOnMouseEnter(e, reservation) {
    const { showDetails, pageBase } = this.props
    const clientUser = reservation.client ? reservation.client.client_user : {}

    this.setState({
      content: (showDetails || clientUser.admin || clientUser.secretary ||
      (pageBase.current_user && pageBase.current_user.id === reservation.user.id)) ? <table className={styles.tooltipTable}><tbody>
        <tr><td>{t([ 'occupancy', 'reservationsId' ])}</td><td>{reservation.id}</td></tr>
        <tr><td>{t([ 'occupancy', 'driver' ])}</td><td>{reservation.user.full_name}</td></tr>
        {reservation.client && <tr><td>{t([ 'occupancy', 'client' ])}</td><td>{reservation.client.name}</td></tr>}
        <tr><td>{t([ 'occupancy', 'type' ])}</td><td>{reservation.client ? t([ 'reservations', 'host' ]) : t([ 'reservations', 'visitor' ])}</td></tr>
        <tr><td>{t([ 'occupancy', 'period' ])}</td><td>{moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')} - {moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
        <tr><td>{t([ 'occupancy', 'licencePlate' ])}</td><td>{reservation.car.licence_plate}</td></tr>
      </tbody></table> : <div>{t([ 'occupancy', 'detailsInaccessible' ])}</div>,
      mouseX:  e.target.getBoundingClientRect().right - 160,
      mouseY:  e.target.getBoundingClientRect().bottom - 60,
      visible: true,
      height:  '500px'
    })
  }

  reservationOnMouseLeave() {
    this.setState(INIT_STATE)
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
        showDetails={showDetails}
        place={place}
        duration={duration}
        from={from}
        now={nowLinePosition}
        onMouseEnter={this.reservationOnMouseEnter}
        onMouseLeave={this.reservationOnMouseLeave}
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
        {Tooltip(this.state)}
      </div>
    )
  }
}

export default connect(
  state => ({ pageBase: state.pageBase }),
  () => ({})
)(OccupancyOverview)
