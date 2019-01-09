import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'

import Input             from '../../_shared/components/input/Input'
import SectionWithHeader from '../../_shared/components/wrapers/SectionWithHeader'
import Uneditable        from '../../_shared/components/input/Uneditable'
import Checkbox          from '../../_shared/components/checkbox/Checkbox'
import SmsForm           from './smsForm'

import { convertPriceToString } from '../../_shared/helpers/calculatePrice'


import {
  setNote,
  isPlaceGoInternal,
  setPaidByHost
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import styles         from '../newReservation.page.scss'

import inputStyles    from '../../_shared/components/input/ReservationInput.scss'
import checkboxStyles from '../../_shared/components/checkbox/ReservationCheckbox.scss'


class PriceSmsNote extends Component {
  static propTypes = {
    state:           PropTypes.object,
    actions:         PropTypes.object,
    accentRegex:     PropTypes.object,
    selectedClient:  PropTypes.object,
    outOfTimeCredit: PropTypes.bool
  }

  render() {
    const {
      state,
      actions,
      accentRegex,
      selectedClient,
      outOfTimeCredit
    } = this.props

    const placeIsGoInternal = actions.isPlaceGoInternal()
    const timeCreditActive = selectedClient && selectedClient.is_time_credit_active &&
                              placeIsGoInternal

    let price = ((placeIsGoInternal || !state.client_id) && state.price) ? state.price : ''

    if (!price && state.place_id) {
      price = convertPriceToString(0)
      const place = state.garage && state.garage.floors.reduce((acc, floor) => {
        return acc || floor.places.find(p => p.id === state.place_id)
      }, undefined)
      // Place.pricing.currency.symbol
      if (place && place.pricing && place.pricing.currency) {
        price += ` ${place.pricing.currency.symbol}`
      }
    }

    let expenseOn

    if (!state.client_id || state.paidByHost) {
      expenseOn = t([ 'newReservation', 'onUsersExpenses' ])
    } else if (!isPlaceGoInternal(state)) {
      expenseOn = t([ 'newReservation', 'longtermRent' ])
    } else {
      expenseOn = t([ 'newReservation', 'onClientsExpenses' ])
    }

    return (
      <div>
        {state.garage &&
          <SectionWithHeader header={t([ 'newReservation', 'priceAndOthers' ])}>
            {/* Price */}
            {timeCreditActive &&
              <Uneditable
                label={t([ 'newReservation', 'price' ])}
                highlight={state.highlight && outOfTimeCredit}
                value={`${state.timeCreditPrice} /
                  ${selectedClient[state.paidByHost ? 'current_time_credit' : 'current_users_current_time_credit']}
                  ${selectedClient.time_credit_currency || t([ 'newClient', 'timeCredit' ])}
                `}
              />
            }
            {!timeCreditActive &&
              <div className={`${styles.price} ${styles.dateTimeContainer}`}>
                <div className={` ${styles.priceTag} ${styles.leftCollumn}`} >
                  {`${t([ 'newReservation', 'price' ])} ${price}`}
                </div>
                <div className={styles.middleCollumn} />
                <div className={` ${styles.expenseOn} ${styles.rightCcollumn}`} >
                  {expenseOn}
                </div>
              </div>
            }
            {((state.user && state.current_user && state.user.id !== state.current_user.id) ||
              placeIsGoInternal) && !state.reservation &&
              <Checkbox
                onChange={() => actions.setPaidByHost(!state.paidByHost)}
                checked={state.paidByHost}
                style={checkboxStyles}
              >
                {t([
                  'newReservation',
                  (selectedClient && selectedClient.is_time_credit_active) && !placeIsGoInternal
                    ? 'paidByHostsTimeCredit'
                    : 'paidByHost'
                ])}
              </Checkbox>
            }
            {/* SMS */}
            {state.user &&
              <SmsForm
                accentRegex={accentRegex}
                selectedClient={selectedClient}
              />
            }
            {/* Note */}
            <Input
              placeholder={t([ 'newReservation', 'notePlaceholder' ])}
              onChange={actions.setNote}
              label={t([ 'newReservation', 'note' ])}
              value={state.note}
              style={inputStyles}
            />
          </SectionWithHeader>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    note,
    user,
    timeCreditPrice,
    highlight,
    paidByHost,
    client_id,
    place_id,
    garage,
    price,
    reservation
  } = state.newReservation
  const { current_user } = state.pageBase

  return {
    state: {
      note,
      user,
      timeCreditPrice,
      highlight,
      paidByHost,
      client_id,
      place_id,
      garage,
      price,
      current_user,
      reservation
    }
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({ actions: bindActionCreators({
    setNote,
    isPlaceGoInternal,
    setPaidByHost
  }, dispatch)
  })
)(PriceSmsNote)
