import React, { Component } from 'react'

import requestPromise from '../_shared/helpers/requestPromise'
import { GET_CURRENT_USER } from '../_shared/queries/pageBase.queries'


export default class TestingPage extends Component {
  render() {
    async function downloadStuff() {
      console.log('current user is', await requestPromise(GET_CURRENT_USER))
    }

    return (
      <div>
        <h1>Testing page</h1>
        <div onClick={downloadStuff}>click me</div>
      </div>
    )
  }
}
