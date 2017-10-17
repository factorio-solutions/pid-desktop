import React, { Component, PropTypes } from 'react'
import Swiper from 'swiper'
import moment from 'moment'

import RoundButton from '../buttons/RoundButton'
import CallToActionButton from '../buttons/CallToActionButton'

import { formatTime, MOMENT_DATETIME_FORMAT, toFifteenMinuteStep } from '../../helpers/time'

import styles from './MobileDateTimePicker.scss'
import '../../../../node_modules/swiper/dist/css/swiper.min.css'


const HOURS = Array.from(Array(24).keys())
const MINUTES = [0, 15, 30, 45]
const RENDER_DAYS = 41 // odd number please
const MIMIMUM_NUMBER_OF_SLIDES_LEFT = 16 // if less slides than this, add slides
const PRESENTED_DATE_FORMAT = 'ddd, DD. MMM YYYY'
const middleSlide = (RENDER_DAYS - 1) / 2


export default class MobileDateTimePicker extends Component {
  static propTypes = {
    dateTime: PropTypes.string,
    label:    PropTypes.string,
    onClick:  PropTypes.func.isRequired,
    actions:  PropTypes.array // [{label: '...', onClick: () => {...} }, ... ]
  }

  static defaultProps = {
    dateTime: formatTime(moment()),
    label:    'Select date',
    actions:  []
  }


  componentDidMount() {
    const formatedDateTime = moment(this.props.dateTime, MOMENT_DATETIME_FORMAT)

    const sharedSettings = {
      slidesPerView:  3,
      centeredSlides: true,
      height:         150,
      direction:      'vertical'
    }

    this.dateSwiper = new Swiper(`.${styles.dates}`, {
      ...sharedSettings,
      initialSlide: middleSlide,
      on:           {
        slideChange() {
          if (this.slides.length - MIMIMUM_NUMBER_OF_SLIDES_LEFT - 1 < this.activeIndex) {
            this.appendSlide(`<div class="swiper-slide"> ${moment(this.slides[this.slides.length - 1].innerText, PRESENTED_DATE_FORMAT).add(1, 'day').format(PRESENTED_DATE_FORMAT)} </div>`)
          }
        },
        transitionEnd() {
          if (this.activeIndex < MIMIMUM_NUMBER_OF_SLIDES_LEFT) {
            this.prependSlide(`<div class="swiper-slide"> ${moment(this.slides[0].innerText, PRESENTED_DATE_FORMAT).subtract(1, 'day').format(PRESENTED_DATE_FORMAT)} </div>`)
          }
        }
      }
    })
    this.hoursSwiper = new Swiper(`.${styles.hours}`, {
      ...sharedSettings,
      loop:         true,
      initialSlide: HOURS.indexOf(parseInt(formatedDateTime.format('HH'), 10))
    })
    this.minutesSwiper = new Swiper(`.${styles.minutes}`, {
      ...sharedSettings,
      loop:         true,
      initialSlide: MINUTES.indexOf(toFifteenMinuteStep(formatedDateTime.format('mm')))
    })
  }

  render() {
    const { dateTime, label, onClick, actions } = this.props

    const toSlide = object => <div className="swiper-slide"> {object} </div>

    const toActionButton = action => <CallToActionButton {...action} />

    const days = Array.from(new Array(RENDER_DAYS), (val, index) =>
      moment(dateTime, MOMENT_DATETIME_FORMAT).subtract(index - middleSlide, 'days').format(PRESENTED_DATE_FORMAT)
    ).reverse().map(toSlide)

    const setDate = () => {
      onClick(
        moment([
          this.dateSwiper.slides[this.dateSwiper.activeIndex].innerText,
          this.hoursSwiper.slides[this.hoursSwiper.activeIndex].innerText,
          this.minutesSwiper.slides[this.minutesSwiper.activeIndex].innerText
        ].join(', '), `${PRESENTED_DATE_FORMAT}, HH, mm`)
        .format(MOMENT_DATETIME_FORMAT)
      )
    }

    return (
      <div>
        {label && <h2>{label}</h2>}

        <div className={styles.datetimepicker}>
          <div className={styles.dimmer} />
          <div className={styles.dates}>
            <div className="swiper-wrapper">
              {days}
            </div>
          </div>

          <div className={styles.hours}>
            <div className="swiper-wrapper">
              {HOURS.map(toSlide)}
            </div>
          </div>

          <div className={styles.minutes}>
            <div className="swiper-wrapper">
              {MINUTES.map(toSlide)}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <div>
            { actions.map(toActionButton) }
          </div>
          <div>
            <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={setDate} type="confirm" />
          </div>
        </div>
      </div>

    )
  }
}
