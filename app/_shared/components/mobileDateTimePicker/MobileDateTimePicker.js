import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Swiper from 'swiper/dist/js/swiper.min.js'
import moment from 'moment'
import 'swiper/dist/css/swiper.min.css'

import RoundButton from '../buttons/RoundButton'
import CallToActionButton from '../buttons/CallToActionButton'

import { formatTime, MOMENT_DATETIME_FORMAT, toFifteenMinuteStep, isBeforeFormated } from '../../helpers/time'

import styles from './MobileDateTimePicker.scss'


const HOURS = Array.from(Array(24).keys()).map(o => o % 24)
const MINUTES = Array.from(Array(4 * 6).keys()).map(o => (o % 4) * 15) // HACK: array repeated 6x to be less likely to fail transition
const RENDER_DAYS = 41 // odd number please
const MIMIMUM_NUMBER_OF_SLIDES_LEFT = 16 // if less slides than this, add slides
const PRESENTED_DATE_FORMAT = 'ddd, DD. MMM YYYY'
const middleSlide = (RENDER_DAYS - 1) / 2


export default class MobileDateTimePicker extends Component {
  static propTypes = {
    dateTime:     PropTypes.string,
    notLowerThan: PropTypes.string, // should not render dates lower than this date
    label:        PropTypes.string,
    onClick:      PropTypes.func.isRequired,
    actions:      PropTypes.array // [{label: '...', onClick: () => {...} }, ... ]
  }

  static defaultProps = {
    dateTime:     formatTime(moment()),
    label:        'Select date',
    actions:      [],
    notLowerThan: formatTime(moment())
  }


  componentDidMount() {
    const formatedDateTime = moment(this.props.dateTime, MOMENT_DATETIME_FORMAT)

    const sharedSettings = {
      slidesPerView:  3,
      centeredSlides: true,
      height:         150,
      direction:      'vertical',
      lazyLoading:    true
    }

    const hourMinutesSharedSettings = {
      ...sharedSettings,
      loop:                 true,
      loopAdditionalSlides: 24
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
      ...hourMinutesSharedSettings,
      initialSlide: HOURS.indexOf(parseInt(formatedDateTime.format('HH'), 10))
    })
    this.minutesSwiper = new Swiper(`.${styles.minutes}`, {
      ...hourMinutesSharedSettings,
      initialSlide: MINUTES.indexOf(toFifteenMinuteStep(formatedDateTime.format('mm')))
    })
  }

  render() {
    const { dateTime, label, onClick, actions } = this.props

    const toSlide = key => (object, i) => <div key={`${key}${i}`} className="swiper-slide"> {object} </div>

    const toActionButton = action => <CallToActionButton key={action.label} {...action} />

    const days = Array.from(new Array(RENDER_DAYS), (val, index) =>
      moment(dateTime, MOMENT_DATETIME_FORMAT).subtract(index - middleSlide, 'days').format(PRESENTED_DATE_FORMAT)
    ).reverse().map(toSlide('day'))

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
        {label && <h2 className={styles.title}>{label}</h2>}

        <div className={styles.datetimepicker}>
          <div className={styles.dimmer} />
          <div className={styles.dates}>
            <div className="swiper-wrapper">
              {days}
            </div>
          </div>

          <div className={styles.hours}>
            <div className="swiper-wrapper">
              {HOURS.map(toSlide('hour'))}
            </div>
          </div>

          <div className={styles.minutes}>
            <div className="swiper-wrapper">
              {MINUTES.map(toSlide('minute'))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <div>
            {actions.map(toActionButton)}
          </div>
          <div>
            <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={setDate} type="confirm" />
          </div>
        </div>
      </div>
    )
  }
}
