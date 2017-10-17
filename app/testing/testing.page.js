import React, { Component, PropTypes } from 'react'
import { get }                     from '../_shared/helpers/get'
import { request } from '../_shared/helpers/request'

import MobileDateTimePicker from '../_shared/components/mobileDateTimePicker/MobileDateTimePicker'

export default class TestingPage extends Component {
  render() {
    const onDateSelect = date => {
      console.log(date)
    }

    const actions = [{ label: '2H', onClick: () => {console.log('2H click') } }, { label: '4H', onClick: () => {console.log('4H click') } }]

    return (
      <div>
        <h1>Testing page</h1>
        <div style={{width: '300px', height: '150px'}}>
          <MobileDateTimePicker onClick={onDateSelect} actions={actions} />
        </div>
      </div>
    )
  }
}
