import React, { Component } from 'react'

import requestPromise from '../_shared/helpers/requestPromise'
import { GARAGE_CONTRACTS } from '../_shared/queries/clients.queries'

export default class TestingPage extends Component {

  download = () => {
    requestPromise(GARAGE_CONTRACTS, { id: 1 })
    .then(data => console.log(data))
  }

  render() {
    return (
      <div>
        <h1>Testing page</h1>
        <button onClick={this.download}>Download</button>
      </div>
    )
  }
}
