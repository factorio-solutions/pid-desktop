import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Input        from '../../_shared/components/input/Input'
import PatternInput from '../../_shared/components/input/PatternInput'
import RoundButton  from '../../_shared/components/buttons/RoundButton'

import {
  setHostName,
  setHostPhone,
  setHostEmail,
  setNote,
  setLanguage,
  setCarLicencePlate
} from '../../_shared/actions/newReservation.actions'

import { AVAILABLE_LANGUAGES } from '../../routes'
import { t }                   from '../../_shared/modules/localization/localization'
import { languagesSelector }   from '../newReservation.page.scss'


class NewUserForm extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    editable: PropTypes.bool,
    onetime:  PropTypes.bool
  }

  renderLanguageButton = lang => {
    const { state, actions, onetime } = this.props
    const selectLanguage = state.user.language ? state.user.language : state.language
    return (<RoundButton
      state={(selectLanguage === lang && 'selected') || ((onetime || state.user.language) && 'disabled')}
      content={lang.toUpperCase()}
      onClick={() => actions.setLanguage(lang)}
      type="action"
    />)
  }

  render() {
    const { state, actions, editable, onetime } = this.props
    return (
      <div>
        <PatternInput
          readOnly={onetime || (state.user && state.user.id > -1)}
          onChange={actions.setHostName}
          label={t([ 'newReservation', state.user.id === -1 ? 'hostsName' : 'visitorsName' ])}
          error={t([ 'signup_page', 'nameInvalid' ])}
          pattern="^(?!\s*$).+"
          value={state.name.value}
          highlight={state.highlight}
          align="left"
        />
        <PatternInput
          readOnly={onetime || (state.user && state.user.id > -1)}
          onChange={actions.setHostEmail}
          label={t([ 'newReservation', state.user.id === -1 ? 'hostsEmail' : 'visitorsEmail' ])}
          error={t([ 'signup_page', 'emailInvalid' ])}
          pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
          value={(state.email.value)}
          highlight={state.highlight && (state.user.id === -1 || (state.user.id === -2 && state.paidByHost && (!state.email.value || !state.email.valid)))}
          align="left"
        />
        <PatternInput
          readOnly={onetime || (state.user && state.user.id > -1)}
          onChange={actions.setHostPhone}
          label={t([ 'newReservation', state.user.id === -1 ? 'hostsPhone' : 'visitorsPhone' ])}
          error={t([ 'signup_page', 'phoneInvalid' ])}
          pattern="\+[\d]{2,4}[\d\s]{3,}"
          value={state.phone.value}
          highlight={state.highlight && (state.user.id === -1 || (state.user.id === -2 && state.sendSMS && (!state.phone.value || !state.phone.valid)))}
          align="left"
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
          highlight={state.highlight && state.user.id !== -2}
        />
        <Input
          onChange={actions.setNote}
          label={t([ 'newReservation', 'note' ])}
          value={state.note}
          align="left"
        />
        <div className={languagesSelector}>
          <h4 style={{ fontWeight: 'normal', margin: '0' }}>{t([ 'newReservation', 'languageSelector' ])}</h4>
          {AVAILABLE_LANGUAGES.map(this.renderLanguageButton)}
        </div>
      </div>
    )
  }
}

export default connect(
  state => {
    const { user, name, phone, email, note, highlight, language, carLicencePlate } = state.newReservation
    return { state: { user, name, phone, email, note, highlight, language, carLicencePlate } }
  },
  dispatch => ({ actions: bindActionCreators(
    { setHostName,
      setHostPhone,
      setHostEmail,
      setNote,
      setLanguage,
      setCarLicencePlate
    },
    dispatch
  )
  })
)(NewUserForm)
