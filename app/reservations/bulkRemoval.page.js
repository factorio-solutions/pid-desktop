import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import Checkbox           from '../_shared/components/checkbox/checkbox'
import Dropdown           from '../_shared/components/dropdown/Dropdown'
import DatetimeInput      from '../_shared/components/input/DatetimeInput'
import ButtonStack        from '../_shared/components/buttonStack/ButtonStack'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'

import * as bulkRemovalActions from '../_shared/actions/reservationsBulkRemoval.actions'
import { setCustomModal }      from '../_shared/actions/pageBase.actions'
import { t }                   from '../_shared/modules/localization/localization'
import { MOMENT_DATE_FORMAT }  from '../_shared/helpers/time'

import styles from './bulkRemoval.page.scss'


class BulkRemovalReservationPage extends Component {

  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    pageBase: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initStorage()
  }

  getUserToSelect = () => {
    const { state } = this.props
    return state.availableUsers.findIndex(user => state.userId && user.id === state.userId)
  }

  userDropdown = () => this.props.state.availableUsers.map(user => ({
    label: user.full_name,
    order: user.id === this.props.pageBase.current_user.id ?
      2 :
      user.id === -1 ?
        1 :
        undefined,
    onClick: () => this.props.actions.setUserId(user.id)
  }))

  formatReservation = reservation => {
    const { actions, state } = this.props
    const startsAtDate = moment(reservation.begins_at).format(MOMENT_DATE_FORMAT)
    const startsAtTime = moment(reservation.begins_at).format('HH:mm')
    const endsAtDate = moment(reservation.ends_at).format(MOMENT_DATE_FORMAT)
    const endsAtTime = moment(reservation.ends_at).format('HH:mm')
    const onChecked = () => {
      actions.setReservationToBeRemove(reservation.id)
    }
    return (
      <Checkbox
        checked={state.toBeRemoved.includes(reservation.id)}
        onChange={onChecked}
      > <b>{startsAtDate}</b> {startsAtTime} - <b>{endsAtDate}</b> {endsAtTime}
      </Checkbox>
    )
  }

  formatClient = client => {
    const { actions, state } = this.props
    const onChange = event => {
      if (event.target.checked) {
        actions.setClientsReservationsToBeRemove(client)
      } else {
        actions.unsetClientsReservationsToBeRemove(client)
      }
    }

    const isChecked = () => {
      const { toBeRemoved } = state
      return client.reservations.reduce((acc, reserv) => {
        return acc && toBeRemoved.includes(reserv.id)
      }, true)
    }

    return (
      <div>
        <div className={styles.h3BorderBotom}>
          <Checkbox
            checked={isChecked()}
            onChange={onChange}
          > <h3> {client.name} </h3>
          </Checkbox>
        </div>
        {client.reservations.map(this.formatReservation)}
      </div>
    )
  }

  formatGarage = garage => {
    const { actions, state } = this.props
    const onChange = event => {
      if (event.target.checked) {
        garage.clients.forEach(client => {
          actions.setClientsReservationsToBeRemove(client)
        })
      } else {
        garage.clients.forEach(client => {
          actions.unsetClientsReservationsToBeRemove(client)
        })
      }
    }
    const isChecked = () => {
      const { toBeRemoved } = state
      return garage.clients.reduce((acc, client) => {
        return acc && client.reservations.reduce((accc, reservation) => {
          return accc && toBeRemoved.includes(reservation.id)
        }, acc)
      }, true)
    }
    return (
      <div>
        <div className={styles.h2BorderBotom}>
          <Checkbox
            checked={isChecked()}
            onChange={onChange}
          > <h2> {garage.name} </h2>
          </Checkbox>
        </div>
        {garage.clients.map(this.formatClient)}
      </div>
    )
  }

  findReservationsOnClick = () => {
    const { actions } = this.props
    actions.loadReservations()
  }

  cancelSelectedReservations = () => {
    const { actions } = this.props
    actions.destroyAllSelectedReservations()
  }

  render() {
    const { state, actions, pageBase } = this.props
    const allGarages = state.garages

    const beginsInlineMenu = <span className={styles.clickable} onClick={actions.beginsToNow}>{t([ 'newReservation', 'now' ])}</span>
    const endsInlineMenu = (<ButtonStack style="horizontal" divider={<span> | </span>}>
      <span className={`${state.durationDate ? styles.selected : styles.clickable}`} onClick={this.handleDuration} >{t([ 'newReservation', 'duration' ])}</span>
      <span className={`${!state.durationDate ? styles.selected : styles.clickable}`} onClick={this.handleDate} >{t([ 'newReservation', 'date' ])}</span>
    </ButtonStack>)

    return (
      <PageBase>
        <div className={styles.container}>
          <h1>{t([ 'bulkCancellation', 'bulkCancellation' ])}</h1>
          {((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) &&
            <div>
              <Dropdown
                label={t([ 'newReservation', 'selectUser' ])}
                content={this.userDropdown()}
                selected={this.getUserToSelect()}
                highlight={state.highlight}
                style="reservation"
              />
            </div>
          }
          <DatetimeInput
            onChange={actions.adjustFromDate}
            label={t([ 'newReservation', 'begins' ])}
            error={t([ 'newReservation', 'invalidaDate' ])}
            value={state.from}
            inlineMenu={beginsInlineMenu}
          />
          <DatetimeInput
            onChange={actions.adjustToDate}
            label={t([ 'newReservation', 'ends' ])}
            error={t([ 'newReservation', 'invalidaDate' ])}
            value={state.to}
            inlineMenu={endsInlineMenu}
          />
          <div className={styles.centerDiv}>
            <CallToActionButton
              label={t([ 'bulkCancellation', 'findReservations' ])}
              onClick={this.findReservationsOnClick}
            />
          </div>
          {allGarages && !allGarages.noData &&
            <div className={styles.centerDiv}>
              <div className={styles.padding}>
                {allGarages.map(this.formatGarage)}
              </div>
            </div>
          }
          {allGarages && allGarages.noData &&
            <div className={styles.centerDiv}>
              <h1>{t([ 'bulkCancellation', 'noReservations' ])}</h1>
            </div>
          }
          <div className={styles.centerDiv}>
            <CallToActionButton
              label={t([ 'bulkCancellation', 'cancelReservations' ])}
              onClick={this.cancelSelectedReservations}
              type="remove"
              state={state.toBeRemoved.length === 0 ? 'disabled' : ''}
            />
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.reservationBulkRemoval, pageBase: state.pageBase }),
  dispatch => ({
    actions: bindActionCreators({ ...bulkRemovalActions, setCustomModal }, dispatch)
  })
)(BulkRemovalReservationPage)
