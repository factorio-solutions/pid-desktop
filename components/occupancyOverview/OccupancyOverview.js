import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import moment                           from 'moment'

import RoundButton from '../buttons/RoundButton'
import Tooltip     from '../tooltip/Tooltip'

import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

const DAY        = 1
const WEEK_DAYS  = 7
const MONTH_DAYS = 30
const INIT_STATE = { content:       ''
                   , mouseX:        0
                   , mouseY:        0
                   , visible:       false
                   , height:        '500px'
                   }


export class OccupancyOverview extends Component{
  static propTypes = {
    places:     PropTypes.array.isRequired,
    from:       PropTypes.object,
    duration:   PropTypes.string,
    leftClick:  PropTypes.func,
    rightClick: PropTypes.func,
    weekClick:  PropTypes.func,
    monthClick: PropTypes.func
  }

  constructor(props) {
     super(props)
     this.state = INIT_STATE
     this.onWindowResize = this.onWindowResize.bind(this)
  }

  onWindowResize(){
    this.tbody.style['max-height'] = (Math.max(document.documentElement.clientHeight, window.innerHeight || 780) - 230) + 'px'
    this.forceUpdate()
  }

  componentDidMount () {
    window.addEventListener('resize', this.onWindowResize, true);
    this.onWindowResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize, true);
  }

  componentDidUpdate(prevProps){
    if (this.props.places.length > 0){
      const intervalLength = moment(this.props.from).add(1, this.props.duration).diff( moment(this.props.from))
      const rowWidth = this.tbody.childNodes[0].getBoundingClientRect().width - this.tbody.childNodes[0].childNodes[0].getBoundingClientRect().width

      for (var i = 0; i < this.props.places.length; i++) {
        var validReservations = this.props.places[i].reservations.filter((reservation) => {
          return moment(reservation.begins_at).isBetween(this.props.from, moment(this.props.from).add(1, this.props.duration))
              || moment(reservation.ends_at).isBetween(this.props.from, moment(this.props.from).add(1, this.props.duration))
              || moment(reservation.begins_at).isBefore(this.props.from) &&  moment(reservation.ends_at).isAfter(moment(this.props.from).add(1, this.props.duration))
        })

        const theRow = this.tbody.childNodes[i].childNodes[1]
        while (theRow.firstChild) { // clear reservation divs
          theRow.removeChild(theRow.firstChild);
        }

        // reservation divs
        for (var j = 0; j < validReservations.length; j++) {
          const reservation = validReservations[j]
          var reservationStart = (moment(reservation.begins_at).diff(this.props.from)/intervalLength)*rowWidth
          var reservationEnd = (moment(reservation.ends_at).diff(this.props.from)/intervalLength)*rowWidth
          reservationStart = reservationStart < 0 ? 0 : (reservationStart - 1.5)
          reservationEnd = reservationEnd > rowWidth ? rowWidth : (reservationEnd - 4)

          moment().isBefore(moment(reservation.begins_at)) ? styles.future : ''
          moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) ? styles.ongoing: ''
          moment().isAfter(moment(reservation.ends_at)) ? styles.fulfilled : ''

          var reservationElement = document.createElement("DIV")
          var span = document.createElement("SPAN")
          span.appendChild(document.createTextNode(reservation.car ? reservation.car.licence_plate +" - "+ reservation.user.full_name : reservation.user.full_name))
          reservationElement.appendChild(span)
          reservationElement.className = [ styles.reservationDiv
                                         , moment().isBefore(moment(reservation.begins_at)) ? styles.future : ''
                                         , moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) ? styles.ongoing: ''
                                         , moment().isAfter(moment(reservation.ends_at)) ? styles.fulfilled : ''
                                         ].join(' ')
          reservationElement.setAttribute("style", `left: ${reservationStart}px; width: ${reservationEnd - reservationStart}px;`) // HACK: Dont forget to substract padding!

          reservationElement.onmouseenter = () => { this.setState({ ...this.state, visible: true, content: <table className={styles.tooltipTable}><tbody>
              <tr><td>{t(['occupancy', 'reservationsId'])}</td><td>{reservation.id}</td></tr>
              <tr><td>{t(['occupancy', 'driver'])}</td><td>{reservation.user.full_name}</td></tr>
              {reservation.client && <tr><td>{t(['occupancy', 'client'])}</td><td>{reservation.client.name}</td></tr>}
              <tr><td>{t(['occupancy', 'type'])}</td><td>{reservation.client ? t(['reservations','host']) : t(['reservations','visitor'])}</td></tr>
              <tr><td>{t(['occupancy', 'period'])}</td><td>{moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')} - {moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
              <tr><td>{t(['occupancy', 'licencePlate'])}</td><td>{reservation.car.licence_plate}</td></tr>
            </tbody></table> }) }
          reservationElement.onmousemove = (event) => { this.setState({ ...this.state, mouseX: event.clientX - 160 - (this.props.showSecondaryMenu ? 200 : 0), mouseY: event.clientY - 60 }) }
          reservationElement.onmouseleave = (event) => { this.setState({ ...this.state, visible: false }) }

          theRow.appendChild(reservationElement)
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
    const { places, leftClick, rightClick, dayClick, weekClick, monthClick } = this.props

    const prepareDates = () => {
      const length = this.props.duration === "day" ? DAY : this.props.duration == 'week' ? WEEK_DAYS : MONTH_DAYS
      var days = []
      for (var i = 0; i < length; i++) {
        // if (this.props.duration === 'month'){
        //   if (i%3 === 0) {
        //     const curr_date = moment(this.props.from).add(i,'days')
        //     days.push(<td key={i} className={`${styles.center} ${styles.date}`} colSpan={6}> {curr_date.format('ddd')} <br/> {curr_date.format('DD.MM.')} </td>)
        //   }
        // }else{
        //   const curr_date = moment(this.props.from).add(i,'days')
        //   days.push(<td key={i} className={`${styles.center} ${styles.date}`} colSpan={2}> {curr_date.format('ddd')} <br/> {curr_date.format('DD.MM.')} </td>)
        // }
        const curr_date = moment(this.props.from).add(i,'days')
        if (this.props.duration === 'month'){
          days.push(<td key={i} className={`${styles.center} ${styles.date}`} colSpan={2}> {curr_date.format('DD.')} <br/> {curr_date.format('MM.')} </td>)
        } else {
          days.push(<td key={i} className={`${styles.center} ${styles.date}`} colSpan={2}> {curr_date.format('ddd')} <br/> {curr_date.format('DD.MM.')} </td>)
        }
      }
      return days
    }

    const prepareBody = () => {
      const sorter = (a,b) => { // will sort place according to floors then labels
        if(a.floor < b.floor) return -1;
        if(a.floor > b.floor) return 1;
        if(parseInt(a.label) < parseInt(b.label)) return -1;
        if(parseInt(a.label) > parseInt(b.label)) return 1;
        if(a.label < b.label) return -1;
        if(a.label > b.label) return 1;
        return 0;
      }

      return places.sort(sorter).map((place) => {
        const prepareRow = () => {
          var row = []
          const length = (this.props.duration === "day" ? DAY : this.props.duration == 'week' ? WEEK_DAYS : MONTH_DAYS) * 2
          for (var i = 0; i < length; i++) {
            const weekday = moment(this.props.from).add(Math.floor(i/2),'days').weekday()
            var tdStyles = [
              weekday === 0 || weekday === 6 ? styles.weekend : '',
              (i) % (2) == 1 ? styles.rightBorder : '',
              (i) % (2) == 0 ? styles.rightBorderDotted : ''
            ]
            row.push(<td key={i} className={tdStyles.join(' ')}> </td>)
          }
          return row
        }

        return (<tr className={`${styles.bottomBorder} ${styles.rightBorder} ${styles.hover}`} key={place.id} ref={place.id}>
            <td className={`${styles.date} ${styles.rightBorder} ${styles.placePadding}`}>{place.floor + " / " + place.label}</td>
            {prepareRow()}
          </tr>)
      })
    }

    return(
      <div>
        <div className={styles.occupacny}  ref={(div) => { this.container = div }}>
          <table onMouseMove={()=>{this.setState({...this.state, visible:false})}}>
            <thead>
              <tr className={styles.bottomBorder}>
                <td className={styles.placePadding}>{t(['occupancy', 'places'])}</td>
                {prepareDates()}
              </tr>
            </thead>
            <tbody ref={tbody => {this.tbody = tbody}}>
              {prepareBody()}
            </tbody>
          </table>
        </div>

        <div className={styles.controlls}>
          <div className={`${styles.flex}`}> <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={leftClick} /> </div>
          <div className={`${styles.flex} ${styles.center}`}>
            <RoundButton content={t(['occupancy', 'dayShortcut'])} onClick={dayClick} state={this.props.duration=="day" && "selected"}/>
            <RoundButton content={t(['occupancy', 'weekShortcut'])} onClick={weekClick} state={this.props.duration=="week" && "selected"}/>
            <RoundButton content={t(['occupancy', 'monthShortcut'])} onClick={monthClick} state={this.props.duration=="month" && "selected"} />
          </div>
          <div className={`${styles.flex} ${styles.right}`}> <RoundButton content={<span className='fa fa-chevron-right' aria-hidden="true"></span>} onClick={rightClick} /> </div>
        </div>
        {Tooltip(this.state)}
      </div>
    )
  }
}

export default connect(
  state    => ({ showSecondaryMenu: state.pageBase.showSecondaryMenu }),
  dispatch => ({ actions: {} })
)(OccupancyOverview)
