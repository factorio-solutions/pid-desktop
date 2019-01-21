import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Dropdown from '../../_shared/components/dropdown/Dropdown'
import Checkbox from '../../_shared/components/checkbox/Checkbox'
import TextArea from '../../_shared/components/input/TextArea'

import {
  setSendSms,
  setSelectedTemplate,
  removeDiacritics,
  setTemplateText,
  selectedClient as selectedClientImported,
  isPlaceGoInternal,
  setPaidByHost
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import styles         from '../newReservation.page.scss'
import checkboxStyles from '../../_shared/components/checkbox/ReservationCheckbox.scss'


class SmsForm extends Component {
  static propTypes = {
    state:       PropTypes.object,
    actions:     PropTypes.object,
    accentRegex: PropTypes.object
  }

  render() {
    const { state, actions, accentRegex } = this.props

    const selectedClient = actions.selectedClientImported()
    return (
      <div>
        {
          state.client_id &&
          selectedClient &&
          selectedClient.has_sms_api_token &&
          selectedClient.is_sms_api_token_active &&
          selectedClient.client_user.secretary &&
          <div>
            {((state.user && state.current_user && state.user.id !== state.current_user.id &&
              selectedClient && selectedClient.is_time_credit_active) ||
              isPlaceGoInternal(state)) &&
              <Checkbox
                onChange={() => actions.setPaidByHost(!state.paidByHost)}
                checked={state.paidByHost}
                style={checkboxStyles}
              >
                {t([
                  'newReservation',
                  (selectedClient && selectedClient.is_time_credit_active) && !isPlaceGoInternal(state)
                    ? 'paidByHostsTimeCredit'
                    : 'paidByHost'
                ])}
              </Checkbox>
            }
            <Checkbox
              onChange={() => actions.setSendSms(!state.sendSMS)}
              checked={state.sendSMS}
              style={checkboxStyles}
            >
              {t([ 'newReservation', 'sendSms' ])}
            </Checkbox>
            {state.sendSMS &&
              <div className={styles.smsTemplates}>
                <Dropdown
                  label={t([ 'newReservation', 'smsTemplateLabel' ])}
                  placeholder={t([ 'newReservation', 'selectTemplate' ])}
                  content={state.user.availableClients.findById(state.client_id).sms_templates.map((template, index) => ({
                    label:   template.name,
                    onClick: () => actions.setSelectedTemplate(index, template.template)
                  }))}
                  selected={state.selectedTemplate}
                  style="reservation"
                />
                <div className={styles.smsText} >
                  <TextArea
                    placeholder={t([ 'newReservation', 'smsTextPlaceholder' ])}
                    onChange={actions.setTemplateText}
                    value={state.templateText}
                  />
                </div>
                <div className={styles.textLabel}>
                  <span
                    className={state.highlight && state.templateText.length > (accentRegex.test(state.templateText) ? 140 : 320) && styles.redText}
                  >
                    {state.templateText.length}/{accentRegex.test(state.templateText) ? 140 : 320}
                    {t([ 'newReservation', 'character' ])}
                  </span> / <span
                    role="button"
                    tabIndex="0"
                    className={styles.removeDiacritics}
                    onClick={actions.removeDiacritics}
                  >
                    {t([ 'newReservation', 'removeDiacritics' ])}
                  </span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.newReservation }),
  dispatch => ({ actions: bindActionCreators({
    setSendSms,
    setSelectedTemplate,
    removeDiacritics,
    setTemplateText,
    selectedClientImported,
    setPaidByHost
  }, dispatch)
  })
)(SmsForm)
