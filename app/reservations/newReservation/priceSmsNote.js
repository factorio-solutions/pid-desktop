import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Input          from '../../_shared/components/input/Input'
import SectionWithHeader from '../../_shared/components/wrapers/SectionWithHeader'
import Uneditable        from '../../_shared/components/input/Uneditable'
import SmsForm           from './smsForm'

import { convertPriceToString } from '../../_shared/helpers/calculatePrice'


import {
  setNote,
  isPlaceGoInternal
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import styles         from '../newReservation.page.scss'

import inputStyles from '../../_shared/components/input/ReservationInput.scss'

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

    let price = ((isPlaceGoInternal(state) || !state.client_id) && state.price) ? state.price : ''

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
            {selectedClient && selectedClient.is_time_credit_active &&
            isPlaceGoInternal(state) ?
              <Uneditable
                label={t([ 'newReservation', 'price' ])}
                highlight={state.highlight && outOfTimeCredit}
                value={`${state.timeCreditPrice} /
                  ${selectedClient[state.paidByHost ? 'current_time_credit' : 'current_users_current_time_credit']}
                  ${selectedClient.time_credit_currency || t([ 'newClient', 'timeCredit' ])}
                `}
              /> :
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

export default connect(
  state => ({ state: state.newReservation }),
  dispatch => ({ actions: bindActionCreators({
    setNote
  }, dispatch)
  })
)(PriceSmsNote)
