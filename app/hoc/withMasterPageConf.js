import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const withMasterPageConf = (WrappedComponent, action, tags) => {
  return class extends Component {
    static propTypes = {
      dispatch: PropTypes.func
    }

    componentDidMount() {
      const { dispatch } = this.props

      if (tags.pattern) {
        const { hash } = window.location
        const tag = tags.array[hash.includes(tags.pattern) ? 0 : 1]
        dispatch(action(tag))
      } else {
        dispatch(action)
      }
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}

export default (action, tags = {}) => (
  WrapperComponent => connect(null, null)(withMasterPageConf(WrapperComponent, action, tags))
)
