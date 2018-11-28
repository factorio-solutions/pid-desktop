import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'

import TextArea          from '../../_shared/components/input/TextArea'
import SectionWithHeader from '../../_shared/components/wrapers/SectionWithHeader'
import Uneditable        from '../../_shared/components/input/Uneditable'
import SmsForm           from './smsForm'


import {
  setNote,
  isPlaceGoInternal
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import styles         from '../newReservation.page.scss'

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
              <div className={styles.price}>
                {t([ 'newReservation', 'price' ])}
                {`
                    ${((isPlaceGoInternal(state) || !state.client_id) && state.price) || ''}
                    (${!state.client_id
                      ? t([ 'newReservation', 'onUsersExpenses' ])
                      : !isPlaceGoInternal(state)
                        ? t([ 'newReservation', 'longtermRent' ])
                        : state.paidByHost
                          ? t([ 'newReservation', 'onUsersExpenses' ])
                          : t([ 'newReservation', 'onClientsExpenses' ])
                    })
                `}
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
            <TextArea
              placeholder={t([ 'newReservation', 'notePlaceholder' ])}
              onChange={actions.setNote}
              label={t([ 'newReservation', 'note' ])}
              value={state.note}
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
