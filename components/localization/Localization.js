import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import RoundButton from '../buttons/RoundButton'

import * as nav from '../../helpers/navigation'
import { changeLanguage } from '../../modules/localization/localization'
import request from '../../helpers/requestPromise'
import { AVAILABLE_LANGUAGES } from '../../../routes'
import { mobile } from '../../../index'


const CHANGE_USERS_LANGUAGE = `mutation UpdateUserLanguage($user_id: Id!, $language: String!) {
  update_user_language(user_id: $user_id, language: $language) {
    id
  }
}
`


class Localization extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    const { user } = this.props

    const prepareButtons = (language, i) => {
      const langClick = () => {
        mobile ? changeLanguage(language) : nav.changeLanguage(language)

        user && request(CHANGE_USERS_LANGUAGE, { // if user exists then update language on server
          language,
          user_id: user.id
        }).then(response => console.log(response))
      }

      return <RoundButton key={i} content={language.toUpperCase()} onClick={langClick} type="action" />
    }

    return (
      <div>
        { AVAILABLE_LANGUAGES.map(prepareButtons) }
      </div>
    )
  }
}

export default connect(
  state => ({ user: state[mobile ? 'mobileHeader' : 'pageBase'].current_user }),
  {}
)(Localization)
