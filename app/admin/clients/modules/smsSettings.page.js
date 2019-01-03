import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Input         from '../../../_shared/components/input/Input'
import Form          from '../../../_shared/components/form/Form'
import ClientModules from './clientModules.page'
import Dropdown      from '../../../_shared/components/dropdown/Dropdown'
import RoundButton   from '../../../_shared/components/buttons/RoundButton'
import Modal         from '../../../_shared/components/modal/Modal'

import * as nav              from '../../../_shared/helpers/navigation'
import { t }                 from '../../../_shared/modules/localization/localization'
import * as newClientActions from '../../../_shared/actions/newClient.actions'

import styles from './smsSettings.page.scss'


class SmsSettingsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.clearForm()
    this.props.params.client_id && this.props.actions.initClient(this.props.params.client_id)
  }

  onTextAreaChange = event => this.props.actions.setNewTemplateText(event.target.value)
  onUpdateTextAreaChange = event => this.props.actions.updateTemplateText(event.target.value)

  checkSubmitable = () => {
    if (this.props.state.name === '') return false
    if (this.props.state.line_1 === '') return false
    if (this.props.state.city === '') return false
    if (this.props.state.postal_code === '') return false
    if (this.props.state.country === '') return false
    return true
  }

  templatesDropdown = template => ({ label: template.name, onClick: () => this.props.actions.setSelectedSmsTemplate(template.id) })
  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/clients`)

  submitForm = () => this.checkSubmitable() && this.props.actions.submitSmsTemplates(this.props.params.client_id)
  toggleSmsApiToken = () => this.props.actions.toggleIsSmsApiTokenActive(this.props.params.client_id)
  submitNewTemplateForm = () => this.checkNewTemplateSubmitable() && this.props.actions.submitNewTemplate(this.props.params.client_id)

  checkNewTemplateSubmitable = () => {
    if (this.props.state.newTemplateName === '') return false
    if (this.props.state.newTemplateText === '') return false
    return true
  }

  render() {
    const { state, actions, pageBase } = this.props

    const selectedTemplateIndex = state.templates.findIndexById(state.selectedTemplate)
    const selectedTemplate = state.templates[selectedTemplateIndex]

    const beginsInlineMenu = <span className={state.isSmsApiTokenActive ? styles.deactivate : styles.activate} onClick={this.toggleSmsApiToken}>
      {t([ 'newClient', state.isSmsApiTokenActive ? 'deactivate' : 'activate' ])}
    </span>

    return (
      <ClientModules params={this.props.params}>
        <Modal show={state.showNewTemplateModal}>
          <Form
            onSubmit={this.submitNewTemplateForm}
            submitable={this.checkNewTemplateSubmitable()}
            onBack={actions.clearNewTemplateForm}
            onHighlight={actions.toggleHighlight}
          >
            <Input
              onEnter={this.submitNewTemplateForm}
              onChange={actions.setNewTemplateName}
              label={t([ 'newClient', 'newTemplateName' ])}
              error={t([ 'newClient', 'invalidNewTemplateName' ])}
              value={state.newTemplateName}
            />
            <div className={styles.newTemplateTextLabel}>
              <label>{t([ 'newClient', 'newTemplateText' ])}</label>
            </div>
            <div className={styles.newTemplateTextArea}>
              <textarea onChange={this.onTextAreaChange} value={state.setNewTemplateText} />
            </div>
          </Form>
        </Modal>
        <Form
          onSubmit={this.submitForm}
          submitable={this.checkSubmitable()}
          onBack={this.goBack}
          onHighlight={actions.toggleHighlight}
        >
          <Input
            onEnter={this.submitForm}
            onChange={actions.setSmsApiToken}
            label={t([ 'newClient', 'SmsApiToken' ])}
            error={t([ 'newClient', 'invalidSmsApiToken' ])}
            value={pageBase.current_user && pageBase.current_user.pid_admin && state.isSmsApiTokenActive ? state.smsApiToken : ''}
            placeholder={t([ 'newClient', 'SmsApiTokenPlaceholder' ])}
            inlineMenu={state.smsApiToken && beginsInlineMenu}
          />
          <div className={styles.dropdownAdd}>
            <Dropdown
              content={state.templates.map(this.templatesDropdown)}
              placeholder={t([ 'newClient', 'selectTemplate' ])}
              style="light"
              selected={selectedTemplateIndex}
            />
            <RoundButton
              content={<i className="fa fa-plus" aria-hidden="true" />}
              onClick={() => actions.setShowModalSmsTemplate(true)}
              type="action"
            />
          </div>
          <textarea className={styles.editTemplateTextArea} onChange={this.onUpdateTextAreaChange} value={selectedTemplate && selectedTemplate.template} />
        </Form>
      </ClientModules>
    )
  }
}

export default connect(
  state => ({ state: state.newClient, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newClientActions, dispatch) })
)(SmsSettingsPage)
