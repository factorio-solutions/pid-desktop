import PropTypes from 'prop-types'
import React, { Component } from 'react'
import request from '../_shared/helpers/request'

import { version } from '../../package.json'


export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  static contextTypes = {
    store: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { lastError: undefined }
  }


  componentDidMount() {
    // Error handling
    window.addEventListener('error', e => {
      const state = this.context.store.getState().pageBase

      if (e.message !== this.state.lastError) { // block error cycle
        debugger
        const error = `Error occured at ${window.location.hash} / ${e.message} / ${state.current_user ? state.current_user.email : 'UserNotLoaded'}`
        console.error(error)
        request(() => {}, `mutation ErrorSend ($origin: String!, $message: String!, $backtrace: String!, $location: String!, $user_id: Id, $version: String!) {
          error(origin: $origin, message: $message, backtrace: $backtrace, location: $location, user_id: $user_id, version: $version)
        }`,
        {
          origin:    'desktop_client',
          message:   e.message,
          backtrace: e.error.stack,
          location:  window.location.href,
          user_id:   state.current_user ? state.current_user.id : undefined,
          version
        })
        this.setState({ lastError: e.message })
      }
    })
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
