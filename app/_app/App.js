import PropTypes from 'prop-types'
import React, { Component } from 'react'
import request from '../_shared/helpers/request'


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
        const error = `Error occured at ${window.location.hash} / ${e.message} / ${state.current_user ? state.current_user.email : 'UserNotLoaded'}`
        console.error(error)
        request(() => {}, 'mutation ErrorSend ($error: String!) { error(error: $error) }', { error })
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
