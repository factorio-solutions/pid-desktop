import React, { Component } from 'react'
import DatetimeInput from '../_shared/components/input/DatetimeInput.js'
import TimeInput from '../_shared/components/input/TimeInput.js'


export default class TestingPage extends Component {
  render() {
    return (
      <div>
        <h1>Testing page</h1>
        <DatetimeInput />
        <TimeInput value="15:00" onChange={time => console.log(time)} />
      </div>
    )
  }
}
