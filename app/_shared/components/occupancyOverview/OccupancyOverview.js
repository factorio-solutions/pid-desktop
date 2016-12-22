import React, { Component, PropTypes }  from 'react'
import moment                           from 'moment'
import styles                           from './OccupancyOverview.scss'
import RoundButton                      from '../buttons/RoundButton'
import { t }                            from '../../modules/localization/localization'

const WEEK_DAYS   = 7
const MONTH_DAYS  = 30


export default class OccupancyOverview extends Component{
  static propTypes = {
    places:     PropTypes.array.isRequired,
    from:       PropTypes.object,
    duration:   PropTypes.string,
    leftClick:  PropTypes.func,
    rightClick: PropTypes.func,
    weekClick:  PropTypes.func,
    monthClick: PropTypes.func
  }

  onWindowResize(){
    console.log('Resize OccupancyOverview.js');
    this.forceUpdate()
  }

  componentDidMount () {
    window.addEventListener('resize', this.onWindowResize.bind(this), true);
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize.bind(this), true);
  }

  componentDidUpdate(prevProps){
    if (this.props.places.length > 0){
      const intervalLength = moment(this.props.from).add(1, this.props.duration).diff( moment(this.props.from))
      const rowWidth = this.refs.tableBody.childNodes[0].getBoundingClientRect().width - this.refs.tableBody.childNodes[0].childNodes[0].getBoundingClientRect().width

      for (var i = 0; i < this.props.places.length; i++) {
        var validReservations = this.props.places[i].reservations.filter((reservation) => {
          return moment(reservation.begins_at).isBetween(this.props.from, moment(this.props.from).add(1, this.props.duration))
              || moment(reservation.ends_at).isBetween(this.props.from, moment(this.props.from).add(1, this.props.duration))
              || moment(reservation.begins_at).isBefore(this.props.from) &&  moment(reservation.ends_at).isAfter(moment(this.props.from).add(1, this.props.duration))
        })

        const theRow = this.refs.tableBody.childNodes[i].childNodes[1]
        while (theRow.firstChild) { // clear reservation divs
          theRow.removeChild(theRow.firstChild);
        }

        // reservation divs
        for (var j = 0; j < validReservations.length; j++) {
          var reservationStart = (moment(validReservations[j].begins_at).diff(this.props.from)/intervalLength)*rowWidth
          var reservationEnd = (moment(validReservations[j].ends_at).diff(this.props.from)/intervalLength)*rowWidth
          reservationStart = reservationStart < 0 ? 0 : reservationStart
          reservationEnd = reservationEnd > rowWidth ? rowWidth : reservationEnd

          var reservation = document.createElement("DIV")
          reservation.className = styles.reservationDiv
          reservation.setAttribute("style", `left: ${reservationStart}px; width: ${reservationEnd - reservationStart}px;`)
          theRow.appendChild(reservation)
        }

        //now line
        var nowPosition = (moment().diff(this.props.from)/intervalLength)*rowWidth
        if ( nowPosition > 0 && nowPosition < rowWidth ) {
          var now = document.createElement("DIV")
          now.className = styles.nowLine
          now.setAttribute("style", `left: ${nowPosition}px;`)
          theRow.appendChild(now)
        }
      }
    }
  }

  render(){
    const { places, leftClick, rightClick, weekClick, monthClick } = this.props

    const prepareDates = () => {
      const length = this.props.duration == 'week' ? WEEK_DAYS : MONTH_DAYS
      var days = []
      for (var i = 0; i < length; i++) {
        const curr_date = moment(this.props.from).add(i,'days')
        days.push(<td key={i} className={`${styles.center} ${styles.date}`} colSpan={2}> {curr_date.format('ddd')} <br/> {curr_date.format('DD.MM.')} </td>)
      }
      return days
    }

    const prepareBody = () => {
      return places.map((place) => {
        const prepareRow = () => {
          var row = []
          const length = (this.props.duration == 'week' ? WEEK_DAYS : MONTH_DAYS) * 2
          for (var i = 0; i < length; i++) {
            var tdStyles = [
              (i) % (2) == 1 ? styles.rightBorder : '',
              (i) % (2) == 0 ? styles.rightBorderDotted : ''
            ]
            row.push(<td key={i} className={tdStyles.join(' ')}> </td>)
          }
          return row
        }

        return (<tr className={`${styles.bottomBorder} ${styles.rightBorder}`} key={place.id} ref={place.id}>
            <td className={`${styles.date} ${styles.rightBorder} ${styles.placePadding}`}>{place.floor + " / " + place.label}</td>
            {prepareRow()}
          </tr>)
      })
    }

    return(
      <div>

        <div className={styles.occupacny}>
          <table>
            <thead>
              <tr className={styles.bottomBorder}>
                <td className={styles.placePadding}>{t(['occupancy', 'places'])}</td>
                {prepareDates()}
              </tr>
            </thead>
            <tbody ref="tableBody">
              {prepareBody()}
            </tbody>
          </table>
        </div>

        <div className={styles.controlls}>
          <div className={`${styles.flex}`}> <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={leftClick} /> </div>
          <div className={`${styles.flex} ${styles.center}`}>
            <RoundButton content={t(['occupancy', 'weekShortcut'])} onClick={weekClick} state={this.props.duration=="week" && "selected"}/>
            <RoundButton content={t(['occupancy', 'monthShortcut'])} onClick={monthClick} state={this.props.duration=="month" && "selected"} />
          </div>
          <div className={`${styles.flex} ${styles.right}`}> <RoundButton content={<span className='fa fa-chevron-right' aria-hidden="true"></span>} onClick={rightClick} /> </div>
        </div>
      </div>
    )
  }
}
