import React, { Component } from 'react'


export default class TestingPage extends Component {
  render() {
    return (
      <div>
        <h1>Testing page</h1>
        <Recurring
          show
          onSubmit={rule => console.log('set rule to ', JSON.stringify(rule))}
          showDays
          showWeeks
        />
      </div>
    )
  }
}
