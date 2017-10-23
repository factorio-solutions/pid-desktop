import React, { Component } from 'react'

import RoundButton from '../buttons/RoundButton'

import { toAbsolute } from '../../helpers/navigation'
import { AVAILABLE_LANGUAGES } from '../../../routes.js'
import { parseParameters, composeParameters } from '../../helpers/parseUrlParameters'


export default class Localization extends Component {
  render() {
    const prepareButtons = (language, i) => {
      const langClick = () => {
        toAbsolute(`${language}${window.location.hash.substr(4).split('?')[0]}?${composeParameters(parseParameters(window.location.hash))}`)
      }

      window.location.hash.substr(4)
      return <RoundButton key={i} content={language.toUpperCase()} onClick={langClick} type="action" />
    }

    return (
      <div>
        { AVAILABLE_LANGUAGES.map(prepareButtons) }
      </div>
    )
  }
}
