import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
