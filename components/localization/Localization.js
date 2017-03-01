import React, { Component, PropTypes }  from 'react';
import RoundButton                      from '../buttons/RoundButton'
<<<<<<< HEAD
=======
import { AVAILABLE_LANGUAGES }          from '../../../routes.js'
>>>>>>> feature/new_api


export default class Localization extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
<<<<<<< HEAD
    const czClick = () => {
      this.context.router.push('/cs/settings')
    }
    const enClick = () => {
      this.context.router.push('/en/settings')
    }
    const plClick = () => {
      this.context.router.push('/pl/settings')
    }
    const deClick = () => {
      this.context.router.push('/de/settings')
=======
    const prepareButtons = (language, i) => {
      const langClick = () => {this.context.router.push(`/${language}/settings`)}
      return <RoundButton key={i} content={language.toUpperCase()} onClick={langClick} type="action" />
>>>>>>> feature/new_api
    }

    return (
      <div>
<<<<<<< HEAD
        <RoundButton content={'CS'} onClick={czClick} type="action" />
        <RoundButton content={'EN'} onClick={enClick} type="action" />
        <RoundButton content={'PL'} onClick={plClick} type="action" />
        <RoundButton content={'DE'} onClick={deClick} type="action" />
=======
        { ['cs', 'en', 'pl', 'de'].map(prepareButtons) }
>>>>>>> feature/new_api
      </div>
    );
  }
}
