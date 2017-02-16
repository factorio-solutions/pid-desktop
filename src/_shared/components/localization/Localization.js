import React, { Component, PropTypes }  from 'react';
import RoundButton                      from '../buttons/RoundButton'
import { AVAILABLE_LANGUAGES }          from '../../../routes.js'


export default class Localization extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    const prepareButtons = (language, i) => {
      const langClick = () => {this.context.router.push(`/${language}/settings`)}
      return <RoundButton key={i} content={language.toUpperCase()} onClick={langClick} type="action" />
    }

    return (
      <div>
        { ['cs', 'en', 'pl', 'de'].map(prepareButtons) }
      </div>
    );
  }
}
