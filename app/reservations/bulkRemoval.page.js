import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import Checkbox           from '../_shared/components/checkbox/Checkbox'
import Dropdown           from '../_shared/components/dropdown/Dropdown'
import DatetimeInput      from '../_shared/components/input/DatetimeInput'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'
import Loading            from '../_shared/components/loading/Loading'
import Modal              from '../_shared/components/modal/Modal'

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
    this.props.actions.resetTimes()
    this.props.actions.loadAvailableUsers()
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
    const onChecked = () => actions.toggleReservation(reservation.id)

    return (
      <Checkbox checked={state.toBeRemoved.includes(reservation.id)} onChange={onChecked}>
        <b>{startsAtDate}</b> {startsAtTime} - <b>{endsAtDate}</b> {endsAtTime}
      </Checkbox>
    )
  }

  formatClient = client => {
    const { actions, state } = this.props
    const onChange = checked => actions.setReservationsInClient(checked, client)
    const isChecked = !!client.reservations.find(res => state.toBeRemoved.includes(res.id))

    return (
      <div>
        <div className={styles.h3BorderBottom}>
          <Checkbox checked={isChecked} onChange={onChange}>
            <h3> {client.name} </h3>
          </Checkbox>
        </div>
        {client.reservations.map(this.formatReservation)}
      </div>
    )
  }

  formatGarage = garage => {
    const { actions, state } = this.props
    const onChange = checked => garage.clients.forEach(client => actions.setReservationsInClient(checked, client))
    const isChecked = !!garage.clients.find(cli => cli.reservations.find(res => state.toBeRemoved.includes(res.id)))

    return (
      <div>
        <div className={styles.h2BorderBottom}>
          <Checkbox checked={isChecked} onChange={onChange}>
            <h2> {garage.name} </h2>
          </Checkbox>
        </div>
        {garage.clients.map(this.formatClient)}
      </div>
    )
  }

  render() {
    const { state, actions, pageBase } = this.props
    const allGarages = state.garages

    return (
      <PageBase>
        <Modal show={state.loading}>
          <Loading />
        </Modal>

        <div className={styles.container}>
          <h1>{t([ 'bulkCancellation', 'bulkCancellation' ])}</h1>
          {((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) &&
            <div>
              <Dropdown
                label={t([ 'newReservation', 'selectUser' ])}
                content={this.userDropdown()}
                selected={state.availableUsers.findIndexById(state.userId)}
                highlight={state.highlight}
                style="reservation"
                filter
              />
            </div>
          }
          <DatetimeInput
            onChange={actions.adjustFromDate}
            label={t([ 'newReservation', 'begins' ])}
            error={t([ 'newReservation', 'invalidaDate' ])}
            value={state.from}
          />
          <DatetimeInput
            onChange={actions.adjustToDate}
            label={t([ 'newReservation', 'ends' ])}
            error={t([ 'newReservation', 'invalidaDate' ])}
            value={state.to}
          />

          <div className={styles.centerDiv}>
            <CallToActionButton
              label={t([ 'bulkCancellation', 'findReservations' ])}
              onClick={actions.loadReservations}
            />
          </div>

          {allGarages && (allGarages.noData ?
            <div className={styles.centerDiv}>
              <h1>{t([ 'bulkCancellation', 'noReservations' ])}</h1>
            </div> :
            <div className={`${styles.centerDiv} ${styles.padding}`}>
              {allGarages.map(this.formatGarage)}
            </div>)
          }

          <div className={styles.centerDiv}>
            <CallToActionButton
              label={t([ 'bulkCancellation', 'cancelReservations' ])}
              onClick={actions.interuptAllSelectedReservations}
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
