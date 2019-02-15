import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import DateInput          from '../../_shared/components/input/DateInput'
import TimeInput          from '../../_shared/components/input/TimeInput'
import Input              from '../../_shared/components/input/Input'
import ButtonStack        from '../../_shared/components/buttonStack/ButtonStack'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import Checkbox           from '../../_shared/components/checkbox/Checkbox'

import {
  formatFrom,
  setFromDate,
  setFromTime,
  formatTo,
  setToDate,
  setToTime,
  durationChange,
  setShowRecurring,
  setFrom,
  setTo
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import {
  MOMENT_DATETIME_FORMAT,
  MOMENT_DATE_FORMAT, MOMENT_TIME_FORMAT,
  MOMENT_UTC_DATETIME_FORMAT_DASH
} from '../../_shared/helpers/time'

import describeRule               from '../../_shared/helpers/recurringRuleToDescribtion'

import styles from '../newReservation.page.scss'
import inputStyles from '../../_shared/components/input/ReservationInput.scss'
import checkboxStyles     from '../../_shared/components/checkbox/ReservationCheckbox.scss'

class DateTimeForm extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    editable: PropTypes.bool
  }


  setGreatestFreeInterval = () => {
    const { state, actions } = this.props
    const interval = state.freeInterval.split(', ').map(date => moment(date, MOMENT_UTC_DATETIME_FORMAT_DASH))
    actions.setFrom(interval[0].format(MOMENT_DATETIME_FORMAT))
    actions.setTo(interval[1].format(MOMENT_DATETIME_FORMAT))
    actions.formatFrom()
    actions.formatTo(true)
  }

  handleDuration = () => this.props.actions.setDurationDate(true)

  handleDate = () => this.props.actions.setDurationDate(false)

  endsInlineMenu = () => {
    const { state } = this.props
    return (
      <ButtonStack style="horizontal" divider={<span> | </span>}>
        <span
          role="button"
          tabIndex={0}
          className={`${state.durationDate ? styles.selected : styles.clickable}`}
          onClick={this.handleDuration}
        >
          {t([ 'newReservation', 'duration' ])}
        </span>
        <span
          role="button"
          tabIndex={0}
          className={`${!state.durationDate ? styles.selected : styles.clickable}`}
          onClick={this.handleDate}
        >
          {t([ 'newReservation', 'date' ])}
        </span>
      </ButtonStack>)
  }

  showRecurring = () => this.props.actions.setShowRecurring(true)

  freeIntervalLabel = () => {
    const { state: { freeInterval } } = this.props
    const interval = freeInterval.split(', ').map(date => moment(date, MOMENT_UTC_DATETIME_FORMAT_DASH))
    const dateFrom = interval[0].format(MOMENT_DATE_FORMAT)
    const timeForm = interval[0].format(MOMENT_TIME_FORMAT)
    const dateTo = interval[1].format(MOMENT_DATE_FORMAT)
    const timeTo = interval[1].format(MOMENT_TIME_FORMAT)

    return (
      <div>
        <b>{t([ 'newReservation', 'AlternativeInterval' ])}</b>
        <div className={styles.dateTimeContainer}>
          <div className={styles.leftCollumn}>
            {dateFrom}<br />
            {timeForm}
          </div>
          <div className={styles.middleCollumn} >
            <i className="fa fa-arrow-right" aria-hidden="true" />
          </div>
          <div className={styles.rightCcollumn}>
            {dateTo}<br />
            {timeTo}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { state, actions, editable } = this.props

    const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT)
      .diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1

    return (
      <div>
        <div className={styles.dateTimeContainer}>
          <div className={styles.leftCollumn}>
            <DateInput
              editable={editable}
              onBlur={actions.formatFrom}
              onChange={actions.setFromDate}
              label={`${t([ 'newReservation', 'begins' ])} *`}
              error={t([ 'newReservation', 'invalidaDate' ])}
              value={moment(state.from, MOMENT_DATETIME_FORMAT).format(MOMENT_DATE_FORMAT)}
              style={inputStyles}
              pickerOnFocus
            />
            <TimeInput
              editable={editable}
              onBlur={actions.formatFrom}
              onChange={actions.setFromTime}
              label={`${t([ 'newReservation', 'begins' ])} *`}
              error={t([ 'newReservation', 'invalidaDate' ])}
              value={moment(state.from, MOMENT_DATETIME_FORMAT).format(MOMENT_TIME_FORMAT)}
              style={inputStyles}
              pickerOnFocus
            />
          </div>
          <div className={styles.middleCollumn} />
          <div className={styles.rightCcollumn}>
            <DateInput
              onBlur={actions.formatTo}
              onChange={actions.setToDate}
              label={`${t([ 'newReservation', 'ends' ])} *`}
              error={t([ 'newReservation', 'invalidaDate' ])}
              value={moment(state.to, MOMENT_DATETIME_FORMAT).format(MOMENT_DATE_FORMAT)}
              style={inputStyles}
              pickerOnFocus
            />
            <TimeInput
              onBlur={actions.formatTo}
              onChange={actions.setToTime}
              label={`${t([ 'newReservation', 'ends' ])} *`}
              error={t([ 'newReservation', 'invalidaDate' ])}
              value={moment(state.to, MOMENT_DATETIME_FORMAT).format(MOMENT_TIME_FORMAT)}
              style={inputStyles}
              pickerOnFocus
            />
          </div>
        </div>

        {state.garage
        && state.freeInterval
        && state.garage.floors.reduce((freeFloors, floor) => freeFloors && floor.free_places.length === 0, true)
        && (
          <CallToActionButton
            label={this.freeIntervalLabel()}
            type="alternativeTime"
            onClick={this.setGreatestFreeInterval}
          />
        )
        }


        {/* Duration Input */}
        {state.durationDate &&
          <Input
            onChange={actions.durationChange}
            label={t([ 'newReservation', 'duration' ])}
            error={t([ 'newReservation', 'invalidaValue' ])}
            inlineMenu={this.endsInlineMenu()}
            value={String(moment.duration(moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT))).asHours())}
            type="number"
            min={0.25}
            step={0.25}
            align="left"
            style="gray"
          />
        }

        {/* Recurring reservation */}
        {/* Recurring modal is in newReservationPage because Recurring component contains Form */}
        {state.reservation === undefined &&
          <div className={`${styles.recurringForm} ${overMonth && styles.hidden}`}>
            <div>
              <Checkbox
                onChange={this.showRecurring}
                checked={state.useRecurring}
                style={checkboxStyles}
              >
                <span
                  role="button"
                  tabIndex={0}
                  className={`${styles.rule} ${!state.useRecurring && styles.disabled}`}
                  onClick={this.showRecurring}
                >
                  {(state.useRecurring) ? describeRule(state.recurringRule) : t([ 'recurringReservation', 'repeat' ])}
                </span>
              </Checkbox>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default connect(
  state => {
    const {
      from, to, recurringRule, useRecurring, garage, freeInterval
    } = state.newReservation
    return {
      state: {
        from, to, recurringRule, useRecurring, garage, freeInterval
      }
    }
  },
  dispatch => ({
    actions: bindActionCreators({
      formatFrom,
      setFromDate,
      setFromTime,
      formatTo,
      setToDate,
      setToTime,
      durationChange,
      setShowRecurring,
      setFrom,
      setTo
    },
    dispatch)
  })
)(DateTimeForm)
