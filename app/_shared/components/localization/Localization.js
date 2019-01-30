import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import RoundButton from '../buttons/RoundButton'

import * as nav from '../../helpers/navigation'
import { changeLanguage } from '../../modules/localization/localization'
import request from '../../helpers/requestPromise'
import { AVAILABLE_LANGUAGES } from '../../../routes'
import { mobile } from '../../../index'
import { setLanguage } from '../../actions/mobile.header.actions'


const CHANGE_USERS_LANGUAGE = `mutation UpdateUserLanguage($user_id: Id!, $language: String!) {
  update_user_language(user_id: $user_id, language: $language) {
    id
  }
}
`


class Localization extends Component {
  static propTypes = {
    user:              PropTypes.object,
    afterChange:       PropTypes.func,
    setMobileLanguage: PropTypes.func
  }

  langClick = async language => {
    const { user, afterChange, setMobileLanguage } = this.props
    if (mobile) {
      changeLanguage(language)
      setMobileLanguage(language)
    } else {
      nav.changeLanguage(language)
    }

    if (user) {
      await request(CHANGE_USERS_LANGUAGE, { // if user exists then update language on server
        language,
        user_id: user.id
      })

      afterChange && afterChange()
    }
  }

  prepareButtons = (language, i) => (
    <RoundButton
      key={i}
      content={language.toUpperCase()}
      onClick={() => this.langClick(language)}
      type="action"
    />
  )


  render() {
    return (
      <div>
        { AVAILABLE_LANGUAGES.map(this.prepareButtons) }
      </div>
    )
  }
}

export default connect(
  state => ({ user: state[mobile ? 'mobileHeader' : 'pageBase'].current_user }),
  { setMobileLanguage: setLanguage }
)(Localization)
