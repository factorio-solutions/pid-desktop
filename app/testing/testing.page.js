import React, { Component, PropTypes } from 'react'
import { get }                     from '../_shared/helpers/get'

export default class TestingPage extends Component {

    render() {

    return (
      <div>
        <h1>Testing page</h1>
        <img src={'https://s3-eu-west-1.amazonaws.com/park-it-direct-alpha/floors/Strazni.svg'} />
      </div>
    );
  }
}
