import React, { Component, PropTypes }  from 'react';
import RoundButton                      from '../buttons/RoundButton'


export default class Localization extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
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
    }

    return (
      <div>
        <RoundButton content={'CS'} onClick={czClick} type="action" />
        <RoundButton content={'EN'} onClick={enClick} type="action" />
        <RoundButton content={'PL'} onClick={plClick} type="action" />
        <RoundButton content={'DE'} onClick={deClick} type="action" />
      </div>
    );
  }
}
