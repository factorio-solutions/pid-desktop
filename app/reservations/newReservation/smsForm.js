import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'

import Dropdown from '../../_shared/components/dropdown/Dropdown'

import {
  setSendSms,
  setSelectedTemplate,
  removeDiacritics,
  setTemplateText
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import styles from '../newReservation.page.scss'

class SmsForm extends Component {
  static propTypes = {
    state:       PropTypes.object,
    actions:     PropTypes.object,
    accentRegex: PropTypes.object
  }

  onTextAreaChange = event => this.props.actions.setTemplateText(event.target.value)

  render() {
    const { state, actions, accentRegex } = this.props
    return (
      <div>
        {
          state.client_id && state.user &&
          state.user.availableClients.findById(state.client_id) &&
          state.user.availableClients.findById(state.client_id).has_sms_api_token &&
          state.user.availableClients.findById(state.client_id).is_sms_api_token_active &&
          state.user.availableClients.findById(state.client_id).client_user.secretary &&
          <div>
            <div className={styles.endSmsCheckbox} onClick={() => actions.setSendSms(!state.sendSMS)}>
              <input type="checkbox" checked={state.sendSMS} align="left" />
              {t([ 'newReservation', 'sendSms' ])}
            </div>
            {state.sendSMS &&
              <div className={styles.smsTemplates}>
                <Dropdown
                  label={t([ 'newReservation', 'selectTemplate' ])}
                  content={state.user.availableClients.findById(state.client_id).sms_templates.map((template, index) => ({
                    label:   template.name,
                    onClick: () => actions.setSelectedTemplate(index, template.template)
                  }))}
                  selected={state.selectedTemplate}
                  style="reservation"
                />
                <div className={styles.textLabel}>
                  <label>{t([ 'newReservation', 'smsText' ])}</label>
                  <span className={styles.removeDiacritics} onClick={actions.removeDiacritics}>{t([ 'newReservation', 'removeDiacritics' ])}</span>
                </div>
                <textarea value={state.templateText} onChange={this.onTextAreaChange} />
                <div className={state.highlight && state.templateText.length > (accentRegex.test(state.templateText) ? 140 : 320) && styles.redText}>
                  {state.templateText.length}/{accentRegex.test(state.templateText) ? 140 : 320}
                  {t([ 'newReservation', 'character' ])}
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
  state => {
    const { user, client_id, sendSMS, templateText, highlight } = state.newReservation
    return { state: { user, client_id, sendSMS, templateText, highlight } }
  },
  dispatch => ({ actions: bindActionCreators({
    setSendSms,
    setSelectedTemplate,
    removeDiacritics,
    setTemplateText
  }, dispatch)
  })
)(SmsForm)
