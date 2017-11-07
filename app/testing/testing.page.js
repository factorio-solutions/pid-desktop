import React, { Component, PropTypes } from 'react'
import * as localization from '../_shared/modules/localization/localization'

import Recurring from '../_shared/components/recurring/Recurring'

export default class TestingPage extends Component {
  render() {
    return (
      <div>
        <h1>Testing page</h1>
        <Recurring
          show
          onSubmit={rule => console.log('set rule to ', rule)}
        />
      </div>
    )
  }
}
