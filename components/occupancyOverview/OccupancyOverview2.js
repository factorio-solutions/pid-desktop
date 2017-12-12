import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import moment                           from 'moment'

import RoundButton        from '../buttons/RoundButton'
import CallToActionButton from '../buttons/CallToActionButton'
import Tooltip            from '../tooltip/Tooltip'
import Loading            from '../loading/Loading'

import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview2.scss'

const DAY = 1
const WEEK_DAYS = 7
const MONTH_DAYS = 30
const INIT_STATE = { content: '',
  mouseX:  0,
  mouseY:  0,
  visible: false
}
const WIDTH_OF_PLACE_CELL = 63 // px


export default class OccupancyOverview2 extends Component {
  static propTypes = {
    places:           PropTypes.array.isRequired,
    from:             PropTypes.object,
    duration:         PropTypes.string,
    leftClick:        PropTypes.func,
    rightClick:       PropTypes.func,
    dayClick:         PropTypes.func,
    weekClick:        PropTypes.func,
    monthClick:       PropTypes.func,
    resetClientClick: PropTypes.func,
    loading:          PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = INIT_STATE
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
    this.tbody.style['max-height'] = (Math.max(document.documentElement.clientHeight, window.innerHeight || 780) - 230) + 'px'
    this.forceUpdate()
  }

  render() {
    const { places, duration, from, leftClick, rightClick, dayClick, weekClick, monthClick, resetClientClick, loading } = this.props

    const prepareDates = () => (<tr className={duration !== 'day' && styles.bottomBorder}>
      <td className={styles.placePadding}>{t([ 'occupancy', 'places' ])}</td>
      {Array(...{ length: duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS }).map((d, index) => {
        const date = moment(from).add(index, 'days')
        return duration === 'month' ?
          <td key={`d-${index}`} className={`${styles.center} ${styles.bold}`} colSpan={2}> {date.format('DD.')} <br /> {date.format('MM.')} </td> :
          <td key={`d-${index}`} className={`${styles.center} ${styles.bold}`} colSpan={duration === 'day' ? 24 : 2}>{date.locale(moment.locale()).format('ddd')} <br /> {date.format('DD.MM.')} </td>
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

      return places.sort(sorter).map(place => (<tr key={`${place.floor}-${place.label}`} className={styles.bottomBorder}>
        <td className={styles.rightBorder}>{`${place.floor}/${place.label}`}</td>
        {Array(...{ length: (duration === 'day' ? DAY * 12 : duration === 'week' ? WEEK_DAYS : MONTH_DAYS) * 2 }).map((o, index) => {
          const date = moment(from).locale(moment.locale()).add((duration === 'day' ? 0 : index / 2) * 24, 'hours')
          const classes = [
            (date.isoWeekday() === 6 || date.isoWeekday() === 7) && styles.weekend,
            duration !== 'day' && index % 2 === 1 && styles.rightBorder,
            duration !== 'day' && index % 2 === 0 && styles.rightBorderDotted,
            duration === 'day' && styles.rightBorderDotted,
            duration === 'day' && ((index + 1) % 6) - 3 === 0 && styles.rightBorder,
            duration === 'day' && (index + 1) % 6 === 0 && styles.boldBorder
          ]

          const renderReservation = reservation => {
            const classes = [ styles.reservation,
              moment().isBefore(moment(reservation.begins_at)) && styles.future,
              moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) && styles.ongoing,
              moment().isAfter(moment(reservation.ends_at)) && styles.fulfilled
            ]

            const begining = moment(reservation.begins_at)
            const dur = moment(reservation.ends_at).diff(begining.isSameOrBefore(from) ? from : begining, 'hours', true)
            const cellWidth = (tBodyWidth - WIDTH_OF_PLACE_CELL) / (duration === 'day' ? 24 : (duration === 'week' ? WEEK_DAYS : MONTH_DAYS) * 2)

            const mouseEnter = e => this.setState({
              content: <table className={styles.tooltipTable}><tbody>
                <tr><td>{t([ 'occupancy', 'reservationsId' ])}</td><td>{reservation.id}</td></tr>
                <tr><td>{t([ 'occupancy', 'driver' ])}</td><td>{reservation.user.full_name}</td></tr>
                {reservation.client && <tr><td>{t([ 'occupancy', 'client' ])}</td><td>{reservation.client.name}</td></tr>}
                <tr><td>{t([ 'occupancy', 'type' ])}</td><td>{reservation.client ? t([ 'reservations', 'host' ]) : t([ 'reservations', 'visitor' ])}</td></tr>
                <tr><td>{t([ 'occupancy', 'period' ])}</td><td>{moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')} - {moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
                <tr><td>{t([ 'occupancy', 'licencePlate' ])}</td><td>{reservation.car.licence_plate}</td></tr>
              </tbody></table>,
              mouseX:  e.target.getBoundingClientRect().right - 160,
              mouseY:  e.target.getBoundingClientRect().bottom - 60,
              visible: true,
              height:  '500px'
            })
            const mouseLeave = () => this.setState(INIT_STATE)

            return (<div
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
              className={classes.filter(o => o).join(' ')}
              style={{
                left: begining.isSameOrBefore(from) ? 0 : ((duration !== 'day' ?
                  (((begining.hours() % 12) + (begining.minutes() / 60)) / 12) :
                  (begining.minutes() / 60)) * cellWidth) + 'px',
                width: ((dur / (duration === 'day' ? 1 : 12)) * cellWidth) + 'px'
              }}
            >
              {reservation.car ? reservation.car.licence_plate + ' - ' + reservation.user.full_name : reservation.user.full_name}
            </div>)
          }

          return (<td key={`${place.floor}-${place.label}-${index}`} className={classes.filter(o => o).join(' ')} >
            {!index && <div className={styles.now} style={{ left: nowLinePosition + 'px' }} />}
            {!index && place.reservations.filter(reservation => moment(reservation.begins_at).isBefore(from) && !moment(reservation.ends_at).isSameOrBefore(from)).map(renderReservation) }
            {place.reservations.filter(reservation =>
              duration === 'day' ?
              moment(reservation.begins_at).isBetween(date.clone().add(index, 'hours'), date.clone().add(index + 1, 'hours'), null, '[)') :
              moment(reservation.begins_at).isBetween(date, date.clone().add(12, 'hours'), null, '[)')
            ).map(renderReservation.bind(this)) }
          </td>)
        })}
      </tr>))
    }

    return (
      <div>
        <table className={styles.table}>
          <thead> {/* style={{ width: this.tbody ? this.tbody.getBoundingClientRect().width : 0 + 'px', top: '60px' }}*/}
            {prepareDates()}
          </thead>
          <tbody ref={tbody => { this.tbody = tbody }}>
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
            {prepareBody()}
          </tbody>
        </table>

        <div className={styles.controlls}>
          <div> <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true" />} onClick={leftClick} /> </div>
          <div className={styles.flex}>
            <RoundButton content={t([ 'occupancy', 'dayShortcut' ])} onClick={dayClick} state={duration === 'day' && 'selected'} />
            <RoundButton content={t([ 'occupancy', 'weekShortcut' ])} onClick={weekClick} state={duration === 'week' && 'selected'} />
            <RoundButton content={t([ 'occupancy', 'monthShortcut' ])} onClick={monthClick} state={duration === 'month' && 'selected'} />
          </div>
          <div> <RoundButton content={<span className="fa fa-chevron-right" aria-hidden="true" />} onClick={rightClick} /> </div>
        </div>

        {Tooltip(this.state)}
      </div>
    )
  }
}
