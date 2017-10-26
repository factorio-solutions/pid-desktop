import React, { Component, PropTypes } from 'react'
import translate from 'counterpart'
import { connect } from 'react-redux'

import RoundButton from '../buttons/RoundButton'

import { changeLanguage } from '../../helpers/navigation'
import request from '../../helpers/requestPromise'
import { AVAILABLE_LANGUAGES } from '../../../routes.js'


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
        changeLanguage(language) // change route
        user && request(CHANGE_USERS_LANGUAGE, { // if user exists then update language on server
          language: translate.getLocale(),
          user_id:  user.id
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
  state => ({ user: state.pageBase.current_user }),
  {}
)(Localization)
