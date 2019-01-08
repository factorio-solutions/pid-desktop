import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Input        from '../../_shared/components/input/Input'
import PatternInput from '../../_shared/components/input/PatternInput'
import CallToActionButton  from '../../_shared/components/buttons/CallToActionButton'


import {
  setHostName,
  setHostPhone,
  setHostEmail,
  setLanguage,
  setCarLicencePlate
} from '../../_shared/actions/newReservation.actions'

import { AVAILABLE_LANGUAGES } from '../../routes'
import { t }                   from '../../_shared/modules/localization/localization'
import normalizeEmail          from '../../_shared/helpers/normalizeEmail'

import {
  languagesSelector,
  searchField,
  actionButton
} from '../newReservation.page.scss'

import reservationStyles from '../../_shared/components/input/ReservationInput.scss'

class NewUserForm extends Component {
  static propTypes = {
    state:       PropTypes.object,
    actions:     PropTypes.object,
    editable:    PropTypes.bool,
    onetime:     PropTypes.bool,
    resetButton: PropTypes.func
  }

  hostEmailMandatoryCondition = () => {
    const { state } = this.props
    return state.user.id === -1 || (state.user.id === -2 && state.paidByHost && (!state.email.value || !state.email.valid))
  }

  hostPhoneMandatoryCondition = () => {
    const { state } = this.props
    return state.user.id === -1 || (state.user.id === -2 && state.sendSMS && (!state.phone.value || !state.phone.valid))
  }

  renderLanguageButton = lang => {
    const { state, actions, onetime } = this.props
    const selectLanguage = state.user.language ? state.user.language : state.language
    return (<CallToActionButton
      state={(selectLanguage === lang && 'selected') || ((onetime || state.user.language) && 'disabled')}
      label={lang.toUpperCase()}
      onClick={() => actions.setLanguage(lang)}
      type="reservationLangWith"
    />)
  }

  render() {
    const { state, actions, editable, onetime, resetButton } = this.props
    return (
      <div>
        <div className={searchField}>
          {resetButton}
          <PatternInput
            readOnly={!onetime && (state.user && state.user.id > -1)}
            onChange={actions.setHostName}
            label={`${t([
              'newReservation',
              state.user.id === -1
                ? state.user.rights.internal
                  ? 'internalsName'
                  : 'hostsName'
                : 'visitorsName'
            ])} *`}
            error={t([ 'signup_page', 'nameInvalid' ])}
            pattern="^(?!\s*$).+"
            value={state.name.value}
            highlight={state.highlight}
            align="left"
            style={reservationStyles}
            placeholder={t([ 'newReservation', 'namePlaceholder' ])}
          />
        </div>
        <PatternInput
          readOnly={onetime || (state.user && state.user.id > -1)}
          onChange={actions.setHostEmail}
          label={`
            ${t([
              'newReservation',
              state.user.id === -1
                ? state.user.rights.internal
                  ? 'internalsEmail'
                  : 'hostsEmail'
                : 'visitorsEmail'
            ])}
            ${this.hostEmailMandatoryCondition() ? ' *' : ''}
          `}
          error={t([ 'signup_page', 'emailInvalid' ])}
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$"
          value={(state.email.value)}
          highlight={state.highlight && this.hostEmailMandatoryCondition()}
          align="left"
          normalizeInput={normalizeEmail}
          style={reservationStyles}
          placeholder={t([ 'newReservation', 'emailPlaceholder' ])}
        />
        <PatternInput
          readOnly={onetime || (state.user && state.user.id > -1)}
          onChange={actions.setHostPhone}
          label={`
            ${t([
              'newReservation',
              state.user.id === -1
                ? state.user.rights.internal
                  ? 'internalsPhone'
                  : 'hostsPhone'
                : 'visitorsPhone'
            ])}
            ${this.hostPhoneMandatoryCondition() ? ' *' : ''}
          `}
          error={t([ 'signup_page', 'phoneInvalid' ])}
          pattern="\+[\d]{2,4}[\d\s]{3,}"
          value={state.phone.value}
          highlight={state.highlight && this.hostPhoneMandatoryCondition()}
          align="left"
          style={reservationStyles}
          placeholder={t([ 'newReservation', 'phonePlaceholder' ])}
        />
        <Input
          readOnly={!editable}
          onChange={actions.setCarLicencePlate}
          value={state.carLicencePlate}
          label={t([ 'newReservation', 'licencePlate' ])}
          error={t([ 'newReservation', 'licencePlateInvalid' ])}
          placeholder={t([ 'newReservation', 'licencePlatePlaceholder' ])}
          type="text"
          align="left"
          style={reservationStyles}
        />
        <div className={`${languagesSelector} ${actionButton}`}>
          <h4 style={{ fontWeight: 'normal', margin: '0' }}>{t([ 'newReservation', 'languageSelector' ])}</h4>
          {AVAILABLE_LANGUAGES.map(this.renderLanguageButton)}
        </div>
      </div>
    )
  }
}

export default connect(
  state => {
    const { user, name, phone, email, highlight, language, carLicencePlate, paidByHost } = state.newReservation
    return { state: { user, name, phone, email, highlight, language, carLicencePlate, paidByHost } }
  },
  dispatch => ({ actions: bindActionCreators(
    { setHostName,
      setHostPhone,
      setHostEmail,
      setLanguage,
      setCarLicencePlate
    },
    dispatch
  )
  })
)(NewUserForm)
