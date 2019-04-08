import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as nav from '../../_shared/helpers/navigation'
import { t } from '../../_shared/modules/localization/localization'
import { AVAILABLE_LANGUAGES } from '../../routes'

import PageBase       from '../../_shared/containers/pageBase/PageBase'
import Dropdown       from '../../_shared/components/dropdown/Dropdown'
import Form           from '../../_shared/components/form/Form'
import PatternInput   from '../../_shared/components/input/PatternInput'
import Modal          from '../../_shared/components/modal/Modal'
import RoundButton    from '../../_shared/components/buttons/RoundButton'
import normalizeEmail from '../../_shared/helpers/normalizeEmail'
import AttributeSpan  from './components/AttributeSpan'
import LanguageSpan   from './components/LanguageSpan'

import * as inviteUserActions from '../../_shared/actions/inviteUser.actions'

import styles from './inviteUser.page.scss'


class inviteUserPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() { this.props.actions.initManagebles() }

  submitForm = () => this.checkSubmitable() && this.props.actions.createNewManagebles()

  goBack = () => nav.back()

  emailChanged = (value, valid) => this.props.actions.setEmail({ value, valid })

  messageChanged = event => this.props.actions.setMessage(event.target.value)

  nameChanged = value => this.props.actions.setName(value)

  phoneChanged = value => this.props.actions.setPhone(value)

  hightlightInputs = () => this.props.actions.toggleHighlight()

  clientSelected = index => this.props.actions.setClient(this.props.state.clients[index].id)

  carSelected = index => this.props.actions.setCar(this.props.state.cars[index].id)

  garageSelected = index => this.props.actions.setGarage(this.props.state.garages[index].id)

  checkSubmitable = () => {
    const { state } = this.props
    if (!state.email.valid) return false
    if (!/\+[\d]{2,4}[\d\s]{3,}/.test(state.phone) && state.phone !== '') return false
    if (!/^(?!\s*$).+/.test(state.full_name) && state.phone !== '') return false
    if (state.client_id && !(state.client_admin || state.client_secretary || state.client_host || state.client_internal || state.client_contact_person)) return false
    if (state.garage_id && !(state.garage_admin || state.garage_manager || state.garage_receptionist || state.garage_security)) return false
    if (state.car_id && !(state.car_admin || state.car_driver)) return false
    return true
  }

  modalClick = () => {
    this.props.actions.dismissModal()
    this.goBack()
  }

  successClick = () => {
    this.props.actions.dismissModal()
    this.goBack()
  }


  render() {
    const { state, actions } = this.props

    const currentClient = state.clients.findById(state.client_id)

    const clientDropdown = state.clients.map((client, index) => ({
      label:   client.name,
      order:   client.id === undefined && 1,
      onClick: () => this.clientSelected(index)
    }))

    const carDropdown = state.cars.map((car, index) => ({
      label:   car.model,
      order:   car.id === undefined && 1,
      onClick: () => this.carSelected(index)
    }))

    const garageDropdown = state.garages.map((garage, index) => ({
      label:   garage.name,
      order:   garage.id === undefined && 1,
      onClick: () => this.garageSelected(index)
    }))

    const errorContent = (
      <div className={styles.floatCenter}>
        {state.error}
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={this.modalClick}
          type="confirm"
        />
      </div>
    )

    const successContent = (
      <div className={styles.floatCenter}>
        {state.success}
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={this.successClick}
          type="confirm"
        />
      </div>
    )

    const loadingContent = (
      <div className={styles.floatCenter}>
        {t([ 'inviteUser', 'sendingInvitation' ])}
        {':'}
        <br />
        {state.currentEmail}
      </div>
    )

    const renderLanguage = lang => <LanguageSpan state={state} lang={lang} actions={actions} />
    const separator = <span>|</span>
    const addSeparator = (acc, lang, index, array) => array.length - 1 !== index ? [ ...acc, lang, separator ] : [ ...acc, lang ]

    const highlightClientRoles = state.highlight && !(state.client_admin || state.client_secretary || state.client_host || state.client_internal || state.client_contact_person)
    const highlightGarageRoles = state.highlight && !(state.garage_admin || state.garage_manager || state.garage_receptionist || state.garage_security)
    const highlightCarRoles = state.highlight && !(state.car_admin || state.car_driver)

    const multipleUsers = state.email.value.includes(',')

    return (
      <PageBase>
        <Modal content={errorContent} show={state.error} />
        <Modal content={successContent} show={state.success} />
        <Modal content={loadingContent} show={state.currentEmail} />

        <Form onSubmit={this.submitForm} submitable={this.checkSubmitable()} onBack={this.goBack} onHighlight={this.hightlightInputs}>
          <div className={styles.form}>
            <div className={`${styles.formChild} ${styles.mainInfo}`}>
              <PatternInput
                onEnter={this.submitForm}
                onChange={this.emailChanged}
                label={t([ 'inviteUser', 'selectUser' ]) + ' *'}
                error={t([ 'signup_page', 'emailInvalid' ])}
                pattern="^([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3},*[\W]*)+$"
                value={state.email.value}
                highlight={state.highlight}
                normalizeInput={normalizeEmail}
              />
              {clientDropdown.length > 1 && (
                <Dropdown
                  placeholder={t([ 'inviteUser', 'selectClient' ])}
                  content={clientDropdown}
                  style="light"
                  selected={state.clients.findIndexById(state.client_id)}
                />
              )}
              {garageDropdown.length > 1 && (
                <Dropdown
                  placeholder={t([ 'inviteUser', 'selectGarage' ])}
                  content={garageDropdown}
                  style="light"
                  selected={state.garages.findIndexById(state.garage_id)}
                />
              )}
              {carDropdown.length > 1 && (
                <Dropdown
                  placeholder={t([ 'inviteUser', 'selectCar' ])}
                  content={carDropdown}
                  style="light"
                  selected={state.cars.findIndexById(state.car_id)}
                />
              )}
              <div>
                <label>{t([ 'inviteUser', 'inviteMessage' ])}</label>
              </div>
              <div>
                <textarea className={styles.textArea} onChange={this.messageChanged} value={state.message} />
              </div>
            </div>

            <div className={`${styles.formChild} ${styles.additionalInfo}`}>
              <h3>{t([ 'inviteUser', 'optionalSettings' ])}</h3>
              <p>{t([ 'inviteUser', 'optionalSettingsText' ])}</p>
              <PatternInput
                onEnter={this.submitForm}
                onChange={this.nameChanged}
                label={t([ 'inviteUser', 'nameLabel' ])}
                error={t([ 'signup_page', 'nameInvalid' ])}
                pattern="^(?!\s*$).+"
                value={state.full_name}
                readOnly={multipleUsers}
              />
              <PatternInput
                onEnter={this.submitForm}
                onChange={this.phoneChanged}
                label={t([ 'inviteUser', 'phoneLabel' ])}
                error={t([ 'signup_page', 'phoneInvalid' ])}
                pattern="\+[\d]{2,4}[\d\s]{3,}"
                value={state.phone}
                readOnly={multipleUsers}
              />
              <div>
                <h3>{t([ 'languages', 'language' ])}</h3>
                {AVAILABLE_LANGUAGES.map(renderLanguage).reduce(addSeparator, [])}
              </div>
              {state.client_id && (
                <div>
                  <h3>{t([ 'inviteUser', 'clientRights' ]) + ' *'}</h3>
                  <p>{t([ 'inviteUser', 'clientRightsDesc' ])}</p>
                  {currentClient && (
                    <p className={styles.rights}>
                      {currentClient.admin && [
                        <AttributeSpan
                          state={state}
                          attribute="client_admin"
                          actions={actions}
                          labelSection="clientUsers"
                          label="admin"
                          highlight={highlightClientRoles}
                        />,
                        <span>|</span>,
                        <AttributeSpan
                          state={state}
                          attribute="client_contact_person"
                          actions={actions}
                          labelSection="clientUsers"
                          label="contact_person"
                          highlight={highlightClientRoles}
                        />,
                        <span>|</span>,
                        <AttributeSpan
                          state={state}
                          attribute="client_secretary"
                          actions={actions}
                          labelSection="clientUsers"
                          label="secretary"
                          highlight={highlightClientRoles}
                        />,
                        <span>|</span>
                      ]}
                      {(currentClient.admin || currentClient.secretary) && [
                        <AttributeSpan
                          state={state}
                          attribute="client_internal"
                          actions={actions}
                          labelSection="clientUsers"
                          label="internal"
                          highlight={highlightClientRoles}
                        />,
                        <span>|</span>
                      ]}
                      {(
                        currentClient.admin
                        || currentClient.secretary
                        || currentClient.internal
                      ) && (
                        <AttributeSpan
                          state={state}
                          attribute="client_host"
                          actions={actions}
                          labelSection="clientUsers"
                          label="host"
                          highlight={highlightClientRoles}
                        />
                      )}
                    </p>
                  )}
                </div>
              )}

              {state.garage_id && (
                <div>
                  <h3>{t([ 'inviteUser', 'GarageRights' ]) + ' *'}</h3>
                  <p>{t([ 'inviteUser', 'GarageRightsDesc' ])}</p>
                  <p className={styles.rights}>
                    <AttributeSpan
                      state={state}
                      attribute="garage_admin"
                      actions={actions}
                      labelSection="garageUsers"
                      label="admin"
                      highlight={highlightGarageRoles}
                    />
                    {'|'}
                    <AttributeSpan
                      state={state}
                      attribute="garage_manager"
                      actions={actions}
                      labelSection="garageUsers"
                      label="manager"
                      highlight={highlightGarageRoles}
                    />
                    {'|'}
                    <AttributeSpan
                      state={state}
                      attribute="garage_receptionist"
                      actions={actions}
                      labelSection="garageUsers"
                      label="receptionist"
                      highlight={highlightGarageRoles}
                    />
                    {'|'}
                    <AttributeSpan
                      state={state}
                      attribute="garage_security"
                      actions={actions}
                      labelSection="garageUsers"
                      label="security"
                      highlight={highlightGarageRoles}
                    />
                  </p>
                </div>
              )}

              {state.car_id && (
                <div>
                  <h3>{t([ 'inviteUser', 'carRights' ]) + ' *'}</h3>
                  <p>{t([ 'inviteUser', 'carRightsDesc' ])}</p>
                  <p className={styles.rights}>
                    <AttributeSpan
                      state={state}
                      attribute="car_admin"
                      actions={actions}
                      label="admin"
                      highlight={highlightCarRoles}
                    />
                    {'|'}
                    <AttributeSpan
                      state={state}
                      attribute="car_driver"
                      actions={actions}
                      label="driver"
                      highlight={highlightCarRoles}
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </Form>
      </PageBase>
    )
  }
}


export default connect(state => {
  const { inviteUser } = state
  return ({
    state: inviteUser
  })
}, dispatch => ({
  actions: bindActionCreators(inviteUserActions, dispatch)
}))(inviteUserPage)
